from database.db import get_connection
from .entities.Client import Client

class ClientModel:

    @classmethod
    def get_clients(cls):
        try:
            connection = get_connection()
            clients = []
            with connection.cursor() as cursor:
                cursor.execute("SELECT client_id, full_name, address, phone_number FROM clients LIMIT 10")
                resultset = cursor.fetchall()
                for row in resultset:
                    client = Client(row[0], row[1], row[2], row[3])
                    clients.append(client.to_JSON())
            return clients
        except Exception as ex:
            raise Exception(f'Error fetching clients: {ex}')
        finally:
            connection.close()
        
    @classmethod
    def get_client(cls, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT client_id, full_name, address, phone_number FROM clients WHERE client_id = %s", (id,))
                row = cursor.fetchone()
                if row:
                    return Client(row[0], row[1], row[2], row[3]).to_JSON()
                return None
        except Exception as ex:
            raise Exception(f'Error fetching client: {ex}')
        finally:
            connection.close()
        
    @classmethod
    def add_client(cls, client):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO clients (full_name, address, phone_number) 
                    VALUES (%s, %s, %s) RETURNING client_id""",
                    (client.full_name, client.address, client.phone_number)
                )
                client.client_id = cursor.fetchone()[0]
                connection.commit()
            return client.client_id
        except Exception as ex:
            raise Exception(f'Error adding client: {ex}')
        finally:
            connection.close()

    @classmethod
    def delete_client(cls, client):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM clients WHERE client_id = %s", (client.client_id,))
                affected_rows = cursor.rowcount
                connection.commit()
            return affected_rows
        except Exception as ex:
            raise Exception(f'Error deleting client: {ex}')
        finally:
            connection.close()
        
    @classmethod
    def update_client(cls, client):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute(
                    """UPDATE clients SET full_name = %s, address = %s, phone_number = %s WHERE client_id = %s""",
                    (client.full_name, client.address, client.phone_number, client.client_id)
                )
                affected_rows = cursor.rowcount
                connection.commit()
            return affected_rows
        except Exception as ex:
            raise Exception(f'Error updating client: {ex}')
        finally:
            connection.close()
