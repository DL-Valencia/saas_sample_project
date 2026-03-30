import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const useIdleTimeout = (timeoutMs = 90000) => { // Default to 1.5 minutes
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      if (user) {
        console.log('User idle for 1.5 mins, logging out...');
        dispatch(logout());
        window.location.href = '/login';
      }
    }, timeoutMs);
  };

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Initial timer start
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, dispatch, timeoutMs]);

  return null;
};

export default useIdleTimeout;
