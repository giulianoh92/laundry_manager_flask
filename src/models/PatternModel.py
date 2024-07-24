from database.db import get_connection
from.entities.Pattern import Pattern

class PatternModel():

    @classmethod
    def get_patterns(cls):
        try:
            connection = get_connection()
            patterns = []
            with connection.cursor() as cursor:
                cursor.execute("SELECT pattern_id, name FROM patterns")
                resultset = cursor.fetchall()
                for row in resultset:
                    pattern = Pattern(row[0], row[1])
                    patterns.append(pattern.to_JSON())
            connection.close()
            return patterns
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_pattern(cls, id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT pattern_id, name FROM patterns WHERE pattern_id = %s", (id,))
                row = cursor.fetchone()
                pattern = None
                if row:
                    pattern = Pattern(row[0], row[1]).to_JSON()
            connection.close()
            return pattern
        except Exception as ex:
            raise Exception(ex)

    # Add, update, and delete methods would follow a similar pattern to those in ClientModel
