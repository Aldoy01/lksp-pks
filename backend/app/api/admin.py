from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.database import get_db
from app.models.user import User
from app.models.parameter_bobot import ParameterBobot
from app.schemas.admin import UserRead, UserCreate, ParameterBobotRead, ParameterBobotUpdate
from app.core.security import require_role, get_password_hash

router = APIRouter(prefix="/api/admin", tags=["Admin"])

admin_only = require_role(["Admin"])


@router.get("/users", response_model=List[UserRead])
def get_users(db: Session = Depends(get_db), current_user=Depends(admin_only)):
    return db.query(User).order_by(User.created_at).all()


@router.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db), current_user=Depends(admin_only)):
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username sudah digunakan")
    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        role=payload.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/users/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    role: str = None,
    is_active: bool = None,
    db: Session = Depends(get_db),
    current_user=Depends(admin_only),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    if role is not None:
        user.role = role
    if is_active is not None:
        user.is_active = is_active
    db.commit()
    db.refresh(user)
    return user


@router.get("/parameter", response_model=List[ParameterBobotRead])
def get_parameter(db: Session = Depends(get_db), current_user=Depends(admin_only)):
    return db.query(ParameterBobot).order_by(ParameterBobot.id).all()


@router.put("/parameter", response_model=List[ParameterBobotRead])
def update_parameter(
    updates: List[ParameterBobotUpdate],
    db: Session = Depends(get_db),
    current_user=Depends(admin_only),
):
    results = []
    for u in updates:
        pb = db.query(ParameterBobot).filter(ParameterBobot.id == u.id).first()
        if not pb:
            raise HTTPException(status_code=404, detail=f"Parameter ID {u.id} tidak ditemukan")
        pb.bobot = u.bobot
        pb.updated_at = datetime.utcnow()
        results.append(pb)
    db.commit()
    for r in results:
        db.refresh(r)
    return results
