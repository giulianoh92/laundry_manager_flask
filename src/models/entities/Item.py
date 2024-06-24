class Item():
    def __init__(self, id, description = None, cost = None) -> None:
        self.id = id
        self.description = description
        self.cost = cost

    def to_JSON(self):
        return {
            "id": self.id,
            "description": self.description,
            "cost": self.cost
        }