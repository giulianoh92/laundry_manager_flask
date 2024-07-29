from database.db import get_connection
from flask import jsonify
import datetime



class Order_det():
    def __init__(self, item_name, main_color, other_color, pattern_name, size_name, service_name, softener, cost):
        self.item_name = item_name
        self.main_color = main_color
        self.other_color = other_color
        self.pattern_name = pattern_name
        self.size_name = size_name
        self.service_name = service_name
        self.softener = softener
        self.cost = cost
    
    def to_JSON(self):
        return {
            'item_name': self.item_name,
            'main_color': self.main_color,
            'other_color': self.other_color,
            'pattern_name': self.pattern_name,
            'size_name': self.size_name,
            'service_name': self.service_name,
            'softener': self.softener,
            'cost': self.cost
        }
    
class Order_wnames:
    def __init__(self, order_id, name, status, address, total_cost, creation_date, finish_date):
        self.order_id = order_id
        self.name = name
        self.status = status
        self.address = address
        self.total_cost = total_cost
        self.creation_date = creation_date
        self.finish_date = finish_date
    
    def to_JSON(self):
        return {
            'id': self.order_id,
            'name': self.name,
            'status': self.status,
            'address': self.address,
            'total_cost': self.total_cost,
            'creation_date': self.creation_date,
            'finish_date': self.finish_date
        }

class CompQueries():
    
    @classmethod
    def get_order_details(self, id):
        try:
            connection = get_connection()
            details = []
            with connection.cursor() as cursor:
                cursor.execute("""SELECT
                i.description AS item_name,
                c1.name AS color1_name,
                c2.name AS color2_name,
                p.name AS pattern_name,
                si.name AS size_name,
                s.name AS service_name,
                os.softener AS softener,
                (i.cost + s.cost) * si.cost_multiplier AS "cost"
                FROM
                    order_services os
                INNER JOIN
                    items i ON i.item_id = os.item_id
                LEFT JOIN
                    colors AS c1 ON c1.color_id = os.main_color_id
                LEFT JOIN
                    colors AS c2 ON c2.color_id = os.other_color_id
                LEFT JOIN
                    patterns p ON p.pattern_id = os.pattern_id
                INNER JOIN
                    sizes si ON si.size_id = os.size_id
                INNER JOIN
                    services s ON s.service_id = os.service_id
                WHERE
                    os.order_id = %s;
                """, id)
                resultset = cursor.fetchall()
                for row in resultset:
                    detail = Order_det(row[0],
                                       row[1],
                                       row[2],
                                       row[3],
                                       row[4],
                                       row[5],
                                       row[6],
                                       row[7])
                    details.append(detail.to_JSON())
            connection.close()
            return jsonify(details)
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def get_orders_wnames(self):
        try:
            connection = get_connection()
            orders = []
            with connection.cursor() as cursor:
                cursor.execute(query = """
                                    SELECT 
                                        o.order_id as id, 
                                        c.full_name as client_name, 
                                        st.description AS status, 
                                        c.address AS address, 
                                        SUM((it.cost + s.cost) * si.cost_multiplier) AS total_cost,
                                        TO_CHAR(o.creation_date, 'DD/MM/YYYY') AS c_date, 
                                        TO_CHAR(o.finish_date, 'DD/MM/YYYY') AS f_date
                                    FROM 
                                        orders o
                                    INNER JOIN 
                                        clients c ON o.client_id = c.client_id
                                    INNER JOIN 
                                        statuses st ON o.status_id = st.status_id
                                    INNER JOIN 
                                        order_services os ON o.order_id = os.order_id
                                    INNER JOIN 
                                        items it ON os.item_id = it.item_id
                                    INNER JOIN 
                                        services s ON os.service_id = s.service_id
                                    INNER JOIN 
                                        sizes si ON os.size_id = si.size_id
                                    GROUP BY 
                                        id, 
                                        client_name, 
                                        status, 
                                        address, 
                                        c_date, 
                                        f_date,
                                        st.status_id
                                    ORDER BY 
                                        id DESC
                                    LIMIT 10;

                                    """)
                resultset = cursor.fetchall()
                for row in resultset:
                    order = Order_wnames(row[0], row[1], row[2], row[3], row[4], row[5], row[6] if row[6] is not None else '-')
                    orders.append(order.to_JSON())
            connection.close()
            return orders
        except Exception as ex:
            raise Exception(ex)


    @classmethod  
    def finish(self, id):
        try:
            connection = get_connection()
            current_date = datetime.datetime.now().strftime('%Y-%m-%d')
            affected_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""UPDATE orders SET finish_date = %s, status_id = 2 WHERE order_id = %s""", (current_date, id))
                affected_rows = cursor.rowcount
                connection.commit()
                
            connection.close()
            if affected_rows == 0:
                raise Exception("Order not found")
            return current_date
            
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def get_clients_matching(cls, query):
        try:
            connection = get_connection()
            clients = []
            with connection.cursor() as cursor:
                cursor.execute("SELECT client_id, full_name FROM clients WHERE full_name ILIKE %s LIMIT 5", ('%' + query + '%',))
                resultset = cursor.fetchall()
                for row in resultset:
                    clients.append({
                        'client_id': row[0],
                        'full_name': row[1],
                    })
        except Exception as ex:
            raise Exception(ex)
        finally:
            if connection:
                connection.close()
        
        return clients

    @classmethod
    def register_order(cls, client_id, items):
        connection = None
        try:
            connection = get_connection()
            print("Client ID:", client_id)
            print("Items:", items)

            with connection.cursor() as cursor:
                # Insert the order and get the generated order_id
                cursor.execute(
                    "INSERT INTO orders (client_id, status_id, creation_date) VALUES (%s, 1, %s) RETURNING order_id",
                    (client_id, datetime.datetime.now())
                )
                order_id = cursor.fetchone()[0]
                
                # Insert each item into the order_services table
                for item in items:
                    cursor.execute(
                        """
                        INSERT INTO order_services (order_id, service_id, item_id, main_color_id, other_color_id, pattern_id, size_id, softener, indications)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """,
                        (
                            order_id, item['service_id'], item['item_id'], item['maincolor_id'],
                            item['othercolor_id'], item['pattern_id'], item['size_id'],
                            item['softener'], item['indications']
                        )
                    )
                
                # Commit transaction after all inserts
                connection.commit()
        except Exception as ex:
            print("An error occurred:", ex)  # Print the exception message
            connection.rollback()  # Rollback the transaction if an error occurs
            raise  # Re-raise the exception to propagate it
        finally:
            if connection:
                connection.close()