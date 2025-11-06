import os

class Config:
    SECRET_KEY = "dev-key"
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Archivos
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "static", "uploads")
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
