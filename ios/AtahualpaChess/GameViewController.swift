import UIKit
import WebKit
import AVFoundation

/// Hosts the game (bundled web app in www/) and provides the native services it asks for:
/// spoken farewell (AVSpeechSynthesizer), saving the PGN (share sheet / Files) and copying it.
final class GameViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler, WKUIDelegate {
    private var webView: WKWebView!
    private let speech = AVSpeechSynthesizer()

    override func loadView() {
        let config = WKWebViewConfiguration()
        let wwwURL = Bundle.main.url(forResource: "www", withExtension: nil)!
        config.setURLSchemeHandler(AppSchemeHandler(root: wwwURL), forURLScheme: AppSchemeHandler.scheme)
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.websiteDataStore = .default()   // keeps the game in progress and the chosen language

        // Bridge object the game looks for (window.AtahualpaNative), injected before the page runs.
        let controller = WKUserContentController()
        controller.add(WeakMessageHandler(self), name: "native")
        controller.addUserScript(WKUserScript(source: Self.bridgeScript(voices: Self.availableVoiceLanguages()),
                                              injectionTime: .atDocumentStart, forMainFrameOnly: true))
        config.userContentController = controller

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = UIColor(named: "LaunchBackground")
        webView.scrollView.backgroundColor = UIColor(named: "LaunchBackground")
        webView.scrollView.contentInsetAdjustmentBehavior = .never   // the page handles the safe areas itself
        webView.scrollView.bounces = false
        webView.allowsLinkPreview = false
        if #available(iOS 16.4, *) {
            #if DEBUG
            webView.isInspectable = true
            #endif
        }
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        webView.load(URLRequest(url: AppSchemeHandler.startURL))
    }

    // MARK: Bridge

    private static func bridgeScript(voices: Set<String>) -> String {
        let voicesJSON = "{" + ["es", "en", "de"].map { "\"\($0)\":\(voices.contains($0))" }.joined(separator: ",") + "}"
        return """
        window.AtahualpaNative = {
          voices: \(voicesJSON),
          post: function (m) { try { window.webkit.messageHandlers.native.postMessage(m); } catch (e) {} },
          savePgn: function (name, text, title) { this.post({cmd: "save", name: String(name), text: String(text), title: String(title || "")}); },
          copy: function (text) { this.post({cmd: "copy", text: String(text)}); },
          speak: function (text, lang) { if (!this.voices[lang]) return false; this.post({cmd: "speak", text: String(text), lang: String(lang)}); return true; },
          setLanguage: function (lang) {},
          status: function (s) { this.post({cmd: "status", value: String(s)}); }
        };
        """
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any], let cmd = body["cmd"] as? String else { return }
        switch cmd {
        case "save":
            savePGN(name: body["name"] as? String ?? "atahualpa-chess.pgn",
                    text: body["text"] as? String ?? "")
        case "copy":
            UIPasteboard.general.string = body["text"] as? String ?? ""
        case "speak":
            speak(body["text"] as? String ?? "", lang: body["lang"] as? String ?? "es")
        case "status":
            // Read by the automated simulator check (GitHub Actions) to confirm Stockfish runs on iOS.
            print("ATAHUALPA_ENGINE \(body["value"] as? String ?? "?")")
        default:
            break
        }
    }

    // MARK: Spoken farewell

    private static let preferredLocales: [String: [String]] = [
        "es": ["es-MX", "es-US", "es-419", "es-ES"],
        "en": ["en-US", "en-GB", "en-AU"],
        "de": ["de-DE", "de-AT", "de-CH"],
    ]

    private static func availableVoiceLanguages() -> Set<String> {
        let langs = AVSpeechSynthesisVoice.speechVoices().map { $0.language.lowercased() }
        return Set(["es", "en", "de"].filter { code in langs.contains { $0.hasPrefix(code) } })
    }

    private func bestVoice(for lang: String) -> AVSpeechSynthesisVoice? {
        let all = AVSpeechSynthesisVoice.speechVoices()
        for locale in Self.preferredLocales[lang] ?? [] {
            let matches = all.filter { $0.language.caseInsensitiveCompare(locale) == .orderedSame }
            if let best = matches.max(by: { $0.quality.rawValue < $1.quality.rawValue }) { return best }
        }
        return all.first { $0.language.lowercased().hasPrefix(lang) }
    }

    private func speak(_ text: String, lang: String) {
        guard !text.isEmpty else { return }
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = bestVoice(for: lang)
        utterance.rate = AVSpeechUtteranceDefaultSpeechRate * 0.95
        if speech.isSpeaking { speech.stopSpeaking(at: .immediate) }
        speech.speak(utterance)
    }

    // MARK: Saving the PGN

    private func savePGN(name: String, text: String) {
        let safeName = name.replacingOccurrences(of: "/", with: "-")
        let fileURL = FileManager.default.temporaryDirectory.appendingPathComponent(safeName)
        do {
            try text.write(to: fileURL, atomically: true, encoding: .utf8)
        } catch {
            notifySaved(false)
            return
        }
        let sheet = UIActivityViewController(activityItems: [fileURL], applicationActivities: nil)
        sheet.completionWithItemsHandler = { [weak self] _, completed, _, _ in self?.notifySaved(completed) }
        if let popover = sheet.popoverPresentationController {   // iPad: anchor the sheet
            popover.sourceView = view
            popover.sourceRect = CGRect(x: view.bounds.midX, y: view.bounds.maxY - 80, width: 1, height: 1)
            popover.permittedArrowDirections = []
        }
        present(sheet, animated: true)
    }

    private func notifySaved(_ ok: Bool) {
        webView.evaluateJavaScript("window.__pgnSaved && window.__pgnSaved(\(ok))", completionHandler: nil)
    }

    // MARK: Navigation

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else { return decisionHandler(.cancel) }
        if url.scheme == AppSchemeHandler.scheme || url.scheme == "about" {
            decisionHandler(.allow)
        } else {
            // Links to other sites (for example the licenses page) open in Safari.
            if navigationAction.navigationType == .linkActivated, ["http", "https"].contains(url.scheme ?? "") {
                UIApplication.shared.open(url)
            }
            decisionHandler(.cancel)
        }
    }

    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
                 for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = navigationAction.request.url, ["http", "https"].contains(url.scheme ?? "") {
            UIApplication.shared.open(url)
        }
        return nil
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        webView.reload()   // iOS may stop the web process in the background; reload restores the saved game
    }
}

/// Avoids a retain cycle between WKUserContentController and the view controller.
private final class WeakMessageHandler: NSObject, WKScriptMessageHandler {
    weak var target: WKScriptMessageHandler?
    init(_ target: WKScriptMessageHandler) { self.target = target }
    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        target?.userContentController(controller, didReceive: message)
    }
}
