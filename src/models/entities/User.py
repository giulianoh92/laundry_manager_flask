from werkzeug.security import check_password_hash
from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, id, password, name = None, email_address = None) -> None:
        self.id = id
        self.password = password
        self.name = name
        self.email_address = email_address

    def to_JSON(self):
        return {
            "id": self.id,
            "password": self.password,
            "name": self.name,
            "email_address": self.email_address
        }
    
    @classmethod
    def check_password(self, hashed_password, password):
        return check_password_hash(hashed_password, password)