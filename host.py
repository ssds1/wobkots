import re
import socket
import subprocess
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from ssl import PROTOCOL_TLS_SERVER, SSLContext

HTTPS_PORT = 443
EXTRA_PORT = 9021
BASE_DIR = Path(__file__).resolve().parent
CERT_FILE = BASE_DIR / "localhost.pem"


class NoCacheHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()


def local_ip():
    try:
        output = subprocess.check_output(
            ["ipconfig"],
            text=True,
            encoding="utf-8",
            errors="ignore",
        )
        for ip in re.findall(r"IPv4[^:]*:\s*([\d.]+)", output):
            if ip.startswith("192.168."):
                return ip
    except Exception:
        pass
    return "localhost"


def handle_extra_client(conn, addr):
    try:
        conn.settimeout(5.0)
        data = conn.recv(4096)
        if data:
            print(f"[{EXTRA_PORT}] Received from {addr}: {data!r}")
    except socket.timeout:
        pass
    except Exception as e:
        print(f"[{EXTRA_PORT}] Client error from {addr}: {e}")
    finally:
        conn.close()


def start_extra_port_server(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(("0.0.0.0", port))
    sock.listen(5)
    print(f"[*] Extra port listening on 0.0.0.0:{port}")

    while True:
        conn, addr = sock.accept()
        threading.Thread(target=handle_extra_client, args=(conn, addr), daemon=True).start()


if __name__ == "__main__":
    threading.Thread(target=start_extra_port_server, args=(EXTRA_PORT,), daemon=True).start()

    context = SSLContext(PROTOCOL_TLS_SERVER)
    context.load_cert_chain(str(CERT_FILE))

    httpd = HTTPServer(("0.0.0.0", HTTPS_PORT), NoCacheHandler)
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    ip = local_ip()
    print(f"running server !! -> https://{ip}:{HTTPS_PORT}/ (also https://{ip}/)")
    httpd.serve_forever()
