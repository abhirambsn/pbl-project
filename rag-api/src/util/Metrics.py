import psutil
import time

app_start_time = -1

def set_start_time(start_time: float):
    global app_start_time
    app_start_time = start_time

def get_cpu_usage():
    return psutil.cpu_percent(interval=1)

def get_memory_usage():
    return psutil.virtual_memory().percent

def get_disk_usage():
    return psutil.disk_usage('/').percent

def get_disk_free():
    return psutil.disk_usage('/').free

def get_disk_total():
    return psutil.disk_usage('/').total

def get_process_cpu_time():
    return psutil.Process().cpu_times().user

def get_process_cpu_usage():
    return psutil.Process().cpu_percent(interval=1)

def get_process_files_open():
    return psutil.Process().num_fds()

def get_process_start_time():
    return psutil.Process().create_time()

def get_process_uptime():
    return time.time() - psutil.Process().create_time()

def get_system_cpu_count():
    return psutil.cpu_count()

def get_system_load_average_1m():
    return psutil.getloadavg()[0]

def format_time(epoch_time):
    return round(epoch_time, 3)

metrics = {
    "application.started.time": {"func": format_time, "args": True, "baseUnit": "seconds"}, 
    "disk.free": {"func": get_disk_free, "args": False, "baseUnit": "bytes"}, 
    "disk.total": {"func": get_disk_total, "args": False, "baseUnit": "bytes"},
    "process.cpu.time": {"func": get_process_cpu_time, "args": False, "baseUnit": "seconds"}, 
    "process.cpu.usage": {"func": get_process_cpu_usage, "args": False, "baseUnit": "seconds"}, 
    "process.files.max": {"func": psutil.Process().num_fds, "args": False, "baseUnit": "files"}, 
    "process.files.open": {"func": get_process_files_open, "args": False, "baseUnit": "files"},
    "process.start.time": {"func": get_process_start_time, "args": False, "baseUnit": "seconds"},
    "process.uptime": {"func": get_process_uptime, "args": False, "baseUnit": "seconds"},
    "system.cpu.count": {"func": get_system_cpu_count, "args": False, "baseUnit": None},
    "system.cpu.usage": {"func": get_cpu_usage, "args": False, "baseUnit": None},
    "system.load.average.1m": {"func": get_system_load_average_1m, "args": False, "baseUnit": None},
}

metrics_keys = list(metrics.keys())

def get_metrics(key: str):
    fn = metrics.get(key, False)
    value = None
    if not fn:
        return None
    if fn["args"] != False:
        if "start" in key:
            value = fn["func"](app_start_time)
        else:
            value = fn["func"](fn["args"])
    else:
        value = fn["func"]()

    response = {
        "name": key,
        "description": "TBD",
        "baseUnit": fn.get("baseUnit", ""),
        "measurements": [
            {"statistic": "VALUE", "value": value}
        ]
    }
    return response