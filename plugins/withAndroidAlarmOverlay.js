const { withAndroidManifest, withMainActivity, withMainApplication, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withAlarmFiles(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const platformRoot = config.modRequest.platformProjectRoot;
      const targetJavaDir = path.join(platformRoot, 'app/src/main/java/me/eyuel/elet');
      const targetRawDir = path.join(platformRoot, 'app/src/main/res/raw');

      fs.mkdirSync(targetJavaDir, { recursive: true });
      fs.mkdirSync(targetRawDir, { recursive: true });

      const files = ['EletAlarmReceiver.kt', 'EletAlarmModule.kt', 'EletAlarmPackage.kt'];
      for (const file of files) {
        const src = path.join(projectRoot, 'native-android', file);
        const dest = path.join(targetJavaDir, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      }

      const bellSrc = path.join(projectRoot, 'assets/sounds/alarm_bell.wav');
      const bellDest = path.join(targetRawDir, 'alarm_bell.wav');
      if (fs.existsSync(bellSrc)) {
        fs.copyFileSync(bellSrc, bellDest);
      }

      return config;
    },
  ]);
}

function withAlarmReceiverManifest(config) {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    if (!mainApplication.receiver) {
      mainApplication.receiver = [];
    }

    const alreadyHasReceiver = mainApplication.receiver.some(
      (r) => r.$ && r.$['android:name'] === '.EletAlarmReceiver'
    );

    if (!alreadyHasReceiver) {
      mainApplication.receiver.push({
        $: {
          'android:name': '.EletAlarmReceiver',
          'android:exported': 'false',
        },
      });
    }

    return config;
  });
}

function withAlarmMainActivity(config) {
  return withMainActivity(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes('alarmLaunchData')) {
      if (!contents.includes('import org.json.JSONObject')) {
        contents = contents.replace(
          /package me\.eyuel\.elet\n/,
          'package me.eyuel.elet\nimport org.json.JSONObject\n'
        );
      }

      const companionCode = `  companion object {
    var alarmLaunchData: String? = null
  }

  private fun checkAlarmIntent(intent: android.content.Intent?) {
    if (intent?.getStringExtra("alarmMode") == "full_alarm") {
      val json = JSONObject()
      json.put("titleAm", intent.getStringExtra("titleAm") ?: "")
      json.put("titleEn", intent.getStringExtra("titleEn") ?: "")
      json.put("subtitleAm", intent.getStringExtra("subtitleAm") ?: "")
      json.put("subtitleEn", intent.getStringExtra("subtitleEn") ?: "")
      json.put("alarmMode", "full_alarm")
      alarmLaunchData = json.toString()
    }
  }
`;
      contents = contents.replace(
        /class MainActivity : ReactActivity\(\) {/,
        `class MainActivity : ReactActivity() {\n${companionCode}`
      );

      contents = contents.replace(
        /super\.onCreate\(null\)/,
        'super.onCreate(null)\n    checkAlarmIntent(intent)'
      );

      if (!contents.includes('onNewIntent')) {
        const onNewIntentCode = `
  override fun onNewIntent(intent: android.content.Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    checkAlarmIntent(intent)
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O_MR1) {
      setShowWhenLocked(true)
      setTurnScreenOn(true)
    }
  }
`;
        contents = contents.replace(
          /super\.onCreate\(null\)[\s\S]*?\n  \}/,
          (match) => `${match}\n${onNewIntentCode}`
        );
      } else {
        contents = contents.replace(
          /setIntent\(intent\)/,
          'setIntent(intent)\n    checkAlarmIntent(intent)'
        );
      }
    }

    config.modResults.contents = contents;
    return config;
  });
}

function withAlarmMainApplication(config) {
  return withMainApplication(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes('add(EletAlarmPackage())')) {
      contents = contents.replace(
        /PackageList\(this\)\.packages\.apply\s*\{/,
        'PackageList(this).packages.apply {\n          add(EletAlarmPackage())'
      );
    }

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = function withAndroidAlarmOverlay(config) {
  config = withAlarmFiles(config);
  config = withAlarmReceiverManifest(config);
  config = withAlarmMainActivity(config);
  config = withAlarmMainApplication(config);
  return config;
};
