from datetime import datetime
from typing import Iterable

from app.models import Amenity, Area

SHAPE_MULTIPLIERS = {
    "normal": 1.00,
    "corner": 1.05,
    "irregular": 0.95,
}


def _depreciation_factor(year_built: int) -> float:
    current_year = datetime.now().year
    age = current_year - year_built
    if age < 10:
        return 1.0
    if age < 20:
        return 0.95
    if age < 30:
        return 0.90
    return 0.85


def _amenity_value(base_value: float, amenities: Iterable[Amenity]) -> float:
    # Amenity weights are stored as percentages and converted into monetary additions.
    return sum(base_value * float(amenity.value_percent) for amenity in amenities)


def estimate_land(area: Area, land_size_acres: float, plot_shape: str) -> dict:
    base_value = float(land_size_acres) * float(area.land_price_per_acre)
    shape_multiplier = SHAPE_MULTIPLIERS[plot_shape]
    final_value = base_value * shape_multiplier
    return {
        "estimated_value": final_value,
        "breakdown": {
            "land_base_value": base_value,
            "land_shape_multiplier": shape_multiplier,
            "land_final_value": final_value,
        },
    }


def estimate_apartment(
    area: Area,
    size_sqm: float,
    year_built: int,
    amenities: Iterable[Amenity],
) -> dict:
    base_psm = float(area.apartment_price_per_sqm)
    apartment_base_value = base_psm * float(size_sqm)
    amenity_value = _amenity_value(apartment_base_value, amenities)
    total_before_depreciation = apartment_base_value + amenity_value
    depreciation_factor = _depreciation_factor(year_built)
    estimated_value = total_before_depreciation * depreciation_factor

    return {
        "estimated_value": estimated_value,
        "breakdown": {
            "base_price_per_sqm": base_psm,
            "building_value_before_amenities": apartment_base_value,
            "building_value_after_amenities": total_before_depreciation,
            "amenity_percent": amenity_value / apartment_base_value if apartment_base_value else 0,
            "depreciation_percent": 1 - depreciation_factor,
            "final_price_per_sqm": estimated_value / float(size_sqm),
        },
    }


def estimate_house(
    area: Area,
    house_size_sqm: float,
    land_size_acres: float,
    year_built: int,
    plot_shape: str,
    amenities: Iterable[Amenity],
) -> dict:
    land_result = estimate_land(area, land_size_acres, plot_shape)
    house_base_value = float(area.house_price_per_sqm) * float(house_size_sqm)
    amenity_value = _amenity_value(house_base_value, amenities)
    total_before_depreciation = (
        house_base_value + land_result["estimated_value"] + amenity_value
    )
    depreciation_factor = _depreciation_factor(year_built)
    estimated_value = total_before_depreciation * depreciation_factor

    return {
        "estimated_value": estimated_value,
        "breakdown": {
            "base_price_per_sqm": float(area.house_price_per_sqm),
            "depreciation_percent": 1 - depreciation_factor,
            "amenity_percent": amenity_value / house_base_value if house_base_value else 0,
            "final_price_per_sqm": estimated_value / float(house_size_sqm),
            "land_base_value": land_result["breakdown"]["land_base_value"],
            "land_shape_multiplier": land_result["breakdown"]["land_shape_multiplier"],
            "land_final_value": land_result["breakdown"]["land_final_value"],
            "building_value_before_amenities": house_base_value,
            "building_value_after_amenities": house_base_value + amenity_value,
        },
    }
