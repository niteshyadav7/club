import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '../store';
import { addToast } from '../store/slices/uiSlice';

export function usePushNotification() {
  const dispatch = useAppDispatch();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      dispatch(addToast({
        title: 'Notifications',
        message: 'Browser push notifications are not supported on this device.',
        type: 'info'
      }));
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        dispatch(addToast({
          title: 'Notifications Enabled! 🔔',
          message: 'You will now receive alerts for Birthdays, Dues updates, and Club Events.',
          type: 'success'
        }));
        return true;
      } else {
        dispatch(addToast({
          title: 'Permission Denied',
          message: 'Notifications were blocked in your browser settings.',
          type: 'warning'
        }));
        return false;
      }
    } catch (err) {
      console.error('Failed to request notification permission', err);
      return false;
    }
  }, [isSupported, dispatch]);

  const sendLocalNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (isSupported && permission === 'granted') {
      try {
        new Notification(title, {
          icon: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=100&auto=format&fit=crop&q=80',
          ...options,
        });
      } catch (e) {
        // In-app toast fallback
        dispatch(addToast({
          title,
          message: options?.body || '',
          type: 'info'
        }));
      }
    } else {
      // In-app fallback toast
      dispatch(addToast({
        title,
        message: options?.body || '',
        type: 'info'
      }));
    }
  }, [isSupported, permission, dispatch]);

  return {
    isSupported,
    permission,
    requestPermission,
    sendLocalNotification,
  };
}
