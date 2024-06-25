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
                Item.description AS item_name, 
                Color1.name AS color1_name, 
                Color2.name AS color2_name, 
                Pattern.name AS pattern_name, 
                Size.name AS size_name, 
                Service.name AS service_name, 
                Order_Service.softener AS softener, 
                (Item.cost + Service.cost) * Size.cost_multiplier AS "cost"
                FROM 
                    Order_Service 
                INNER JOIN 
                    Item ON Item.id = Order_Service.item_id
                INNER JOIN 
                    Color AS Color1 ON Color1.id = Order_Service.maincolor_id
                INNER JOIN 
                    Color AS Color2 ON Color2.id = Order_Service.othercolor_id
                INNER JOIN 
                    Pattern ON Pattern.id = Order_Service.pattern_id
                INNER JOIN 
                    Size ON Size.id = Order_Service.size_id
                INNER JOIN 
                    Service ON Service.id = Order_Service.service_id
                WHERE 
                    Order_Service.order_id = %s;
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
                                        "Order".id, 
                                        Client.name AS name, 
                                        Status.description AS status, 
                                        Client.address AS address, 
                                        SUM((Item.cost + Service.cost) * Size.cost_multiplier) AS total_cost,
                                        "Order".creation_date, 
                                        "Order".finish_date 
                                    FROM 
                                        "Order"
                                    INNER JOIN 
                                        Client ON "Order".client_id = Client.id
                                    INNER JOIN 
                                        Status ON "Order".status_id = Status.id
                                    INNER JOIN 
                                        Order_Service ON "Order".id = Order_Service.order_id
                                    INNER JOIN 
                                        Item ON Order_Service.item_id = Item.id
                                    INNER JOIN 
                                        Service ON Order_Service.service_id = Service.id
                                    INNER JOIN 
                                        Size ON Order_Service.size_id = Size.id
                                    GROUP BY 
                                        "Order".id, 
                                        Client.name, 
                                        Status.description, 
                                        Client.address, 
                                        "Order".creation_date, 
                                        "Order".finish_date,
                                        Status.id
                                    ORDER BY 
                                        "Order".creation_date ASC;

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
                cursor.execute("""UPDATE "Order" SET finish_date = %s, status_id = 2 WHERE id = %s""", (current_date, id))
                affected_rows = cursor.rowcount
                connection.commit()
                
            connection.close()
            if affected_rows == 0:
                raise Exception("Order not found")
            return current_date
            
        except Exception as ex:
            raise Exception(ex)