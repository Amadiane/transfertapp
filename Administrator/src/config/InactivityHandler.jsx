import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const InactivityHandler = ({ children }) => {
  const navigate = useNavigate();
  const timerId = useRef(null);
  const logoutTime = 5 * 60 * 1000; // 5 minutes
  const [isInactive, setIsInactive] = useState(false);

  const resetTimer = () => {
    if (timerId.current) clearTimeout(timerId.current);
    setIsInactive(false);  // Reset état inactif
    timerId.current = setTimeout(() => {
      setIsInactive(true);  // Timeout atteint
    }, logoutTime);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (timerId.current) clearTimeout(timerId.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  // Navigation dans un useEffect, bien dans le cycle React
  useEffect(() => {
    if (isInactive) {
      localStorage.clear();
      navigate("/login");
    }
  }, [isInactive, navigate]);

  return <>{children}</>;
};

export default InactivityHandler;
