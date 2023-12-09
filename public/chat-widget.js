(function() {
  document.head.insertAdjacentHTML(
    "beforeend",
    '<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.16/tailwind.min.css" rel="stylesheet">'
  );

  // Inject the CSS
  const style = document.createElement("style");
  style.innerHTML = `
        .hidden {
          display: none;
        }
        #chat-widget-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          flex-direction: column;
          z-index: 9999;
        }
        #chat-popup {
          height: 70vh;
          max-height: 70vh;
          transition: all 0.3s;
          overflow: hidden;
          z-index: 9999;
        }
        #chat-header {
          background-color: #000;
          color: white; /* Change the title color to white */
        }
        @media (max-width: 768px) {
          #chat-popup {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            max-height: 100%;
            border-radius: 0;
          }
        }
        `;

  document.head.appendChild(style);

  // Create chat widget container
  const chatWidgetContainer = document.createElement("div");
  chatWidgetContainer.id = "chat-widget-container";
  document.body.appendChild(chatWidgetContainer);

  // Inject the HTML with #chat-popup initially hidden
  chatWidgetContainer.innerHTML = `
          <div id="chat-bubble" class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer text-3xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div id="chat-popup" class="hidden absolute bottom-20 right-0 w-96 bg-white rounded-md shadow-md flex flex-col transition-all text-sm">
            <div id="chat-header" class="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-md">
            <h3 class="m-0 text-lg" style="color: white;">Embark - AI</h3>
            <button id="close-popup" class="bg-transparent border-none text-white cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
            </div>
            <div id="chat-messages" class="flex-1 p-4 overflow-y-auto"></div>
            <div id="chat-input-container" class="p-4 border-t border-gray-200">
              <div class="flex space-x-4 items-center">
                <input type="text" id="chat-input" class="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none w-3/4" placeholder="Type your message...">
                <button id="chat-submit" class="bg-gray-800 text-white rounded-md px-4 py-2 cursor-pointer">Send</button>
              </div>
              <div class="flex text-center text-xs pt-4">
              <span class="flex-1">Powered by <a href="https://localhost:3000/" target="_blank" class="text-indigo-600">@Embark</a></span>
              </div>
            </div>
          </div>
        `;

  // Add event listeners
  const chatInput = document.getElementById("chat-input");
  const chatSubmit = document.getElementById("chat-submit");
  const chatMessages = document.getElementById("chat-messages");
  const chatBubble = document.getElementById("chat-bubble");
  const chatPopup = document.getElementById("chat-popup");
  const closePopup = document.getElementById("close-popup");

  chatSubmit.addEventListener("click", function() {
    const message = chatInput.value.trim();
    if (!message) return;

    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = "";

    onUserRequest(message);
  });

  chatInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      chatSubmit.click();
    }
  });

  chatBubble.addEventListener("click", function() {
    togglePopup();
  });

  closePopup.addEventListener("click", function() {
    togglePopup();
  });

  function togglePopup() {
    console.log("Toggle popup called");
    chatPopup.classList.toggle("hidden");
    if (!chatPopup.classList.contains("hidden")) {
      document.getElementById("chat-input").focus();
    }
  }

  // Initially hide the popup
  togglePopup();

  let promptCount = 0; // Counter for prompts

  function onUserRequest(message) {
    // Handle user request here
    console.log("User request:", message);

    // Display user message
    const messageElement = document.createElement("div");
    messageElement.className = "flex justify-end mb-3";
    messageElement.innerHTML = `
            <div class="bg-gray-800 text-white rounded-lg py-2 px-4 max-w-[70%]">
              ${message}
            </div>
          `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = "";

    // Provide dummy responses based on prompt count
    let response = "";
    if (promptCount === 0) {
      response =
        "A DAO, or Decentralized Autonomous Organization, is a community-driven entity governed by smart contracts and run on blockchain technology. Joining a DAO provides you with a chance to participate in collective decision-making, contribute to projects, and earn rewards in a decentralized manner.";
    } else if (promptCount === 1) {
      response =
        "Certainly! The onboarding process usually involves obtaining ARB tokens, connecting your crypto wallet to the Arbitrum network, and participating in community discussions. Detailed instructions can be found in Arbitrum DAO's official onboarding documentation.";
    } else if (promptCount === 2) {
      response =
        "Yes, you can usually exit Arbitrum DAO. The process may involve initiating a withdrawal through the DAO's mechanisms. Your ARB tokens will be returned to your wallet, but be sure to check for any exit fees or lock-up periods.?";
    } else if (promptCount === 3) {
      response =
        "Arbitrum DAO likely employs a voting mechanism, where ARB token holders can vote on proposals. Your influence in decision-making is proportional to the number of ARB tokens you hold. Engaging in community discussions and voting is crucial for active participation";
    } else {
      response = "I'm just an AI-bot. I have limited data and capabilities";
    }

    // Reply to the user
    setTimeout(function() {
      reply(response);
      promptCount++; // Increment prompt count
    }, 3000);
  }

  function reply(message) {
    const chatMessages = document.getElementById("chat-messages");
    const replyElement = document.createElement("div");
    replyElement.className = "flex mb-3";
    replyElement.innerHTML = `
            <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]">
              ${message}
            </div>
          `;
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
})();
