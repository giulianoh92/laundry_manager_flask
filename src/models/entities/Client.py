class Client():
    def __init__(self, client_id, full_name = None, address = None, phone_number = None) -> None:
        self.client_id = client_id
        self.full_name = full_name
        self.address = address
        self.phone_number = phone_number

    def to_JSON(self):
        return {
            "client_id": self.client_id,
            "full_name": self.full_name,
            "address" : self.address,
            "phone_number": self.phone_number
        }
    