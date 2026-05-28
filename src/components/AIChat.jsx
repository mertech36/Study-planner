import { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";

const SYSTEM_PROMPT = `You are a helpful AI study assistant built into a student study planner app. 
You help students with:
- Study planning and scheduling
- Explaining difficult concepts
- Exam preparation tips
- Generating practice questions
- Motivating and encouraging students
Keep responses concise, friendly, and focused on studying. Use emojis occasionally to be engaging.
Always respond in the same language the student uses (Turkish or English).`;

function AIChat({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Merhaba! 👋 Bugün hangi konuda yardımcı olabilirim? Sınav hazırlığı, ders planlaması veya konu anlatımı için buradayım!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const dm = darkMode;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;

      if (!apiKey) {
        throw new Error("API key bulunamadı. .env dosyasını kontrol et.");
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages,
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data?.error?.message || `HTTP ${response.status}`;
        throw new Error(errMsg);
      }

      const reply = data.choices?.[0]?.message?.content;
      if (!reply) throw new Error("Boş yanıt geldi.");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

    } catch (err) {
      console.error("AIChat error:", err.message);

      let userMsg = "Bir hata oluştu, tekrar dene. 😕";

      if (err.message.includes("API key")) {
        userMsg = "⚠️ API anahtarı bulunamadı. .env dosyasında VITE_GROQ_API_KEY tanımlı mı?";
      } else if (err.message.includes("401") || err.message.includes("Invalid API Key")) {
        userMsg = "⚠️ API anahtarı geçersiz. Groq Console'dan kontrol et.";
      } else if (err.message.includes("429")) {
        userMsg = "⚠️ Çok fazla istek gönderildi. Biraz bekle ve tekrar dene.";
      } else if (err.message.includes("quota") || err.message.includes("rate_limit")) {
        userMsg = "⚠️ Günlük limit doldu. Biraz bekle veya yarın tekrar dene.";
      } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        userMsg = "⚠️ Bağlantı hatası. İnternet bağlantını kontrol et.";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: userMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "Sınav planı yap",
    "Pomodoro tekniği nedir?",
    "Beni motive et",
    "Soru üret",
  ];

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? dm ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"
            : "bg-gradient-to-br from-green-400 to-emerald-600 text-white"
        }`}
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      {/* CHAT PANEL */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 rounded-[24px] shadow-2xl border transition-all duration-300 flex flex-col overflow-hidden ${
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        } ${dm ? "bg-[#1a1f35] border-white/10" : "bg-white border-slate-200"}`}
        style={{ height: "480px" }}
      >
        {/* HEADER */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${dm ? "border-white/10" : "border-slate-100"}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-base">🤖</span>
          </div>
          <div>
            <p className={`text-sm font-bold ${dm ? "text-white" : "text-slate-900"}`}>AI Study Assistant</p>
            <p className={`text-xs ${dm ? "text-slate-400" : "text-slate-500"}`}>powered by Groq</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-br-sm"
                  : dm
                    ? "bg-white/10 text-slate-200 rounded-bl-sm"
                    : "bg-slate-100 text-slate-800 rounded-bl-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* LOADING DOTS */}
          {loading && (
            <div className="flex justify-start">
              <div className={`px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 ${dm ? "bg-white/10" : "bg-slate-100"}`}>
                {[0, 1, 2].map((i) => (
                  <div key={i}
                    className={`w-2 h-2 rounded-full animate-bounce ${dm ? "bg-slate-400" : "bg-slate-400"}`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* QUICK PROMPTS */}
        {messages.length <= 1 && (
          <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => { setInput(p); inputRef.current?.focus(); }}
                className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all hover:scale-105 ${
                  dm
                    ? "border-white/10 text-slate-400 hover:bg-white/10"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* INPUT */}
        <div className={`px-3 py-3 border-t flex gap-2 items-end ${dm ? "border-white/10" : "border-slate-100"}`}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bir şey sor..."
            rows={1}
            className={`flex-1 resize-none rounded-2xl px-3 py-2 text-sm outline-none border transition-all ${
              dm
                ? "bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-green-400"
                : "bg-slate-50 border-slate-200 text-slate-900 focus:border-green-400"
            }`}
            style={{ maxHeight: "80px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white flex items-center justify-center flex-shrink-0 hover:scale-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiSend size={15} />
          </button>
        </div>
      </div>
    </>
  );
}

export default AIChat;
