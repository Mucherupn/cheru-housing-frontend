from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field, field_validator


PlotShape = Literal["normal", "corner", "irregular"]


class EstimateBase(BaseModel):
    property_type: Literal["apartment", "house", "land"]
    area: str


class ApartmentEstimateRequest(EstimateBase):
    property_type: Literal["apartment"] = "apartment"
    size_sqm: float = Field(..., ge=1)
    year_built: int = Field(..., ge=1970)
    bedrooms: int = Field(..., ge=1, le=9)
    bathrooms: int = Field(default=0, ge=0)
    floor: int = Field(..., ge=1, le=99)
    amenities: List[str] = Field(default_factory=list)
    apartment_name: Optional[str] = None

    @field_validator("year_built")
    @classmethod
    def validate_year(cls, value: int) -> int:
        current_year = datetime.now().year
        if value > current_year:
            raise ValueError("year_built cannot be in the future")
        return value


class HouseEstimateRequest(EstimateBase):
    property_type: Literal["house"] = "house"
    house_size_sqm: float = Field(..., ge=1)
    land_size_acres: float = Field(..., ge=0.01)
    year_built: int = Field(..., ge=1970)
    bedrooms: int = Field(default=0, ge=0)
    bathrooms: int = Field(default=0, ge=0)
    plot_shape: PlotShape
    amenities: List[str] = Field(default_factory=list)

    @field_validator("year_built")
    @classmethod
    def validate_year(cls, value: int) -> int:
        current_year = datetime.now().year
        if value > current_year:
            raise ValueError("year_built cannot be in the future")
        return value


class LandEstimateRequest(EstimateBase):
    property_type: Literal["land"] = "land"
    land_size_acres: float = Field(..., ge=0.01)
    plot_shape: PlotShape


EstimateRequest = ApartmentEstimateRequest | HouseEstimateRequest | LandEstimateRequest


class EstimateBreakdown(BaseModel):
    base_price_per_sqm: Optional[float] = None
    depreciation_percent: Optional[float] = None
    amenity_percent: Optional[float] = None
    final_price_per_sqm: Optional[float] = None
    land_base_value: Optional[float] = None
    land_shape_multiplier: Optional[float] = None
    land_final_value: Optional[float] = None
    building_value_before_amenities: Optional[float] = None
    building_value_after_amenities: Optional[float] = None


class EstimateResponse(BaseModel):
    property_type: str
    area: str
    estimated_value: float
    value: float
    low_estimate: float
    high_estimate: float
    base_price_per_sqm: Optional[float] = None
    breakdown: EstimateBreakdown
    disclaimer: str
