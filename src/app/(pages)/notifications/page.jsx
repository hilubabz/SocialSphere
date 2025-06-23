"use client"

import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Share, Settings, MoreHorizontal, X } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: {
        name: 'Sarah Johnson',
        username: 'sarahj_dev',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face'
      },
      action: 'liked your photo',
      content: 'Amazing sunset shot! 📸',
      time: '2m',
      isRead: false,
      postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      type: 'follow',
      user: {
        name: 'Mike Chen',
        username: 'mikec_photo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      action: 'started following you',
      time: '15m',
      isRead: false
    },
    {
      id: 3,
      type: 'comment',
      user: {
        name: 'Emma Rodriguez',
        username: 'emma_writes',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      action: 'commented on your post',
      content: 'This is exactly what I needed to read today. Thank you for sharing! 💙',
      time: '1h',
      isRead: true,
      postImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop'
    },
    {
      id: 4,
      type: 'like',
      user: {
        name: 'Alex Thompson',
        username: 'alexthompson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      action: 'liked your comment',
      content: '"Great insight on the latest React updates!"',
      time: '3h',
      isRead: true
    },
    {
      id: 5,
      type: 'share',
      user: {
        name: 'Lisa Park',
        username: 'lisapark_design',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face'
      },
      action: 'shared your post',
      content: 'UI/UX Design Principles for 2024',
      time: '5h',
      isRead: true,
      postImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop'
    },
    {
      id: 6,
      type: 'comment',
      user: {
        name: 'David Kumar',
        username: 'davidk_data',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      action: 'replied to your comment',
      content: 'Have you tried the new data visualization library? It might be perfect for your project.',
      time: '8h',
      isRead: true
    },
    {
      id: 7,
      type: 'follow',
      user: {
        name: 'Priya Sharma',
        username: 'priya_design',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
      },
      action: 'started following you',
      time: '1d',
      isRead: true
    },
    {
      id: 8,
      type: 'like',
      user: {
        name: 'James Wilson',
        username: 'jameswilson',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face'
      },
      action: 'and 12 others liked your photo',
      content: 'Coffee shop vibes ☕',
      time: '2d',
      isRead: true,
      postImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=100&fit=crop'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" fill="currentColor" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'share':
        return <Share className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'follows') return notif.type === 'follow';
    if (filter === 'likes') return notif.type === 'like';
    if (filter === 'comments') return notif.type === 'comment';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-slate-700/50 bg-black/10 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/20">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold tracking-tight mb-1">
                  Notifications
                </h1>
                <p className="text-slate-400 text-sm">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'You\'re all caught up!'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors duration-200"
                >
                  Mark all as read
                </button>
              )}
              <button className="text-slate-400 hover:text-slate-300 p-2 rounded-full hover:bg-white/5 transition-all duration-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-6 mt-6">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'follows', label: 'Follows' },
              { key: 'likes', label: 'Likes' },
              { key: 'comments', label: 'Comments' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`pb-2 border-b-2 text-sm font-medium transition-all duration-200 ${
                  filter === tab.key
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.label}
                {tab.key === 'unread' && unreadCount > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="relative max-w-4xl mx-auto px-8 py-8">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">No notifications found</p>
            <p className="text-slate-600 text-sm">
              {filter === 'unread' ? 'You have no unread notifications' : 'Try adjusting your filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-5 hover:from-slate-700/60 hover:to-slate-800/60 transition-all duration-300 border border-slate-600/20 hover:border-slate-500/30 ${
                  !notification.isRead ? 'border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-slate-900/60' : ''
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                {/* Unread indicator */}
                {!notification.isRead && (
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}

                <div className="flex items-start gap-4 ml-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={notification.user.avatar}
                      alt={notification.user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-slate-800 rounded-full">
                      {getIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white text-sm">
                        <span className="font-semibold">{notification.user.username}</span>
                        <span className="text-slate-300 ml-1">{notification.action}</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs">{notification.time}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-300 p-1 rounded-full hover:bg-white/5 transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {notification.content && (
                      <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                        {notification.content}
                      </p>
                    )}
                  </div>

                  {/* Post Image */}
                  {notification.postImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={notification.postImage}
                        alt="Post"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-600/30"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;