from database.db import get_connection
from models.entities.User import User

class UserModel():
    @classmethod
    def login(cls, user):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""SELECT user_id, password, username, email FROM users 
                                  WHERE username = %s""", (user.name,))
                row = cursor.fetchone()
                if row:
                    user = User(row[0], User.check_password(row[1], user.password), row[2], row[3])
                    return user
                else:
                    return None
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_by_id(cls, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""SELECT user_id, password, username, email FROM users 
                                  WHERE user_id = %s""", (id,))
                row = cursor.fetchone()
                if row:
                    user = User(row[0], row[1], row[2], row[3])
                    return user
                else:
                    return None
        except Exception as ex:
            raise Exception(ex)
