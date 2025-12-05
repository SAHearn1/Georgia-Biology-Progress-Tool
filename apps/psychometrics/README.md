# Psychometrics Service

FastAPI microservice for psychometric analysis, IRT modeling, and EOC score predictions for the Georgia Biology Progress Tool.

## Features

- **EOC Score Prediction**: ML-based predictions of student EOC performance
- **Psychometric Analysis**: Reliability and validity analysis of assessments
- **Item Response Theory**: IRT calibration and ability estimation
- **Batch Processing**: Efficient analysis of multiple students/classes

## Tech Stack

- **Framework**: FastAPI 0.109+
- **Language**: Python 3.11+
- **ML Libraries**: scikit-learn, XGBoost, LightGBM
- **Psychometrics**: py-irt, statsmodels
- **Scientific Computing**: NumPy, SciPy, pandas

## Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Development

```bash
# Run development server
uvicorn app.main:app --reload --port 8000

# Run tests
pytest

# Lint and format
ruff check .
black .
```

## API Endpoints

### Predictions
- `POST /api/predictions/predict-eoc` - Predict EOC score for a student
- `POST /api/predictions/batch-predict` - Batch predictions for multiple students

### Analysis
- `POST /api/analysis/assess-reliability` - Analyze assessment reliability
- `POST /api/analysis/item-analysis` - Detailed item-level analysis

### IRT
- `POST /api/irt/calibrate` - Calibrate items using IRT
- `POST /api/irt/estimate-ability` - Estimate student ability (theta)

## Documentation

- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

```bash
# Optional: Database connection for caching
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Optional: Web app URL for callbacks
WEB_APP_URL=http://localhost:3000

# Model paths (for trained ML models)
MODEL_PATH=./models/
```

## Deployment

The service can be deployed to:
- Google Cloud Run
- AWS Lambda (with Mangum adapter)
- Azure Container Instances
- Any Docker-compatible platform

```bash
# Build Docker image
docker build -t ga-biology-psychometrics .

# Run container
docker run -p 8000:8000 ga-biology-psychometrics
```
