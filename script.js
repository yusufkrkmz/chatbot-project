document.addEventListener("DOMContentLoaded", function () {
  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const preChatbotMessage = document.querySelector(".pre-chatbot-message");
  const closeBtn = document.querySelector(".close-btn");
  const chatbox = document.querySelector(".chatbox");
  const chatInput = document.querySelector(".chat-input textarea");
  const sendChatBtn = document.querySelector(".chat-input span");
  const minimizeBtn = document.querySelector(".minimize-btn");
  const refreshBtn = document.querySelector(".refresh-btn");  

  // Chatbotu minimize eden fonksiyon
  minimizeBtn.addEventListener("click", function () {
    document.querySelector(".chatbot-toggler").click();
  });

  // Chatbot sohbetini yenileyen fonksiyon
  refreshBtn.addEventListener("click", function () {
    clearChatbox();

    setTimeout(() => {
      const welcomeMessage = createChatLi(
        "Merhaba! Ben Chatbot. Size nasıl yardımcı olabilirim?",
        "incoming"
      );
      chatbox.appendChild(welcomeMessage);
    }, 1000);

    setTimeout(() => {
      displayCategories();
    }, 2000);
  });

  function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    replacePattern1 =
      /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(
      replacePattern1,
      '<a href="$1" target="_blank">link</a>'
    );

    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(
      replacePattern2,
      '$1<a href="http://$2" target="_blank">link</a>'
    );

    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_\-]+?\.[a-zA-Z]{2,6})/gim;
    replacedText = replacedText.replace(
      replacePattern3,
      '<a href="mailto:$1">$1</a>'
    );

    return replacedText;
  }

  const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className, "fade-in");
    let chatContent;
    if (className === "incoming") {
      message = linkify(message);
      chatContent = `<img src="img/pwclogo.png" alt="Chatbot" class="chat-image"><p>${message}</p>`;
    } else {
      chatContent = `<p>${message}</p>`;
    }
    chatLi.innerHTML = chatContent;
    return chatLi;
  };

  //Butonlar için konteynır
  const createButtonContainer = () => {
    let buttonContainer = document.querySelector(".button-container");
    if (!buttonContainer) {
      buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");
    }
    chatbox.appendChild(buttonContainer);
    scrollToBottom();
    return buttonContainer;
  };

  const predefinedAnswers = [
    { keywords: ["merhaba","selam","selamlar","merhabalar"], response: "Merhaba! Nasıl yardımcı olabilirim?" },
    { keywords: ["nasılsın", "nasıl gidiyor","iyi misin"], response: "İyiyim, teşekkürler! Sana nasıl yardımcı olabilirim?" },
    { keywords: ["naber", "ne haber"], response: "İyiyim, teşekkürler! Sana nasıl yardımcı olabilirim?" }
  ];

  //Kullanıcı inputunu keywordlere bölüp soru tipleriyle eşleyen fonksiyon.
  function findAndDisplayAnswer(userInput) {
    userInput = userInput.toLowerCase();

    const matchedAnswer = predefinedAnswers.find(answer => answer.keywords.some(keyword => userInput.includes(keyword)));
    if (matchedAnswer) {
        setTimeout(() => {
          clearButtons();
            chatbox.appendChild(createChatLi(matchedAnswer.response, "incoming"));
            setTimeout(() => {
              displayCategories();
              scrollToBottom();
            }, 2000);
            
        }, 1000);
    } else {

    let matchedQuestions = questions.map(question => {
      let score = 0;
      question.keywords.forEach(keyword => {
        if (userInput.includes(keyword.toLowerCase())) score++;
      });
      return { question: question, score: score };
    });

    matchedQuestions = matchedQuestions.filter(q => q.score > 0);
    matchedQuestions.sort((a, b) => b.score - a.score);
    matchedQuestions = matchedQuestions.slice(0, 3);

    if (matchedQuestions.length > 0) {
      setTimeout(() => {
        chatbox.appendChild(createChatLi("Yazdığın soruyla en çok benzeşen bu soruları buldum.", "incoming"));
        scrollToBottom();
      }, 1000);
      clearButtons();
      setTimeout(() => {
        const buttonContainer = createButtonContainer();

        matchedQuestions.forEach(match => {
          const questionBtn = document.createElement("button");
          questionBtn.textContent = match.question.text;
          questionBtn.classList.add("fade-in", "question-button");
          questionBtn.onclick = () => {
            chatbox.appendChild(createChatLi(questionBtn.textContent, "outgoing"));
            setTimeout(() => {
              chatbox.appendChild(createChatLi(match.question.answer, "incoming"));
              scrollToBottom();
            }, 1000);
            clearButtons();
            setTimeout(askIfUserHasMoreQuestions, 2000);
          };
          buttonContainer.appendChild(questionBtn);
          scrollToBottom();
        });
      }, 2000);
    } else {
      chatbox.appendChild(createChatLi("Üzgünüm, bu konuda yardımcı olamıyorum.", "incoming"));
      setTimeout(askIfUserHasMoreQuestions, 2000);
    }
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
  }




  const handleChat = () => {
    let userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      findAndDisplayAnswer(userMessage);
    }, 600);
  };

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  });

  sendChatBtn.addEventListener("click", handleChat);
  closeBtn.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot")
  );
  chatbotToggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot")
  );

  chatbotToggler.addEventListener("click", () => {
    clearChatbox();

    setTimeout(() => {
      clearChatbox();
      const welcomeMessage = createChatLi(
        "Merhaba! Ben Chatbot. Size nasıl yardımcı olabilirim?",
        "incoming"
      );
      chatbox.appendChild(welcomeMessage);
    }, 1000);

    setTimeout(() => {
      displayCategories();
    }, 1750);
  });



  // Ana kategorileri göster
  const displayCategories = () => {
    clearButtons();
    const buttonContainer = createButtonContainer();

    Object.keys(mainCategories).forEach((category) => {
      const categoryBtn = document.createElement("button");
      categoryBtn.textContent = category;
      categoryBtn.classList.add("fade-in", "category-button");
      categoryBtn.addEventListener("click", () => {
        displaySubcategories(category);
      });
      buttonContainer.appendChild(categoryBtn);
      scrollToBottom();
    });
  };

  // Alt kategorilerin sorularını gösterme
  const displayQuestions = (selectedSubcategory) => {
    currentSubcategory = selectedSubcategory;
    clearButtons();
    const buttonContainer = createButtonContainer();

    if (selectedSubcategory in subcategory) {
      subcategory[selectedSubcategory].forEach(questionText => {
        const questionBtn = document.createElement("button");
        questionBtn.textContent = questionText;
        questionBtn.classList.add("fade-in", "question-button");
        questionBtn.onclick = () => {
          clearButtons(true);
          chatInput.value = questionText;
          handleChatbySelectedQuestion();
        };
        buttonContainer.appendChild(questionBtn);
        scrollToBottom();
      });
      createBackButton();
      scrollToBottom();
    } else {
      const noQuestionLi = document.createElement("li");
      noQuestionLi.textContent = "Bu kategori için soru bulunamadı.";
      chatbox.appendChild(noQuestionLi);
      scrollToBottom();
    }
};
  

  const selectedQuestionAnswer = (userInput) => {
    let highestScore = 0;
    let selectedQuestion = null;
    userInput = userInput.toLowerCase();

    questions.forEach(question => {
      let score = 0;
      question.keywords.forEach(keyword => {
        if (userInput.includes(keyword.toLowerCase())) score++;
      });
      if (score > highestScore) {
        highestScore = score;
        selectedQuestion = question;
      }
    });

    if (selectedQuestion) {

      chatbox.appendChild(createChatLi(selectedQuestion.answer, "incoming"));
      setTimeout(askIfUserHasMoreQuestions, 1000);
    } else {

      chatbox.appendChild(createChatLi("Üzgünüm, bu konuda yardımcı olamıyorum.", "incoming"));
      setTimeout(askIfUserHasMoreQuestions, 1000);
    }
    chatbox.scrollTo(0, chatbox.scrollHeight);
  };

  const handleChatbySelectedQuestion = () => {
    clearButtons();
    let userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      selectedQuestionAnswer(userMessage);
    }, 600);
    scrollToBottom();
  };

  // Alt kategorileri gösterme
  const displaySubcategories = (category) => {
    currentCategory = category;
    currentSubcategory = "";
    clearButtons();
    const buttonContainer = createButtonContainer();

    mainCategories[category].forEach((subcategoryName) => {
      const subcategoryBtn = document.createElement("button");
      subcategoryBtn.textContent = subcategoryName;
      subcategoryBtn.classList.add("fade-in", "subcategory-button");
      subcategoryBtn.addEventListener("click", () => {
        displayQuestions(subcategoryName);
      });
      buttonContainer.appendChild(subcategoryBtn);
      scrollToBottom();
    });
    
    createBackButton("mainCategories");
    chatbox.scrollTo(0, chatbox.scrollHeight);
  };

  const clearChatbox = () => {
    while (chatbox.firstChild) {
      chatbox.removeChild(chatbox.firstChild);
    }
  };

  function askIfUserHasMoreQuestions() {

    clearButtons();

    chatbox.appendChild(
      createChatLi("Başka işlem yapmak ister misiniz?", "incoming")
    );
    scrollToBottom();

    const buttonContainer = createButtonContainer();

    // Evet butonu
    setTimeout(() => {
      const yesButton = document.createElement("button");
      yesButton.textContent = "Evet";
      yesButton.classList.add("fade-in", "decision-button");
      yesButton.onclick = () => {
        chatbox.appendChild(createChatLi("Evet", "outgoing"));
        scrollToBottom();
        setTimeout(() => { clearChatbox(); }, 3000);
        setTimeout(() => {
          const welcomeMessage = createChatLi(
            "Merhaba! Ben Chatbot. Size nasıl yardımcı olabilirim?",
            "incoming"
          );
          chatbox.appendChild(welcomeMessage);
          scrollToBottom();
        }, 3500);
        setTimeout(() => { displayCategories(); }, 4500);
        buttonContainer.removeChild(yesButton);
        buttonContainer.removeChild(noButton);
      };

      // Hayır butonu
      const noButton = document.createElement("button");
      noButton.textContent = "Hayır";
      noButton.classList.add("fade-in", "decision-button");
      noButton.onclick = () => {
        chatbox.appendChild(createChatLi("Hayır", "outgoing"));
        scrollToBottom();
        setTimeout(() => {
          const goodbyeMessage = "İyi çalışmalar, kendine iyi bak.";
          chatbox.appendChild(createChatLi(goodbyeMessage, "incoming"));
          scrollToBottom();
        }, 1000);
        buttonContainer.removeChild(yesButton);
        buttonContainer.removeChild(noButton);
        setTimeout(() => {
          document.body.classList.remove("show-chatbot");
        }, 3000);
      };

      buttonContainer.appendChild(yesButton);
      buttonContainer.appendChild(noButton);
      scrollToBottom();
    }, 1000);
  }

  //Butonlarını temizleme
  const clearButtons = () => {
    const buttonContainer = document.querySelector(".button-container");
    if (buttonContainer) {
      buttonContainer.innerHTML = '';
    }
  };

  function scrollToBottom() {
    const chatbox = document.querySelector(".chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  let currentCategory = "";
  let currentSubcategory = "";

  function createBackButton() {
    let backButton = document.querySelector(".back-button");
    if (!backButton) {
      backButton = document.createElement("button");
      backButton.classList.add("back-button", "fade-in");

      const icon = document.createElement("i");
      icon.classList.add("material-icons");
      icon.textContent = "arrow_back";
  
      backButton.appendChild(icon);
  

      const buttonContainer = document.querySelector(".button-container") || createButtonContainer();
      buttonContainer.appendChild(backButton);
    }
  
    backButton.onclick = () => {
      if (currentSubcategory) {
        displaySubcategories(currentCategory);
      } else {
        displayCategories();
      }
    };

    const chatbox = document.querySelector(".chatbox");
    chatbox.appendChild(buttonContainer);
  }
  
  
});
