import logging, json
from datetime import datetime
from typing import Union
from pathlib import Path

class Logger:
    def __init__(self, name, file_path = ".logs/rag-api.log"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        parent_path = Path(__file__).parent.parent.parent.parent
        file_handler = logging.FileHandler(parent_path / file_path)
        self.logger.addHandler(file_handler)
        self.module_name = name
        
    
    def _parse_to_json(self, message: Union[str, dict], level: str):
        log_message = {
            'module': self.module_name,
            '@timestamp': datetime.now().isoformat(),
            'level': level.upper()
        }
        if isinstance(message, dict):
            log_message = {**log_message, **message}
            pass
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