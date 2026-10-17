"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Bot, HelpCircle, PhoneCall, Check, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const PRESETS = [
  { label: "Check Payout Status", text: "How do I check the status of my vendor transfer?" },
  { label: "KYC Guidelines", text: "What documents do I need for Aadhaar and PAN verification?" },
  { label: "Card Rewards", text: "How do card rewards work?" },
  { label: "Support Limit", text: "What is the maximum limit per card transaction?" },
  { label: "Talk to Human", text: "I need to speak with a customer care representative." },
];

const BOT_RESPONSES: Record<string, string> = {
  "How do I check the status of my vendor transfer?": "You can view all transaction statuses on your Dashboard under 'Recent Transfers'. A green checkmark indicates a successful payout, which typically reaches the vendor's bank account within 2-5 minutes using multiple settlement options.",
  "What documents do I need for Aadhaar and PAN verification?": "You need your Aadhaar Number (linked to your mobile for OTP verification) and a PAN card. Verification is fully automated and takes less than 60 seconds to complete in our app.",
  "How do card rewards work?": "Continue enjoying eligible rewards, cashback, and benefits offered by your credit card issuer. Additional promotional offers may be available subject to applicable terms.",
  "What is the maximum limit per card transaction?": "The initial transaction limit is up to ₹2,00,000 per day for verified users. This limit can be enhanced by submitting tax returns or business registrations in the settings panel.",
  "I need to speak with a customer care representative.": "Connecting you to a Live Agent... A support specialist will chat with you shortly. You can also reach us via phone at 1800-360-PAYZ.",
};

let msgIdCounter = 0;
function createChatMessage(sender: "user" | "bot", text: string): ChatMessage {
  msgIdCounter += 1;
  const timeString = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return {
    id: `msg-${msgIdCounter}`,
    sender,
    text,
    timestamp: timeString,
  };
}

export default function ChatBotDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "bot",
      text: "Hello! I am your 360payZ Virtual Assistant. How can I help you secure your vendor payments today?",
      timestamp: "10:26 AM",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = createChatMessage("user", textToSend);
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate Bot response
    setTimeout(() => {
      const responseText = BOT_RESPONSES[textToSend] || "Thank you for reaching out. A support representative will review this request and assist you in a few moments.";
      const botMsg = createChatMessage("bot", responseText);
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
      {/* Quick Queries Board */}
      <div className="lg:col-span-1 flex flex-col justify-center space-y-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-primary tracking-widest">Self-Service</span>
          <h3 className="text-2xl font-bold text-neutral-900 mt-1">Instant Support Chatbot</h3>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            Ask any question to our assistant. Click one of the quick topics below to simulate a conversation.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              disabled={isTyping}
              onClick={() => handleSend(preset.text)}
              className="text-left w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-primary/40 transition-all text-xs text-neutral-800 font-semibold flex items-center gap-2 group shadow-sm disabled:opacity-50"
            >
              <MessageSquare className="h-4 w-4 text-primary group-hover:text-primary transition-colors flex-shrink-0" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window Mockup */}
      <div className="lg:col-span-2 flex flex-col h-[400px] border border-neutral-200 glass-panel rounded-3xl overflow-hidden shadow-xl relative">
        {/* Chat Header */}
        <div className="bg-neutral-50/50 border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">360payZ Assistant</h4>
              <span className="text-[10px] text-emerald-600 font-medium">Online • Our Agent</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-neutral-400 hover:text-neutral-900 cursor-pointer transition-colors">
            <PhoneCall className="h-4 w-4" />
          </div>
        </div>

        {/* Chat History */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start gap-2.5 max-w-[80%] ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold shadow-sm ${
                  m.sender === "user" ? "bg-primary text-white" : "bg-neutral-100 border border-neutral-200 text-primary"
                }`}>
                  {m.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div>
                  <div className={`rounded-2xl p-3.5 text-xs shadow-sm ${
                    m.sender === "user" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-tl-none"
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] text-neutral-400 block mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2.5 max-w-[80%]">
                <div className="h-7 w-7 rounded-full bg-neutral-100 border border-neutral-200 text-primary flex items-center justify-center flex-shrink-0 text-xs">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1 shadow-sm">
                  <div className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="bg-neutral-50 border-t border-neutral-200 p-4 flex gap-2 items-center"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping}
            placeholder="Type your message here..."
            className="flex-1 bg-white text-xs text-neutral-900 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary disabled:opacity-60 shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="h-10 w-10 bg-primary text-white rounded-xl hover:opacity-90 flex items-center justify-center transition-opacity disabled:opacity-40 shadow-md shadow-primary/20"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
