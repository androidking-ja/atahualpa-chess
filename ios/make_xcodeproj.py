# Generates AtahualpaChess.xcodeproj (project.pbxproj + shared scheme).
# One iOS app target, Swift sources, the asset catalog, the privacy manifest and the bundled
# web game as a folder reference ("www", copied as is into the app).
import hashlib, os

ROOT = os.path.dirname(os.path.abspath(__file__))
BUNDLE_ID = "com.jamesalvistafur.atahualpachess"

def uid(name):  # stable 24-hex object ids
    return hashlib.md5(name.encode()).hexdigest()[:24].upper()

SOURCES = ["AppDelegate.swift", "GameViewController.swift", "AppSchemeHandler.swift"]
RES = [("Assets.xcassets", "folder.assetcatalog"), ("PrivacyInfo.xcprivacy", "text.xml"), ("www", "folder")]

ids = {k: uid(k) for k in [
    "project", "mainGroup", "appGroup", "productsGroup", "target", "product",
    "srcPhase", "resPhase", "fwPhase", "projCfgList", "tgtCfgList",
    "projDebug", "projRelease", "tgtDebug", "tgtRelease", "infoPlist"]}
for f in SOURCES + [r[0] for r in RES]:
    ids["ref:" + f] = uid("ref:" + f)
    ids["build:" + f] = uid("build:" + f)

def q(s):
    return s if all(c.isalnum() or c in "._/$" for c in s) and s else '"' + s.replace('"', '\\"') + '"'

o = []
o.append("// !$*UTF8*$!\n{\n\tarchiveVersion = 1;\n\tclasses = {\n\t};\n\tobjectVersion = 56;\n\tobjects = {\n")

o.append("\n/* Begin PBXBuildFile section */\n")
for f in SOURCES:
    o.append(f"\t\t{ids['build:'+f]} /* {f} in Sources */ = {{isa = PBXBuildFile; fileRef = {ids['ref:'+f]} /* {f} */; }};\n")
for f, _ in RES:
    o.append(f"\t\t{ids['build:'+f]} /* {f} in Resources */ = {{isa = PBXBuildFile; fileRef = {ids['ref:'+f]} /* {f} */; }};\n")
o.append("/* End PBXBuildFile section */\n")

o.append("\n/* Begin PBXFileReference section */\n")
o.append(f"\t\t{ids['product']} /* AtahualpaChess.app */ = {{isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = AtahualpaChess.app; sourceTree = BUILT_PRODUCTS_DIR; }};\n")
for f in SOURCES:
    o.append(f"\t\t{ids['ref:'+f]} /* {f} */ = {{isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = {f}; sourceTree = \"<group>\"; }};\n")
for f, t in RES:
    o.append(f"\t\t{ids['ref:'+f]} /* {f} */ = {{isa = PBXFileReference; lastKnownFileType = {t}; path = {f}; sourceTree = \"<group>\"; }};\n")
o.append(f"\t\t{ids['infoPlist']} /* Info.plist */ = {{isa = PBXFileReference; lastKnownFileType = text.plist.xml; path = Info.plist; sourceTree = \"<group>\"; }};\n")
o.append("/* End PBXFileReference section */\n")

o.append("\n/* Begin PBXFrameworksBuildPhase section */\n")
o.append(f"\t\t{ids['fwPhase']} /* Frameworks */ = {{\n\t\t\tisa = PBXFrameworksBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = (\n\t\t\t);\n\t\t\trunOnlyForDeploymentPostprocessing = 0;\n\t\t}};\n")
o.append("/* End PBXFrameworksBuildPhase section */\n")

