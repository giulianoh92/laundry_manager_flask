class Client():
    def __init__(self, id, name = None, address = None, phone_number = None) -> None:
        self.id = id
        self.name = name
        self.address = address
        self.phone_number = phone_number

    def to_JSON(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "phone_number": self.phone_number
        }
    