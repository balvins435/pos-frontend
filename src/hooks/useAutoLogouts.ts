import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = (logoutFn: () => void, timeoutMinutes = 30) => {
  const navigate = useNavigate();
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      logoutFn();
      navigate("/login"); // redirect to login
    }, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // start timer

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
    // }, [logoutFn, navigate, timeoutMinutes]);
  }, [logoutFn, navigate, timeoutMinutes]);
};

export default useAutoLogout;
