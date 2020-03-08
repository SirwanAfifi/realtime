import React, { useState, useEffect } from "react";
import "./Chat.css";
import Message from "./Message";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType
} from "@microsoft/signalr";

export default () => {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState();

  useEffect(async () => {
    const socketConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Debug)
      .withUrl("http://localhost:5000/chatHub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .build();
    await socketConnection.start();
    setConnection(socketConnection);

    const uName = prompt("Name?");
    if (uName) {
      setUserName(uName);
    }
  }, []);

  connection &&
    connection.on("message", message => {
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
            <Message
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

                connection && connection.invoke("message", msg);
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