o.append("\n/* Begin PBXGroup section */\n")
o.append(f"\t\t{ids['mainGroup']} = {{\n\t\t\tisa = PBXGroup;\n\t\t\tchildren = (\n\t\t\t\t{ids['appGroup']} /* AtahualpaChess */,\n\t\t\t\t{ids['productsGroup']} /* Products */,\n\t\t\t);\n\t\t\tsourceTree = \"<group>\";\n\t\t}};\n")
children = "".join(f"\t\t\t\t{ids['ref:'+f]} /* {f} */,\n" for f in SOURCES + [r[0] for r in RES])
children += f"\t\t\t\t{ids['infoPlist']} /* Info.plist */,\n"
o.append(f"\t\t{ids['appGroup']} /* AtahualpaChess */ = {{\n\t\t\tisa = PBXGroup;\n\t\t\tchildren = (\n{children}\t\t\t);\n\t\t\tpath = AtahualpaChess;\n\t\t\tsourceTree = \"<group>\";\n\t\t}};\n")
o.append(f"\t\t{ids['productsGroup']} /* Products */ = {{\n\t\t\tisa = PBXGroup;\n\t\t\tchildren = (\n\t\t\t\t{ids['product']} /* AtahualpaChess.app */,\n\t\t\t);\n\t\t\tname = Products;\n\t\t\tsourceTree = \"<group>\";\n\t\t}};\n")
o.append("/* End PBXGroup section */\n")

o.append("\n/* Begin PBXNativeTarget section */\n")
o.append(f"""\t\t{ids['target']} /* AtahualpaChess */ = {{
\t\t\tisa = PBXNativeTarget;
\t\t\tbuildConfigurationList = {ids['tgtCfgList']} /* Build configuration list for PBXNativeTarget "AtahualpaChess" */;
\t\t\tbuildPhases = (
\t\t\t\t{ids['srcPhase']} /* Sources */,
\t\t\t\t{ids['fwPhase']} /* Frameworks */,
\t\t\t\t{ids['resPhase']} /* Resources */,
\t\t\t);
\t\t\tbuildRules = (
\t\t\t);
\t\t\tdependencies = (
\t\t\t);
\t\t\tname = AtahualpaChess;
\t\t\tproductName = AtahualpaChess;
\t\t\tproductReference = {ids['product']} /* AtahualpaChess.app */;
\t\t\tproductType = "com.apple.product-type.application";
\t\t}};
""")
o.append("/* End PBXNativeTarget section */\n")

o.append("\n/* Begin PBXProject section */\n")
o.append(f"""\t\t{ids['project']} /* Project object */ = {{
\t\t\tisa = PBXProject;
\t\t\tattributes = {{
\t\t\t\tBuildIndependentTargetsInParallel = 1;
\t\t\t\tLastSwiftUpdateCheck = 1500;
\t\t\t\tLastUpgradeCheck = 1500;
\t\t\t\tTargetAttributes = {{
\t\t\t\t\t{ids['target']} = {{
\t\t\t\t\t\tCreatedOnToolsVersion = 15.0;
\t\t\t\t\t}};
\t\t\t\t}};
\t\t\t}};
\t\t\tbuildConfigurationList = {ids['projCfgList']} /* Build configuration list for PBXProject "AtahualpaChess" */;
\t\t\tcompatibilityVersion = "Xcode 14.0";
\t\t\tdevelopmentRegion = es;
\t\t\thasScannedForEncodings = 0;
\t\t\tknownRegions = (
\t\t\t\tes,
\t\t\t\ten,
\t\t\t\tde,
\t\t\t\tBase,
\t\t\t);
\t\t\tmainGroup = {ids['mainGroup']};
\t\t\tproductRefGroup = {ids['productsGroup']} /* Products */;
\t\t\tprojectDirPath = "";
\t\t\tprojectRoot = "";
\t\t\ttargets = (
\t\t\t\t{ids['target']} /* AtahualpaChess */,
\t\t\t);
\t\t}};
""")
o.append("/* End PBXProject section */\n")

o.append("\n/* Begin PBXResourcesBuildPhase section */\n")
files = "".join(f"\t\t\t\t{ids['build:'+f]} /* {f} in Resources */,\n" for f, _ in RES)
o.append(f"\t\t{ids['resPhase']} /* Resources */ = {{\n\t\t\tisa = PBXResourcesBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = (\n{files}\t\t\t);\n\t\t\trunOnlyForDeploymentPostprocessing = 0;\n\t\t}};\n")
o.append("/* End PBXResourcesBuildPhase section */\n")

