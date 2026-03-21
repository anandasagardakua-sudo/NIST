import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  Filter,
  ChevronRight,
  ChevronLeft,
  Timer
} from 'lucide-react';
import { Exam } from '../types';

interface ExamsProps {
  exams: Exam[];
}

export default function Exams({ exams }: ExamsProps) {
  const [filter, setFilter] = useState<'All' | 'Mid-Sem' | 'End-Sem' | 'Practical'>('All');
  const [countdown, setCountdown] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  const filteredExams = exams
    .filter(e => filter === 'All' || e.type === filter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextExam = exams
    .filter(e => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  useEffect(() => {
    if (!nextExam) return;

    const timer = setInterval(() => {
      const target = new Date(`${nextExam.date} ${nextExam.time}`).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown(null);
        clearInterval(timer);
      } else {
        setCountdown({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextExam]);

  const downloadICS = (exam: Exam) => {
    const startDate = exam.date.replace(/-/g, '') + 'T' + exam.time.replace(/[:\s]/g, '').substring(0, 4) + '00';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:NIST Exam: ${exam.subject}`,
      `DTSTART:${startDate}`,
      `LOCATION:${exam.venue}`,
      `DESCRIPTION:${exam.type} - ${exam.duration}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exam.subject}_exam.ics`;
    link.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gradient">Exam Schedule</h2>
        
        <div className="flex items-center gap-2 glass p-1 rounded-xl">
          {['All', 'Mid-Sem', 'End-Sem', 'Practical'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === t ? 'bg-nist-gold text-nist-navy' : 'text-white/60 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Countdown Hero */}
      {nextExam && countdown && (
        <div className="glass-gold rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Timer className="w-32 h-32" />
          </div>
          
          <div className="space-y-2 relative z-10 text-center md:text-left">
            <p className="text-nist-gold font-bold uppercase tracking-widest text-xs">Next Exam Countdown</p>
            <h3 className="text-3xl font-bold">{nextExam.subject}</h3>
            <div className="flex items-center justify-center md:justify-start gap-4 text-white/60">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(nextExam.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{nextExam.venue}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 relative z-10">
            {[
              { label: 'Days', value: countdown.d },
              { label: 'Hrs', value: countdown.h },
              { label: 'Min', value: countdown.m },
              { label: 'Sec', value: countdown.s },
            ].map(unit => (
              <div key={unit.label} className="flex flex-col items-center">
                <div className="w-16 h-16 glass bg-black/40 rounded-2xl flex items-center justify-center text-2xl font-bold border-nist-gold/30">
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] uppercase font-bold mt-2 text-nist-gold">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline View */}
      <div className="glass rounded-3xl p-6 overflow-x-auto custom-scrollbar">
        <div className="min-w-[800px] py-4">
          <div className="relative h-1 bg-white/10 rounded-full mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-nist-gold to-nist-accent opacity-20" />
            {filteredExams.map((exam, i) => {
              const isToday = new Date(exam.date).toDateString() === new Date().toDateString();
              const isPast = new Date(exam.date).getTime() < new Date().setHours(0,0,0,0);
              
              return (
                <div 
                  key={exam.id} 
                  className="absolute top-1/2 -translate-y-1/2 group"
                  style={{ left: `${(i / (filteredExams.length - 1)) * 100}%` }}
                >
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                    isToday ? 'bg-nist-gold border-white scale-150 animate-pulse' : 
                    isPast ? 'bg-white/20 border-transparent' : 'bg-nist-navy border-nist-gold'
                  }`} />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold text-nist-gold">{exam.subject}</p>
                    <p className="text-[8px] text-white/40">{exam.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map(exam => {
          const isToday = new Date(exam.date).toDateString() === new Date().toDateString();
          const isPast = new Date(exam.date).getTime() < new Date().setHours(0,0,0,0);
          
          return (
            <div 
              key={exam.id} 
              className={`glass rounded-3xl p-6 border-l-4 transition-all hover:scale-[1.02] ${
                isToday ? 'border-nist-gold bg-nist-gold/5' : 
                isPast ? 'border-white/10 opacity-60' : 'border-nist-accent'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${
                  isToday ? 'bg-nist-gold text-nist-navy' : 'bg-white/10 text-white/60'
                }`}>
                  {exam.type}
                </span>
                {isToday && <span className="flex h-2 w-2 rounded-full bg-nist-gold animate-ping" />}
              </div>

              <h3 className="text-xl font-bold mb-4">{exam.subject}</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Calendar className="w-4 h-4 text-nist-gold" />
                  <span>{new Date(exam.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Clock className="w-4 h-4 text-nist-gold" />
                  <span>{exam.time} ({exam.duration})</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <MapPin className="w-4 h-4 text-nist-gold" />
                  <span>{exam.venue}</span>
                </div>
              </div>

              <button 
                onClick={() => downloadICS(exam)}
                className="w-full mt-6 py-3 glass bg-white/5 hover:bg-nist-gold hover:text-nist-navy rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Download className="w-4 h-4" />
                Add to Calendar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
