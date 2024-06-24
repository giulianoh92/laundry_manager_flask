from database.db import get_connection
from .entities.Order import Order


class OrderModel():

    @classmethod
    def get_orders(self):
        try:
            connection = get_connection()
            orders = []
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, client_id, status_id, total_cost, creation_date, finish_date FROM \"Order\"")
                resultset = cursor.fetchall()
                for row in resultset:
                    order = Order(row[0], row[1], row[2], row[3], row[4], row[5])
                    orders.append(order.to_JSON())
            connection.close()
            return orders
        except Exception as ex:
            raise Exception(ex)
        
    
    @classmethod
    def get_order(self, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, client_id, status_id, total_cost, creation_date, finish_date FROM \"Order\" WHERE id = %s",(id,))
                row = cursor.fetchone()

                order = None
                if row:
                    order = Order(row[0], row[1], row[2], row[3], row[4], row[5])
                    order = order.to_JSON()
            connection.close()
            return order
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def add_order(self, order):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO "Order" (client_id, status_id, total_cost, creation_date, finish_date) 
                    VALUES (%s, %s, %s, %s, %s) RETURNING id""",
                    (order.client_id, order.status_id, order.total_cost, order.creation_date, order.finish_date)
                )
                # Fetch the id of the last inserted row
                order.id = cursor.fetchone()[0]
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

        
    @classmethod
    def delete_order(self, order):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM \"Order\" WHERE id = %s",(order.id,))

                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def update_order(self, order):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""UPDATE \"Order\" SET client_id = %s, status_id = %s, total_cost = %s, creation_date = %s, finish_date = %s 
                               WHERE id = %s """,
                               (order.client_id, order.status_id, order.total_cost, order.creation_date, order.finish_date, order.id))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)