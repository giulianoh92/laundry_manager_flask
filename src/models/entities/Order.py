from utils.DateFormat import DateFormat

class Order():
    def __init__(self, id, client_id, status_id, creation_date = None, finish_date = None) -> None:
        self.id = id
        self.client_id = client_id
        self.status_id = status_id
        self.creation_date = creation_date
        self.finish_date = finish_date

    def to_JSON(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "status_id": self.status_id,
            "creation_date": DateFormat.convert_date(self.creation_date) if self.creation_date is not None else self.creation_date,
            "finish_date": DateFormat.convert_date(self.finish_date) if self.finish_date is not None else self.finish_date
        }
    