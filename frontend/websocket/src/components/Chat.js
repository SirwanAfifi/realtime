import React, { useState, useEffect } from "react";
import "./Chat.css";
import ChatItem from "./ChatItem";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:8080");

export default () => {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const uName = prompt("Name?");
    if (uName) {
      setUserName(uName);
    }
  }, []);

  socket.on("message", message => {
    setMessages([...messages, message]);
  });

  return (
    <div className="wrapper">
      <div className="card border-primary">
        <h5 className="card-header bg-primary text-white">
          <i className="fas fa-comment"></i> Chat
        </h5>
        <div className="card-body overflow-auto">
          {messages.map((msg, index) => (
            <ChatItem
              key={index}
              userName={msg.userName}
              message={msg.message}
            />
          ))}
        </div>
        <div className="card-footer border-primary p-0">
          <div className="input-group">
            <input
              value={message}
              onChange={e => {
                setMessage(e.target.value);
              }}
              type="text"
              className="form-control input-sm"
              placeholder="Type your message here..."
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={_ => {
                const msg = {
                  id: Math.random() * 10,
                  message,
                  userName: userName
                };
                setMessages([...messages, msg]);
                setMessage("");

                socket.emit("message", msg);
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