o.append("\n/* Begin PBXSourcesBuildPhase section */\n")
files = "".join(f"\t\t\t\t{ids['build:'+f]} /* {f} in Sources */,\n" for f in SOURCES)
o.append(f"\t\t{ids['srcPhase']} /* Sources */ = {{\n\t\t\tisa = PBXSourcesBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = (\n{files}\t\t\t);\n\t\t\trunOnlyForDeploymentPostprocessing = 0;\n\t\t}};\n")
o.append("/* End PBXSourcesBuildPhase section */\n")

def settings(d):
    out = ""
    for k in sorted(d):
        v = d[k]
        if isinstance(v, list):
            out += f"\t\t\t\t{k} = (\n" + "".join(f"\t\t\t\t\t{q(x)},\n" for x in v) + "\t\t\t\t);\n"
        else:
            out += f"\t\t\t\t{k} = {q(v)};\n"
    return out

common_proj = {
    "ALWAYS_SEARCH_USER_PATHS": "NO", "CLANG_ENABLE_MODULES": "YES", "CLANG_ENABLE_OBJC_ARC": "YES",
    "COPY_PHASE_STRIP": "NO", "ENABLE_STRICT_OBJC_MSGSEND": "YES", "GCC_NO_COMMON_BLOCKS": "YES",
    "IPHONEOS_DEPLOYMENT_TARGET": "16.0", "SDKROOT": "iphoneos", "SWIFT_VERSION": "5.0",
    "ENABLE_USER_SCRIPT_SANDBOXING": "YES", "LOCALIZATION_PREFERS_STRING_CATALOGS": "YES",
}
proj_debug = dict(common_proj, DEBUG_INFORMATION_FORMAT="dwarf", ENABLE_TESTABILITY="YES", GCC_OPTIMIZATION_LEVEL="0",
                  ONLY_ACTIVE_ARCH="YES", SWIFT_OPTIMIZATION_LEVEL="-Onone", SWIFT_ACTIVE_COMPILATION_CONDITIONS="DEBUG",
                  GCC_PREPROCESSOR_DEFINITIONS=["DEBUG=1", "$(inherited)"], MTL_ENABLE_DEBUG_INFO="INCLUDE_SOURCE")
proj_release = dict(common_proj, DEBUG_INFORMATION_FORMAT="dwarf-with-dsym", ENABLE_NS_ASSERTIONS="NO",
                    SWIFT_COMPILATION_MODE="wholemodule", SWIFT_OPTIMIZATION_LEVEL="-O", VALIDATE_PRODUCT="YES", MTL_ENABLE_DEBUG_INFO="NO")
target = {
    "ASSETCATALOG_COMPILER_APPICON_NAME": "AppIcon",
    "ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME": "AccentColor",
    "CODE_SIGN_STYLE": "Automatic",
    "CURRENT_PROJECT_VERSION": "1",
    "DEVELOPMENT_TEAM": "",
    "ENABLE_PREVIEWS": "NO",
    "GENERATE_INFOPLIST_FILE": "NO",
    "INFOPLIST_FILE": "AtahualpaChess/Info.plist",
    "IPHONEOS_DEPLOYMENT_TARGET": "16.0",
    "LD_RUNPATH_SEARCH_PATHS": ["$(inherited)", "@executable_path/Frameworks"],
    "MARKETING_VERSION": "1.0",
    "PRODUCT_BUNDLE_IDENTIFIER": BUNDLE_ID,
    "PRODUCT_NAME": "$(TARGET_NAME)",
    "SUPPORTED_PLATFORMS": "iphoneos iphonesimulator",
    "SUPPORTS_MACCATALYST": "NO",
    "SUPPORTS_MAC_DESIGNED_FOR_IPHONE_IPAD": "NO",
    "SUPPORTS_XR_DESIGNED_FOR_IPHONE_IPAD": "NO",
    "SWIFT_EMIT_LOC_STRINGS": "YES",
    "SWIFT_VERSION": "5.0",
    "TARGETED_DEVICE_FAMILY": "1,2",
}
o.append("\n/* Begin XCBuildConfiguration section */\n")
for key, name, s in [("projDebug", "Debug", proj_debug), ("projRelease", "Release", proj_release),
                     ("tgtDebug", "Debug", target), ("tgtRelease", "Release", target)]:
    o.append(f"\t\t{ids[key]} /* {name} */ = {{\n\t\t\tisa = XCBuildConfiguration;\n\t\t\tbuildSettings = {{\n{settings(s)}\t\t\t}};\n\t\t\tname = {name};\n\t\t}};\n")
