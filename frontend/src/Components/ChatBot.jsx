import { useState,useRef } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
export default function ChatBot({ darkMode }) {
  const dragRef = useRef(null);
  const [minimized, setMinimized] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const username =
  localStorage.getItem("email")?.split("@")[0] || "Reader";

const [messages, setMessages] = useState([
  {
    sender: "ai",
    text: `👋 Hii ${username}!\n\nI'm your Bookish AI Assistant 📚\nTell me what kind of books you are looking for.`
  }
]);

  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!message.trim()) return;

    // 👤 USER MESSAGE
    const userMessage = {
      sender: "user",
      text: message
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const email = localStorage.getItem("email");

      const res = await API.post("/ai/chat", {
        message,
        email
      });

      // 🤖 AI MESSAGE
      const aiMessage = {
        sender: "ai",
        text: res.data.reply,
        books: res.data.books
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.log(err);
    }

    setMessage("");
  };

  return (
    <>
      {/* 💬 FLOATING BUTTON */}
      <button
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "none",
          background: "#1a237e",
          color: "white",
          fontSize: "34px",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
        }}
      >
        🤖
      </button>

      {/* 📦 CHAT WINDOW */}
      {open && !minimized && (
        <Draggable handle=".chat-header" nodeRef={dragRef}>
        <div
        ref={dragRef}
          style={{
            position: "fixed",
            bottom: "120px",
            right: "50px",
            width: "760px",
            height: "90vh",
            background: darkMode ? "#1e1e1e" : "white",
            borderRadius: "30px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999
          }}
        >

          {/* 🔝 HEADER */}
          <div
  className="chat-header"
  style={{
    padding: "20px",
    background: "#1a237e",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "move"
  }}
>
  <span
    style={{
      fontSize: "26px",
      fontWeight: "bold"
    }}
  >
    Bookish AI 📚
  </span>

  <div>
    <button
      onClick={() => {
          setMinimized(true);
          setOpen(false);
        }}
      
      style={{
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "22px",
        cursor: "pointer",
        marginRight: "10px"
      }}
    >
      {minimized ? "□" : "—"}
    </button>

    <button
      onClick={() => {
          setOpen(false);
          setMinimized(false);

          setMessages([
            {
              sender: "ai",
              text: `👋 Hii ${username}!\n\nI'm your Bookish AI Assistant 📚\nTell me what kind of books you are looking for.`
            }
          ]);
        }}
      style={{
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "22px",
        cursor: "pointer"
      }}
    >
      ✕
    </button>
  </div>
</div>

          {/* 💬 MESSAGES */}
      {!minimized && (
        <>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "25px",
              display: "flex",
              flexDirection: "column",
              gap: "25px"
            }}
          >

            {messages.map((msg, index) => (
              <div key={index}>

                {/* TEXT MESSAGE */}
                <div
                  style={{
                    alignSelf:
                      msg.sender === "user"
                        ? "flex-end"
                        : "flex-start",

                    background:
                      msg.sender === "user"
                        ? "#1a237e"
                        : darkMode
                        ? "#333"
                        : "#f1f1f1",

                    color:
                      msg.sender === "user"
                        ? "white"
                        : darkMode
                        ? "white"
                        : "black",

                    padding: "22px",
                    borderRadius: "22px",
                    maxWidth: "85%",
                    fontSize: "24px",
                    lineHeight: "1.6",
                    fontWeight: "500",
                    marginLeft:
                      msg.sender === "user"
                        ? "auto"
                        : "0"
                  }}
                >
                  {msg.text}
                </div>

                {/* 📚 BOOK CARDS */}
                {msg.books && msg.books.length > 0 && (
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px"
                    }}
                  >
                    {msg.books.map((book) => (
                      <div
                        key={book._id}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "20px",
                          padding: "20px",
                          background: darkMode ? "#2a2a2a" : "#fafafa"
                        }}
                      >

                        {/* IMAGE */}
                        <img
                          src={book.image}
                          alt={book.title}
                          style={{
                            width: "100%",
                            height: "320px",
                            objectFit: "cover",
                            borderRadius: "15px"
                          }}
                        />

                        {/* TITLE */}
                        <h3
                          style={{
                            marginTop: "15px",
                            fontSize: "28px",
                            fontWeight: "bold",
                            lineHeight: "1.4"
                          }}
                        >
                          {book.title}
                        </h3>

                        {/* PRICE */}
                        <p
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            marginTop: "10px"
                          }}
                        >
                          ₹{book.price}
                        </p>

                        {/* BUTTON */}
                        <button
                          onClick={() =>
                            navigate(`/book/${book._id}`)
                          }
                          style={{
                            width: "100%",
                            padding: "18px",
                            background: "#1a237e",
                            color: "white",
                            border: "none",
                            borderRadius: "15px",
                            cursor: "pointer",
                            fontSize: "22px",
                            fontWeight: "bold",
                            marginTop: "15px"
                          }}
                        >
                          View Details
                        </button>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}

          </div>

          {/* ✍ INPUT */}
          <div
            style={{
              display: "flex",
              padding: "20px",
              borderTop: "1px solid #ddd"
            }}
          >
           <input
              type="text"
              placeholder="Ask for books..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}

              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "18px"
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                marginLeft: "15px",
                padding: "20px 30px",
                border: "none",
                borderRadius: "18px",
                background: "#1a237e",
                color: "white",
                cursor: "pointer",
                fontSize: "22px",
                fontWeight: "bold"
              }}
            >
              Send
            </button>
                    </div>
        </>
      )}
        </div>
        </Draggable>
      )}
      
    </>
  );
}