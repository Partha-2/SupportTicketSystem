#!/bin/sh

# Wait for postgres only if POSTGRES_HOST is set (local Docker)
if [ -n "$POSTGRES_HOST" ]; then
  echo "Waiting for postgres..."
  while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
    sleep 0.1
  done
  echo "PostgreSQL started"
fi

echo "Generating migrations..."
python manage.py makemigrations tickets

echo "Applying database migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
if [ "$DEBUG" = "True" ]; then
  python manage.py runserver 0.0.0.0:8000
else
  gunicorn ticket_system.wsgi:application --bind 0.0.0.0:8000 --workers 2
fi
