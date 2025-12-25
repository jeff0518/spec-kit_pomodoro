import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setLock, acquireLock, releaseLock } from './lockSlice';

const LOCK_KEY = 'pomodoro_window_lock';

export const useWindowLock = () => {
  const dispatch = useAppDispatch();
  const { thisWindowId, activeWindowId, isLockedByOther } = useAppSelector((state) => state.lock);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCK_KEY) {
        dispatch(setLock(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const currentLock = localStorage.getItem(LOCK_KEY);
    dispatch(setLock(currentLock));

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  const acquire = useCallback(() => {
    localStorage.setItem(LOCK_KEY, thisWindowId);
    dispatch(acquireLock());
  }, [dispatch, thisWindowId]);

  const release = useCallback(() => {
    const currentLock = localStorage.getItem(LOCK_KEY);
    if (currentLock === thisWindowId) {
      localStorage.removeItem(LOCK_KEY);
      dispatch(releaseLock());
    }
  }, [dispatch, thisWindowId]);

  return {
    isLockedByOther,
    activeWindowId,
    acquireLock: acquire,
    releaseLock: release,
  };
};
