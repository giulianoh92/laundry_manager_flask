from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, id, password, name = None) -> None:
        self.id = id
        self.password = password
        self.name = name

    def to_JSON(self):
        return {
            "id": self.id,
            "password": self.password,
            "name": self.name
        }
    
    @classmethod
    def check_password(self, hashed_password, password):
        return check_password_hash(hashed_password, password)