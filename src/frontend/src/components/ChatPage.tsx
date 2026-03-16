import { Button } from "@/components/ui/button";
import { Bot, Send, Settings, Wifi } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "../App";
import { useGetSession, useSaveSession } from "../hooks/useQueries";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: number;
}

const KEYWORD_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ["hello", "hi", "salam", "assalam", "hey"],
    response: "Assalam o Alaikum! Main aapki kaise madad kar sakta hoon? 😊",
  },
  {
    keywords: ["help"],
    response:
      "Main aapke sawaalon ka jawab dene ke liye yahan hoon. Koi bhi sawaal poochein! Aap price, services, ya kisi bhi topic ke baare mein pooch sakte hain.",
  },
  {
    keywords: ["bye", "goodbye", "alvida", "khuda hafiz"],
    response: "Khuda Hafiz! Dobara milte hain. Aapka din acha guzre! 👋",
  },
  {
    keywords: ["price", "qeemat", "cost", "rate", "pricing"],
    response:
      "Hamare pricing ke baare mein jaanney ke liye admin se contact karein. Aap settings mein ja kar admin details dekh sakte hain.",
  },
  {
    keywords: ["thanks", "shukriya", "thank you", "shukria", "thank"],
    response:
      "Koi baat nahi! Kuch aur help chahiye? Main hamesha available hoon. 🙏",
  },
  {
    keywords: ["name", "naam", "kaun", "who", "aap kaun"],
    response:
      "Main ek AI Assistant hoon jo aapki madad ke liye yahan hoon. Aap mujhse koi bhi sawaal pooch sakte hain!",
  },
  {
    keywords: ["kaam", "kya karta", "service", "feature"],
    response:
      "Main customer support, information dena, aur aapke sawaalon ka jawab dene mein help kar sakta hoon. Kya specifically jaanna chahte hain?",
  },
];

const DEFAULT_FALLBACK =
  "Mujhe samajh nahi aaya. Kripya dobara likhein ya 'help' type karein.";

function getAgentResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const entry of KEYWORD_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }
  return DEFAULT_FALLBACK;
}

function getOrCreateSessionId(): bigint {
  let stored = localStorage.getItem("chat_session_id");
  if (!stored) {
    const id = BigInt(Math.floor(Math.random() * 1_000_000_000));
    stored = id.toString();
    localStorage.setItem("chat_session_id", stored);
  }
  return BigInt(stored);
}

function getAgentSettings() {
  return {
    name: localStorage.getItem("agent_name") || "AI Assistant",
    welcome:
      localStorage.getItem("agent_welcome") ||
      "Assalam o Alaikum! Main aapka AI Assistant hoon. Aap mujhse koi bhi sawaal pooch sakte hain. 'help' type karein agar kuch jaanna ho.",
  };
}

interface Props {
  onNavigate: (page: Page) => void;
}

export default function ChatPage({ onNavigate }: Props) {
  const [sessionId] = useState<bigint>(getOrCreateSessionId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentSettings] = useState(getAgentSettings);
  const [initialized, setInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useGetSession(sessionId);
  const saveSession = useSaveSession();

  // Initialize messages from session or welcome message
  useEffect(() => {
    if (initialized) return;
    const welcome: ChatMessage = {
      id: "welcome",
      role: "agent",
      content: agentSettings.welcome,
      timestamp: Date.now(),
    };
    if (session?.messages && session.messages.length > 0) {
      const loaded: ChatMessage[] = session.messages.map((m, i) => ({
        id: `loaded-${i}`,
        role: m.role as "user" | "agent",
        content: m.content,
        timestamp: Number(m.timestamp),
      }));
      setMessages(loaded);
    } else {
      setMessages([welcome]);
    }
    setInitialized(true);
  }, [session, initialized, agentSettings.welcome]);

  // Auto-scroll to bottom — deps are intentional scroll triggers
  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollRef.current mutation is a DOM side-effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isTyping]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(
      () => {
        const agentMsg: ChatMessage = {
          id: `agent-${Date.now()}`,
          role: "agent",
          content: getAgentResponse(text),
          timestamp: Date.now(),
        };
        const finalMessages = [...newMessages, agentMsg];
        setMessages(finalMessages);
        setIsTyping(false);

        saveSession.mutate({
          id: sessionId,
          messages: finalMessages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: BigInt(m.timestamp),
          })),
        });
      },
      1000 + Math.random() * 500,
    );
  }, [input, isTyping, messages, sessionId, saveSession]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString("ur-PK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-10">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-card" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-semibold text-foreground text-base leading-tight truncate">
            {agentSettings.name}
          </h1>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary font-medium">Online</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          data-ocid="chat.admin_button"
          onClick={() => onNavigate("admin")}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3"
        data-ocid="chat.list"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={
                msg.role === "user"
                  ? { opacity: 0, x: 20 }
                  : { opacity: 0, x: -20 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              data-ocid={`chat.item.${index + 1}`}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "agent" && (
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center mr-2 mt-auto mb-1 flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[75%] sm:max-w-[65%] ${
                  msg.role === "user" ? "items-end" : "items-start"
                } flex flex-col gap-1`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl shadow-bubble text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card text-foreground rounded-bl-sm border border-border"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex justify-start"
              data-ocid="chat.loading_state"
            >
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center mr-2 mt-auto mb-1 flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-bubble">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-border bg-card/80 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-2.5 border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Apna sawaal likhein..."
            disabled={isTyping}
            data-ocid="chat.input"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            data-ocid="chat.submit_button"
            className="w-8 h-8 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 flex-shrink-0 glow-teal transition-all"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
