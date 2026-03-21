import React, { useState, useEffect } from 'react';
import { View, Language, Student } from './types';
import { MOCK_STUDENT, MOCK_EXAMS, MOCK_SPORTS, MOCK_INTERNSHIPS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import Exams from './components/Exams';
import Sports from './components/Sports';
import Internships from './components/Internships';
import Login from './components/Login';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [student, setStudent] = useState<Student>(MOCK_STUDENT);

  // Persistence (Mock)
  useEffect(() => {
    const savedAuth = localStorage.getItem('nist_auth');
    if (savedAuth) {
      const data = JSON.parse(savedAuth);
      setStudent(prev => ({ ...prev, ...data }));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (data: { regNo: string; rollNo: string; name: string }) => {
    const updatedStudent = { ...MOCK_STUDENT, ...data };
    setStudent(updatedStudent);
    setIsLoggedIn(true);
    localStorage.setItem('nist_auth', JSON.stringify(data));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('nist_auth');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout
      activeView={activeView}
      setActiveView={setActiveView}
      language={language}
      setLanguage={setLanguage}
      student={student}
      onLogout={handleLogout}
    >
      {activeView === 'dashboard' && (
        <Dashboard student={student} upcomingExams={MOCK_EXAMS} />
      )}
      {activeView === 'ai' && (
        <AIAssistant student={student} onShowProfile={() => setActiveView('dashboard')} />
      )}
      {activeView === 'exams' && (
        <Exams exams={MOCK_EXAMS} />
      )}
      {activeView === 'sports' && (
        <Sports sports={MOCK_SPORTS} />
      )}
      {activeView === 'internships' && (
        <Internships internships={MOCK_INTERNSHIPS} language={language} />
      )}
      {activeView === 'settings' && (
        <div className="flex items-center justify-center h-full text-white/20 italic">
          Settings module coming soon...
        </div>
      )}
    </Layout>
  );
}

