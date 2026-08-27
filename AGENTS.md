# Expo & Elet Architectural Invariants

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.
Refer to detailed engineering specifications in `.agents/skills/elet-orthodox-engineering/SKILL.md`.

---

## 🏛️ Elet Core Engineering Invariants

1. **Bahire Hasab Math Integrity**:
   - Never hardcode movable fasts without verifying against `YEBEALAT_MAWECHA_2018_2041`.
   - Run `npm test` to validate all 330+ unit tests before shipping changes.

2. **Android Exact Notifications & Alarms**:
   - Never pass string sound names in `expo-notifications` on Android (use `sound: true` + channel configs to prevent missing `.wav` crashes).
   - Use `shouldShowBanner: true` & `shouldShowList: true` (never deprecated `shouldShowAlert`).
   - Use dignified Orthodox ecclesiastical phrasing without casual emojis.

3. **Zero-Mock Blank Slate**:
   - Initial store state must start with empty arrays (`dailyPracticeDates: []`, `customFastPlans: []`, `penanceItems: []`).
   - Streaks start at 0 days on new installs with unlit heatmap cells.

4. **Typography & Native Font Rendering**:
   - Strip `fontWeight` on Native when specifying `@expo-google-fonts` (`NotoSansEthiopic`, `Lexend`, `Outfit`) to prevent Android font manager fallback to Roboto.

---

## 🎯 Build & APK Size Optimization Plan

### 1. APK Size Optimization (Target: ~28–35 MB instead of 109 MB Fat APK)
* **ABI Splitting (`arm64-v8a` & `armeabi-v7a`)**:
  * Configure `android/app/build.gradle` with `splits.abi.enable = true` and `universalApk = false`.
  * `arm64-v8a` targets 95%+ of modern Android devices at ~30 MB.
* **ProGuard / R8 Code & Resource Shrinking**:
  * Set `enableProguardInReleaseBuilds = true` and `shrinkResources true` in release build type.
  * Tree-shake unused native classes, C++ symbols, and redundant font glyphs.
* **Android App Bundle (.aab)**:
  * Add `.aab` compilation target to `.github/workflows/build-and-release.yml` for Google Play Store publishing.
