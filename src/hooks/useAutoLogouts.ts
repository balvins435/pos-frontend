import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAutoLogout = (logoutFn: () => void, timeoutMinutes = 30) => {
  const navigate = useNavigate();
  let logoutTimer: NodeJS.Timeout;

  const resetTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
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
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [logoutFn, resetTimer]);
};

export default useAutoLogout;
