from flask import Flask # type: ignore
from flask_sqlalchemy import SQLAlchemy # type: ignore
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    from app.master_routes import master_bp
    from app.schedule_routes import schedule_bp

    app.register_blueprint(master_bp, url_prefix='/master')
    app.register_blueprint(schedule_bp, url_prefix='/schedule')

    return app
