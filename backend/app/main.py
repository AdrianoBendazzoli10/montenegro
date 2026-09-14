import os
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from .database import Base, engine, get_db
from .models import Review, Shelf, ShelfItem, User, Work
from .schemas import LoginPayload, ProfileUpdate, RegisterPayload, ReviewCreate, ShelfCreate, ShelfItemCreate, WorkCreate
from .security import create_access_token, get_current_user, hash_password, verify_password

app = FastAPI(title="Montenegro API", version="2.0.0")

cors_value = os.getenv("CORS_ORIGINS", "*")
cors_origins = [origin.strip() for origin in cors_value.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins or ["*"],
    allow_credentials="*" not in cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


def user_json(user: User) -> dict[str, Any]:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "avatar_url": user.avatar_url,
        "bio": user.bio,
        "created_at": user.created_at,
    }


def work_json(work: Work, rating: float | None = None, review_count: int | None = None) -> dict[str, Any]:
    return {
        "id": work.id,
        "title": work.title,
        "kind": work.kind,
        "creator": work.creator,
        "publisher": work.publisher,
        "release_date": work.release_date,
        "year": work.year,
        "genre": work.genre,
        "synopsis": work.synopsis,
        "image_url": work.image_url,
        "created_by": work.created_by,
        "created_at": work.created_at,
        "updated_at": work.updated_at,
        "rating": round(float(rating or 0), 1),
        "review_count": int(review_count or 0),
    }


def review_json(review: Review, include_user: bool = False) -> dict[str, Any]:
    data = {
        "id": review.id,
        "user_id": review.user_id,
        "work_id": review.work_id,
        "mode": review.mode,
        "rating": review.rating,
        "worth_it": review.worth_it,
        "comment": review.comment,
        "emotion": review.emotion,
        "verdict": review.verdict,
        "scores": review.scores,
        "created_at": review.created_at,
        "updated_at": review.updated_at,
    }
    if include_user and review.user:
        data["user_name"] = review.user.name
        data["avatar_url"] = review.user.avatar_url
    return data


def normalize_worth_it(value: str) -> str:
    normalized = value.strip().lower().replace("ã", "a")
    mapping = {
        "sim": "sim",
        "nao": "nao",
        "mais ou menos": "mais_ou_menos",
        "mais_ou_menos": "mais_ou_menos",
    }
    result = mapping.get(normalized, normalized)
    if result not in {"sim", "nao", "mais_ou_menos"}:
        raise HTTPException(status_code=400, detail="Resposta de valeu a pena inválida.")
    return result


@app.get("/health")
def health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"ok": True, "service": "montenegro-api", "backend": "fastapi"}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Banco indisponível: {exc}")


