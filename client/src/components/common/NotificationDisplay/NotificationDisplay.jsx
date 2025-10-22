import React from 'react';
import { useNotification } from '../../../context/NotificationContext.jsx';

const NotificationDisplay = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 w-full max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-md shadow-lg flex items-center justify-between text-white
            ${notification.type === 'success' ? 'bg-green-500'
            : notification.type === 'error' ? 'bg-red-500'
            : notification.type === 'warning' ? 'bg-yellow-500'
            : 'bg-blue-500'}`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-white hover:text-gray-100 focus:outline-none"
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationDisplay;
