import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'college-mini-project-secret-key-2026'
    
    # SQLite default database path (works automatically without pre-installing MySQL)
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(BASE_DIR, 'instance', 'tournament.db')
        
    # To connect to MySQL database, set DATABASE_URL environment variable or uncomment line below:
    # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@localhost/tournament_manager'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
