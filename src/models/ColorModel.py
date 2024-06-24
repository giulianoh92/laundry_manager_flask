from database.db import get_connection
from.entities.Color import Color

class ColorModel():

    @classmethod
    def get_colors(cls):
        try:
            connection = get_connection()
            colors = []
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, name FROM Color")
                resultset = cursor.fetchall()
                for row in resultset:
                    color = Color(row[0], row[1])
                    colors.append(color.to_JSON())
            connection.close()
            return colors
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_color(cls, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, name FROM Color WHERE id = %s", (id,))
                row = cursor.fetchone()
                color = None
                if row:
                    color = Color(row[0], row[1]).to_JSON()
            connection.close()
            return color
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def add_color(cls, color):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("INSERT INTO Color (name) VALUES (%s) RETURNING id", (color.name,))
                color.id = cursor.fetchone()[0]
                connection.commit()
            connection.close()
            return color.id
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def update_color(cls, color):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("UPDATE Color SET name = %s WHERE id = %s", (color.name, color.id))
                connection.commit()
            connection.close()
            return True
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def delete_color(cls, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM Color WHERE id = %s", (id,))
                connection.commit()
            connection.close()
            return True
        except Exception as ex:
            raise Exception(ex)
