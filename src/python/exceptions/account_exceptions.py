class RecordDoesNotExist(Exception):
    def __init__(self, userId):
        self.message = f"Record with User ID: {userId} - Does not exist"
        super().__init__(self.message)