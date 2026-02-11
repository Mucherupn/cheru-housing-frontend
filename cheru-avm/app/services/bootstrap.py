from sqlalchemy.orm import Session

from app.models import Amenity, Area

DEFAULT_AREAS = [
    {"name": "Karen", "land": 220_000_000, "apartment": 180_000, "house": 200_000},
    {"name": "Kilimani", "land": 300_000_000, "apartment": 220_000, "house": 210_000},
    {"name": "Kileleshwa", "land": 280_000_000, "apartment": 210_000, "house": 200_000},
    {"name": "Runda", "land": 260_000_000, "apartment": 190_000, "house": 210_000},
    {"name": "Lavington", "land": 240_000_000, "apartment": 200_000, "house": 205_000},
    {"name": "Westlands", "land": 320_000_000, "apartment": 240_000, "house": 220_000},
    {"name": "Muthaiga", "land": 350_000_000, "apartment": 230_000, "house": 230_000},
    {"name": "Gigiri", "land": 270_000_000, "apartment": 210_000, "house": 215_000},
    {"name": "Riverside", "land": 310_000_000, "apartment": 225_000, "house": 215_000},
    {"name": "Nyari", "land": 250_000_000, "apartment": 195_000, "house": 205_000},
]

DEFAULT_AMENITIES = [
    {"name": "lift", "property_type": "apartment", "value": 0.03},
    {"name": "pool", "property_type": "apartment", "value": 0.05},
    {"name": "gym", "property_type": "apartment", "value": 0.03},
    {"name": "backup_generator", "property_type": "apartment", "value": 0.025},
    {"name": "parking", "property_type": "apartment", "value": 0.02},
    {"name": "balcony", "property_type": "apartment", "value": 0.015},
    {"name": "security", "property_type": "apartment", "value": 0.02},
    {"name": "pool", "property_type": "house", "value": 0.06},
    {"name": "gym", "property_type": "house", "value": 0.03},
    {"name": "garage", "property_type": "house", "value": 0.03},
    {"name": "solar", "property_type": "house", "value": 0.02},
    {"name": "garden", "property_type": "house", "value": 0.03},
    {"name": "security", "property_type": "house", "value": 0.02},
]


def seed_reference_data(session: Session) -> None:
    if session.query(Area).count() == 0:
        for area in DEFAULT_AREAS:
            session.add(
                Area(
                    name=area["name"],
                    land_price_per_acre=area["land"],
                    apartment_price_per_sqm=area["apartment"],
                    house_price_per_sqm=area["house"],
                )
            )

    if session.query(Amenity).count() == 0:
        for amenity in DEFAULT_AMENITIES:
            session.add(
                Amenity(
                    name=amenity["name"],
                    property_type=amenity["property_type"],
                    value_percent=amenity["value"],
                )
            )

    session.commit()
