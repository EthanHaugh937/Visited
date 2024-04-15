class RecordDoesNotExist(Exception):
    def __init__(self, Id: str):
        self.message = f"Record with ID: {Id} - Does not exist"
        super().__init__(self.message)