@app.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="Este e-mail já está cadastrado.")

    user = User(
        name=payload.name.strip(),
        email=email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Este e-mail já está cadastrado.")
    db.refresh(user)
    return {"token": create_access_token(user), "user": user_json(user)}


@app.post("/auth/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    user = db.scalar(select(User).where(User.email == email))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")
    return {"token": create_access_token(user), "user": user_json(user)}


@app.get("/auth/me")
def me(current_user: User = Depends(get_current_user)):
    return {"user": user_json(current_user)}


@app.put("/users/me")
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.name is not None:
        current_user.name = payload.name.strip()
    current_user.bio = payload.bio
    current_user.avatar_url = payload.avatar_url
    db.commit()
    db.refresh(current_user)
    return {"user": user_json(current_user)}


@app.get("/works")
def list_works(
    kind: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    stmt = (
        select(Work, func.avg(Review.rating), func.count(Review.id))
        .outerjoin(Review, Review.work_id == Work.id)
        .group_by(Work.id)
        .order_by(Work.created_at.desc())
    )
    if kind:
        if kind not in {"livro", "filme", "serie"}:
            raise HTTPException(status_code=400, detail="Tipo de obra inválido.")
        stmt = stmt.where(Work.kind == kind)
    if search:
        term = f"%{search.strip()}%"
        stmt = stmt.where((Work.title.like(term)) | (Work.creator.like(term)))

    rows = db.execute(stmt).all()
    return {"works": [work_json(work, avg_rating, review_count) for work, avg_rating, review_count in rows]}


@app.get("/works/{work_id}")
def get_work(work_id: int, db: Session = Depends(get_db)):
    stats = db.execute(
        select(Work, func.avg(Review.rating), func.count(Review.id))
        .outerjoin(Review, Review.work_id == Work.id)
        .where(Work.id == work_id)
        .group_by(Work.id)
    ).first()
    if stats is None:
        raise HTTPException(status_code=404, detail="Obra não encontrada.")

    work, avg_rating, review_count = stats
    reviews = db.scalars(
        select(Review)
        .options(selectinload(Review.user))
        .where(Review.work_id == work_id)
        .order_by(Review.created_at.desc())
    ).all()
    return {
        "work": work_json(work, avg_rating, review_count),
        "reviews": [review_json(review, include_user=True) for review in reviews],
    }


@app.post("/works", status_code=status.HTTP_201_CREATED)
def create_work(
    payload: WorkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    work = Work(
        title=payload.title.strip(),
        kind=payload.kind,
        creator=payload.creator.strip(),
        publisher=payload.publisher,
        release_date=payload.release_date,
        year=payload.year,
        genre=payload.genre,
        synopsis=payload.synopsis,
        image_url=payload.image_url,
        created_by=current_user.id,
    )
    db.add(work)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Essa obra já está cadastrada.")
    db.refresh(work)
    return {"work": work_json(work)}


@app.post("/works/{work_id}/reviews", status_code=status.HTTP_201_CREATED)
def save_review(
    work_id: int,
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if db.get(Work, work_id) is None:
        raise HTTPException(status_code=404, detail="Obra não encontrada.")

    worth_it = normalize_worth_it(payload.worth_it)
    review = db.scalar(select(Review).where(Review.user_id == current_user.id, Review.work_id == work_id))
    if review is None:
        review = Review(user_id=current_user.id, work_id=work_id)
        db.add(review)

    review.mode = payload.mode
    review.rating = payload.rating
    review.worth_it = worth_it
    review.comment = payload.comment
    review.emotion = payload.emotion
    review.verdict = payload.verdict
    review.scores = payload.scores
    db.commit()
    db.refresh(review)
    return {"review": review_json(review)}


@app.get("/reviews/me")
def my_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reviews = db.scalars(
        select(Review)
        .options(selectinload(Review.work))
        .where(Review.user_id == current_user.id)
        .order_by(Review.updated_at.desc())
    ).all()
    data = []
    for review in reviews:
        item = review_json(review)
        item.update({
            "title": review.work.title,
            "kind": review.work.kind,
            "image_url": review.work.image_url,
        })
        data.append(item)
    return {"reviews": data}


@app.get("/shelves")
def list_shelves(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shelves = db.scalars(
        select(Shelf)
        .options(selectinload(Shelf.items).selectinload(ShelfItem.work))
        .where(Shelf.user_id == current_user.id)
        .order_by(Shelf.created_at)
    ).all()
    return {
        "shelves": [
            {
                "id": shelf.id,
                "user_id": shelf.user_id,
                "name": shelf.name,
                "created_at": shelf.created_at,
                "items": [work_json(item.work) for item in shelf.items],
            }
            for shelf in shelves
        ]
    }


@app.post("/shelves", status_code=status.HTTP_201_CREATED)
def create_shelf(
    payload: ShelfCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shelf = Shelf(user_id=current_user.id, name=payload.name.strip())
    db.add(shelf)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Você já possui uma estante com esse nome.")
    db.refresh(shelf)
    return {"shelf": {"id": shelf.id, "name": shelf.name, "user_id": shelf.user_id, "items": []}}


@app.post("/shelves/{shelf_id}/items", status_code=status.HTTP_201_CREATED)
def add_shelf_item(
    shelf_id: int,
    payload: ShelfItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shelf = db.scalar(select(Shelf).where(Shelf.id == shelf_id, Shelf.user_id == current_user.id))
    if shelf is None:
        raise HTTPException(status_code=404, detail="Estante não encontrada.")
    if db.get(Work, payload.work_id) is None:
        raise HTTPException(status_code=404, detail="Obra não encontrada.")

    existing = db.get(ShelfItem, (shelf_id, payload.work_id))
    if existing is None:
        db.add(ShelfItem(shelf_id=shelf_id, work_id=payload.work_id))
        db.commit()
    return {"ok": True}


@app.delete("/shelves/{shelf_id}/items/{work_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_shelf_item(
    shelf_id: int,
    work_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    shelf = db.scalar(select(Shelf).where(Shelf.id == shelf_id, Shelf.user_id == current_user.id))
    if shelf is None:
        raise HTTPException(status_code=404, detail="Estante não encontrada.")
    item = db.get(ShelfItem, (shelf_id, work_id))
    if item is not None:
        db.delete(item)
        db.commit()
    return None
