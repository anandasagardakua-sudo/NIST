import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, Loader2, Bot, User, Languages, Copy, Check, Square } from 'lucide-react';
import { Student } from '../types';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface AIChatbotProps {
  student: Student;
  onShowProfile?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  lang: string;
}

const LANGUAGES = [
  { code: 'en', name: 'English', promptLang: 'English', ttsCode: 'en-US', voiceName: 'Puck' },
  { code: 'hi', name: 'Hindi', promptLang: 'Hindi', ttsCode: 'hi-IN', voiceName: 'Kore' },
  { code: 'or', name: 'Odia', promptLang: 'Odia', ttsCode: 'or-IN', voiceName: 'Charon' },
  { code: 'bn', name: 'Bengali', promptLang: 'Bengali', ttsCode: 'bn-IN', voiceName: 'Zephyr' },
  { code: 'te', name: 'Telugu', promptLang: 'Telugu', ttsCode: 'te-IN', voiceName: 'Fenrir' },
];

const getSuggestedQuestions = (student: Student) => {
  const questions = [
    "What is my CGPA?",
    "What is my overall attendance?",
    "What is my current semester?",
    "Can you show my profile?",
  ];

  return questions;
};

export const AIChatbot: React.FC<AIChatbotProps> = ({ student, onShowProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${student.name}! I am your AI Help Desk Assistant. You can ask me questions about your academic details, exams, internships, or sports.`,
      lang: 'en'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeLang, setActiveLang] = useState('en');
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startListening = () => {
    if (isListening) return;
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {
      // Ignore stop errors
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    
    const ttsCode = LANGUAGES.find(l => l.code === activeLang)?.ttsCode || 'en-US';
    recognitionRef.current.lang = ttsCode;

    recognitionRef.current.onstart = () => setIsListening(true);
    
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      if (event.error !== 'aborted') {
        console.error('Speech recognition error', event.error);
      }
      setIsListening(false);
    };

    recognitionRef.current.onend = () => setIsListening(false);
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const stopPlaying = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingMsgId(null);
  };

  const speakText = async (text: string, langCode: string, msgId: string) => {
    if (playingMsgId === msgId) {
      stopPlaying();
      return;
    }

    stopPlaying();
    setPlayingMsgId(msgId);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const voiceName = LANGUAGES.find(l => l.code === langCode)?.voiceName || 'Zephyr';
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
          },
        },
      });
      
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const buffer = audioCtx.createBuffer(1, bytes.length / 2, 24000);
        const channelData = buffer.getChannelData(0);
        const dataView = new DataView(bytes.buffer);
        
        for (let i = 0; i < bytes.length / 2; i++) {
          channelData[i] = dataView.getInt16(i * 2, true) / 32768.0;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        
        source.onended = () => {
          if (playingMsgId === msgId) {
            setPlayingMsgId(null);
          }
        };
        
        audioSourceRef.current = source;
        source.start();
        return;
      }
    } catch (error) {
      console.error('Gemini TTS error:', error);
    }

    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      setPlayingMsgId(null);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    const ttsCode = LANGUAGES.find(l => l.code === langCode)?.ttsCode || 'en-US';
    utterance.lang = ttsCode;
    utterance.onend = () => setPlayingMsgId(null);
    utterance.onerror = () => setPlayingMsgId(null);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, msgId: string) => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      console.warn('Clipboard API unavailable');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    if (text.toLowerCase().includes('profile') || text.toLowerCase().includes('profilre')) {
      if (onShowProfile) {
        onShowProfile();
      }
    }

    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      lang: activeLang
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const langName = LANGUAGES.find(l => l.code === activeLang)?.promptLang || 'English';
      
      const systemInstruction = `
        You are an AI university help desk assistant talking to a student.
        Here is the student's data:
        Name: ${student.name}
        Registration No: ${student.regNo}
        Roll No: ${student.rollNo}
        CGPA: ${student.cgpa}
        Attendance: ${student.attendance}%
        Branch: ${student.branch}
        Semester: ${student.semester}
        Section: ${student.section}

        Answer the student's question based ONLY on the provided data. Be helpful, concise, and polite.
        If the user asks to see their profile, tell them you have displayed it on the screen.
        IMPORTANT: You MUST respond in the ${langName} language.
        Format your response using Markdown for better readability.
      `;

      const contents = messages.map(m => ({
        role: m.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));
      
      contents.push({
        role: 'user',
        parts: [{ text: text }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const aiResponseText = response.text || "I'm sorry, I couldn't process that request.";
      
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        lang: activeLang
      };

      setMessages(prev => [...prev, newAiMsg]);
      
      // Auto-speak if voice interaction was used recently or if it's a helpful feature
      // speakText(aiResponseText, activeLang);
      
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm experiencing technical difficulties. Please try again later.",
        lang: 'en'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLanguageChange = async (newLangCode: string) => {
    if (newLangCode === activeLang) return;
    
    const prevLang = activeLang;
    setActiveLang(newLangCode);
    
    // Translate the last AI message if it exists
    const lastAiMsgIndex = [...messages].reverse().findIndex(m => m.sender === 'ai');
    if (lastAiMsgIndex !== -1) {
      const actualIndex = messages.length - 1 - lastAiMsgIndex;
      const msgToTranslate = messages[actualIndex];
      
      if (msgToTranslate.lang !== newLangCode) {
        setIsTyping(true);
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const langName = LANGUAGES.find(l => l.code === newLangCode)?.promptLang || 'English';
          
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{
              role: 'user',
              parts: [{ text: `Translate the following text to ${langName}. Only provide the translation, no extra text.\n\nText: ${msgToTranslate.text}` }]
            }]
          });
          
          if (response.text) {
            setMessages(prev => {
              const newMsgs = [...prev];
              newMsgs[actualIndex] = {
                ...newMsgs[actualIndex],
                text: response.text!,
                lang: newLangCode
              };
              return newMsgs;
            });
          }
        } catch (error) {
          console.error("Translation error:", error);
        } finally {
          setIsTyping(false);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">AI Help Desk</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask about your academic info</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-slate-400" />
          <select
            value={activeLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer outline-none"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-800">
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
            }`}>
              {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
              <div
                className={`px-4 py-2.5 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm shadow-sm'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                ) : (
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-1 mt-1">
                  {playingMsgId === msg.id ? (
                    <button
                      onClick={stopPlaying}
                      className="p-1.5 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/30"
                      title="Stop Reading"
                    >
                      <Square className="h-3.5 w-3.5 fill-current" />
                    </button>
                  ) : (
                    <button
                      onClick={() => speakText(msg.text, msg.lang, msg.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Read Aloud"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => copyToClipboard(msg.text, msg.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Copy to Clipboard"
                  >
                    {copiedMsgId === msg.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex gap-2">
            {getSuggestedQuestions(student).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`p-2.5 rounded-full transition-colors ${
              isListening
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            title="Voice Input"
          >
            {isListening ? (
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <Mic className="relative h-4 w-4" />
              </span>
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about your academic details..."
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400"
          />
          
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatbot;
