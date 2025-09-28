// Chatbot JavaScript functionality
class Chatbot {
  constructor() {
    this.chatContainer = document.getElementById("chatContainer");
    this.messageInput = document.getElementById("messageInput");
    this.sendButton = document.getElementById("sendButton");
    this.clearChatButton = document.getElementById("clearChat");
    this.typingIndicator = document.getElementById("typingIndicator");
    this.charCount = document.getElementById("charCount");
    this.quickActionButtons = document.querySelectorAll(".quick-action-btn");

    this.isTyping = false;
    this.messageHistory = [];

    this.initializeEventListeners();
    this.setWelcomeTime();
  }

  initializeEventListeners() {
    // Send message on button click
    this.sendButton.addEventListener("click", () => this.sendMessage());

    // Send message on Enter key
    this.messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Character count update
    this.messageInput.addEventListener("input", () => this.updateCharCount());

    // Clear chat
    this.clearChatButton.addEventListener("click", () => this.clearChat());

    // Quick action buttons
    this.quickActionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const message = button.getAttribute("data-message");
        this.messageInput.value = message;
        this.sendMessage();
      });
    });

    // File attachment (placeholder)
    document.getElementById("attachFile").addEventListener("click", () => {
      this.showNotification("File attachment feature coming soon!", "info");
    });
  }

  setWelcomeTime() {
    const welcomeTime = document.getElementById("welcomeTime");
    welcomeTime.textContent = new Date().toLocaleTimeString();
  }

  updateCharCount() {
    const count = this.messageInput.value.length;
    this.charCount.textContent = `${count}/500`;

    if (count > 450) {
      this.charCount.classList.add("text-red-500");
    } else {
      this.charCount.classList.remove("text-red-500");
    }
  }

  async sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message || this.isTyping) return;

    // Add user message to chat
    this.addMessage(message, "user");

    // Clear input
    this.messageInput.value = "";
    this.updateCharCount();

    // Show typing indicator
    this.showTypingIndicator();

    // Simulate AI response delay
    setTimeout(() => {
      this.hideTypingIndicator();
      this.generateAIResponse(message);
    }, 1000 + Math.random() * 2000);
  }

  addMessage(content, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat ${
      sender === "user" ? "chat-end" : "chat-start"
    } message-enter`;

    const time = new Date().toLocaleTimeString();

    messageDiv.innerHTML = `
            <div class="chat-image avatar">
                <div class="w-10 rounded-full ${
                  sender === "user"
                    ? "bg-gradient-to-r from-green-500 to-blue-500"
                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                } flex items-center justify-center">
                    <i class="fas ${
                      sender === "user" ? "fa-user" : "fa-robot"
                    } text-white"></i>
                </div>
            </div>
            <div class="chat-header">
                ${sender === "user" ? "You" : "Accommodation Assistant"}
                <time class="text-xs opacity-50">${time}</time>
            </div>
            <div class="chat-bubble ${
              sender === "user"
                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            }">
                ${this.formatMessage(content)}
            </div>
        `;

    this.chatContainer.appendChild(messageDiv);
    this.scrollToBottom();

    // Store message in history
    this.messageHistory.push({ content, sender, timestamp: new Date() });
  }

  formatMessage(content) {
    // Basic formatting for links, bold, italic
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" class="underline">$1</a>'
      );
  }

  showTypingIndicator() {
    this.isTyping = true;
    this.typingIndicator.classList.remove("hidden");
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.isTyping = false;
    this.typingIndicator.classList.add("hidden");
  }

  generateAIResponse(userMessage) {
    const responses = this.getAIResponses(userMessage);
    const response = responses[Math.floor(Math.random() * responses.length)];
    this.addMessage(response, "ai");
  }

  getAIResponses(userMessage) {
    const message = userMessage.toLowerCase();

    // Electricity bills question
    if (
      message.includes("electricity") ||
      message.includes("bill") ||
      message.includes("split") ||
      message.includes("mess")
    ) {
      return [
        "To manage electricity in a mess, track monthly bills (typically 1,000-2,000 BDT, split among roommates). Use energy-efficient bulbs and turn off appliances when not in use. Pay bills on time to avoid disconnections, and report outages to the landlord. Use apps like bKash for shared payments.",
      ];
    }

    // SUST hall furniture question
    if (
      message.includes("sust") ||
      message.includes("hall") ||
      message.includes("furniture") ||
      message.includes("provided")
    ) {
      return [
        "SUST halls typically provide a bed, table, chair, and locker per student. You need to buy additional items like fans or personal furniture.",
      ];
    }

    // Hostel furniture question
    if (
      message.includes("hostel") ||
      message.includes("buy") ||
      message.includes("need")
    ) {
      return [
        "In hostels, residents must purchase their own furniture, like beds, chairs or desks, as none is provided. Check with the hostel manager for guidelines.",
      ];
    }

    // Greeting responses
    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      return [
        "Hello! I'm your University Accommodation Assistant. How can I help you with halls, mess, or hostel questions?",
        "Hi there! I'm here to help with accommodation queries. What would you like to know?",
        "Hey! I can assist with university accommodation questions. What's on your mind?",
        "Hello! I'm excited to help you with accommodation matters. What can I do for you?",
      ];
    }

    // Mess facilities responses
    if (
      message.includes("mess") ||
      message.includes("food") ||
      message.includes("meal")
    ) {
      return [
        "Mess facilities typically provide breakfast, lunch, and dinner. Meal times are usually fixed, and you may need to register for mess services. Check with your hall administration for specific timings and menu options.",
        "Most university messes offer vegetarian and non-vegetarian options. You can usually choose your meal plan at the beginning of the semester. Contact the mess manager for detailed information.",
      ];
    }

    // Hall information responses
    if (
      message.includes("hall") ||
      message.includes("room") ||
      message.includes("accommodation")
    ) {
      return [
        "University halls typically provide basic furniture and shared facilities like bathrooms and common areas. You'll need to bring personal items like bedding, study materials, and any additional furniture you prefer.",
        "Hall rooms are usually shared between 2-4 students. Each student gets a bed, study table, chair, and storage space. Common facilities include dining halls, study rooms, and recreational areas.",
      ];
    }

    // General accommodation help responses
    if (
      message.includes("help") ||
      message.includes("assistance") ||
      message.includes("support")
    ) {
      return [
        "I'd be happy to help with accommodation questions! What specific aspect of university housing would you like to know about?",
        "Accommodation assistance is my specialty! Feel free to ask about halls, mess, hostel facilities, or any housing-related concerns.",
        "I love helping with accommodation matters! Whether it's furniture, bills, facilities, or policies, I'm here to assist. What's your question?",
        "Accommodation help coming up! What specific housing challenge are you facing today?",
      ];
    }

    // Policy and rules explanations
    if (
      message.includes("explain") ||
      message.includes("what is") ||
      message.includes("how does") ||
      message.includes("policy") ||
      message.includes("rule")
    ) {
      return [
        "I'd be delighted to explain accommodation policies! Could you provide a bit more detail about what specific rule or policy you'd like me to break down?",
        "Absolutely! I love explaining accommodation concepts. What would you like me to clarify or explain in detail?",
        "I'm here to help with accommodation explanations! The more specific your question, the better I can assist you.",
        "Great question! I'd be happy to provide a clear explanation about accommodation matters. What topic would you like me to cover?",
      ];
    }

    // Thank you responses
    if (message.includes("thank") || message.includes("thanks")) {
      return [
        "You're very welcome! I'm glad I could help. Is there anything else you'd like to know?",
        "My pleasure! Happy to assist anytime. What else can I help you with?",
        "You're welcome! I'm here whenever you need assistance. Feel free to ask more questions!",
        "No problem at all! I enjoy helping. What's your next question?",
      ];
    }

    // Goodbye responses
    if (
      message.includes("bye") ||
      message.includes("goodbye") ||
      message.includes("see you")
    ) {
      return [
        "Goodbye! It was great chatting with you. Feel free to come back anytime!",
        "See you later! Thanks for the conversation. I'll be here when you need me!",
        "Take care! It was wonderful talking with you. Come back soon!",
        "Farewell! I enjoyed our chat. Don't hesitate to return if you have more questions!",
      ];
    }

    // Default responses
    return [
      "That's an interesting accommodation question! I'd be happy to help you explore that topic further. Could you provide a bit more detail?",
      "I understand what you're asking about regarding accommodation. Let me think about the best way to help you with that.",
      "Great question about university housing! I'm processing your request and will do my best to provide a helpful response.",
      "I'm here to help with accommodation matters! Could you elaborate a bit more on what you'd like to know?",
      "That's a thoughtful accommodation question. I'd love to assist you with that. What specific aspect would you like me to focus on?",
      "I appreciate your accommodation question! Let me provide you with some helpful information on that topic.",
      "Interesting point about housing! I can definitely help you with that. What would you like to know more about?",
      "I'm excited to help you with accommodation matters! Could you give me a bit more context so I can provide the best assistance?",
    ];
  }

  clearChat() {
    // Keep only the welcome message
    const welcomeMessage = this.chatContainer.querySelector(".chat-start");
    this.chatContainer.innerHTML = "";
    this.chatContainer.appendChild(welcomeMessage);

    // Clear message history
    this.messageHistory = [];

    // Show notification
    this.showNotification("Chat cleared successfully!", "success");
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }, 100);
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} fixed top-4 right-4 z-50 max-w-sm shadow-lg`;
    notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                  type === "success"
                    ? "fa-check-circle"
                    : type === "error"
                    ? "fa-exclamation-circle"
                    : "fa-info-circle"
                } mr-2"></i>
                <span>${message}</span>
            </div>
        `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const chatbot = new Chatbot();

  // Add some interactive features
  console.log("🤖 AI Chatbot initialized successfully!");

  // Add keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + K to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      document.getElementById("messageInput").focus();
    }

    // Escape to clear input
    if (e.key === "Escape") {
      document.getElementById("messageInput").value = "";
      document.getElementById("messageInput").blur();
    }
  });

  // Add click animation to buttons
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", function () {
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });
  });

  // Add hover effects to quick action buttons
  document.querySelectorAll(".quick-action-btn").forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });
});

// Add some utility functions
const utils = {
  // Format timestamp
  formatTime: (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  },

  // Generate random ID
  generateId: () => {
    return Math.random().toString(36).substr(2, 9);
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

// Export for potential module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Chatbot, utils };
}
