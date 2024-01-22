// App.js

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
    // Set selected option as the user message
    const userMessage = { text: option, type: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Call API with the selected option
    await sendMessage(option);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If the user typed a message, add it to the state
    if (inputText.trim() !== "") {
      const userMessage = { text: inputText, type: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      await sendMessage(inputText);
    }

    // Clear the input field
    setInputText("");
  };

  const sendMessage = async (message) => {
    try {
      // Send the user message to the server
      const response = await axios.post("http://3.135.182.251:3001/sendMessage", {
        message,
      });

      // Get the response based on the user message
      const getResponse = await axios.get(
        `http://3.135.182.251:3001/getResponse?message=${message}`
      );

      // Add the bot response to the state with a typing animation
      const botMessage = {
        text: getResponse.data.responseMessage.title,
        type: "bot",
        description: getResponse.data.responseMessage.description,
        image: getResponse.data.responseMessage.image,
        ingredients: getResponse.data.responseMessage.ingredients,
        isTyping: true,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Hide options after the user interacts with the chat
      setShowOptions(false);

      // Simulate a delay for the typing animation
      setTimeout(() => {
        // Update the message to remove the typing animation
        botMessage.isTyping = false;
        setMessages((prevMessages) => [...prevMessages]);
      }, 1000);
    } catch (error) {
      console.error("Error sending/receiving message:", error.message);
    }
  };

  useEffect(() => {
    // Display the welcome message only on the first load
    if (messages.length === 0) {
      const welcomeMessage = {
        text: "Hi there! 👋 Welcome to CoffeeBot, your virtual coffee assistant. How can I help you today? Feel free to ask for a coffee recipe, and I'll be happy to provide one for you!",
        type: "bot",
      };
      setMessages([welcomeMessage]);
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="header">
        <svg
          fill="#000000"
          width="48px"
          height="48px"
          viewBox="-5 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
<path d="M12.406 14.75c-0.094-2.094-0.219-3.219-1.469-4.594-1.594-1.781-2.188-3.5-0.875-6.156 0.344 1.781 0.469 3.375 1.719 4.344s2.281 3.594 0.625 6.406zM10.063 14.75c-0.063-1.125-0.125-1.688-0.813-2.469-0.844-0.938-1.188-1.844-0.469-3.281 0.188 0.969 0.219 1.813 0.906 2.313s1.281 1.938 0.375 3.438zM15.719 24.625h5.688c0.344 0 0.469 0.25 0.25 0.531 0 0-2.219 2.844-5.281 2.844h-10.969s-5.281-2.844-5.281-2.844c-0.219-0.281-0.125-0.531 0.219-0.531h5.625c-0.781-0.406-1.938-2.188-1.938-4.406v-4.688h13.688v0.375c0.438-0.375 0.969-0.563 1.531-0.563 0.781 0 2.25 0.813 2.25 2.219 0 2.031-1.344 2.781-2.125 3.313 0 0-1.469 1.156-2.5 2.5-0.344 0.594-0.75 1.063-1.156 1.25zM19.25 16.188c-0.5 0-1.125 0.219-1.531 1.219v2.594c0 0.344-0.031 0.75-0.094 1.094 0.688-0.688 1.5-1.156 1.5-1.156 0.5-0.344 1.5-1 1.5-2.281 0.031-0.906-0.813-1.469-1.375-1.469zM6.406 16.563h-0.875v1.281h0.875v-1.281zM6.406 18.594h-0.875v2.094s0.25 2.813 2.031 3.656c-1.094-1.281-1.156-2.75-1.156-3.656v-2.094z"></path>
        </svg>
        &nbsp; Coffee Bot
      </div>

      <div className="chat-screen">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.type === "user" ? "user-message" : "bot-message"
            } ${message.isTyping ? "typing" : ""}`}
          >
            {message.type === "user" ? (
              message.text
            ) : (
              <>
                {message.isTyping && (
                  <div className="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
                {message.text !==
                "Hi there! 👋 Welcome to CoffeeBot, your virtual coffee assistant. How can I help you today? Feel free to ask for a coffee recipe, and I'll be happy to provide one for you!" ? (
                  <>
                    <p>Sure thing! Here's the information about your coffee:</p>
                    <p>{message.text}</p>
                    <p>Description: {message.description}</p>
                    <p>Ingredients: </p>
                    {message.ingredients &&
                      message.ingredients.map((i, index) => (
                        <p key={index}>{i}</p>
                      ))}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Coffee"
                        style={{
                          width: "150px",
                          height: "150px",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          borderRadius: "12px",
                        }}
                      />
                    )}
                    <p>Enjoy your coffee! ☕️</p>
                  </>
                ) : (
                  <p>{message.text}</p>
                )}
              </>
            )}
          </div>
        ))}
        {showOptions && (
          <div className="options-container">
            {/* <p>Choose a coffee type:</p> */}
            {options.map((option, index) => (
              <button key={index} onClick={() => handleOptionSelect(option)}>
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="text"
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
