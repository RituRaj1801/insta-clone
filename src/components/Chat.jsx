import React, { useState, useEffect } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    // Fetch logged-in user info from localStorage or API
    const loggedUser = localStorage.getItem("authToken");
    if (!loggedUser) {
      alert("Please log in!");
      window.location.href = "/";
    } else {
      setUser(loggedUser); // Replace with user data if available
    }

    // Fetch initial chat messages
    fetchMessages();

    // Simulate polling or real-time update for new messages
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost/backend/chat/getMessages", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({'sender':localStorage.getItem('authToken')}),
      });
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    try {
      const response = await fetch("http://localhost/backend/chat/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: user,
          receiver: user === "Ram" ? "Me" : "Ram", // Assuming 2 users only
          message,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setMessages([...messages, { sender: user, message }]);
        setMessage(""); // Clear input after sending
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Chat with Ram</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === user ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === user ? "#d4f1f4" : "#f0f0f0",
            }}
          >
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

// Styles for the chat UI
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "70%",
    wordWrap: "break-word",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Chat;
