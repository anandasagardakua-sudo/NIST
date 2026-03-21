import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Calendar, 
  Trophy, 
  Briefcase, 
  Settings, 
  LogOut,
  Bell,
  Globe,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { View, Language, Student } from '../types';
import { LANGUAGES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setActiveView: (view: View) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  student: Student;
  onLogout: () => void;
}

export default function Layout({ 
  children, 
  activeView, 
  setActiveView, 
  language, 
  setLanguage, 
  student,
  onLogout 
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'ai', icon: Bot, label: 'AI Assistant' },
    { id: 'exams', icon: Calendar, label: 'Exams' },
    { id: 'sports', icon: Trophy, label: 'Sports Hub' },
    { id: 'internships', icon: Briefcase, label: 'Internships' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-nist-navy flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 glass z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-nist-gold flex items-center justify-center font-bold text-nist-navy">N</div>
          <span className="font-display font-bold tracking-tight">NIST PORTAL</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className={`
        fixed inset-0 z-40 md:relative md:flex flex-col w-64 glass border-r border-white/5 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-nist-gold flex items-center justify-center font-bold text-nist-navy text-xl shadow-lg shadow-nist-gold/20">N</div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none">NIST</h1>
            <p className="text-[10px] text-nist-gold font-bold tracking-widest uppercase mt-1">University</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as View);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${activeView === item.id 
                  ? 'bg-nist-gold text-nist-navy font-bold shadow-lg shadow-nist-gold/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-nist-navy' : 'group-hover:text-nist-gold'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 glass border-b border-white/5">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-display font-bold capitalize">{activeView.replace('-', ' ')}</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 glass rounded-full hover:bg-white/10 transition-all"
              >
                <Globe className="w-4 h-4 text-nist-gold" />
                <span className="text-sm font-medium uppercase">{language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 glass rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as Language);
                        setIsLangMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-nist-gold hover:text-nist-navy transition-colors flex justify-between items-center"
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] opacity-60">{lang.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative p-2 glass rounded-full hover:bg-white/10 transition-all group">
              <Bell className="w-5 h-5 group-hover:text-nist-gold" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-[10px] flex items-center justify-center rounded-full border-2 border-nist-navy">3</span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-bold leading-none">{student.name}</p>
                <p className="text-[10px] text-white/40 mt-1">{student.rollNo}</p>
              </div>
              <img src={student.photo} alt="Profile" className="w-10 h-10 rounded-full border-2 border-nist-gold p-0.5" />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden flex items-center justify-around p-2 glass border-t border-white/5">
          {navItems.slice(0, 5).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`p-3 rounded-xl transition-all ${activeView === item.id ? 'text-nist-gold bg-white/5' : 'text-white/40'}`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
