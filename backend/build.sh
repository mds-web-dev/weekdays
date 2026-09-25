#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "===> Installing Python dependencies..."
pip install -r requirements.txt

echo "===> Collecting static files with WhiteNoise..."
python manage.py collectstatic --no-input

echo "===> Applying database migrations..."
python manage.py migrate

echo "===> Seeding default deployment checklist tasks..."
python manage.py seed_tasks

echo "===> Build script completed successfully!"
