import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [options, setOptions] = useState([
    "Black Coffee",
    "Mocha",
    "Cappuccino",
  ]);
  const [showOptions, setShowOptions] = useState(true);

  const handleOptionSelect = async (option) => {
    // Add the selected option as the user message and send it
    const userMessage = { text: option, type: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    await sendMessage(option);
    setShowOptions(false); // Hide options after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() !== "") {
      await sendMessage(inputText);
      setInputText(""); // Clear input after sending
    }
  };

  const sendMessage = async (msg) => {
    try {
      const response = await axios.post(` http://3.135.182.251:3001/sendMessage`, {
        message: msg
      });


      // Assuming the API directly returns the formatted message response
      const botMessage = {
        ...response.data, // Spread operator assumes response.data contains necessary fields
        type: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, { text: msg, type: "user" }, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        botMessage: "Hi there! 👋 Welcome to CoffeeBot, your virtual coffee assistant. How can I help you today? Feel free to ask for a coffee recipe, and I'll be happy to provide one for you!",
        type: "bot",
      };
      setMessages([welcomeMessage]);
    }
  }, [messages]);

  return (
    <div className="chat-container">
      {/* Header and Chat Screen rendering remains the same */}
      <div className="header">Coffee Bot</div>
      <div className="chat-screen">
        {/* Messages rendering */}
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type === "user" ? "user-message" : "bot-message"}`}>
            <p>{`${message.type === "user" ?message.text:message.botMessage}`}</p>
            {message.image && (
              <img src={message.image} alt="Coffee" style={{ width: "100px", height: "100px", borderRadius: "8px" }} />
            )}
          </div>
        ))}
        {showOptions && (
          <div className="options-container">
            {options.map((option, index) => (
              <button key={index} onClick={() => handleOptionSelect(option)}>{option}</button>
            ))}
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
