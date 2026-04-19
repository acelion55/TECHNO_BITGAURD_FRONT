import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import useStore from '../store/useStore';

const QUICK = [
  'What is my current portfolio value?',
  'Should I buy BTC now based on latest news?',
  'How much tax will I owe this year?',
  'Which lots should I sell to minimize tax?',
  'Am I in profit or loss on each lot?',
  'What is the current BTC market trend?',
  'How much have I invested so far?',
  'Explain my HIFO tax saving opportunity',
];

export default function ChatPage() {
  const { user, sendChat } = useStore();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `Hi ${user?.name || 'there'}! 👋 I'm BitGuard AI. I have full access to your portfolio data and can answer questions about your Bitcoin DCA strategy, tax optimization, and investment decisions. What would you like to know?`
    }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || thinking) return;
    setInput('');

    // Add user message immediately
    const updatedMessages = [...messages, { role: 'user', text: q }];
    setMessages(updatedMessages);
    setThinking(true);

    // Send to Gemini with history (exclude the initial greeting)
    const history = updatedMessages.slice(1); // skip system greeting
    const reply = await sendChat(q, history);

    setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    setThinking(false);
  };

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <div>
        <h1 className="text-white text-2xl font-bold">AI Chat</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Powered by Gemini 2.5 Flash • Live portfolio, tax data & BTC news
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[580px]">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'ai' && (
                <div className="w-7 h-7 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center shrink-0 mt-1">
                  <Bot size={13} className="text-orange-400" />
                </div>
              )}
              <div className={`max-w-sm lg:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'ai'
                  ? 'bg-zinc-800 text-zinc-200 rounded-tl-sm'
                  : 'bg-orange-500 text-white rounded-tr-sm ml-auto'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {thinking && (
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center shrink-0">
                <Bot size={13} className="text-orange-400" />
              </div>
              <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <Loader2 size={14} className="text-orange-400 animate-spin" />
                <span className="text-zinc-400 text-sm">Gemini is thinking...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <div className="px-4 pt-3 flex gap-2 flex-wrap border-t border-zinc-800">
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={thinking}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 px-3 py-1.5 rounded-full transition-colors mb-1"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask about your portfolio, tax, DCA strategy..."
            disabled={thinking}
            className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 placeholder:text-zinc-500 disabled:opacity-50"
          />
          <button
            onClick={() => send()}
            disabled={thinking || !input.trim()}
            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors"
          >
            {thinking ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
