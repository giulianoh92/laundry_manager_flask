from database.db import get_connection
from .entities.Item import Item

class ItemModel():

    @classmethod
    def get_items(self):
        try:
            connection = get_connection()
            items = []
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, description, cost FROM item")
                resultset = cursor.fetchall()
                for row in resultset:
                    item = Item(row[0], row[1], row[2])
                    items.append(item.to_JSON())
            connection.close()
            return items
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def get_item(self, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT id, description, cost FROM item WHERE id = %s",(id,))
                row = cursor.fetchone()

                item = None
                if row:
                    item = Item(row[0], row[1], row[2])
                    item = item.to_JSON()
            connection.close()
            return item
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def add_item(self, item):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO item (description, cost) 
                    VALUES (%s, %s) RETURNING id""",
                    (item.description, item.cost, item.id)
                )
                # Fetch the id of the last inserted row
                item.id = cursor.fetchone()[0]
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

        
    @classmethod
    def delete_item(self, item):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM \"item\" WHERE id = %s",(item.id,))

                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def update_item(self, item):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""UPDATE \"item\" SET description = %s, cost = %s WHERE id = %s """,
                               (item.description, item.cost, item.id))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)