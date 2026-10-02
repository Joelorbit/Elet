package me.eyuel.elet

import android.app.AlarmManager
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.json.JSONObject

class EletAlarmModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "EletAlarmModule"

    private val context: Context
        get() = reactApplicationContext

    private val prefs: SharedPreferences
        get() = context.getSharedPreferences("elet_alarm_ids", Context.MODE_PRIVATE)

    @ReactMethod
    fun scheduleFullScreenAlarm(
        alarmId: Int,
        triggerAtMillis: Double,
        title: String,
        body: String,
        channelId: String,
        dataJson: String,
        promise: Promise
    ) {
        try {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            var titleAm = title
            var titleEn = title
            var subtitleAm = body
            var subtitleEn = body

            try {
                if (dataJson.isNotEmpty()) {
                    val json = JSONObject(dataJson)
                    if (json.has("titleAm")) titleAm = json.getString("titleAm")
                    if (json.has("titleEn")) titleEn = json.getString("titleEn")
                    if (json.has("subtitleAm")) subtitleAm = json.getString("subtitleAm")
                    if (json.has("subtitleEn")) subtitleEn = json.getString("subtitleEn")
                }
            } catch (_: Exception) {}

            val intent = Intent(context, EletAlarmReceiver::class.java).apply {
                putExtra("alarmId", alarmId)
                putExtra("titleAm", titleAm)
                putExtra("titleEn", titleEn)
                putExtra("subtitleAm", subtitleAm)
                putExtra("subtitleEn", subtitleEn)
                putExtra("channelId", channelId)
            }

            val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
            val broadcastPendingIntent = PendingIntent.getBroadcast(context, alarmId, intent, flags)

            // Intent to show when user taps the alarm widget in system UI
            val showIntent = Intent(context, MainActivity::class.java).apply {
                setFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            }
            val showPendingIntent = PendingIntent.getActivity(context, alarmId + 100000, showIntent, flags)

            val triggerTimeLong = triggerAtMillis.toLong()
            val alarmClockInfo = AlarmManager.AlarmClockInfo(triggerTimeLong, showPendingIntent)
            alarmManager.setAlarmClock(alarmClockInfo, broadcastPendingIntent)

            prefs.edit().putBoolean(alarmId.toString(), true).apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ALARM_SCHEDULE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun cancelFullScreenAlarm(alarmId: Int, promise: Promise) {
        try {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(context, EletAlarmReceiver::class.java)
            val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
            val pendingIntent = PendingIntent.getBroadcast(context, alarmId, intent, flags)
            alarmManager.cancel(pendingIntent)
            prefs.edit().remove(alarmId.toString()).apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ALARM_CANCEL_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun cancelAllFullScreenAlarms(promise: Promise) {
        try {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val allIds = prefs.all.keys
            for (idStr in allIds) {
                try {
                    val id = idStr.toInt()
                    val intent = Intent(context, EletAlarmReceiver::class.java)
                    val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    } else {
                        PendingIntent.FLAG_UPDATE_CURRENT
                    }
                    val pendingIntent = PendingIntent.getBroadcast(context, id, intent, flags)
                    alarmManager.cancel(pendingIntent)
                } catch (_: Exception) {}
            }
            prefs.edit().clear().apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ALARM_CANCEL_ALL_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun hasFullScreenIntentPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                promise.resolve(notificationManager.canUseFullScreenIntent())
            } else {
                promise.resolve(true)
            }
        } catch (e: Exception) {
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun openFullScreenIntentSettings(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                val intent = Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT).apply {
                    data = Uri.parse("package:${context.packageName}")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                context.startActivity(intent)
                promise.resolve(true)
            } else {
                promise.resolve(false)
            }
        } catch (e: Exception) {
            promise.reject("SETTINGS_OPEN_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getAlarmLaunchData(promise: Promise) {
        promise.resolve(MainActivity.alarmLaunchData)
    }

    @ReactMethod
    fun clearAlarmLaunchData(promise: Promise) {
        MainActivity.alarmLaunchData = null
        promise.resolve(true)
    }
}
