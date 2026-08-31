import { Bot, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as service from '../../services/chatService';

const welcome = { role: 'assistant', content: 'Bonjour ! Je suis votre assistant étudiant. Posez-moi une question sur votre parcours ou les cours.' };

export default function Chatbot({ studentId, isOpen, onClose }) {
  const [messages, setMessages] = useState([welcome]); 
  const [input, setInput] = useState(''); 
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const submit = async (event) => { 
    event.preventDefault(); 
    const message = input.trim(); 
    if (!message || loading  ) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setLoading(true);

    try {
      const response = await service.sendMessage({ studentId: studentId || 'default_id', message });
      const reply = response.data?.message || response.message || "Désolé, je n'ai pas pu obtenir de réponse.";
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: "Désolé, une erreur est survenue." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <section className="fixed bottom-20 right-4 z-40 flex h-[70vh] max-h-[550px] w-[calc(100vw-32px)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 bg-blue-600 px-4 py-3 text-white dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-semibold text-sm">EduInsight AI Assistant</h3>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-blue-700 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-slate-400">Chargement...</div>}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="border-t border-slate-200 p-3 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question..."
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <button type="submit" disabled={loading || !input.trim()} className="rounded-xl bg-blue-600 px-4 py-2 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-50">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}