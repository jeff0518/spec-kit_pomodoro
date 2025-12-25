import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { tick, pauseTimer, resumeTimer, resetTimer, startTimer } from './timerSlice';
import { playSound } from '../../utils/audio';
import { useWindowLock } from '../lock/useWindowLock';

export const useTimer = () => {
  const dispatch = useAppDispatch();
  const { status, remainingSeconds, mode } = useAppSelector((state) => state.timer);
  const { isSoundEnabled } = useAppSelector((state) => state.ui);
  const { isLockedByOther, acquireLock, releaseLock } = useWindowLock();

  useEffect(() => {
    if (status === 'running' && !isLockedByOther) {
      acquireLock();
    } else if (status === 'paused' || status === 'idle') {
      releaseLock();
    }
  }, [status, isLockedByOther, acquireLock, releaseLock]);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (status === 'running' && !isLockedByOther) {
      intervalId = setInterval(() => {
        dispatch(tick());
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status, isLockedByOther, dispatch]);
  
  useEffect(() => {
    if (remainingSeconds <= 0 && status === 'running' && !isLockedByOther) {
      if (isSoundEnabled) {
        playSound('/assets/sounds/timer-end.mp3');
      }
    }
  }, [remainingSeconds, status, isLockedByOther, mode, dispatch, isSoundEnabled]);

  useEffect(() => {
    if (isLockedByOther && status === 'running') {
      dispatch(pauseTimer());
    }
  }, [isLockedByOther, status, dispatch]);


  const handlePause = useCallback(() => {
    if (status === 'running') {
      dispatch(pauseTimer());
    }
  }, [dispatch, status]);

  const handleResume = useCallback(() => {
    if (status === 'paused' && !isLockedByOther) {
      dispatch(resumeTimer());
    }
  }, [dispatch, status, isLockedByOther]);

  const handleReset = useCallback(() => {
    dispatch(resetTimer());
  }, [dispatch]);

  return {
    status,
    remainingSeconds,
    mode,
    pause: handlePause,
    resume: handleResume,
    reset: handleReset,
  };
};
