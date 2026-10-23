package com.atahualpa.chess;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Atahualpa Chess for Android: a WebView that serves the game from the APK's assets.
 * Pages are served from a private https origin (like androidx WebViewAssetLoader) so the
 * Stockfish Web Worker and its WebAssembly load exactly as on the web, with no network.
 */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START = "https://" + HOST + "/index.html";
    private static final int REQ_SAVE = 4201;

    private WebView web;
    private String pendingText;
    private TextToSpeech tts;
    private volatile boolean ttsReady;
    private String language = "es";
    private String chooserTitle = "Compartir PGN";

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);           // localStorage keeps the game in progress
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setTextZoom(100);
        web.setBackgroundColor(0xFF1A1310);
        web.setWebViewClient(new AssetClient());
        web.addJavascriptInterface(new Bridge(), "AtahualpaAndroid");
        setContentView(web);
        // Phone's own text-to-speech for Atahualpa's farewell (works offline with the installed voices).
        tts = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override public void onInit(int status) { ttsReady = status == TextToSpeech.SUCCESS; }
        });
        if (state != null) web.restoreState(state);
        else web.loadUrl(START);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    protected void onPause() { super.onPause(); web.onPause(); }

    @Override
    protected void onResume() { super.onResume(); web.onResume(); }

    @Override
    protected void onDestroy() {
        if (tts != null) tts.shutdown();
        web.destroy();
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    /** Serves https://appassets.androidplatform.net/... from assets/www/... */
    private class AssetClient extends WebViewClient {
        private final Map<String, String> types = new HashMap<>();
        AssetClient() {
            types.put("html", "text/html");
            types.put("js", "text/javascript");
            types.put("wasm", "application/wasm");
            types.put("woff2", "font/woff2");
            types.put("css", "text/css");
            types.put("json", "application/json");
            types.put("mp3", "audio/mpeg");
            types.put("png", "image/png");
            types.put("svg", "image/svg+xml");
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            if (!HOST.equals(u.getHost())) return null;
            String path = u.getPath();
            if (path == null || path.equals("/")) path = "/index.html";
            if (path.contains("..")) return notFound();
            String ext = path.substring(path.lastIndexOf('.') + 1).toLowerCase();
            String mime = types.containsKey(ext) ? types.get(ext) : "application/octet-stream";
            try {
                InputStream in = getAssets().open("www" + path);
                boolean text = mime.startsWith("text/") || mime.equals("application/json");
                WebResourceResponse r = new WebResourceResponse(mime, text ? "utf-8" : null, in);
                Map<String, String> h = new HashMap<>();
                h.put("Access-Control-Allow-Origin", "*");
                h.put("Cache-Control", "no-cache");
                r.setResponseHeaders(h);
                return r;
            } catch (Exception e) {
                return notFound();
            }
        }

        private WebResourceResponse notFound() {
            WebResourceResponse r = new WebResourceResponse("text/plain", "utf-8", null);
            r.setStatusCodeAndReasonPhrase(404, "Not Found");
            return r;
        }

        @Override
        @SuppressWarnings("deprecation") // the WebResourceRequest overload needs API 24
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Uri u = Uri.parse(url);
            if (HOST.equals(u.getHost())) return false;
            try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
            return true;
        }
    }

    /** Called from the page: window.AtahualpaAndroid.savePgn(...) / .copy(...) */
    private class Bridge {
        @JavascriptInterface
        public void setLanguage(String lang) { if (lang != null) language = lang; }

        @JavascriptInterface
        public void savePgn(final String fileName, final String text, final String shareTitle) {
            if (shareTitle != null && !shareTitle.isEmpty()) chooserTitle = shareTitle;
            savePgn(fileName, text);
        }

        @JavascriptInterface
        public void savePgn(final String fileName, final String text) {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    pendingText = text;
                    Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    i.addCategory(Intent.CATEGORY_OPENABLE);
                    i.setType("application/x-chess-pgn");
                    i.putExtra(Intent.EXTRA_TITLE, fileName);
                    try {
                        startActivityForResult(i, REQ_SAVE);
                    } catch (Exception e) {
                        // No file picker on this device: offer the share sheet instead.
                        Intent share = new Intent(Intent.ACTION_SEND);
                        share.setType("text/plain");
                        share.putExtra(Intent.EXTRA_SUBJECT, fileName);
                        share.putExtra(Intent.EXTRA_TEXT, text);
                        startActivity(Intent.createChooser(share, chooserTitle));
                    }
                }
            });
        }

        /** Speaks text in "es", "en" or "de". Returns false when no voice for that language is installed. */
        @JavascriptInterface
        public boolean speak(String text, String lang) {
            if (tts == null || !ttsReady || text == null) return false;
            Locale[] options = "de".equals(lang) ? new Locale[]{Locale.GERMANY, Locale.GERMAN}
                    : "en".equals(lang) ? new Locale[]{Locale.US, Locale.UK, Locale.ENGLISH}
                    : new Locale[]{new Locale("es", "PE"), new Locale("es", "US"), new Locale("es", "MX"), new Locale("es", "ES"), new Locale("es")};
            for (Locale loc : options) {
                if (tts.isLanguageAvailable(loc) >= TextToSpeech.LANG_AVAILABLE) {
                    tts.setLanguage(loc);
                    tts.setSpeechRate(0.95f);
                    return tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "farewell") == TextToSpeech.SUCCESS;
                }
            }
            return false;
        }

        @JavascriptInterface
        public void copy(String text) {
            ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("PGN", text));
        }
    }

    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != REQ_SAVE) return;
        boolean ok = false;
        if (result == RESULT_OK && data != null && data.getData() != null && pendingText != null) {
            try (OutputStream out = getContentResolver().openOutputStream(data.getData(), "wt")) {
                out.write(pendingText.getBytes(StandardCharsets.UTF_8));
                ok = true;
            } catch (Exception ignored) { }
        }
        pendingText = null;
        web.evaluateJavascript("window.__pgnSaved&&window.__pgnSaved(" + ok + ")", null);
    }
}
