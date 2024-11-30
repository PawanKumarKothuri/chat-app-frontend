import React, { useState } from "react";
import io from "socket.io-client";

const socket = io.connect("https://chat-app-backend-t7w5.onrender.com"); // Backend URL

const App = () => {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Join room
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  // Send message
  const sendMessage = () => {
    const messageData = { room, message };
    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]); // Local messages
    setMessage("");
  };

  // Receive message
  socket.on("receive_message", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  return (
    <div>
      <h1>Chat Application</h1>
      <input
        type="text"
        placeholder="Room ID"
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>

      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <div>
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.room}</strong>: {msg.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
