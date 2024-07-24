

class Order_Service():
    def __init__(self, os_id, order_id, item_id, service_id, maincolor_id, othercolor_id, pattern_id, size_id, softener, indications):
        self.os_id = os_id
        self.order_id = order_id
        self.item_id = item_id
        self.service_id = service_id
        self.maincolor_id = maincolor_id
        self.othercolor_id = othercolor_id
        self.pattern_id = pattern_id
        self.size_id = size_id
        self.softener = softener
        self.indications = indications

    def to_JSON(self):
        return {
            "os_id": self.os_id,
            "order_id": self.order_id,
            "item_id": self.item_id,
            "service_id": self.service_id,
            "maincolor_id": self.maincolor_id,
            "othercolor_id": self.othercolor_id,
            "pattern_id": self.pattern_id,
            "size_id": self.size_id,
            "softener": self.softener,
            "indications": self.indications
        }
    