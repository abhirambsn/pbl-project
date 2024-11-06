import React, { useState } from 'react';


function Chat() {
  const [websites, setWebsites] = useState([
    'Wikipedia',
    'ESPN',
    'Al Jazeera',
    'NDTV',
  ]);
  const [messages, setMessages] = useState([
    { text: 'What is the latest news', sender: 'user' },
    { text: "UN chief says US must pressure Israel to end its war as 16 killed in Gaza: This article reports on the increasing death toll in Gaza and calls for the US to intervene and pressure Israel to end the conflict.\nPope Francis condemns Gaza children killings in Israeli attacks: This article highlights the Pope's condemnation of the violence against children in Gaza.\nTurkish-American activist killed by Israel to be buried on Saturday: This article reports on the death of a Turkish-American activist who was killed by Israeli forces and her upcoming burial.\nThree killed in Israeli attacks on Gaza City, Rafah: This article reports on the latest casualties in Gaza due to Israeli attacks.\nTurkey spy chief meets Hamas officials in Ankara: Report: This article reports on a meeting between Turkish intelligence officials and Hamas leaders in Ankara.", sender: 'bot' },  
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <input
          type="text"
          placeholder="Enter URL"
          className="input-url"
        />
        <button className="add-website-btn">+ Add Website</button>
        <div className="website-list">
          <div className="website-heading">Websites</div>
          {websites.map((website, index) => (
            <div key={index} className="website-item">
              {website}
            </div>
          ))}
        </div>
        <button className="logout-btn">Log out</button>
      </aside>

      <main className="chat-section">
        <header className="chat-header">ConvoBOT</header>
        <div className="chat-box">
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-item ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        </div>
        <footer className="chat-footer">
          <input
            type="text"
            placeholder="Type message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="message-input"
          />
          <button onClick={handleSendMessage} className="send-btn">Send</button>
        </footer>
      </main>
    </div>
  );
}

export default Chat;
