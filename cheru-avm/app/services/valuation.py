from datetime import datetime
from typing import Iterable

from app.models import Area, Amenity

SHAPE_MULTIPLIERS = {
    "normal": 1.00,
    "corner": 1.05,
    "irregular": 0.90,
}


def _amenity_percent(amenities: Iterable[Amenity]) -> float:
    return float(sum(float(amenity.value_percent) for amenity in amenities))


def _depreciation_factor(year_built: int) -> float:
    current_year = datetime.now().year
    age = current_year - year_built
    depreciation = min(age * 0.02, 0.60)
    return 1 - depreciation


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
    remaining_value = _depreciation_factor(year_built)
    depreciated_psm = base_psm * remaining_value
    amenity_percent = _amenity_percent(amenities)
    final_psm = depreciated_psm * (1 + amenity_percent)
    estimated_value = final_psm * float(size_sqm)
    return {
        "estimated_value": estimated_value,
        "price_per_sqm": final_psm,
        "breakdown": {
            "base_price_per_sqm": base_psm,
            "depreciation_percent": 1 - remaining_value,
            "amenity_percent": amenity_percent,
            "final_price_per_sqm": final_psm,
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
    base_psm = float(area.house_price_per_sqm)
    remaining_value = _depreciation_factor(year_built)
    depreciated_psm = base_psm * remaining_value
    building_value = depreciated_psm * float(house_size_sqm)
    amenity_percent = _amenity_percent(amenities)
    building_value_adjusted = building_value * (1 + amenity_percent)
    estimated_value = land_result["estimated_value"] + building_value_adjusted
    return {
        "estimated_value": estimated_value,
        "breakdown": {
            "base_price_per_sqm": base_psm,
            "depreciation_percent": 1 - remaining_value,
            "amenity_percent": amenity_percent,
            "final_price_per_sqm": depreciated_psm,
            "land_base_value": land_result["breakdown"]["land_base_value"],
            "land_shape_multiplier": land_result["breakdown"]["land_shape_multiplier"],
            "land_final_value": land_result["breakdown"]["land_final_value"],
            "building_value_before_amenities": building_value,
            "building_value_after_amenities": building_value_adjusted,
        },
    }
