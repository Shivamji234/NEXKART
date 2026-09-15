import React, { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { formatDate } from '../utils/formatters';
import { Bell, Check, CheckCheck } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } =
    useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Concierge Bulletins
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            Notifications {unreadCount > 0 && `(${unreadCount} Unread)`}
          </h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs uppercase tracking-wider font-semibold text-gold-700 hover:text-gold-900 flex items-center space-x-1"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All As Read</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Bell className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              No notifications at present.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-5 flex items-start justify-between gap-4 transition ${
                notif.isRead ? 'bg-white' : 'bg-gold-50/20'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-luxury-950 uppercase tracking-wide">
                    {notif.title}
                  </h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-gold-600 inline-block" />
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  {notif.message}
                </p>
                <span className="text-[10px] text-gray-400 block pt-1">
                  {formatDate(notif.createdAt)}
                </span>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => markAsRead(notif._id)}
                  className="p-1.5 text-gray-400 hover:text-luxury-950 rounded-full hover:bg-gray-100 transition flex-shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
