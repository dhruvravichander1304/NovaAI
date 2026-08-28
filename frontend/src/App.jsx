import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = "https://novaai-iczh.onrender.com";

const USER_NAME =
  localStorage.getItem("lunaUserName") || "Dhruv";


// =========================================================
// ICONS
// =========================================================

function Icon({ type, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "send":
      return (
        <svg {...common}>
          <path d="M21 3L10 14" />
          <path d="M21 3l-7 18-4-7-7-4 18-7z" />
        </svg>
      );

    case "paperclip":
      return (
        <svg {...common}>
          <path d="M21.4 11.6l-8.8 8.8a6 6 0 01-8.5-8.5l9.2-9.2a4 4 0 015.7 5.7l-9.2 9.2a2 2 0 01-2.8-2.8l8.5-8.5" />
        </svg>
      );

    case "mic":
      return (
        <svg {...common}>
          <rect
            x="9"
            y="3"
            width="6"
            height="11"
            rx="3"
          />
          <path d="M5 11a7 7 0 0014 0" />
          <path d="M12 18v3" />
          <path d="M8 21h8" />
        </svg>
      );

    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 010 18" />
          <path d="M12 3a14 14 0 000 18" />
        </svg>
      );

    case "file":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8M8 17h6" />
        </svg>
      );

    case "code":
      return (
        <svg {...common}>
          <path d="M8 9l-4 3 4 3" />
          <path d="M16 9l4 3-4 3" />
          <path d="M14 5l-4 14" />
        </svg>
      );

    case "sparkles":
      return (
        <svg {...common}>
          <path d="M12 3l1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3z" />
          <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15z" />
        </svg>
      );

    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M10 11v6M14 11v6" />
          <path d="M6 7l1 14h10l1-14" />
          <path d="M9 7V4h6v3" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V20h-2.5v-.2a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 008 15a1.7 1.7 0 00-1.6-1H6v-2.5h.4A1.7 1.7 0 008 10a1.7 1.7 0 00-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 001.9.3 1.7 1.7 0 001-1.6V5h2.5v.2a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 00-.3 1.9 1.7 1.7 0 001.6 1h.4V14h-.4a1.7 1.7 0 00-1.6 1z" />
        </svg>
      );

    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 21a7 7 0 0114 0" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );

    case "x":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );

    case "volume":
      return (
        <svg {...common}>
          <path d="M11 5L6 9H3v6h3l5 4V5z" />
          <path d="M15 9a4 4 0 010 6" />
          <path d="M18 7a7 7 0 010 10" />
        </svg>
      );

    case "stop":
      return (
        <svg {...common}>
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            rx="2"
          />
        </svg>
      );

    default:
      return null;
  }
}


// =========================================================
// DRAGON LOGO
// =========================================================

function DragonLogo({ small = false }) {
  return (
    <div
      className={`dragon-logo ${
        small ? "dragon-small" : ""
      }`}
    >
      <img
        src="/dragon-logo.PNG"
        alt="Luna"
      />
    </div>
  );
}


// =========================================================
// THINKING
// =========================================================

function Thinking() {
  return (
    <div className="thinking-wrap">

      <DragonLogo small />

      <div className="thinking-bubble">

        <span>
          Luna is thinking
        </span>

        <div className="thinking-dots">
          <i />
          <i />
          <i />
        </div>

      </div>

    </div>
  );
}


// =========================================================
// APP
// =========================================================

