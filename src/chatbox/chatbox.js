import React, { useEffect } from "react";

const Chatbox = () => {
  useEffect(() => {
    // Load script if not already there
    if (!document.getElementById("df-script")) {
      const script = document.createElement("script");
      script.id = "df-script";
      script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
    }

    // Add chatbox element after delay
    const timer = setTimeout(() => {
      if (!document.querySelector("df-messenger")) {
        const chat = document.createElement("df-messenger");
        chat.setAttribute("intent", "WELCOME");
        chat.setAttribute("chat-title", "Diabeticschedulechat");
        chat.setAttribute("agent-id", "50e0a08b-611f-455e-8543-a40f503d3d2b");
        chat.setAttribute("language-code", "vi");
        document.body.appendChild(chat);
      }
    }, 500); // give time for script to load

    return () => {
      const chat = document.querySelector("df-messenger");
      if (chat) document.body.removeChild(chat);
    };
  }, []);

  return null;
};

export default Chatbox;

