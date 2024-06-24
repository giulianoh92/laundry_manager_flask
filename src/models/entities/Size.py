class Size():
    def __init__(self, id, name = None, cost_multiplier = None) -> None:
        self.id = id
        self.name = name
        self.cost_multiplier = cost_multiplier


    def to_JSON(self):
        return {
            'id': self.id,
            'name': self.name,
            'cost_multiplier': self.cost_multiplier
        }