#!/bin/bash
# Builds the Android APK with the plain SDK tools (no Gradle). Needs: aapt, javac, dalvik-exchange (dx),
# zipalign, apksigner and the android-23 platform (Ubuntu: apt install aapt dalvik-exchange zipalign apksigner android-sdk-platform-23).
# Signing: put your keystore at android/atahualpa-release.jks and its password in android/keystore.pass
# (both are ignored by git; keep them safe, updates must be signed with the same key).
set -euo pipefail
cd "$(dirname "$0")"
SDK=${ANDROID_SDK:-/usr/lib/android-sdk}
JAR=$(ls $SDK/platforms/*/android.jar | head -1)
OUT=build; rm -rf $OUT; mkdir -p $OUT/gen $OUT/classes
python3 ../tools/build_www.py src/assets/www
aapt package -f -m -J $OUT/gen -M src/AndroidManifest.xml -S src/res -A src/assets -I "$JAR" \
     -0 wasm -0 woff2 -0 mp3 -F $OUT/app.unaligned.apk
javac -nowarn -Xlint:-options -source 8 -target 8 -encoding UTF-8 -bootclasspath "$JAR" -d $OUT/classes \
      $(find src/java $OUT/gen -name '*.java')
dalvik-exchange --dex --min-sdk-version=23 --output=$OUT/classes.dex $OUT/classes
(cd $OUT && aapt add -f app.unaligned.apk classes.dex >/dev/null)
zipalign -f -p 4 $OUT/app.unaligned.apk $OUT/app.aligned.apk
apksigner sign --ks atahualpa-release.jks --ks-key-alias atahualpa --ks-pass file:keystore.pass \
   --min-sdk-version 23 --out AtahualpaChess.apk $OUT/app.aligned.apk
apksigner verify AtahualpaChess.apk && ls -la AtahualpaChess.apk
