import logging

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Amenity, Area

logging.basicConfig(level=logging.INFO)

AREAS = [
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
    {"name": "Lower Kabete", "land": 230_000_000, "apartment": 185_000, "house": 195_000},
    {"name": "Parklands", "land": 290_000_000, "apartment": 215_000, "house": 205_000},
    {"name": "Spring Valley", "land": 260_000_000, "apartment": 200_000, "house": 205_000},
    {"name": "Nairobi West", "land": 160_000_000, "apartment": 150_000, "house": 155_000},
    {"name": "Langata", "land": 180_000_000, "apartment": 165_000, "house": 175_000},
    {"name": "Garden Estate", "land": 170_000_000, "apartment": 155_000, "house": 165_000},
    {"name": "Kitisuru", "land": 275_000_000, "apartment": 205_000, "house": 215_000},
    {"name": "Upper Hill", "land": 330_000_000, "apartment": 235_000, "house": 225_000},
    {"name": "Kyuna", "land": 240_000_000, "apartment": 190_000, "house": 200_000},
    {"name": "Loresho", "land": 210_000_000, "apartment": 175_000, "house": 185_000},
]

AMENITIES = [
    {"name": "lift", "property_type": "apartment", "value": 0.03},
    {"name": "pool", "property_type": "apartment", "value": 0.05},
    {"name": "gym", "property_type": "apartment", "value": 0.03},
    {"name": "backup_generator", "property_type": "apartment", "value": 0.02},
    {"name": "parking", "property_type": "apartment", "value": 0.02},
    {"name": "pool", "property_type": "house", "value": 0.06},
    {"name": "staff_quarters", "property_type": "house", "value": 0.04},
    {"name": "garage", "property_type": "house", "value": 0.03},
    {"name": "solar", "property_type": "house", "value": 0.02},
    {"name": "garden", "property_type": "house", "value": 0.03},
]


def upsert_areas(session: Session) -> None:
    for area in AREAS:
        existing = session.query(Area).filter(Area.name == area["name"]).one_or_none()
        if existing:
            existing.land_price_per_acre = area["land"]
            existing.apartment_price_per_sqm = area["apartment"]
            existing.house_price_per_sqm = area["house"]
        else:
            session.add(
                Area(
                    name=area["name"],
                    land_price_per_acre=area["land"],
                    apartment_price_per_sqm=area["apartment"],
                    house_price_per_sqm=area["house"],
                )
            )


def upsert_amenities(session: Session) -> None:
    for amenity in AMENITIES:
        existing = (
            session.query(Amenity)
            .filter(Amenity.name == amenity["name"])
            .filter(Amenity.property_type == amenity["property_type"])
            .one_or_none()
        )
        if existing:
            existing.value_percent = amenity["value"]
        else:
            session.add(
                Amenity(
                    name=amenity["name"],
                    property_type=amenity["property_type"],
                    value_percent=amenity["value"],
                )
            )


def main() -> None:
    session = SessionLocal()
    try:
        upsert_areas(session)
        upsert_amenities(session)
        session.commit()
        logging.info("Seeded areas and amenities successfully.")
    finally:
        session.close()


if __name__ == "__main__":
    main()
