import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";

const ChatItem = ({ isMyMessage, text, data }) => {
  return (
    <div className={isMyMessage ? "MyTextChatContainer" : "TextChatContainer"}>
      {data ? (
        <div>
          {data.map((item) => (
            <div className="TextChat" key={item.id}>
              <p>Account number: {item.account_number}</p>
              <p>Account name: {item.account_name}</p>
              <p>Bank: {item.bank_name}</p>
              <p>Date: {item.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          className={isMyMessage ? "MyTextChat" : "TextChat"}
        />
      )}
    </div>
  );
};

function App() {
  const chatRef = useRef();
  const inputRef = useRef();

  const [isPrompt, setIsPrompt] = useState(false);
  const [inputText, setInputText] = useState("");
  const [openNav, setOpenNav] = useState(false);
  const [chats, setChats] = useState([
    {
      id: 1,
      text: "Hi, how may I help you today?",
      prompt: "Hi, how may I help you today?",
    },
  ]);

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
    inputRef.current.focus();
  }, []);

  const onSendChat = () => {
    setChats((oldChats) => [
      ...oldChats,
      { text: inputText, prompt: "", isMyMessage: true },
    ]);
    setInputText("");
    axios
      .post("http://localhost:8000/prompt/", {
        text: inputText,
      })
      .then((res) => {
        console.log(res.data);
        const newChats = [...chats];
        delete newChats[newChats.length + 1];
        newChats.push({
          text: inputText,
          prompt: res.data.prompt,
          isMyMessage: true,
        });
        newChats.push({
          text: res.data.text,
          prompt: res.data.response,
          data: res.data?.data,
        });
        setChats(newChats);
      });
  };

  return (
    <div className="Container">
      <div className="SideNav">
        <div className="HeaderContainer">
          <div className="Logo">FinBot</div>
        </div>
        <div className="NavContainer">
          <a
            onClick={() => {
              setIsPrompt(false);
              setOpenNav(false);
            }}
            className={!isPrompt ? "NavLinkActive" : "NavLink"}
          >
            Chat
          </a>
          <a
            onClick={() => {
              setIsPrompt(true);
              setOpenNav(false);
            }}
            className={isPrompt ? "NavLinkActive" : "NavLink"}
          >
            Prompt Visualization
          </a>
        </div>
      </div>
      <div style={{ left: openNav ? 0 : "-100vw" }} className="SideNavMobile">
        <div className="HeaderContainer">
          <div className="Logo">FinBot</div>
        </div>
        <div className="NavContainer">
          <a
            onClick={() => {
              setIsPrompt(false);
              setOpenNav(false);
            }}
            className={!isPrompt ? "NavLinkActive" : "NavLink"}
          >
            Chat
          </a>
          <a
            onClick={() => {
              setIsPrompt(true);
              setOpenNav(false);
            }}
            className={isPrompt ? "NavLinkActive" : "NavLink"}
          >
            Prompt Visualization
          </a>
        </div>
      </div>
      <div className="Main">
        <div className="HeaderMobile">
          <div
            className="MenuIcon"
            onClick={() => {
              console.log("abc...");
              setOpenNav(true);
            }}
          >
            ☰
          </div>
          <div className="Logo">FinBot</div>
        </div>
        <div ref={chatRef} className="ChatContainer">
          {chats.map(({ id, text, prompt, isMyMessage, data }) => (
            <ChatItem
              key={id}
              text={isPrompt ? prompt : text}
              isMyMessage={isMyMessage}
              data={data}
            />
          ))}
        </div>
        <div className="ChatInputContainer">
          <input
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="ChatInput"
          />
          <a onClick={onSendChat} className="SendButton">
            Send
          </a>
        </div>
      </div>
      <div className="Right"></div>
    </div>
  );
}

export default App;
