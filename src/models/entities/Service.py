class Service():
    def __init__(self, id, name = None, description = None, cost = None) -> None:
        self.id = id
        self.name = name
        self.description = description
        self.cost = cost


    def to_JSON(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'cost': self.cost
        }