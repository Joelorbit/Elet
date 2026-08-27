---
name: elet-orthodox-engineering
description: >-
  Comprehensive guide and architectural reference for Elet (ዕለት) Ethiopian Orthodox Tewahedo
  mobile application. Covers Bahire Hasab calendar math (2018–2041), 3D Roller Time Picker,
  Android exact alarms and notifications, 81-canon scriptures, blank-slate state stores,
  and native build optimization.
---

# Elet (ዕለት) Orthodox Engineering Reference Guide

This skill documents the complete architecture, liturgical algorithms, UI patterns, and native mobile configurations for building and extending **Elet (ዕለት)** — the offline spiritual companion for the Ethiopian Orthodox Tewahedo Church.

---

## 1. ⛪ Liturgical Engine & Calendar Arithmetic

### 1.1 24-Year Bahire Hasab Matrix (2018–2041 ዓ.ም.)
The Bahire Hasab (ባሕረ ሐሳብ) engine calculates all movable fasts and feasts from the Evangelist (ወንጌላዊ), Wenber (ወንበር), Abekte (አበቅቴ), and Metqe (መጥቅዕ).

* **Anchor Formula**:
  $$\text{Amete Alem} = 5500 + \text{EthYear}$$
  $$\text{Evangelist Index} = \text{Amete Alem} \pmod 4 \quad (0 \to \text{John}, 1 \to \text{Matthew}, 2 \to \text{Mark}, 3 \to \text{Luke})$$
* **Movable Fasts Sequence**:
  1. **Tsome Nenewe (ጾመ ነነዌ)** $\to$ Benchmark anchor day.
  2. **Abiy Tsome / Great Lent (ዐቢይ ጾም)** $\to$ Nenewe + 14 days.
  3. **Debre Zeyt (ደብረ ዘይት)** $\to$ Nenewe + 41 days.
  4. **Hosaena (ሆሣዕና)** $\to$ Nenewe + 62 days.
  5. **Siklet / Good Friday (ስቅለት)** $\to$ Nenewe + 67 days.
  6. **Tensae / Easter (ትንሣኤ)** $\to$ Nenewe + 69 days.
  7. **Rikbe Kahnat (ርክበ ካህናት)** $\to$ Tensae + 24 days.
  8. **Erget / Ascension (ዕርገት)** $\to$ Tensae + 39 days.
  9. **Peraklitos / Pentecost (ጰራቅሊጦስ)** $\to$ Tensae + 49 days.
  10. **Tsome Hawaryat / Apostles Fast (ጾመ ሐዋርያት)** $\to$ Tensae + 50 days.
  11. **Tsome Dihnet / Salvation Fast (ጾመ ድኅነት)** $\to$ Tensae + 52 days.

### 1.2 Julian Day Number (JDN) Roundtrips
* Always use JDN conversions for accurate Gregorian $\rightleftharpoons$ Ethiopian date roundtrips.
* Pagume has **6 days** on leap years (when `year % 4 === 3` in Ethiopian calendar / John year) and **5 days** on non-leap years.

### 1.3 30 Monthly Tabots & 13-Month Annual Feasts
* Monthly Tabots (1 to 30) repeat each Ethiopian month (e.g. 7 = ሥላሴ, 12 = ሚካኤል, 19 = ገብርኤል, 21 = ማርያም, 29 = በዓለ ወልድ).
* Annual Feasts are tied to specific month/day combinations (e.g. Hamle 7 = ሥላሴ, Nehase 13 = ደብረ ታቦር/ቡሄ, Tir 12 = ቃና ዘገሊላ, Tahsas 19 = ቁልቢ ገብርኤል).

---

## 2. ⏰ The 3D Roller Time Picker (`RollerTimePickerModal`)

### 2.1 3D Cylindrical Mechanical Dial Architecture
* **3 Independent Vertical Columns**:
  1. **Hours**: 1 to 12.
  2. **Minutes**: 00 to 59.
  3. **Period**: AM / PM.
* **Cylindrical Visual Depth**:
  * Center selection locked in a focused window with large typography (`32px` font).
  * Adjacent numbers (above and below) rendered in smaller, dimmed text (`fontSize: 17`, `opacity: 0.38`, `transform: [{ scale: 0.88 }]`) with haptic tick (`Haptics.selectionAsync()`).

