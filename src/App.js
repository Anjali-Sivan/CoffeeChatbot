import { useEffect, useState } from 'react';
import './App.css';

const App=()=> {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add user message to the state
    setMessages([...messages, { text: inputText, type: 'user' }]);
    
    try {
      // Simulate the fetch operation
      const response = await fetch("/send_message", {
        method: "POST",
        body: new FormData(e.target),
      });

      // Extract and add bot message to the state
      const data = await response.text();
      setMessages([...messages, { text: data, type: 'bot' }]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    // Clear the input field
    setInputText('');
  };

  useEffect(() => {
    const form = document.querySelector(".chat-form");
    form.addEventListener("submit", handleSubmit);

    // Cleanup event listener on component unmount
    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, []);

  return (
    <>
      <div className="chat-container" id="response_message">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form className="chat-form">
        <input
          type="text"
          name="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default App;
