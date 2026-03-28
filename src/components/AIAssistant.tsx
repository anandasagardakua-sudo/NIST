import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Loader2, Bot, User, Languages, Copy, Check, Square, GraduationCap } from 'lucide-react';
import { Student } from '../types';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  lang: string;
  isVoiceToVoice?: boolean;
}

const LANGUAGES = [
  { code: 'en', name: 'English', promptLang: 'English', ttsCode: 'en-US' },
  { code: 'hi', name: 'Hindi', promptLang: 'Hindi', ttsCode: 'hi-IN' },
  { code: 'or', name: 'Odia', promptLang: 'Odia', ttsCode: 'en-IN' }, // Fallback to regional EN if OR is unavailable in browser
  { code: 'bn', name: 'Bengali', promptLang: 'Bengali', ttsCode: 'bn-IN' },
  { code: 'te', name: 'Telugu', promptLang: 'Telugu', ttsCode: 'te-IN' },
];

export const AIChatbot: React.FC<{ student: Student; onShowProfile?: () => void }> = ({ student, onShowProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: `Namaste ${student.name}! I am your University AI Assistant. How can I help you with your exams, sports, or profile?`, lang: 'en' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeLang, setActiveLang] = useState('en');
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- Speech Recognition (Voice to Text) ---
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported in this browser.");

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = LANGUAGES.find(l => l.code === activeLang)?.ttsCode || 'en-US';
    recognitionRef.current.continuous = false;
    
    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript, true); // Send with V2V flag
    };
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
  };

  // --- Speech Synthesis (Text to Voice) ---
  const speakText = (text: string, langCode: string, msgId: string) => {
    window.speechSynthesis.cancel();
    if (playingMsgId === msgId) {
      setPlayingMsgId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const lang = LANGUAGES.find(l => l.code === langCode);
    utterance.lang = lang?.ttsCode || 'en-US';
    utterance.onstart = () => setPlayingMsgId(msgId);
    utterance.onend = () => setPlayingMsgId(null);
    window.speechSynthesis.speak(utterance);
  };

  // --- AI Brain (Gemini 1.5 Flash) ---
  const handleSendMessage = async (text: string = inputText, isVoiceInput: boolean = false) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text, lang: activeLang };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Fallback local response for browser demo
      const lowerText = text.toLowerCase();
      let responseText = "I'm here to help! Ask me about exams, sports, internships, or your profile.";

      if (lowerText.includes('profile')) {
        responseText = `Showing your profile now: ${student.name}, ${student.branch}, CGPA ${student.cgpa.toFixed(2)}, Attendance ${student.attendance}%.`;
        if (onShowProfile) onShowProfile();
      } else if (lowerText.includes('exam')) {
        responseText = `Mid-Sem exams begin Oct 20, End-Sem begin Dec 15. Keep your revision strong.`;
      } else if (lowerText.includes('sports')) {
        responseText = `Annual Sports Meet is in January; cricket trials next Monday.`;
      } else if (lowerText.includes('intern')) {
        responseText = `TPO has openings for ${student.branch} at Google and Infosys. Apply soon.`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        lang: activeLang,
      };

      setMessages(prev => [...prev, aiMsg]);

      if (isVoiceInput) {
        speakText(responseText, activeLang, aiMsg.id);
      }

    } catch (error) {
      console.error('Chatbot Error:', error);
      setMessages(prev => [...prev, { id: (Date.now()+2).toString(), sender: 'ai', text: 'There was an error processing your request. Please try again.', lang: activeLang }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-4">
      {/* Premium Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <h3 className="font-bold leading-none">Uni-AI Help Desk</h3>
            <span className="text-[10px] uppercase tracking-widest opacity-80">24/7 Digital Assistant</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/10">
          <Languages size={14} />
          <select 
            value={activeLang} 
            onChange={(e) => setActiveLang(e.target.value)}
            className="bg-transparent text-xs font-bold outline-none cursor-pointer"
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code} className="text-black">{l.name}</option>)}
          </select>
        </div>
      </div>

      {/* Chat Space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-950/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600' : 'bg-emerald-500'}`}>
                {msg.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'}`}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                {msg.sender === 'ai' && (
                  <button 
                    onClick={() => speakText(msg.text, msg.lang, msg.id)}
                    className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {playingMsgId === msg.id ? <><Square size={12} fill="currentColor" /> Stop Audio</> : <><Volume2 size={12} /> Play Audio</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 items-center text-slate-400 text-xs animate-pulse">
            <Loader2 size={14} className="animate-spin" /> AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 ring-1 ring-inset ring-slate-200 dark:ring-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <button 
            onClick={isListening ? () => {} : startListening}
            className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            <Mic size={20} />
          </button>
          <input 
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-sm py-2 dark:text-white"
            placeholder="Ask about marks, sports, or exams..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2 bg-indigo-600 text-white rounded-full disabled:opacity-30 hover:bg-indigo-700 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;