/* Atahualpa Chess · translations (es = default, en, de).
 * t(key, vars) returns the text in the current language; {name} placeholders are filled from vars. */
(function (root) {
  "use strict";
  const T = {
    es: {
      tagline: "Ajedrez en estilo inca", licenses: "Licencias y créditos", sign: "Creado por James Alvis Tafur", farewell: "Fue un placer jugar contigo.",
      subtitle: "Ajedrez contra la máquina · ejército del Inti contra ejército de la Killa",
      lang_aria: "Idioma",
      sound_title: "Activar o silenciar sonidos", sound_on: "Sonido", sound_off: "Silencio",
      engine_loading: "Cargando Stockfish 18…", engine_ready: "Stockfish 18 listo", engine_fallback: "Motor de respaldo (más débil)",
      engine_t_loading: "Descargando el motor (≈7 MB) una sola vez.",
      engine_t_ready: "Stockfish 18 listo: calcula dentro de tu navegador y funciona sin conexión.",
      engine_t_fallback: "Stockfish no está disponible: {r}",
      fail_error: "error al iniciar el motor ({d})", fail_timeout: "el motor no respondió en 25 s",
      fail_blocked: "el navegador no permitió iniciar el motor ({d})", fail_unknown: "motivo desconocido",
      board_region: "Tablero", board_aria: "Tablero de ajedrez",
      promo_aria: "Elegir pieza de coronación", promo_title: "Coronación", promo_text: "Elige la pieza para tu peón.",
      end_new: "Nueva partida", end_save: "Guardar PGN", end_close: "Ver tablero",
      level_label: "Nivel de Atahualpa", level_aria: "Nivel",
      lvl_basico: "Básico", lvl_intermedio: "Intermedio", lvl_avanzado: "Avanzado",
      your_pieces: "Tus piezas", color_aria: "Color", white: "Blancas", black: "Negras", random: "Al azar",
      tc_label: "Ritmo de juego", tc_unlimited: "Sin límite",
      your_name: "Tu nombre", player: "Jugador",
      settings_note: "Nivel, color y ritmo se aplican al empezar una partida nueva.",
      settings_saved: "Cambio guardado: se aplicará al pulsar «Nueva partida».",
      new_game: "Nueva partida", undo: "Deshacer", flip: "Girar", resign: "Rendirse", confirm: "¿Confirmar?", offer_draw: "Ofrecer tablas",
      your_turn: "Tu turno", check_your_turn: "¡Jaque! Tu turno", ai_turn: "Turno de Atahualpa",
      ai_thinking: "Atahualpa está pensando…", ai_loading: "Cargando el motor de Atahualpa… su reloj está en pausa",
      win: "Victoria", loss: "Derrota", draw: "Tablas",
      r_mate: "Jaque mate", r_stalemate: "Rey ahogado", r_threefold: "Triple repetición", r_insufficient: "Material insuficiente",
      r_fifty: "Regla de los 50 movimientos", r_resign: "Abandono", r_flag: "Tiempo agotado",
      r_flag_nomat: "Tiempo agotado sin material para dar mate", r_agreed: "Tablas por acuerdo",
      moves_label: "Jugadas", book_note: "Subrayado dorado: jugada de libro de Atahualpa.",
      first_move: "Haz tu primera jugada: arrastra una pieza o tócala y luego toca su destino.",
      ai_opens: "Atahualpa abre la partida con blancas.",
      opening_start: "Posición inicial", opening_out: "Fuera de la teoría catalogada",
      note_book_k: "<b>De memoria:</b> jugada del repertorio de Kasparov.",
      note_book_c: "<b>De memoria:</b> jugada de campeones del mundo.",
      note_book_t: "<b>De memoria:</b> línea de teoría.",
      note_style: "<b>Estilo Kasparov:</b> entre jugadas de igual valor elige la más activa{why}.",
      note_norepeat: "<b>Sin repetir:</b> Atahualpa va mejor y evita repetir la posición.",
      why_check: "jaque", why_near_king: "pieza junto al rey rival", why_retreat: "retirada", why_opens_king: "abre el enroque",
      why_pawn_storm: "avance de peones contra el rey", why_keeps_queens: "evita cambiar damas", why_mate: "mate",
      ai_sub: "{lvl} · {elo} Elo · estilo Kasparov",
      player_sub_w: "Blancas · ejército del Inti", player_sub_b: "Negras · ejército de la Killa",
      dw_over: "La partida ya terminó", dw_deciding: "Atahualpa está considerando tu oferta",
      dw_turn: "Puedes ofrecer tablas en tu turno", dw_first: "Juega al menos una jugada antes de ofrecer tablas",
      dw_cool1: "Atahualpa rechazó tu última oferta. Podrás ofrecer de nuevo en 1 jugada",
      dw_cooln: "Atahualpa rechazó tu última oferta. Podrás ofrecer de nuevo en {n} jugadas",
      dw_ok: "Propón a Atahualpa terminar la partida en tablas",
      d_wait: "Ofreciste tablas. Atahualpa lo está pensando…",
      d_yes_worse: "Atahualpa acepta las tablas: su posición es peor.",
      d_no_early: "Atahualpa rechaza: es demasiado pronto para tablas. Quiere seguir luchando.",
      d_yes_stuck: "Atahualpa acepta las tablas: no ve cómo mejorar su posición.",
      d_yes_equal: "Atahualpa acepta las tablas: considera la posición igualada.",
      d_no_clear: "Atahualpa rechaza: cree que tiene ventaja clara.",
      d_no_slight: "Atahualpa rechaza: piensa que su posición es algo mejor.",
      pgn_label: "Partida en PGN", pgn_aria: "Partida en formato PGN", save_pgn: "Guardar .pgn", copy_pgn: "Copiar PGN",
      pgn_event: "Partida contra Atahualpa Chess",
      pgn_ai: "Atahualpa {lvl} (Stockfish 18 Lite, nivel {elo}, estilo Kasparov)", pgn_ai_fb: "Atahualpa {lvl} (motor de respaldo)",
      t_saved: "Archivo PGN guardado.", t_cancel: "Guardado cancelado.",
      t_busy: "Ya hay una ventana de guardado abierta. Inténtalo en unos segundos.",
      t_txt: "Guardado como .pgn.txt: quítale «.txt» al nombre y tu programa de ajedrez lo abrirá como PGN.",
      t_maybe: "Si no se descargó el archivo, usa «Copiar PGN» y pégalo en tu programa de ajedrez.",
      t_fail: "No se pudo guardar aquí. Usa «Copiar PGN».", t_copied: "PGN copiado al portapapeles.",
      t_select: "Texto seleccionado: cópialo con Ctrl+C o ⌘C.", share_title: "Compartir PGN",
      clock_aria: "Reloj de {who}: {t}", you: "tu lado",
      sq_piece: "{sq}, {p} de las {c}", c_w: "blancas", c_b: "negras",
      p_p: "peón", p_n: "caballo", p_b: "alfil", p_r: "torre", p_q: "dama", p_k: "rey",
      foot: "Motor: Stockfish 18 Lite con fuerza limitada. Cada nivel está ajustado para rendir como Stockfish 18 completo con UCI_Elo 2000, 2300 o 2500, escala calibrada por Stockfish contra la lista de motores CCRL. Es una aproximación al Elo FIDE humano, no una equivalencia oficial. Estilo Kasparov: abre con su repertorio real (1.610 partidas clásicas), luego con jugadas de otros nueve campeones del mundo y la teoría de Lichess; en el medio juego, entre jugadas de igual valor, prefiere la iniciativa y el ataque al rey. Cuando va mejor, evita las tablas por repetición. Piezas: Sapa Inca con su mascapaicha (rey), ñusta con ñañaca y lliclla (dama), sacerdote con tumi (alfil), llama (caballo), fortaleza de piedra (torre) y guerrero (peón).",
    },
    en: {
      tagline: "Inca-style chess", licenses: "Licenses and credits", sign: "Created by James Alvis Tafur", farewell: "It was a pleasure playing with you.",
      subtitle: "Chess against the machine · army of Inti against army of Killa",
      lang_aria: "Language",
      sound_title: "Turn sounds on or off", sound_on: "Sound", sound_off: "Muted",
      engine_loading: "Loading Stockfish 18…", engine_ready: "Stockfish 18 ready", engine_fallback: "Backup engine (weaker)",
      engine_t_loading: "Downloading the engine (≈7 MB) once.",
      engine_t_ready: "Stockfish 18 ready: it runs inside your browser and works offline.",
      engine_t_fallback: "Stockfish is not available: {r}",
      fail_error: "error starting the engine ({d})", fail_timeout: "the engine did not respond within 25 s",
      fail_blocked: "the browser did not allow the engine to start ({d})", fail_unknown: "unknown reason",
      board_region: "Board", board_aria: "Chessboard",
      promo_aria: "Choose a promotion piece", promo_title: "Promotion", promo_text: "Choose the piece for your pawn.",
      end_new: "New game", end_save: "Save PGN", end_close: "View board",
      level_label: "Atahualpa's level", level_aria: "Level",
      lvl_basico: "Basic", lvl_intermedio: "Intermediate", lvl_avanzado: "Advanced",
      your_pieces: "Your pieces", color_aria: "Colour", white: "White", black: "Black", random: "Random",
      tc_label: "Time control", tc_unlimited: "Unlimited",
      your_name: "Your name", player: "Player",
      settings_note: "Level, colour and time control apply when you start a new game.",
      settings_saved: "Change saved: it will apply when you press “New game”.",
      new_game: "New game", undo: "Undo", flip: "Flip", resign: "Resign", confirm: "Confirm?", offer_draw: "Offer a draw",
      your_turn: "Your move", check_your_turn: "Check! Your move", ai_turn: "Atahualpa's move",
      ai_thinking: "Atahualpa is thinking…", ai_loading: "Loading Atahualpa's engine… its clock is paused",
      win: "Victory", loss: "Defeat", draw: "Draw",
      r_mate: "Checkmate", r_stalemate: "Stalemate", r_threefold: "Threefold repetition", r_insufficient: "Insufficient material",
      r_fifty: "50-move rule", r_resign: "Resignation", r_flag: "Time forfeit",
      r_flag_nomat: "Time forfeit, but no mating material", r_agreed: "Draw by agreement",
      moves_label: "Moves", book_note: "Gold underline: Atahualpa's book move.",
      first_move: "Make your first move: drag a piece, or tap it and then tap its destination.",
      ai_opens: "Atahualpa opens the game with White.",
      opening_start: "Starting position", opening_out: "Outside catalogued theory",
      note_book_k: "<b>From memory:</b> a move from Kasparov's repertoire.",
      note_book_c: "<b>From memory:</b> a move played by world champions.",
      note_book_t: "<b>From memory:</b> a theory line.",
      note_style: "<b>Kasparov style:</b> among moves of equal value it picks the most active one{why}.",
      note_norepeat: "<b>No repetition:</b> Atahualpa is better and avoids repeating the position.",
      why_check: "check", why_near_king: "piece next to the enemy king", why_retreat: "retreat", why_opens_king: "opens the king's shelter",
      why_pawn_storm: "pawn storm against the king", why_keeps_queens: "avoids trading queens", why_mate: "mate",
      ai_sub: "{lvl} · {elo} Elo · Kasparov style",
      player_sub_w: "White · army of Inti", player_sub_b: "Black · army of Killa",
      dw_over: "The game is over", dw_deciding: "Atahualpa is considering your offer",
      dw_turn: "You can offer a draw on your move", dw_first: "Play at least one move before offering a draw",
      dw_cool1: "Atahualpa declined your last offer. You can offer again in 1 move",
      dw_cooln: "Atahualpa declined your last offer. You can offer again in {n} moves",
      dw_ok: "Propose to Atahualpa that the game ends in a draw",
      d_wait: "You offered a draw. Atahualpa is thinking it over…",
      d_yes_worse: "Atahualpa accepts the draw: its position is worse.",
      d_no_early: "Atahualpa declines: it is too early for a draw. It wants to keep fighting.",
      d_yes_stuck: "Atahualpa accepts the draw: it sees no way to improve its position.",
      d_yes_equal: "Atahualpa accepts the draw: it considers the position equal.",
      d_no_clear: "Atahualpa declines: it believes it has a clear advantage.",
      d_no_slight: "Atahualpa declines: it thinks its position is slightly better.",
      pgn_label: "Game in PGN", pgn_aria: "Game in PGN format", save_pgn: "Save .pgn", copy_pgn: "Copy PGN",
      pgn_event: "Game against Atahualpa Chess",
      pgn_ai: "Atahualpa {lvl} (Stockfish 18 Lite, level {elo}, Kasparov style)", pgn_ai_fb: "Atahualpa {lvl} (backup engine)",
      t_saved: "PGN file saved.", t_cancel: "Save cancelled.",
      t_busy: "A save window is already open. Try again in a few seconds.",
      t_txt: "Saved as .pgn.txt: remove “.txt” from the name and your chess program will open it as PGN.",
      t_maybe: "If the file did not download, use “Copy PGN” and paste it into your chess program.",
      t_fail: "Could not save here. Use “Copy PGN”.", t_copied: "PGN copied to the clipboard.",
      t_select: "Text selected: copy it with Ctrl+C or ⌘C.", share_title: "Share PGN",
      clock_aria: "{who} clock: {t}", you: "Your",
      sq_piece: "{sq}, {c} {p}", c_w: "white", c_b: "black",
      p_p: "pawn", p_n: "knight", p_b: "bishop", p_r: "rook", p_q: "queen", p_k: "king",
      foot: "Engine: Stockfish 18 Lite with limited strength. Each level is tuned to play like full Stockfish 18 at UCI_Elo 2000, 2300 or 2500, a scale Stockfish calibrates against the CCRL engine rating list. It approximates human FIDE ratings; it is not an official equivalence. Kasparov style: it opens with his real repertoire (1,610 classical games), then with moves of nine other world champions and Lichess theory; in the middlegame, among moves of equal value, it prefers the initiative and attacking the king. When it is better, it avoids a draw by repetition. Pieces: Sapa Inca with his mascapaicha (king), ñusta with ñañaca and lliclla (queen), priest with a tumi (bishop), llama (knight), stone fortress (rook) and warrior (pawn).",
    },
    de: {
      tagline: "Schach im Inka-Stil", licenses: "Lizenzen und Danksagungen", sign: "Erstellt von James Alvis Tafur", farewell: "Es war mir ein Vergnügen, mit dir zu spielen.",
      subtitle: "Schach gegen die Maschine · Heer des Inti gegen Heer der Killa",
      lang_aria: "Sprache",
      sound_title: "Töne ein- oder ausschalten", sound_on: "Ton", sound_off: "Stumm",
      engine_loading: "Stockfish 18 wird geladen…", engine_ready: "Stockfish 18 bereit", engine_fallback: "Ersatz-Engine (schwächer)",
      engine_t_loading: "Die Engine (≈7 MB) wird einmalig heruntergeladen.",
      engine_t_ready: "Stockfish 18 bereit: rechnet in deinem Browser und funktioniert offline.",
      engine_t_fallback: "Stockfish ist nicht verfügbar: {r}",
      fail_error: "Fehler beim Start der Engine ({d})", fail_timeout: "die Engine hat nicht innerhalb von 25 s geantwortet",
      fail_blocked: "der Browser hat den Start der Engine nicht erlaubt ({d})", fail_unknown: "unbekannter Grund",
      board_region: "Brett", board_aria: "Schachbrett",
      promo_aria: "Umwandlungsfigur wählen", promo_title: "Umwandlung", promo_text: "Wähle die Figur für deinen Bauern.",
      end_new: "Neue Partie", end_save: "PGN speichern", end_close: "Brett ansehen",
      level_label: "Spielstärke von Atahualpa", level_aria: "Stufe",
      lvl_basico: "Grundstufe", lvl_intermedio: "Mittelstufe", lvl_avanzado: "Fortgeschritten",
      your_pieces: "Deine Figuren", color_aria: "Farbe", white: "Weiß", black: "Schwarz", random: "Zufällig",
      tc_label: "Bedenkzeit", tc_unlimited: "Unbegrenzt",
      your_name: "Dein Name", player: "Spieler",
      settings_note: "Stufe, Farbe und Bedenkzeit gelten ab der nächsten neuen Partie.",
      settings_saved: "Änderung gespeichert: Sie gilt, sobald du „Neue Partie“ drückst.",
      new_game: "Neue Partie", undo: "Zurücknehmen", flip: "Drehen", resign: "Aufgeben", confirm: "Bestätigen?", offer_draw: "Remis anbieten",
      your_turn: "Du bist am Zug", check_your_turn: "Schach! Du bist am Zug", ai_turn: "Atahualpa ist am Zug",
      ai_thinking: "Atahualpa denkt nach…", ai_loading: "Atahualpas Engine wird geladen… seine Uhr ist angehalten",
      win: "Sieg", loss: "Niederlage", draw: "Remis",
      r_mate: "Schachmatt", r_stalemate: "Patt", r_threefold: "Dreifache Stellungswiederholung", r_insufficient: "Ungenügendes Material",
      r_fifty: "50-Züge-Regel", r_resign: "Aufgabe", r_flag: "Zeitüberschreitung",
      r_flag_nomat: "Zeitüberschreitung ohne Mattmaterial", r_agreed: "Remis durch Einigung",
      moves_label: "Züge", book_note: "Goldene Unterstreichung: Buchzug von Atahualpa.",
      first_move: "Mach deinen ersten Zug: Figur ziehen oder antippen und dann das Zielfeld antippen.",
      ai_opens: "Atahualpa eröffnet die Partie mit Weiß.",
      opening_start: "Ausgangsstellung", opening_out: "Außerhalb der katalogisierten Theorie",
      note_book_k: "<b>Aus dem Gedächtnis:</b> ein Zug aus Kasparows Repertoire.",
      note_book_c: "<b>Aus dem Gedächtnis:</b> ein Zug von Weltmeistern.",
      note_book_t: "<b>Aus dem Gedächtnis:</b> eine Theorievariante.",
      note_style: "<b>Kasparow-Stil:</b> Unter gleichwertigen Zügen wählt er den aktivsten{why}.",
      note_norepeat: "<b>Keine Wiederholung:</b> Atahualpa steht besser und vermeidet eine Stellungswiederholung.",
      why_check: "Schach", why_near_king: "Figur am gegnerischen König", why_retreat: "Rückzug", why_opens_king: "öffnet die Königsstellung",
      why_pawn_storm: "Bauernsturm gegen den König", why_keeps_queens: "vermeidet den Damentausch", why_mate: "Matt",
      ai_sub: "{lvl} · {elo} Elo · Kasparow-Stil",
      player_sub_w: "Weiß · Heer des Inti", player_sub_b: "Schwarz · Heer der Killa",
      dw_over: "Die Partie ist beendet", dw_deciding: "Atahualpa prüft dein Angebot",
      dw_turn: "Du kannst Remis anbieten, wenn du am Zug bist", dw_first: "Spiele mindestens einen Zug, bevor du Remis anbietest",
      dw_cool1: "Atahualpa hat dein letztes Angebot abgelehnt. In 1 Zug kannst du erneut anbieten",
      dw_cooln: "Atahualpa hat dein letztes Angebot abgelehnt. In {n} Zügen kannst du erneut anbieten",
      dw_ok: "Schlage Atahualpa ein Remis vor",
      d_wait: "Du hast Remis angeboten. Atahualpa denkt darüber nach…",
      d_yes_worse: "Atahualpa nimmt das Remis an: Seine Stellung ist schlechter.",
      d_no_early: "Atahualpa lehnt ab: Für ein Remis ist es zu früh. Er will weiterkämpfen.",
      d_yes_stuck: "Atahualpa nimmt das Remis an: Er sieht keinen Weg, seine Stellung zu verbessern.",
      d_yes_equal: "Atahualpa nimmt das Remis an: Er hält die Stellung für ausgeglichen.",
      d_no_clear: "Atahualpa lehnt ab: Er glaubt, klar im Vorteil zu sein.",
      d_no_slight: "Atahualpa lehnt ab: Er hält seine Stellung für etwas besser.",
      pgn_label: "Partie als PGN", pgn_aria: "Partie im PGN-Format", save_pgn: ".pgn speichern", copy_pgn: "PGN kopieren",
      pgn_event: "Partie gegen Atahualpa Chess",
      pgn_ai: "Atahualpa {lvl} (Stockfish 18 Lite, Stufe {elo}, Kasparow-Stil)", pgn_ai_fb: "Atahualpa {lvl} (Ersatz-Engine)",
      t_saved: "PGN-Datei gespeichert.", t_cancel: "Speichern abgebrochen.",
      t_busy: "Ein Speicherfenster ist bereits offen. Versuche es in ein paar Sekunden erneut.",
      t_txt: "Als .pgn.txt gespeichert: Entferne „.txt“ aus dem Namen, dann öffnet dein Schachprogramm die Datei als PGN.",
      t_maybe: "Falls die Datei nicht heruntergeladen wurde, nutze „PGN kopieren“ und füge sie in dein Schachprogramm ein.",
      t_fail: "Speichern ist hier nicht möglich. Nutze „PGN kopieren“.", t_copied: "PGN in die Zwischenablage kopiert.",
      t_select: "Text markiert: Kopiere ihn mit Strg+C oder ⌘C.", share_title: "PGN teilen",
      clock_aria: "Uhr von {who}: {t}", you: "dir",
      sq_piece: "{sq}, {p} ({c})", c_w: "Weiß", c_b: "Schwarz",
      p_p: "Bauer", p_n: "Springer", p_b: "Läufer", p_r: "Turm", p_q: "Dame", p_k: "König",
      foot: "Engine: Stockfish 18 Lite mit begrenzter Spielstärke. Jede Stufe ist so eingestellt, dass sie wie das vollständige Stockfish 18 mit UCI_Elo 2000, 2300 oder 2500 spielt – eine Skala, die Stockfish an der Engine-Rangliste CCRL kalibriert. Sie nähert die menschliche FIDE-Elo an, ist aber keine offizielle Entsprechung. Kasparow-Stil: Er eröffnet mit seinem echten Repertoire (1.610 klassische Partien), danach mit Zügen neun weiterer Weltmeister und der Lichess-Theorie; im Mittelspiel bevorzugt er unter gleichwertigen Zügen die Initiative und den Königsangriff. Steht er besser, vermeidet er ein Remis durch Stellungswiederholung. Figuren: Sapa Inka mit Mascapaicha (König), Ñusta mit Ñañaca und Lliclla (Dame), Priester mit Tumi (Läufer), Lama (Springer), Steinfestung (Turm) und Krieger (Bauer).",
    },
  };

  /* ---------- Opening names ---------- */
  const ES_FAMILY = {"Sicilian Defense":"Defensa Siciliana","French Defense":"Defensa Francesa","Caro-Kann Defense":"Defensa Caro-Kann",
    "King's Indian Defense":"Defensa India de Rey","Queen's Indian Defense":"Defensa India de Dama","Nimzo-Indian Defense":"Defensa Nimzoindia",
    "Bogo-Indian Defense":"Defensa Bogoindia","Grünfeld Defense":"Defensa Grünfeld","Queen's Gambit Declined":"Gambito de Dama Rehusado",
    "Queen's Gambit Accepted":"Gambito de Dama Aceptado","Queen's Gambit":"Gambito de Dama","Ruy Lopez":"Apertura Española","Italian Game":"Partida Italiana",
    "Scotch Game":"Partida Escocesa","Four Knights Game":"Partida de los Cuatro Caballos","Three Knights Opening":"Apertura de los Tres Caballos","Vienna Game":"Partida Vienesa",
    "King's Gambit Accepted":"Gambito de Rey Aceptado","King's Gambit Declined":"Gambito de Rey Rehusado","King's Gambit":"Gambito de Rey",
    "Petrov's Defense":"Defensa Petrov","Russian Game":"Defensa Petrov","Philidor Defense":"Defensa Philidor",
    "Pirc Defense":"Defensa Pirc","Modern Defense":"Defensa Moderna","Alekhine Defense":"Defensa Alekhine","Scandinavian Defense":"Defensa Escandinava",
    "Semi-Slav Defense":"Defensa Semieslava","Slav Defense":"Defensa Eslava","Catalan Opening":"Apertura Catalana","English Opening":"Apertura Inglesa",
    "Dutch Defense":"Defensa Holandesa","Benoni Defense":"Defensa Benoni","Modern Benoni":"Benoni Moderna","Benko Gambit":"Gambito Benko","Zukertort Opening":"Apertura Zukertort",
    "Réti Opening":"Apertura Réti","Indian Defense":"Defensa India","Queen's Pawn Game":"Juego de Peón de Dama","King's Pawn Game":"Juego de Peón de Rey",
    "King's Knight Opening":"Apertura del Caballo de Rey","Bishop's Opening":"Apertura de Alfil","Trompowsky Attack":"Ataque Trompowsky","London System":"Sistema Londres",
    "Tarrasch Defense":"Defensa Tarrasch","Old Indian Defense":"Defensa India Antigua","Owen Defense":"Defensa Owen","Nimzo-Larsen Attack":"Ataque Nimzo-Larsen"};
  const ES_WORD = {English:"Inglés",Classical:"Clásica",Modern:"Moderna",Exchange:"del Cambio",Main:"principal",Advance:"del Avance",Closed:"Cerrada",Open:"Abierta",
    Accelerated:"Acelerada",Normal:"Normal",Hungarian:"Húngara",Berlin:"Berlinesa",Spanish:"Española",Old:"Antigua",Orthodox:"Ortodoxa",Samisch:"Sämisch",
    Two:"Dos",Knights:"Caballos",Symmetrical:"Simétrica",Reversed:"Invertida",Lines:"líneas",Line:"línea",
    French:"Francesa",Dutch:"Holandesa",Russian:"Rusa",Italian:"Italiana",Indian:"India",Polish:"Polaca",Scotch:"Escocesa",Swiss:"Suiza",Czech:"Checa"};
  const DE_FAMILY = {"Sicilian Defense":"Sizilianische Verteidigung","French Defense":"Französische Verteidigung","Caro-Kann Defense":"Caro-Kann-Verteidigung",
    "King's Indian Defense":"Königsindische Verteidigung","Queen's Indian Defense":"Damenindische Verteidigung","Nimzo-Indian Defense":"Nimzowitsch-Indische Verteidigung",
    "Bogo-Indian Defense":"Bogoljubow-Indische Verteidigung","Grünfeld Defense":"Grünfeld-Indische Verteidigung","Queen's Gambit Declined":"Abgelehntes Damengambit",
    "Queen's Gambit Accepted":"Angenommenes Damengambit","Queen's Gambit":"Damengambit","Ruy Lopez":"Spanische Partie","Italian Game":"Italienische Partie",
    "Scotch Game":"Schottische Partie","Four Knights Game":"Vierspringerspiel","Three Knights Opening":"Dreispringerspiel","Vienna Game":"Wiener Partie",
    "King's Gambit Accepted":"Angenommenes Königsgambit","King's Gambit Declined":"Abgelehntes Königsgambit","King's Gambit":"Königsgambit",
    "Petrov's Defense":"Russische Verteidigung","Russian Game":"Russische Verteidigung","Philidor Defense":"Philidor-Verteidigung",
    "Pirc Defense":"Pirc-Verteidigung","Modern Defense":"Moderne Verteidigung","Alekhine Defense":"Aljechin-Verteidigung","Scandinavian Defense":"Skandinavische Verteidigung",
    "Semi-Slav Defense":"Halbslawische Verteidigung","Slav Defense":"Slawische Verteidigung","Catalan Opening":"Katalanische Eröffnung","English Opening":"Englische Eröffnung",
    "Dutch Defense":"Holländische Verteidigung","Benoni Defense":"Benoni-Verteidigung","Modern Benoni":"Moderne Benoni","Benko Gambit":"Benkö-Gambit","Zukertort Opening":"Zukertort-Eröffnung",
    "Réti Opening":"Réti-Eröffnung","Indian Defense":"Indische Verteidigung","Queen's Pawn Game":"Damenbauernspiel","King's Pawn Game":"Königsbauernspiel",
    "King's Knight Opening":"Königsspringer-Eröffnung","Bishop's Opening":"Läuferspiel","Trompowsky Attack":"Trompowsky-Angriff","London System":"London-System",
    "Tarrasch Defense":"Tarrasch-Verteidigung","Old Indian Defense":"Altindische Verteidigung","Owen Defense":"Owen-Verteidigung","Nimzo-Larsen Attack":"Nimzowitsch-Larsen-Angriff"};
  const DE_WORD = {English:"Englischer",Classical:"Klassische",Modern:"Moderne",Exchange:"Abtausch",Main:"Haupt",Advance:"Vorstoß",Closed:"Geschlossene",Open:"Offene",
    Accelerated:"Beschleunigte",Normal:"Normale",Hungarian:"Ungarische",Berlin:"Berliner",Spanish:"Spanische",Old:"Alte",Orthodox:"Orthodoxe",Samisch:"Sämisch",
    Symmetrical:"Symmetrische",Reversed:"Umgekehrte",
    French:"Französische",Dutch:"Holländische",Russian:"Russische",Italian:"Italienische",Indian:"Indische",Polish:"Polnische",Scotch:"Schottische",Swiss:"Schweizer",Czech:"Tschechische"};

  const DE_NOUN = new Set(["Exchange", "Advance", "Main"]);
  function esSeg(seg) {
    const tr = s => s.split(" ").map(w => ES_WORD[w] || w).join(" ");
    let m;
    if ((m = seg.match(/^(.*) Variations$/))) return "Variantes " + tr(m[1]).replace(/a$/, "as");
    if ((m = seg.match(/^(.*) Variation$/))) return "Variante " + tr(m[1]);
    if ((m = seg.match(/^(.*) Attack$/))) return "Ataque " + tr(m[1]);
    if ((m = seg.match(/^(.*) Gambit$/))) return "Gambito " + tr(m[1]);
    if ((m = seg.match(/^(.*) System$/))) return "Sistema " + tr(m[1]);
    if ((m = seg.match(/^(.*) Defense$/))) return "Defensa " + tr(m[1]);
    if (seg === "Main Line") return "Línea principal";
    return tr(seg.replace(/^with /, "con ").replace(/ Accepted$/, " aceptado").replace(/ Declined$/, " rehusado"));
  }
  function deSeg(seg) {
    // German compounds: "Najdorf Variation" -> "Najdorf-Variante", "English Attack" -> "Englischer Angriff"
    const join = (x, noun) => {
      const words = x.split(" ");
      if (words.length === 1 && !DE_WORD[x]) return x + "-" + noun;              // Najdorf-Variante
      if (words.length === 1 && DE_NOUN.has(x)) return DE_WORD[x] + noun.toLowerCase(); // Abtauschvariante
      return words.map(w => DE_WORD[w] || w).join(" ") + " " + noun;
    };
    let m;
    if (seg === "Main Line") return "Hauptvariante";
    if ((m = seg.match(/^(.*) Variations$/))) return join(m[1], "Varianten");
    if ((m = seg.match(/^(.*) Variation$/))) return join(m[1], "Variante");
    if ((m = seg.match(/^(.*) Attack$/))) return join(m[1], "Angriff");
    if ((m = seg.match(/^(.*) Gambit$/))) return join(m[1], "Gambit");
    if ((m = seg.match(/^(.*) System$/))) return join(m[1], "System");
    if ((m = seg.match(/^(.*) Defense$/))) return join(m[1], "Verteidigung");
    return seg.replace(/^with /, "mit ").replace(/ Accepted$/, " angenommen").replace(/ Declined$/, " abgelehnt")
      .split(" ").map(w => DE_WORD[w] || w).join(" ");
  }
  function openingName(lang, n) {
    if (lang === "en") return n;
    const [fam, rest] = n.split(": ");
    const F = lang === "de" ? DE_FAMILY : ES_FAMILY, seg = lang === "de" ? deSeg : esSeg;
    return (F[fam] || fam) + (rest ? ": " + rest.split(", ").map(seg).join(", ") : "");
  }

  const api = {
    LANGS: ["es", "en", "de"], lang: "es",
    set(l) { if (T[l]) this.lang = l; },
    t(key, vars) {
      let s = (T[this.lang] && T[this.lang][key]) ?? T.es[key] ?? key;
      if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
      return s;
    },
    has(key) { return key in T.es; },
    opening(n) { return openingName(this.lang, n); },
    defaults: Object.values(T).map(x => x.player),
    _T: T,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.I18N = api;
})(typeof self !== "undefined" ? self : this);
