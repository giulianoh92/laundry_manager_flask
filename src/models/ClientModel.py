from database.db import get_connection
from .entities.Client import Client

class ClientModel():

    @classmethod
    def get_clients(self):
        try:
            connection = get_connection()
            clients = []
            with connection.cursor() as cursor:
                cursor.execute("SELECT client_id, full_name, address, phone_number FROM clients")
                resultset = cursor.fetchall()
                for row in resultset:
                    client = Client(row[0], row[1], row[2], row[3])
                    clients.append(client.to_JSON())
        except Exception as ex:
            raise Exception(ex)
        finally:
            if connection:
                connection.close()
        
        return clients
    
    @classmethod
    def get_client(self, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT client_id, full_name, address, phone_number FROM clients WHERE client_id = %s",(id,))
                row = cursor.fetchone()

                client = None
                if row:
                    client = Client(row[0], row[1], row[2], row[3])
                    client = client.to_JSON()
            connection.close()
            return client
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def add_client(self, client):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO clients (full_name, address, phone_number) 
                    VALUES (%s, %s, %s) RETURNING id""",
                    (client.full_name, client.address, client.phone_number)
                )
                # Fetch the id of the last inserted row
                client.id = cursor.fetchone()[0]
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

        
    @classmethod
    def delete_client(self, client):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM clients WHERE client_id = %s",(client.client_id,))

                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def update_client(self, client):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""UPDATE client SET full_name = %s, address = %s, phone_number = %s WHERE client_id = %s """,
                               (client.full_name, client.address, client.phone_number, client.client_id))
                affected_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)