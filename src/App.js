import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Replace with your deployed backend URL
// const SOCKET_URL = "https://chat-app-backend-t7w5.onrender.com";

const socket = io("https://chat-app-backend-t7w5.onrender.com");


function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Initialize Socket.io connection
  const socket = io(SOCKET_URL);

  useEffect(() => {
    // Handle connection status
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    // Listen for incoming messages
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { username, text: message });
      setMessage("");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Chat App</h1>
      {isConnected ? (
        <p style={{ color: "green" }}>Connected to the server</p>
      ) : (
        <p style={{ color: "red" }}>Not connected to the server</p>
      )}

      <div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: "10px", padding: "5px" }}
        />
        <br />
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ marginRight: "5px", padding: "5px" }}
        />
        <button onClick={sendMessage} style={{ padding: "5px 10px" }}>
          Send
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Chat Messages</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.username || "Anonymous"}:</strong> {msg.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
