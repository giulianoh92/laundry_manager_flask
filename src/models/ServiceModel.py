from database.db import get_connection
from.entities.Service import Service

class ServiceModel():

    @classmethod
    def get_services(cls):
        try:
            connection = get_connection()
            services = []
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, name, description, cost FROM Service")
                resultset = cursor.fetchall()
                for row in resultset:
                    service = Service(*row)
                    services.append(service.to_JSON())
            connection.close()
            return services
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_service(cls, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, name, description, cost FROM Service WHERE id = %s", (id,))
                row = cursor.fetchone()
                service = None
                if row:
                    service = Service(*row).to_JSON()
            connection.close()
            return service
        except Exception as ex:
            raise Exception(ex)

    # Add, update, and delete methods would follow a similar pattern to those in ClientModel
