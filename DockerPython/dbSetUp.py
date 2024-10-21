# Script for setting up database by dropping all tables and creating them again

# Usage: docker-compose exec flask-app bash - run this script from there

from app import create_app, db
from app.models import Master, Schedule  # Import the models that need to be created

app = create_app()

with app.app_context():
    # Drop all existing tables
    print("Dropping all tables...")
    db.drop_all()
    
    # Recreate the tables based on the models
    print("Creating all tables...")
    db.create_all()

    print("All tables dropped and recreated successfully!")
