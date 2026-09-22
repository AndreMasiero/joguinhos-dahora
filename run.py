#!/usr/bin/env python3
"""Servidor local pro app Joguinhos da Hora.

Service workers só funcionam em contexto seguro (https:// ou http://localhost),
então abrir o index.html direto com duplo-clique (file://) não deixa instalar
nem cachear offline. Este script serve a pasta em http://localhost e abre o
navegador automaticamente.
"""
import http.server
import mimetypes
import os
import socketserver
import threading
import webbrowser

PORT = 8791

mimetypes.add_type('application/manifest+json', '.webmanifest')


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def open_browser():
    webbrowser.open('http://localhost:%d/' % PORT)


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(('localhost', PORT), Handler) as httpd:
        print('Servindo Joguinhos da Hora em http://localhost:%d  (Ctrl+C pra parar)' % PORT)
        threading.Timer(0.6, open_browser).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nEncerrado.')
