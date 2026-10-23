#!/usr/bin/env python3
"""Builds the offline game bundle used by the mobile apps.

app/ (the web version) + fonts/  ->  a self-contained "www" folder with local fonts.

Usage:
  python3 tools/build_www.py                 # writes ios/AtahualpaChess/www and android/src/assets/www
  python3 tools/build_www.py <dir> [<dir>...]
"""
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
FONTS = os.path.join(ROOT, "fonts")
DEFAULT_OUT = [os.path.join(ROOT, "ios", "AtahualpaChess", "www"),
               os.path.join(ROOT, "android", "src", "assets", "www")]

FONT_FACES = [("Chakra Petch", "chakra-petch", [500, 600, 700]),
              ("Albert Sans", "albert-sans", [400, 500, 600]),
              ("JetBrains Mono", "jetbrains-mono", [400, 500])]
FILES = ["chess.js", "atahualpa-ai.js", "i18n.js", "book.json", "stockfish.js", "stockfish.wasm",
         "voice-es.mp3", "voice-en.mp3", "voice-de.mp3", "licenses.html",
         "LICENSE-GPL3.txt", "LICENSE-OFL.txt", "LICENSE-chessjs.txt", "LICENSE-games-MIT.txt", "LICENSE-openings-CC0.txt"]


def build(out):
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, "fonts"))
    css = []
    for family, slug, weights in FONT_FACES:
        for w in weights:
            fn = f"{slug}-latin-{w}-normal.woff2"
            shutil.copy(os.path.join(FONTS, fn), os.path.join(out, "fonts", fn))
            css.append(f"@font-face{{font-family:'{family}';font-style:normal;font-weight:{w};"
                       f"font-display:swap;src:url(fonts/{fn}) format('woff2')}}")
    page = open(os.path.join(APP, "index.html"), encoding="utf-8").read()
    # The web page loads Google Fonts; the apps use the bundled copies so they work offline.
    page = re.sub(r'<link rel="(preconnect|stylesheet)" href="https://fonts\.g[^>]*>\n?', "", page)
    page = page.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "")
    head = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<style>'
            + "\n".join(css)
            + "\n[hidden]{display:none!important}img{max-width:100%}body{margin:0}"
              "html{touch-action:manipulation;-webkit-text-size-adjust:100%}</style>\n</head>\n<body>\n")
    with open(os.path.join(out, "index.html"), "w", encoding="utf-8") as f:
        f.write(head + page + "\n</body>\n</html>\n")
    for name in FILES:
        shutil.copy(os.path.join(APP, name), os.path.join(out, name))
    print("www ->", out)


if __name__ == "__main__":
    for target in (sys.argv[1:] or DEFAULT_OUT):
        build(os.path.abspath(target))
