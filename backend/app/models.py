from __future__ import annotations

from datetime import date, datetime
from typing import Any

from sqlalchemy import BigInteger, Date, DateTime, Enum, ForeignKey, Integer, JSON, SmallInteger, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(190), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(Enum("admin", "avaliador", name="user_role"), nullable=False, default="avaliador")
    avatar_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    bio: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    reviews: Mapped[list[Review]] = relationship(back_populates="user", cascade="all, delete-orphan")
    shelves: Mapped[list[Shelf]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Work(Base):
    __tablename__ = "works"
    __table_args__ = (UniqueConstraint("title", "kind", name="uq_work_title_kind"),)

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False, index=True)
    kind: Mapped[str] = mapped_column(Enum("livro", "filme", "serie", name="work_kind"), nullable=False, index=True)
    creator: Mapped[str] = mapped_column(String(180), nullable=False)
    publisher: Mapped[str | None] = mapped_column(String(180), nullable=True)
    release_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    year: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    genre: Mapped[str | None] = mapped_column(String(100), nullable=True)
    synopsis: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    reviews: Mapped[list[Review]] = relationship(back_populates="work", cascade="all, delete-orphan")


class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (UniqueConstraint("user_id", "work_id", name="uq_review_user_work"),)

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    work_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("works.id", ondelete="CASCADE"), nullable=False, index=True)
    mode: Mapped[str] = mapped_column(Enum("rapida", "detalhada", name="review_mode"), nullable=False, default="rapida")
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    worth_it: Mapped[str] = mapped_column(Enum("sim", "mais_ou_menos", "nao", name="worth_it"), nullable=False)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    emotion: Mapped[str | None] = mapped_column(String(160), nullable=True)
    verdict: Mapped[str | None] = mapped_column(String(180), nullable=True)
    scores: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    user: Mapped[User] = relationship(back_populates="reviews")
    work: Mapped[Work] = relationship(back_populates="reviews")


class Shelf(Base):
    __tablename__ = "shelves"
    __table_args__ = (UniqueConstraint("user_id", "name", name="uq_shelf_name"),)

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    user: Mapped[User] = relationship(back_populates="shelves")
    items: Mapped[list[ShelfItem]] = relationship(back_populates="shelf", cascade="all, delete-orphan")


class ShelfItem(Base):
    __tablename__ = "shelf_items"

    shelf_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("shelves.id", ondelete="CASCADE"), primary_key=True)
    work_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("works.id", ondelete="CASCADE"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    shelf: Mapped[Shelf] = relationship(back_populates="items")
    work: Mapped[Work] = relationship()
