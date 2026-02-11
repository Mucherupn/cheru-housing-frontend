from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Amenity, Area
from app.schemas.estimate import (
    ApartmentEstimateRequest,
    EstimateRequest,
    EstimateResponse,
    HouseEstimateRequest,
    LandEstimateRequest,
)
from app.services.valuation import estimate_apartment, estimate_house, estimate_land

router = APIRouter()

CLASSIC_PROPERTY_YEAR = 1985
YEAR_CLASSIC_MESSAGE = (
    "This property is too classic for automated estimation. "
    "Please contact our team for a professional valuation."
)

DISCLAIMER_TEXT = (
    "Kindly note that this is an automatic estimated value. "
    "The real value can differ as each property is unique. "
    "If you need an official valuation, kindly contact our valuers."
)


def _confidence_score(property_type: str, amenity_count: int) -> float:
    base_scores = {
        "land": 0.78,
        "house": 0.82,
        "apartment": 0.85,
    }
    base = base_scores.get(property_type, 0.75)
    adjusted = base + min(amenity_count, 5) * 0.02
    return round(min(adjusted, 0.95), 2)



def _get_area(db: Session, area_name: str) -> Area:
    area = (
        db.query(Area)
        .filter(func.lower(Area.name) == area_name.strip().lower())
        .one_or_none()
    )
    if not area:
        raise HTTPException(status_code=400, detail="Unknown area")
    return area


def _get_amenities(
    db: Session,
    amenity_names: List[str],
    property_type: str,
) -> List[Amenity]:
    if not amenity_names:
        return []
    alias_map = {
        "solar panels": "solar",
        "backup generator": "backup_generator",
        "parking": "parking",
        "lift": "lift",
        "balcony": "balcony",
        "security": "security",
        "garage": "garage",
        "garden": "garden",
        "pool": "pool",
        "gym": "gym",
    }

    normalized = []
    for name in amenity_names:
        cleaned = name.strip().lower().replace("_", " ")
        normalized.append(alias_map.get(cleaned, cleaned.replace(" ", "_")))
    amenities = (
        db.query(Amenity)
        .filter(func.lower(Amenity.name).in_(normalized))
        .filter(Amenity.property_type == property_type)
        .all()
    )
    found_names = {amenity.name.lower() for amenity in amenities}
    missing = [name for name in normalized if name not in found_names]
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown amenities: {', '.join(sorted(set(missing)))}",
        )
    return amenities


@router.post("/estimate", response_model=EstimateResponse)

def create_estimate(payload: EstimateRequest, db: Session = Depends(get_db)):
    current_year = datetime.now().year
    area = _get_area(db, payload.area)

    if hasattr(payload, "year_built"):
        if payload.year_built > current_year:
            raise HTTPException(
                status_code=400,
                detail=f"year_built must be between 1970 and {current_year}",
            )
        if payload.year_built < CLASSIC_PROPERTY_YEAR:
            raise HTTPException(status_code=400, detail=YEAR_CLASSIC_MESSAGE)

    if isinstance(payload, LandEstimateRequest):
        result = estimate_land(area, payload.land_size_acres, payload.plot_shape)
        estimated_value = result["estimated_value"]
        breakdown = result["breakdown"]
        base_price_per_sqm = None
        confidence_score = _confidence_score(payload.property_type, 0)
    elif isinstance(payload, ApartmentEstimateRequest):
        amenities = _get_amenities(db, payload.amenities, "apartment")
        result = estimate_apartment(
            area,
            payload.size_sqm,
            payload.year_built,
            amenities,
        )
        estimated_value = result["estimated_value"]
        breakdown = result["breakdown"]
        base_price_per_sqm = breakdown["base_price_per_sqm"]
        confidence_score = _confidence_score(payload.property_type, len(amenities))
    elif isinstance(payload, HouseEstimateRequest):
        amenities = _get_amenities(db, payload.amenities, "house")
        result = estimate_house(
            area,
            payload.house_size_sqm,
            payload.land_size_acres,
            payload.year_built,
            payload.plot_shape,
            amenities,
        )
        estimated_value = result["estimated_value"]
        breakdown = result["breakdown"]
        base_price_per_sqm = breakdown["base_price_per_sqm"]
        confidence_score = _confidence_score(payload.property_type, len(amenities))
    else:
        raise HTTPException(status_code=400, detail="Unsupported property type")

    low_estimate = estimated_value * 0.90
    high_estimate = estimated_value * 1.10

    return EstimateResponse(
        property_type=payload.property_type,
        area=area.name,
        estimated_value=estimated_value,
        value=estimated_value,
        low_estimate=low_estimate,
        high_estimate=high_estimate,
        base_price_per_sqm=base_price_per_sqm,
        breakdown=breakdown,
        confidence_score=confidence_score,
        disclaimer=DISCLAIMER_TEXT,
    )
