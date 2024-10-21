from flask import Flask, jsonify  # type: ignore
from flask_sqlalchemy import SQLAlchemy  # type: ignore
from flask_cors import CORS  # type: ignore # Import CORS package
import os
from app import db, create_app  # Import the package for app setup
from app.models import Master, Schedule  # Import models

# Initialize the app using the factory function from your package
app = create_app()

# Enable CORS for the entire app
CORS(app, resources={r"/*": {"origins": "*"}})  # This will allow cross-origin requests for all routes

# CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})

# You can keep the route for testing purposes
@app.route('/cc')
def index():
    return jsonify(message="Welcome to the Scheduler Management Application!")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
