from database.db import get_connection
from.entities.Size import Size

class SizeModel():

    @classmethod
    def get_sizes(cls):
        try:
            connection = get_connection()
            sizes = []
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, name, cost_multiplier FROM Size")
                resultset = cursor.fetchall()
                for row in resultset:
                    size = Size(row[0], row[1], row[2])
                    sizes.append(size.to_JSON())
            connection.close()
            return sizes
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_size(cls, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, name, cost_multiplier FROM Size WHERE id = %s", (id,))
                row = cursor.fetchone()
                size = None
                if row:
                    size = Size(row[0], row[1], row[2]).to_JSON()
            connection.close()
            return size
        except Exception as ex:
            raise Exception(ex)

    # Add, update, and delete methods would follow a similar pattern to those in ClientModel
