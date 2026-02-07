# Cheru Estimator AVM Backend

Production-ready FastAPI backend for deterministic property valuation across Nairobi neighborhoods. Supports apartments, houses, and land with transparent breakdowns and tunable inputs.

## Features
- Deterministic valuation formulas for land, apartments, and houses.
- Supabase/PostgreSQL storage for area base prices and amenity adjustments.
- Clean architecture: routes, services, models, schemas, utilities.
- CORS, structured logging, and error handling.

## Project Structure
```
cheru-avm/
  app/
    main.py
    database.py
    models/
    schemas/
    services/
    routes/
    utils/
  requirements.txt
  schema.sql
  scripts/
    seed_data.py
  README.md
```

## Requirements
- Python 3.11+
- PostgreSQL (Supabase)

## Environment Variables
Create a `.env` file in `cheru-avm/`:
```
DATABASE_URL=postgresql+psycopg2://user:password@host:5432/dbname
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

## Database Setup
1. Apply the schema:
   ```sql
   -- Run in Supabase SQL editor or psql
   \i schema.sql
   ```
2. Seed the data:
   ```bash
   cd cheru-avm
   python scripts/seed_data.py
   ```

## Run Locally
```bash
cd cheru-avm
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## API Usage
### Estimate Property Value
`POST /api/estimate`

**Apartment**
```bash
curl -X POST http://localhost:8000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "property_type": "apartment",
    "area": "Kilimani",
    "size_sqm": 120,
    "year_built": 2016,
    "amenities": ["lift", "pool"],
    "apartment_name": "Skyline Residences"
  }'
```

**House**
```bash
curl -X POST http://localhost:8000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "property_type": "house",
    "area": "Karen",
    "house_size_sqm": 350,
    "land_size_acres": 0.5,
    "year_built": 2012,
    "plot_shape": "normal",
    "amenities": ["pool", "staff_quarters"]
  }'
```

**Land**
```bash
curl -X POST http://localhost:8000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "property_type": "land",
    "area": "Karen",
    "land_size_acres": 1.2,
    "plot_shape": "corner"
  }'
```

## Response Notes
- The response includes `estimated_value`, a low/high range, and a full breakdown.
- A disclaimer string is returned for UI display: 
  "Kindly note that this is an automatic estimated value. The real value can differ as each property is unique. If you need an official valuation, kindly contact our valuers."
- Frontends can attach a premium UI with a "Contact Valuer" button using the disclaimer.

## Health Check
`GET /health` returns `{ "status": "ok" }`.

## Tuning
Update base area prices or amenity percentages in Supabase to tune results without changing code.
