from database.db import get_connection
from.entities.Order_Service import Order_Service

class Order_ServiceModel():

    @classmethod
    def get_order_services(cls):
        try:
            connection = get_connection()
            order_services = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, order_id, item_id, service_id, maincolor_id, othercolor_id, pattern_id, size_id, softener, indications 
                    FROM Order_Service""")
                resultset = cursor.fetchall()
                for row in resultset:
                    order_service = Order_Service(*row)
                    order_services.append(order_service.to_JSON())
            connection.close()
            return order_services
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_order_service(cls, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, order_id, item_id, service_id, maincolor_id, othercolor_id, pattern_id, size_id, softener, indications 
                    FROM Order_Service WHERE id = %s""", (id,))
                row = cursor.fetchone()
                order_service = None
                if row:
                    order_service = Order_Service(*row).to_JSON()
            connection.close()
            return order_service
        except Exception as ex:
            raise Exception(ex)

    # Add, update, and delete methods would follow a similar pattern to those in ClientModel
