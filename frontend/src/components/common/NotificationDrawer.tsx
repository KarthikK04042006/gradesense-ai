import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Bell, X, Check, Trash2, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadNotificationCount, markNotificationRead, clearNotifications } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-red-500/50 hover:bg-slate-800/80 transition-all text-slate-300 hover:text-white"
        title="Live System Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadNotificationCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-[60px] right-4 w-80 sm:w-96 z-[9999] rounded-2xl bg-[#0d1120] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: 'calc(100vh - 72px)' }}
            >
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60 shrink-0">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-slate-100">Live Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-950/80 border border-red-800/60 text-red-400">
                      {unreadNotificationCount} unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Clear all notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">No active notifications</div>
                ) : (
                  notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                        n.read ? 'bg-slate-900/30 opacity-70' : 'bg-slate-800/40 border border-slate-700/40'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="font-semibold text-slate-200 truncate">{n.title}</span>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
