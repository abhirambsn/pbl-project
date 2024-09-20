import logging, json
from datetime import datetime
from typing import Union
from pathlib import Path
from hypercorn.logging import Logger as HypercornLogger
import os

class LogstashJSONFormatter(logging.Formatter):
    def format(self, record):
        log_obj = {
            '@timestamp': self.formatTime(record),
            'level': record.levelname,
            'message': record.getMessage(),
            'logger_name': record.name,
            'pid': record.process
        }
        return json.dumps(log_obj)

class CustomLogger:
    def __init__(self, name: str = "rag-api", level: str = logging.INFO):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)

        ch = logging.StreamHandler()
        ch.setLevel(level)

        formatter = LogstashJSONFormatter()
        ch.setFormatter(formatter)

        if not self.logger.handlers:
            self.logger.addHandler(ch)
    
    def get_logger(self):
        return self.logger
    
class HypercornLoggerAdapter(HypercornLogger):
    def __init__(self, config):
        super().__init__(config)
        self.access_logger = None
        self.error_logger = Logger("hypercorn_error_logger", logging.ERROR, ".logs/rag-error.log").get_logger()


class Logger:
    def __init__(self, name: str, level: int = logging.INFO, file_path = ".logs/rag-api.log"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)
        parent_path = Path(__file__).parent.parent.parent.parent
        file_handler = logging.FileHandler(parent_path / file_path)
        stream_handler = logging.StreamHandler()
        if not self.logger.handlers:
            self.logger.addHandler(stream_handler)
            self.logger.addHandler(file_handler)
        self.module_name = name
    
    def get_logger(self):
        return self.logger
        
    
    def _parse_to_json(self, message: Union[str, dict], level: str):
        log_message = {
            'module': self.module_name,
            '@timestamp': datetime.now().isoformat(),
            'level': level.upper(),
            'pid': os.getpid()
        }
        if isinstance(message, dict):
            log_message = {**log_message, **message}
        else:
            log_message = {**log_message, 'message': message}
        return json.dumps(log_message)

    def info(self, message: Union[str, dict]) -> None:
        self.logger.info(self._parse_to_json(message, 'info'))

    def debug(self, message: Union[str, dict]) -> None:
        self.logger.debug(self._parse_to_json(message, 'debug'))
        

    def error(self, message: Union[str, dict]) -> None:
        self.logger.error(self._parse_to_json(message, 'error'))

    def warn(self, message: Union[str, dict]) -> None:
        self.logger.warning(self._parse_to_json(message, 'warn'))

    def critical(self, message: Union[str, dict]) -> None:
        self.logger.critical(self._parse_to_json(message, 'critical'))