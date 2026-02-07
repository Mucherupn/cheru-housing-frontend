import uuid

from sqlalchemy import Column, DateTime, Numeric, String, func
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Area(Base):
    __tablename__ = "areas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False, index=True)
    land_price_per_acre = Column(Numeric, nullable=False)
    apartment_price_per_sqm = Column(Numeric, nullable=False)
    house_price_per_sqm = Column(Numeric, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