function App() {

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [documentLoaded, setDocumentLoaded] =
    useState(false);

  const [documentName, setDocumentName] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [recentChats, setRecentChats] =
    useState(["New conversation"]);

  const [isListening, setIsListening] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [voiceSupported, setVoiceSupported] =
    useState(true);


  const recognitionRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const fileInputRef =
    useRef(null);

  const textareaRef =
    useRef(null);

  const inputRef =
    useRef("");


  // =======================================================
  // KEEP INPUT REF UPDATED
  // =======================================================

  useEffect(() => {

    inputRef.current = input;

  }, [input]);


  // =======================================================
  // VOICE RECOGNITION
  // =======================================================

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

      setVoiceSupported(false);

      return;

    }


    const recognition =
      new SpeechRecognition();


    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";


    recognition.onstart = () => {

      setIsListening(true);

    };


    // =====================================================
    // AUTOMATICALLY SEND WHEN SPEAKING ENDS
    // =====================================================

    recognition.onend = () => {

      setIsListening(false);


      setTimeout(() => {

        const currentText =
          inputRef.current.trim();


        if (
          currentText &&
          !loading
        ) {

          handleSend(
            currentText
          );

        }

      }, 500);

    };


    recognition.onerror = (event) => {

      console.error(
        "Voice recognition error:",
        event.error
      );

      setIsListening(false);

    };


    recognition.onresult = (event) => {

      let finalTranscript = "";


      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        const transcript =
          event.results[i][0].transcript;


        if (
          event.results[i].isFinal
        ) {

          finalTranscript +=
            transcript;

        }

      }


      if (finalTranscript) {

        setInput((previous) => {

          const separator =
            previous.trim()
              ? " "
              : "";


          return (
            previous +
            separator +
            finalTranscript.trim()
          );

        });


        setTimeout(() => {

          resizeTextarea();

        }, 0);

      }

    };


    recognitionRef.current =
      recognition;


    return () => {

      try {

        recognition.stop();

      } catch {}

    };

  }, [loading]);


  // =======================================================
  // GET BEST AVAILABLE VOICE
  // =======================================================

  function getBestVoice() {

    if (
      !("speechSynthesis" in window)
    ) {

      return null;

    }


    const voices =
      window.speechSynthesis.getVoices();


    if (!voices.length) {

      return null;

    }


    const preferredNames = [

      "Samantha",

      "Karen",

      "Daniel",

      "Google UK English Female",

      "Google UK English Male",

      "Google US English",

      "Microsoft Zira",

      "Microsoft Jenny",

      "Microsoft Aria",

      "Microsoft Guy",

      "Alex",

    ];


    for (
      const preferredName
      of preferredNames
    ) {

      const match =
        voices.find(
          (voice) =>
            voice.name
              .toLowerCase()
              .includes(
                preferredName.toLowerCase()
              )
        );


      if (match) {

        return match;

      }

    }


    const british =
      voices.find(
        (voice) =>
          voice.lang ===
          "en-GB"
      );


    if (british) {

      return british;

    }


    const american =
      voices.find(
        (voice) =>
          voice.lang ===
          "en-US"
      );


    if (american) {

      return american;

    }


    const english =
      voices.find(
        (voice) =>
          voice.lang?.startsWith(
            "en"
          )
      );


    return (
      english ||
      voices[0]
    );

  }


  // =======================================================
  // SPEAK LUNA
  // =======================================================

  function speakLuna(text) {

    if (
      !("speechSynthesis" in window)
    ) {

      alert(
        "Voice playback is not supported in this browser."
      );

      return;

    }


    window.speechSynthesis.cancel();


    const cleanText =
      text
        .replace(
          /[*_#`]/g,
          ""
        )
        .replace(
          /$begin:math:display$\(\.\*\?\)$end:math:display$$begin:math:text$\.\*\?$end:math:text$/g,
          "$1"
        )
        .replace(
          /https?:\/\/\S+/g,
          ""
        );


    const utterance =
      new SpeechSynthesisUtterance(
        cleanText
      );


    const voice =
      getBestVoice();


    if (voice) {

      utterance.voice =
        voice;

    }


    utterance.lang =
      voice?.lang ||
      "en-US";


    utterance.rate =
      0.92;

    utterance.pitch =
      1.0;

    utterance.volume =
      1.0;


    utterance.onstart = () => {

      setIsSpeaking(true);

    };


    utterance.onend = () => {

      setIsSpeaking(false);

    };


    utterance.onerror = () => {

      setIsSpeaking(false);

    };


    window.speechSynthesis.speak(
      utterance
    );

  }


  // =======================================================
  // STOP LUNA
  // =======================================================

  function stopLunaSpeaking() {

    if (
      "speechSynthesis" in window
    ) {

      window.speechSynthesis.cancel();

    }


    setIsSpeaking(false);

  }


  // =======================================================
  // MICROPHONE
  // =======================================================

  function toggleVoice() {

    if (!voiceSupported) {

      alert(
        "Voice input is not supported in this browser. Try Chrome or Safari."
      );

      return;

    }


    const recognition =
      recognitionRef.current;


    if (!recognition) {

      return;

    }


    if (isListening) {

      try {

        recognition.stop();

      } catch {}

      setIsListening(false);

      return;

    }


    stopLunaSpeaking();


    try {

      recognition.start();

    } catch (error) {

      console.error(
        "Could not start microphone:",
        error
      );

    }

  }


  // =======================================================
  // DOCUMENT STATUS
  // =======================================================

  useEffect(() => {

    checkDocumentStatus();

  }, []);


  async function checkDocumentStatus() {

    try {

      const response =
        await fetch(
          `${API_URL}/document-status`
        );


      if (!response.ok) {

        return;

      }


      const data =
        await response.json();


      setDocumentLoaded(
        Boolean(
          data.document_loaded
        )
      );


      setDocumentName(
        data.document_name ||
        ""
      );

    } catch {

      console.log(
        "Luna backend status unavailable."
      );

    }

  }


  // =======================================================
  // AUTO SCROLL
  // =======================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    messages,
    loading,
  ]);


  // =======================================================
  // NEW CHAT
  // =======================================================

  function newChat() {

    stopLunaSpeaking();

    setMessages([]);

    setInput("");


    setRecentChats(
      (previous) => {

        const updated = [

          "New conversation",

          ...previous.filter(
            (item) =>
              item !==
              "New conversation"
          ),

        ];


        return updated.slice(
          0,
          8
        );

      }
    );

  }


  // =======================================================
  // RECENT QUESTIONS
  // =======================================================

  function addRecentQuestion(
    question
  ) {

    setRecentChats(
      (previous) => {

        const filtered =
          previous.filter(
            (item) =>
              item !==
              "New conversation"
          );


        const shortened =
          question.length > 32
            ? question.substring(
                0,
                32
              ) + "..."
            : question;


        return [

          shortened,

          ...filtered,

        ].slice(
          0,
          8
        );

      }
    );

  }


  // =======================================================
  // SEND MESSAGE
  // =======================================================

  async function handleSend(
    customMessage = null
  ) {

    const question =
      (
        customMessage ??
        input
      ).trim();


    if (
      !question ||
      loading
    ) {

      return;

    }


    // Stop microphone

    if (isListening) {

      try {

        recognitionRef.current?.stop();

      } catch {}

      setIsListening(false);

    }


    stopLunaSpeaking();


    const userMessage = {

      role: "user",

      content:
        question,

    };


    setMessages(
      (previous) => [

        ...previous,

        userMessage,

      ]
    );


    setInput("");

    inputRef.current = "";

    setLoading(true);


    if (textareaRef.current) {

      textareaRef.current.style.height =
        "auto";

    }


    addRecentQuestion(
      question
    );


    try {

      const response =
        await fetch(
          `${API_URL}/chat`,
          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify({

                message:
                  question,

                history:
                  messages.map(
                    (
                      message
                    ) => ({

                      role:
                        message.role,

                      content:
                        message.content,

                    })
                  ),

              }),

          }
        );


      if (!response.ok) {

        throw new Error(
          "Backend request failed"
        );

      }


      const data =
        await response.json();


      const lunaResponse =
        data.response ||
        "I couldn't generate a response.";


      setMessages(
        (previous) => [

          ...previous,

          {

            role:
              "assistant",

            content:
              lunaResponse,

            sources:
              data.sources ||
              [],

            web_search_used:
              data.web_search_used ||
              false,

            document_used:
              data.document_used ||
              false,

          },

        ]
      );


      // ===============================================
      // LUNA SPEAKS
      // ===============================================

      setTimeout(() => {

        speakLuna(
          lunaResponse
        );

      }, 200);


    } catch (error) {

      console.error(error);


      setMessages(
        (previous) => [

          ...previous,

          {

            role:
              "assistant",

            content:
              "I couldn't connect to Luna's backend. Please make sure your FastAPI server is running on port 8000.",

            sources: [],

          },

        ]
      );

    } finally {

      setLoading(false);

    }

  }


  // =======================================================
  // KEYBOARD
  // =======================================================

  function handleKeyDown(event) {

    if (
      event.key ===
        "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSend();

    }

  }


  // =======================================================
  // TEXTAREA
  // =======================================================

  function resizeTextarea() {

    const textarea =
      textareaRef.current;


    if (!textarea) {

      return;

    }


    textarea.style.height =
      "auto";


    textarea.style.height =
      Math.min(
        textarea.scrollHeight,
        170
      ) + "px";

  }


  // =======================================================
  // PDF UPLOAD
  // =======================================================

  async function handleFileUpload(
    event
  ) {

    const file =
      event.target.files?.[0];


    if (!file) {

      return;

    }


    if (
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {

      alert(
        "Please upload a PDF file."
      );

      return;

    }


    setUploading(true);


    const formData =
      new FormData();


    formData.append(
      "file",
      file
    );


    try {

      const response =
        await fetch(
          `${API_URL}/upload`,
          {

            method:
              "POST",

            body:
              formData,

          }
        );


      const data =
        await response.json();


      if (!data.success) {

        alert(
          data.message ||
            "The PDF could not be uploaded."
        );

        return;

      }


      setDocumentLoaded(true);


      setDocumentName(
        data.filename ||
          file.name
      );


      setMessages(
        (previous) => [

          ...previous,

          {

            role:
              "assistant",

            content:
              `I've loaded **${
                data.filename ||
                file.name
              }**. Ask me to summarize it, explain a section, find information, compare ideas, or give you useful insights from the document.`,

            document_used:
              true,

            sources: [],

          },

        ]
      );

    } catch (error) {

      console.error(error);


      alert(
        "Could not connect to Luna's backend."
      );

    } finally {

      setUploading(false);


      if (fileInputRef.current) {

        fileInputRef.current.value =
          "";

      }

    }

  }


  // =======================================================
  // CLEAR DOCUMENT
  // =======================================================

  async function clearDocument() {

    try {

      await fetch(
        `${API_URL}/clear-document`,
        {

          method:
            "POST",

        }
      );

    } catch (error) {

      console.error(error);

    }


    setDocumentLoaded(false);

    setDocumentName("");


    setMessages(
      (previous) => [

        ...previous,

        {

          role:
            "assistant",

          content:
            "The document has been cleared. I'm back in normal AI mode.",

          sources: [],

        },

      ]
    );

  }


  // =======================================================
  // SUGGESTION
  // =======================================================

  function useSuggestion(
    text
  ) {

    setInput(text);

    inputRef.current = text;


    setTimeout(() => {

      textareaRef.current?.focus();

    }, 50);

  }


  // =======================================================
  // FORMAT TEXT
  // =======================================================

  function formatText(text) {

    if (!text) {

      return null;

    }


    return text
      .split("\n")
      .map(
        (
          line,
          index,
          array
        ) => (

          <React.Fragment
            key={index}
          >

            {line}

            {index <
              array.length -
                1 && (
              <br />
            )}

          </React.Fragment>

        )
      );

  }


  // =======================================================
  // GREETINGS
  // =======================================================

  const greetings = [

    `Hi ${USER_NAME}, what's the move?`,

    `Hey ${USER_NAME}, how are we moving?`,

    `Hi ${USER_NAME}, what are we figuring out?`,

    `Hey ${USER_NAME}, what's next?`,

    `Good to see you, ${USER_NAME}. What's on your mind?`,

  ];


  const greeting =
    greetings[
      new Date().getDate() %
        greetings.length
    ];


  // =======================================================
  // RETURN UI
  // =======================================================

  return (

    <div className="app-shell">


      {/* AURORA */}

      <div className="aurora-background">

        <div className="aurora aurora-one" />

        <div className="aurora aurora-two" />

        <div className="aurora aurora-three" />

        <div className="aurora aurora-four" />

      </div>


      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`}
      >

        <div className="sidebar-top">

          <div className="brand">

            <DragonLogo />

            <div className="brand-name">

              <span>
                Luna
              </span>

              <small>
                AI
              </small>

            </div>

          </div>


          <button
            className="new-chat-button"
            onClick={newChat}
          >

            <Icon
              type="plus"
              size={19}
            />

            <span>
              New chat
            </span>

          </button>

        </div>


        <div className="recent-section">

          <div className="section-label">
            RECENT
          </div>


          <div className="recent-list">

            {recentChats.map(
              (
                chat,
                index
              ) => (

                <button
                  className={`recent-chat ${
                    index === 0
                      ? "active-recent"
                      : ""
                  }`}
                  key={`${chat}-${index}`}
                >

                  {chat}

                </button>

              )
            )}

          </div>

        </div>


        <div className="sidebar-bottom">


          {documentLoaded && (

            <div className="document-mini">

              <div className="document-mini-icon">

                <Icon
                  type="file"
                  size={17}
                />

              </div>


              <div className="document-mini-text">

                <strong>
                  Document loaded
                </strong>

                <span>
                  {documentName}
                </span>

              </div>


              <button
                className="document-clear"
                onClick={
                  clearDocument
                }
              >

                <Icon
                  type="x"
                  size={15}
                />

              </button>

            </div>

          )}


          <button
            className="sidebar-link"
          >

            <Icon
              type="settings"
              size={18}
            />

            <span>
              Settings
            </span>

          </button>


          <button
            className="sidebar-link"
          >

            <Icon
              type="user"
              size={18}
            />

            <span>
              Account
            </span>

          </button>


        </div>

      </aside>


      {/* MAIN */}

      <main className="main-area">


        {/* TOPBAR */}

        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(
                (previous) =>
                  !previous
              )
            }
          >

            <Icon
              type="menu"
              size={21}
            />

          </button>


          <div className="topbar-title">
            Luna
          </div>


          <div className="model-selector">

            <span className="status-dot" />

            <span>
              GPT-OSS
            </span>

            <span className="chevron">
              ▾
            </span>

          </div>

        </header>


        {/* CHAT */}

        <section className="chat-area">


          {messages.length === 0 ? (

            <div className="welcome-screen">


              <div className="welcome-dragon">

                <DragonLogo />

              </div>


              <h1>
                {greeting}
              </h1>


              <p className="welcome-subtitle">

                I'm here to help you
                research, create,
                analyze, code, and
                think through ideas.

              </p>


              <div className="quick-actions">


                <button
                  onClick={() =>
                    useSuggestion(
                      "Explain something to me"
                    )
                  }
                >

                  <span className="action-icon purple">

                    <Icon
                      type="sparkles"
                      size={21}
                    />

                  </span>


                  <span>

                    <strong>
                      Explain
                    </strong>

                    <small>
                      something
                    </small>

                  </span>


                  <Icon
                    type="arrow"
                    size={16}
                  />

                </button>


                <button
                  onClick={() =>
                    useSuggestion(
                      "Research this topic on the web"
                    )
                  }
                >

                  <span className="action-icon blue">

                    <Icon
                      type="globe"
                      size={21}
                    />

                  </span>


                  <span>

                    <strong>
                      Research
                    </strong>

                    <small>
                      the web
                    </small>

                  </span>


                  <Icon
                    type="arrow"
                    size={16}
                  />

                </button>


                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >

                  <span className="action-icon cyan">

                    <Icon
                      type="file"
                      size={21}
                    />

                  </span>


                  <span>

                    <strong>
                      Analyze
                    </strong>

                    <small>
                      a file
                    </small>

                  </span>


                  <Icon
                    type="arrow"
                    size={16}
                  />

                </button>


                <button
                  onClick={() =>
                    useSuggestion(
                      "Help me write some code"
                    )
                  }
                >

                  <span className="action-icon pink">

                    <Icon
                      type="code"
                      size={21}
                    />

                  </span>


                  <span>

                    <strong>
                      Write
                    </strong>

                    <small>
                      code
                    </small>

                  </span>


                  <Icon
                    type="arrow"
                    size={16}
                  />

                </button>


              </div>

            </div>

          ) : (

            <div className="messages-container">


              {messages.map(
                (
                  message,
                  index
                ) => (

                  <div
                    className={`message-row ${
                      message.role ===
                      "user"
                        ? "user-row"
                        : "assistant-row"
                    }`}
                    key={index}
                  >


                    {message.role ===
                    "assistant" ? (

                      <div
                        className={
                          isSpeaking
                            ? "luna-speaking-logo"
                            : ""
                        }
                      >

                        <DragonLogo small />

                      </div>

                    ) : (

                      <div className="user-avatar">

                        {USER_NAME
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                    )}


                    <div
                      className={`message-content ${
                        message.role ===
                        "user"
                          ? "user-message"
                          : "assistant-message"
                      }`}
                    >


                      <div className="message-name">

                        {message.role ===
                        "user"
                          ? "You"
                          : "Luna"}

                      </div>


                      <div className="message-text">

                        {formatText(
                          message.content
                        )}

                      </div>


                      {message.role ===
                        "assistant" && (

                        <div className="voice-response-controls">


                          {isSpeaking ? (

                            <button
                              className="speak-response-button speaking"
                              onClick={
                                stopLunaSpeaking
                              }
                            >

                              <Icon
                                type="stop"
                                size={14}
                              />

                              <span>
                                Stop
                              </span>

                            </button>

                          ) : (

                            <button
                              className="speak-response-button"
                              onClick={() =>
                                speakLuna(
                                  message.content
                                )
                              }
                            >

                              <Icon
                                type="volume"
                                size={15}
                              />

                              <span>
                                Speak
                              </span>

                            </button>

                          )}


                        </div>

                      )}


                      {message.web_search_used &&
                        message.sources
                          ?.length > 0 && (

                          <div className="sources">


                            <div className="sources-title">

                              <Icon
                                type="globe"
                                size={15}
                              />

                              Sources

                            </div>


                            {message.sources.map(
                              (
                                source,
                                sourceIndex
                              ) => (

                                <a
                                  key={
                                    sourceIndex
                                  }
                                  href={
                                    source.url
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="source-card"
                                >

                                  <span>
                                    {
                                      source.title
                                    }
                                  </span>


                                  <Icon
                                    type="arrow"
                                    size={14}
                                  />

                                </a>

                              )
                            )}


                          </div>

                        )}

                    </div>

                  </div>

                )
              )}


              {loading && (
                <Thinking />
              )}


              <div
                ref={
                  messagesEndRef
                }
              />

            </div>

          )}

        </section>


        {/* COMPOSER */}

        <div className="composer-wrapper">


          {documentLoaded && (

            <div className="document-banner">


              <div className="document-banner-left">


                <div className="document-banner-icon">

                  <Icon
                    type="file"
                    size={16}
                  />

                </div>


                <div>

                  <strong>
                    {documentName}
                  </strong>

                  <span>
                    Luna is using
                    this document
                  </span>

                </div>


              </div>


              <button
                className="clear-document-button"
                onClick={
                  clearDocument
                }
              >

                <Icon
                  type="trash"
                  size={15}
                />

                Clear

              </button>


            </div>

          )}


          <div className="composer">


            <textarea
              ref={textareaRef}
              value={input}
              rows={1}
              disabled={loading}
              placeholder={
                documentLoaded
                  ? "Ask Luna about your document..."
                  : "Ask Luna anything..."
              }
              onChange={(event) => {

                setInput(
                  event.target.value
                );

                inputRef.current =
                  event.target.value;

                resizeTextarea();

              }}
              onKeyDown={
                handleKeyDown
              }
            />


            <div className="composer-bottom">


              <div className="composer-tools">


                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  onChange={
                    handleFileUpload
                  }
                />


                <button
                  className="composer-tool"
                  disabled={
                    uploading ||
                    loading
                  }
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  title="Attach PDF"
                >

                  <Icon
                    type="paperclip"
                    size={19}
                  />

                </button>


                {/* MICROPHONE */}

                <button
                  className={`composer-tool voice-button ${
                    isListening
                      ? "voice-listening"
                      : ""
                  }`}
                  disabled={
                    loading
                  }
                  onClick={
                    toggleVoice
                  }
                  title={
                    isListening
                      ? "Stop listening"
                      : "Speak to Luna"
                  }
                >

                  <Icon
                    type="mic"
                    size={20}
                  />

                </button>


                {isListening && (

                  <span className="voice-status">

                    Listening...

                  </span>

                )}


                {uploading && (

                  <span className="uploading-text">

                    Uploading PDF...

                  </span>

                )}


              </div>


              <button
                className="send-button"
                disabled={
                  !input.trim() ||
                  loading
                }
                onClick={() =>
                  handleSend()
                }
              >

                <Icon
                  type="send"
                  size={19}
                />

              </button>


            </div>

          </div>


          <div className="disclaimer">

            <span className="disclaimer-dot" />

            Luna can make mistakes.
            Check important
            information.

          </div>


        </div>


      </main>

    </div>

  );
}


export default App;