### 2.2 Live Dynamic Countdown
* The helper `calculateAlarmCountdown(targetHour24, targetMinute, language)` calculates remaining time relative to the current device clock:
  * Amharic: `በ7 ሰዓት ከ25 ደቂቃ በኋላ ይደውላል`
  * English: `Rings in 7 hr 25 min`

### 2.3 Additional Alarm Controls
* **Alarm Behavior**: Full Alarm (`ደወልና ንዝረት`) vs Notification Only (`ማሳወቂያ ብቻ`).
* **Vibration**: Toggle for haptic pulse during alarm.
* **Chimes / Ringtones**: Sacred Orthodox Chime (`የቤተክርስቲያን ቃጭል`), Cathedral Bell (`የደብር ደወል`), or Gentle Morning Tone.

---

## 3. 🔔 Android 8.0+ / 14 / 15 Notifications & Alarms

### 3.1 Channel Configuration
Always declare dedicated notification channels on Android with appropriate audio and vibration attributes:
1. `elet_prayers_alarm` $\to$ Canonical 7 prayer hours (High priority / Alarm usage).
2. `elet_fasting_alarm` $\to$ Fasting break time reminders.
3. `elet_feasts_daily` $\to$ 7:30 AM Daily Saint & Tabot commemoration.
4. `elet_scripture_daily` $\to$ 12:00 PM Noon daily scripture verse.
5. `elet_streak_guard` $\to$ 8:30 PM Evening streak protection alert.

### 3.2 Critical Android Rules
* **Avoid String Sounds**: Never pass string sound names like `sound: "default"` in `expo-notifications` on Android, as the OS searches for missing `.wav` resources. Use `sound: true` and channel vibration settings.
* **Deprecated Property**: Use `shouldShowBanner: true` and `shouldShowList: true` instead of deprecated `shouldShowAlert: true` in `setNotificationHandler`.
* **Sacred Phrasing**: Use solemn, dignified ecclesiastical copy without casual emojis.

---

## 4. 🧹 Zero-Mock Blank Slate & State Invariants

### 4.1 Clean Initial State
* Store storage key: `@elet_state_v3`.
* New installs must initialize with empty arrays:
  * `dailyPracticeDates: []` $\to$ Streak starts at **`0 Days`**.
  * `customFastPlans: []`, `penanceItems: []`, `notes: []`, `intercessions: []`, `confessionSessions: []`.
* Streak heatmap and spiritual insight graphs must start completely unlit on Day 1.

---

## 5. 🎨 Typography & Design Tokens

### 5.1 Bilingual Font Resolution
To prevent Android font manager fallback:
* **English**: `@expo-google-fonts/lexend` (`Lexend_400Regular`, `Lexend_600SemiBold`, `Lexend_700Bold`).
* **Amharic / Ge'ez**: `@expo-google-fonts/noto-sans-ethiopic` (`NotoSansEthiopic_400Regular`, `NotoSansEthiopic_700Bold`, `NotoSansEthiopic_900Black`).
* **Display / Numbers**: `@expo-google-fonts/outfit` (`Outfit_700Bold`, `Outfit_900Black`).
* **Rule**: Strip `fontWeight` when passing custom `fontFamily` strings on React Native Native.

### 5.2 Color Tokens
* **Primary Terracotta**: `#8E4424` (Buttons, active highlights, badges).
* **Liturgical Gold**: `#C89D42` (Feast stars, scripture headers, fast badges).
* **Deep Emerald**: `#2D6A4F` (Commemoration markers).
* **Surface Backgrounds**: `#FAF7F2` (Light) / `#1C1512` (Dark) / `#120E0B` (Sacred Night).

### 5.3 Micro-Animations
* Bottom tab bar icons scale up by **10%** (`transform: [{ scale: focused ? 1.10 : 1.0 }]`) when active.

---

## 6. 📱 Android APK & Build Optimization

### 6.1 SDK 36 & Toolchain
* `compileSdkVersion: 36` in `app.json` and `android/gradle.properties`.
* Android NDK: `27.1.12297006`.
* Build Tools: `36.0.0`.

### 6.2 APK Size Reduction (~30 MB Target)
* Enable ABI splitting in `android/app/build.gradle`:
  * `arm64-v8a` (Primary modern target: ~30 MB).
  * `armeabi-v7a` (Legacy target: ~28 MB).
* Enable ProGuard / R8 code & resource shrinking in release builds (`enableProguardInReleaseBuilds = true`, `shrinkResources true`).
