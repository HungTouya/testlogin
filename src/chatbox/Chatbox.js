import React from "react";

function Chatbox() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        borderRadius: "12px",
        overflow: "hidden"
      }}
    >
      <iframe
        title="Dialogflow Chatbot"
        width="350"
        height="430"
        src="https://bot.dialogflow.com/50e0a08b-611f-455e-8543-a40f503d3d2b"
        allow="microphone;"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
}

export default Chatbox;

