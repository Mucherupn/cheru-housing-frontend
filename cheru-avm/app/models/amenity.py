import uuid

from sqlalchemy import Column, Numeric, String
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    property_type = Column(String, nullable=False)
    value_percent = Column(Numeric, nullable=False)
