from database.db import get_connection
from.entities.Status import Status

class StatusModel():

    @classmethod
    def get_statuses(cls):
        try:
            connection = get_connection()
            statuses = []
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, description FROM Status")
                resultset = cursor.fetchall()
                for row in resultset:
                    status = Status(row[0], row[1])
                    statuses.append(status.to_JSON())
            connection.close()
            return statuses
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_status(cls, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, description FROM Status WHERE id = %s", (id,))
                row = cursor.fetchone()
                status = None
                if row:
                    status = Status(row[0], row[1]).to_JSON()
            connection.close()
            return status
        except Exception as ex:
            raise Exception(ex)

    # Add, update, and delete methods would follow a similar pattern to those in ClientModel
