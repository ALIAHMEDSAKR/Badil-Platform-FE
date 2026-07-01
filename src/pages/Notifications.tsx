import { useState, useEffect, useCallback } from "react";
import { Bell, Check, Trash2, ShieldAlert, Sparkles, Inbox } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { notificationApi } from "../api/notificationApi";
import type { NotificationDto } from "../types/notification";

export function Notifications() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await notificationApi.getMine();
      // Sort by newest first
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Match":
        return <Sparkles className="w-5 h-5 text-[#2dd4bf]" />;
      case "Security":
      case "Alert":
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      default:
        return <Inbox className="w-5 h-5 text-indigo-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2dd4bf] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#2dd4bf]" />
            Notifications
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Stay updated on new matches, messages, and platform alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Check className="w-4 h-4" />}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Card className="dashboard-card p-0 overflow-hidden border border-[var(--border)]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mb-4 text-gray-600" />
            <p>You have no notifications at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 transition-colors ${
                  n.isRead ? "opacity-70 hover:opacity-100" : "bg-[#2dd4bf]/5"
                } hover:bg-[#1a2e2e]/50`}
              >
                <div className="mt-1">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <p className={`text-sm ${n.isRead ? "text-gray-300" : "text-white font-semibold"}`}>
                    {n.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#2dd4bf] hover:bg-[#2dd4bf]/10 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
