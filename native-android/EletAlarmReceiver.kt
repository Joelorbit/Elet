package me.eyuel.elet

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import androidx.core.app.NotificationCompat

class EletAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val pm = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        val wakeLock = pm.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP,
            "Elet:AlarmWakeLock"
        )
        wakeLock.acquire(15000L) // 15 seconds wake lock

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        val titleAm = intent.getStringExtra("titleAm") ?: "የጸሎት ሰዓት ደርሷል"
        val titleEn = intent.getStringExtra("titleEn") ?: "Canonical Prayer Time"
        val subtitleAm = intent.getStringExtra("subtitleAm") ?: "ጸሎትዎን ለመጀመር ዝግጁ ነዎት?"
        val subtitleEn = intent.getStringExtra("subtitleEn") ?: "It is time for your scheduled devotion."
        val channelId = intent.getStringExtra("channelId") ?: "prayer-routine"
        val alarmId = intent.getIntExtra("alarmId", (System.currentTimeMillis() % 100000).toInt())

        // Full-screen and click intent targeting MainActivity
        val activityIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("alarmMode", "full_alarm")
            putExtra("titleAm", titleAm)
            putExtra("titleEn", titleEn)
            putExtra("subtitleAm", subtitleAm)
            putExtra("subtitleEn", subtitleEn)
        }

        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }
        val fullScreenPendingIntent = PendingIntent.getActivity(context, alarmId, activityIntent, flags)

        // Raw sound resource URI
        val soundUri = try {
            Uri.parse("android.resource://${context.packageName}/raw/alarm_bell")
        } catch (_: Exception) {
            RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
        }

        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        // Create or update notification channel
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            var channel = notificationManager.getNotificationChannel(channelId)
            if (channel == null) {
                channel = NotificationChannel(channelId, "Orthodox Prayer & Fasting Alarms", NotificationManager.IMPORTANCE_HIGH).apply {
                    description = "Solemn Orthodox prayer hours and fasting alerts"
                    setSound(soundUri, audioAttributes)
                    enableVibration(true)
                    vibrationPattern = longArrayOf(0, 500, 300, 500, 300, 500)
                    lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
                    setBypassDnd(true)
                }
                notificationManager.createNotificationChannel(channel)
            }
        }

        val iconRes = context.resources.getIdentifier("notification_icon", "drawable", context.packageName).takeIf { it != 0 }
            ?: context.resources.getIdentifier("ic_launcher", "mipmap", context.packageName).takeIf { it != 0 }
            ?: android.R.drawable.ic_dialog_info

        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(iconRes)
            .setContentTitle(titleEn)
            .setContentText(subtitleEn)
            .setSubText(titleAm)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true)
            .setSound(soundUri)
            .setVibrate(longArrayOf(0, 500, 300, 500, 300, 500))
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setContentIntent(fullScreenPendingIntent)
            .setFullScreenIntent(fullScreenPendingIntent, true)

        notificationManager.notify(alarmId, builder.build())
    }
}
