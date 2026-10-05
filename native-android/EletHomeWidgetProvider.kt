package me.eyuel.elet

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews

/** Small, dependency-free Android home widget. It uses the platform RemoteViews API. */
class EletHomeWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { appWidgetId ->
            val views = RemoteViews(context.packageName, R.layout.elet_home_widget)
            views.setContentDescription(R.id.elet_widget_root, "Elet quick access: prayer, calendar, and scripture")

            bindRoute(context, views, appWidgetId, R.id.elet_widget_prayer, "elet:///practice/prayers", 1)
            bindRoute(context, views, appWidgetId, R.id.elet_widget_calendar, "elet:///calendar", 2)
            bindRoute(context, views, appWidgetId, R.id.elet_widget_scripture, "elet:///daily-scripture", 3)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

    private fun bindRoute(
        context: Context,
        views: RemoteViews,
        widgetId: Int,
        viewId: Int,
        route: String,
        actionId: Int
    ) {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(route), context, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        val requestCode = widgetId * 10 + actionId
        val pendingIntent = PendingIntent.getActivity(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        views.setOnClickPendingIntent(viewId, pendingIntent)
    }
}