o.append("/* End XCBuildConfiguration section */\n")

o.append("\n/* Begin XCConfigurationList section */\n")
for key, a, b, label in [("projCfgList", "projDebug", "projRelease", 'PBXProject "AtahualpaChess"'),
                         ("tgtCfgList", "tgtDebug", "tgtRelease", 'PBXNativeTarget "AtahualpaChess"')]:
    o.append(f"\t\t{ids[key]} /* Build configuration list for {label} */ = {{\n\t\t\tisa = XCConfigurationList;\n\t\t\tbuildConfigurations = (\n\t\t\t\t{ids[a]} /* Debug */,\n\t\t\t\t{ids[b]} /* Release */,\n\t\t\t);\n\t\t\tdefaultConfigurationIsVisible = 0;\n\t\t\tdefaultConfigurationName = Release;\n\t\t}};\n")
o.append("/* End XCConfigurationList section */\n")
o.append(f"\t}};\n\trootObject = {ids['project']} /* Project object */;\n}}\n")

proj = os.path.join(ROOT, "AtahualpaChess.xcodeproj")
os.makedirs(os.path.join(proj, "xcshareddata", "xcschemes"), exist_ok=True)
os.makedirs(os.path.join(proj, "project.xcworkspace"), exist_ok=True)
open(os.path.join(proj, "project.pbxproj"), "w").write("".join(o))
open(os.path.join(proj, "project.xcworkspace", "contents.xcworkspacedata"), "w").write(
    '<?xml version="1.0" encoding="UTF-8"?>\n<Workspace\n   version = "1.0">\n   <FileRef\n      location = "self:">\n   </FileRef>\n</Workspace>\n')

ref = f'''<BuildableReference
               BuildableIdentifier = "primary"
               BlueprintIdentifier = "{ids['target']}"
               BuildableName = "AtahualpaChess.app"
               BlueprintName = "AtahualpaChess"
               ReferencedContainer = "container:AtahualpaChess.xcodeproj">
            </BuildableReference>'''
scheme = f'''<?xml version="1.0" encoding="UTF-8"?>
<Scheme
   LastUpgradeVersion = "1500"
   version = "1.7">
   <BuildAction
      parallelizeBuildables = "YES"
      buildImplicitDependencies = "YES">
      <BuildActionEntries>
         <BuildActionEntry
            buildForTesting = "YES"
            buildForRunning = "YES"
            buildForProfiling = "YES"
            buildForArchiving = "YES"
            buildForAnalyzing = "YES">
            {ref}
         </BuildActionEntry>
      </BuildActionEntries>
   </BuildAction>
   <TestAction
      buildConfiguration = "Debug"
      selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
      selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
      shouldUseLaunchSchemeArgsEnv = "YES">
   </TestAction>
   <LaunchAction
      buildConfiguration = "Debug"
      selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
      selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
      launchStyle = "0"
      useCustomWorkingDirectory = "NO"
      ignoresPersistentStateOnLaunch = "NO"
      debugDocumentVersioning = "YES"
      debugServiceExtension = "internal"
      allowLocationSimulation = "YES">
      <BuildableProductRunnable
         runnableDebuggingMode = "0">
         {ref}
      </BuildableProductRunnable>
   </LaunchAction>
   <ProfileAction
      buildConfiguration = "Release"
      shouldUseLaunchSchemeArgsEnv = "YES"
      savedToolIdentifier = ""
      useCustomWorkingDirectory = "NO"
      debugDocumentVersioning = "YES">
      <BuildableProductRunnable
         runnableDebuggingMode = "0">
         {ref}
      </BuildableProductRunnable>
   </ProfileAction>
   <AnalyzeAction
      buildConfiguration = "Debug">
   </AnalyzeAction>
   <ArchiveAction
      buildConfiguration = "Release"
      revealArchiveInOrganizer = "YES">
   </ArchiveAction>
</Scheme>
'''
open(os.path.join(proj, "xcshareddata", "xcschemes", "AtahualpaChess.xcscheme"), "w").write(scheme)
print("ok", proj)
