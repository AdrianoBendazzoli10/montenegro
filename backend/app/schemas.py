from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, EmailStr, Field

Role = Literal["admin", "avaliador"]
MediaKind = Literal["livro", "filme", "serie"]
ReviewMode = Literal["rapida", "detalhada"]


class RegisterPayload(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    role: Role = "avaliador"


class LoginPayload(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    bio: str | None = Field(default=None, max_length=500)
    avatar_url: str | None = None


class WorkCreate(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    kind: MediaKind
    creator: str = Field(min_length=1, max_length=180)
    publisher: str | None = Field(default=None, max_length=180)
    release_date: date | None = None
    year: int | None = Field(default=None, ge=1800, le=2200)
    genre: str | None = Field(default=None, max_length=100)
    synopsis: str | None = None
    image_url: str | None = None


class ReviewCreate(BaseModel):
    mode: ReviewMode = "rapida"
    rating: int = Field(ge=1, le=5)
    worth_it: str
    comment: str | None = None
    emotion: str | None = Field(default=None, max_length=160)
    verdict: str | None = Field(default=None, max_length=180)
    scores: dict[str, Any] | None = None


class ShelfCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class ShelfItemCreate(BaseModel):
    work_id: int
