// import { useState } from "react";

// export default function Home() {
//   const [chatHistory, setChatHistory] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInput = async () => {
//     // Create a local copy of the chat history to prevent mutating state directly
//     const localChatHistory = [...chatHistory];
//     localChatHistory.push({ sender: "Me", text: inputText });
//     setChatHistory(localChatHistory);
//     setInputText("");
//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/gf-reply", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt: inputText }),
//       });

//       const { reply } = await response.json();
//       localChatHistory.push({ sender: "Vandana", text: reply });
//       setChatHistory(localChatHistory);
//     } catch (error) {
//       console.error("AI conversation failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-black">
//       <h1 className="text-3xl font-semibold mb-6">AI Girlfriend Companion</h1>
//       <div className="chat-container bg-white rounded-lg shadow-md p-4 w-80 h-96 overflow-y-auto">
//         {chatHistory.map((message, index) => (
//           <div
//             key={index}
//             className={`chat-message mb-2 ${
//               message.sender === "Vandana"
//                 ? "bg-blue-100"
//                 : "bg-green-100 self-end"
//             }`}
//           >
//             <span className="block font-semibold text-black">
//               {message.sender}:
//             </span>{" "}
//             {message.text}
//           </div>
//         ))}
//       </div>
//       <div className="input-container mt-4 flex items-center">
//         <input
//           type="text"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           placeholder="Start a conversation..."
//           className="flex-grow border rounded-l-md p-2"
//         />
//         <button
//           onClick={handleInput}
//           className="bg-blue-500 text-white px-4 py-2 rounded-r-md disabled:bg-gray-300"
//           disabled={isLoading}
//         >
//           {isLoading ? "Sending..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Scroll to the bottom of the chat on every update
  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [chatHistory]);

  const handleInput = async () => {
    let localChatHistory = [...chatHistory];
    localChatHistory.push({ sender: "Me", text: inputText });
    setChatHistory(localChatHistory);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gf-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      const { reply } = await response.json();
      localChatHistory.push({ sender: "Vandana", text: reply });
      setChatHistory(localChatHistory);
    } catch (error) {
      console.error("AI conversation failed:", error);
      localChatHistory.push({ sender: "Vandana", text: "Oops! Something went wrong. Please try again." });
      setChatHistory(localChatHistory);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#424242] text-white">
      <h1 className="text-3xl font-semibold mb-6 text-center text-shadow-md">AI Girlfriend Companion</h1>

      <div
        ref={chatContainerRef}
        className="chat-container bg-white rounded-lg shadow-xl p-4 w-80 h-96 overflow-y-auto space-y-4 transition-all duration-500 ease-in-out"
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`chat-message p-3 rounded-lg transition-all duration-300 ease-in-out ${
              message.sender === "Vandana"
                ? "bg-blue-100 text-black"
                : "bg-green-100 self-end text-black"
            }`}
          >
            <span className="block font-semibold text-lg">
              {message.sender === "Vandana" ? "Vandana" : "Me"}:
            </span>
            <p>{message.text}</p>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message p-3 rounded-lg bg-gray-200 text-gray-600 flex items-center space-x-2">
            <div className="loader w-4 h-4 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
            <span className="italic">Vandana is typing...</span>
          </div>
        )}
      </div>

      <div className="input-container mt-4 flex items-center w-80 space-x-2">
        <textarea
          rows="2"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Start a conversation..."
          className="flex-grow border rounded-lg p-3 text-white bg-black shadow-md resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleInput}
          className="send-btn px-6 py-3 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 focus:ring-4 focus:ring-purple-500 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <div className="loader w-5 h-5 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}
