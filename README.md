# Atahualpa Chess

**Ajedrez en estilo inca · Inca-style chess · Schach im Inka-Stil**

Creado por James Alvis Tafur.

Juega contra Atahualpa, un rival basado en Stockfish 18 con tres niveles calibrados (2000, 2300 y 2500 Elo), libro de aperturas de partidas de campeones del mundo, piezas y tablero con motivos incas, relojes de 3 y 5 minutos, oferta de tablas, sonidos andinos, exportación PGN y tres idiomas (español, inglés y alemán). Funciona sin conexión.

## Soporte / Support
Para preguntas o problemas, abre un *issue* en este repositorio.
For questions or problems, open an issue in this repository.

- Política de privacidad / Privacy policy: [PRIVACY.md](PRIVACY.md)

## Estructura / Layout
| Carpeta | Contenido |
|---|---|
| `app/` | El juego (HTML/JS). Es la versión web y la fuente única de las apps. |
| `fonts/` | Tipografías incluidas en las apps (SIL OFL 1.1). |
| `tools/build_www.py` | Genera el paquete sin conexión `www` para iOS y Android. |
| `ios/` | App de iOS/iPadOS (Swift + WKWebView). |
| `android/` | App de Android (Java + WebView) y `build.sh`. |
| `.github/workflows/ios.yml` | Compila, prueba en simulador, firma y sube a App Store Connect. |
| `tools/build_book.js` | Script que construyó `app/book.json` (libro de aperturas). |

## Compilar / Build
- **iOS en GitHub Actions (sin Mac):** ver el workflow `iOS`. Secrets necesarios: `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8_BASE64`, `APPLE_TEAM_ID`.
- **iOS en un Mac:** `python3 tools/build_www.py ios/AtahualpaChess/www`, abrir `ios/AtahualpaChess.xcodeproj`, elegir tu equipo en *Signing & Capabilities* y usar *Product → Archive*.
- **Android:** `android/build.sh` (requiere tu propio keystore, que no se guarda en el repositorio).

## Licencia / License
GNU General Public License v3.0 (ver [LICENSE](LICENSE)). Incluye Stockfish 18 (GPLv3), chess.js (BSD-2-Clause), datos de lichess-org/chess-openings (CC0), partidas de «against-the-masters» (MIT) y tipografías bajo SIL OFL 1.1. Detalle en `app/licenses.html`.
