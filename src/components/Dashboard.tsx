import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ChevronRight,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { Student, Exam } from '../types';

interface DashboardProps {
  student: Student;
  upcomingExams: Exam[];
}

export default function Dashboard({ student, upcomingExams }: DashboardProps) {
  const attendanceColor = student.attendance >= 75 ? 'text-green-400' : student.attendance >= 65 ? 'text-yellow-400' : 'text-red-400';
  const attendanceBg = student.attendance >= 75 ? 'bg-green-400/20' : student.attendance >= 65 ? 'bg-yellow-400/20' : 'bg-red-400/20';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gradient">Welcome back, {student.name.split(' ')[0]}!</h2>
          <p className="text-white/40 mt-2">Here's what's happening in your academic journey today.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-nist-gold/20 rounded-lg">
              <Clock className="w-5 h-5 text-nist-gold" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold">Current Time</p>
              <p className="font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Warning */}
      {student.attendance < 75 && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
          <div className="p-2 bg-red-500/20 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h4 className="font-bold text-red-500">Low Attendance Warning</h4>
            <p className="text-sm text-red-500/80">Your attendance is currently {student.attendance}%. You need at least 75% to be eligible for exams.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 glass rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-nist-gold/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-nist-gold/10 transition-all duration-700" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            <div className="relative">
              <img src={student.photo} alt={student.name} className="w-32 h-32 rounded-3xl object-cover border-4 border-white/10 shadow-2xl" />
              <div className="absolute -bottom-2 -right-2 bg-nist-gold text-nist-navy p-1.5 rounded-xl shadow-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{student.name}</h3>
                <p className="text-nist-gold font-medium">{student.branch}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="glass bg-white/5 p-3 rounded-xl">
                  <p className="text-[10px] text-white/40 uppercase font-bold">Roll Number</p>
                  <p className="font-bold text-sm">{student.rollNo}</p>
                </div>
                <div className="glass bg-white/5 p-3 rounded-xl">
                  <p className="text-[10px] text-white/40 uppercase font-bold">Registration</p>
                  <p className="font-bold text-sm">{student.regNo}</p>
                </div>
                <div className="glass bg-white/5 p-3 rounded-xl">
                  <p className="text-[10px] text-white/40 uppercase font-bold">Semester</p>
                  <p className="font-bold text-sm">{student.semester}th Sem (Sec {student.section})</p>
                </div>
              </div>
            </div>

            {/* CGPA Ring */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle 
                    cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (student.cgpa / 10) * 251.2}
                    className="text-nist-gold transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
                  {student.cgpa}
                </div>
              </div>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">CGPA</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
          <div className="glass rounded-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${attendanceBg}`}>
                <Users className={`w-6 h-6 ${attendanceColor}`} />
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase font-bold">Attendance</p>
                <p className={`text-2xl font-bold ${attendanceColor}`}>{student.attendance}%</p>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-white/10" />
          </div>

          <div className="glass rounded-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-nist-accent/20">
                <BookOpen className="w-6 h-6 text-nist-accent" />
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase font-bold">Courses</p>
                <p className="text-2xl font-bold text-nist-accent">6 Active</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/10" />
          </div>
        </div>
      </div>

      {/* Upcoming Exams Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-nist-gold" />
            Upcoming Exams
          </h3>
          <button className="text-sm text-nist-gold hover:underline">View Schedule</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingExams.slice(0, 4).map(exam => (
            <div key={exam.id} className="glass rounded-2xl p-5 hover:bg-white/10 transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold px-2 py-1 bg-nist-gold/20 text-nist-gold rounded-lg uppercase">
                  {exam.type}
                </span>
                <Clock className="w-4 h-4 text-white/20 group-hover:text-nist-gold transition-colors" />
              </div>
              <h4 className="font-bold mb-1 line-clamp-1">{exam.subject}</h4>
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <MapPin className="w-3 h-3" />
                  <span>{exam.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
