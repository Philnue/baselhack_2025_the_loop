import logging

from typing import cast


class HealthCheckFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.args, tuple):
            method: str = cast(str, record.args[1])
            query_string: str = cast(str, record.args[2])

            return method != "GET" or not query_string.startswith("/health")

        return True
