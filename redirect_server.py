from http.server import BaseHTTPRequestHandler, HTTPServer

TARGET_URL = "https://ssds1.github.io/wobkots/"
PORT = 80

class RedirectHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(302)
        self.send_header("Location", TARGET_URL)
        self.end_headers()

    def do_HEAD(self):
        self.send_response(302)
        self.send_header("Location", TARGET_URL)
        self.end_headers()

    def log_message(self, format, *args):
        return  # تقليل الضجيج في الطرفية

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), RedirectHandler)
    print(f"Redirect server running on port {PORT} -> {TARGET_URL}")
    server.serve_forever()
y": "ps5upload"},
    {"title": "WebKit Autoloader Installer", "description": "Installs WebKit Autoloader on the PS5 homescreen. Version v0.5.2", "name": "WebKit-Autoloader-Installer_v0.5.2.elf", "info": "WebKit-Autoloader-Installer_v0.5.2.elf - itsPLK", "key": "webkit-autoloader-installer"},
    {"title": "ps5debug-NG", "description": "PS5 debugger payload with a userland TCP wire-protocol server. Version 1.3.2", "name": "ps5debug-NG_1.3.2.elf", "info": "ps5debug-NG_1.3.2.elf - Pharaoh2k", "key": "ps5debug-ng"},
    {"title": "zftpd", "description": "Zero-copy FTP/HTTP server. Version v1.6.0", "name": "zftpd_v1.6.0.elf", "info": "zftpd_v1.6.0.elf - seregonwar", "key": "zftpd"},
    {"title": "CheatRunner", "description": "Web-based game cheat trainer. Version v0.17.1", "name": "CheatRunner_v0.17.1.elf", "info": "CheatRunner_v0.17.1.elf - notmaj0r", "key": "cheatrunner"},
    {"title": "ftpsrv-drakmor", "description": "drakmor's fork of ftpsrv. Version 1.16-ng-stable", "name": "ftpsrv-drakmor_1.16-ng-stable.elf", "info": "ftpsrv-drakmor_1.16-ng-stable.elf - drakmor", "key": "ftpsrv-drakmor"},
    {"title": "garlic-savemgr", "description": "PS5 save decrypt/encrypt/browse utility with embedded web UI. Version v1.13.1", "name": "garlic-savemgr_v1.13.1.elf", "info": "garlic-savemgr_v1.13.1.elf - earthonion", "key": "garlic-savemgr"},
    {"title": "kstuff-lite", "description": "Lite version of kstuff. Version v1.11", "name": "kstuff-lite_v1.11.elf", "info": "kstuff-lite_v1.11.elf - EchoStretch", "key": "kstuff-lite"},
    {"title": "Lapy-JB-Daemon", "description": "Standalone homebrew jailbreak daemon for PS5. Version v1.2", "name": "Lapy-JB-Daemon_v1.2.elf", "info": "Lapy-JB-Daemon_v1.2.elf - Lapy", "key": "lapy-jb-daemon"},
    {"title": "PKG-Manager", "description": "Browse and install PKGs from USB, disc, or SMB shares directly on your PS5. Version v1.4.1", "name": "PKG-Manager_v1.4.1.elf", "info": "PKG-Manager_v1.4.1.elf - itsPLK", "key": "pkg-manager"},
    {"title": "pldmgr", "description": "Modern web dashboard to manage, import, and automatically load payloads on your PS5. Version v0.5.2", "name": "pldmgr_v0.5.2.elf", "info": "pldmgr_v0.5.2.elf - itsPLK", "key": "pldmgr"},
    {"title": "ps5-app-dumper", "description": "Dumps PS5 application files from pfsmnt to a connected USB storage device. Version v2.00", "name": "ps5-app-dumper_v2.00.elf", "info": "ps5-app-dumper_v2.00.elf - EchoStretch", "key": "ps5-app-dumper"},
    {"title": "ShadowMountPlus", "description": "Fully automated background Auto-Mounter for jailbroken PS5 consoles. Version 1.7beta2", "name": "ShadowMountPlus_1.7beta2.elf", "info": "ShadowMountPlus_1.7beta2.elf - drakmor", "key": "shadowmountplus"}
];
window.PAYLOAD_ART = { dir: "ui/", pfx: "btn-", on: true };
