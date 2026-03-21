import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  ChevronRight, 
  Plus,
  Activity,
  Medal,
  Image as ImageIcon
} from 'lucide-react';
import { Sport } from '../types';

interface SportsProps {
  sports: Sport[];
}

export default function Sports({ sports }: SportsProps) {
  const [selectedSport, setSelectedSport] = useState<Sport>(sports[0]);
  const [showRegForm, setShowRegForm] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gradient">Sports Hub</h2>
        <button 
          onClick={() => setShowRegForm(true)}
          className="px-6 py-3 bg-nist-gold text-nist-navy font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Register for Tryouts
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sports List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Categories</h3>
          {sports.map(sport => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                selectedSport.id === sport.id ? 'glass bg-nist-gold/20 text-nist-gold border-nist-gold/30' : 'glass hover:bg-white/5 text-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sport.icon}</span>
                <span className="font-bold">{sport.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedSport.id === sport.id ? 'rotate-90' : ''}`} />
            </button>
          ))}
        </div>

        {/* Sport Details */}
        <div className="lg:col-span-3 space-y-8">
          {/* Hero Section */}
          <div className="glass rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="text-9xl">{selectedSport.icon}</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-2">{selectedSport.name}</h3>
              <p className="text-white/40 max-w-md">Join the NIST {selectedSport.name} team and represent our university in inter-college championships.</p>
              
              <div className="flex gap-6 mt-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-nist-gold">{selectedSport.roster.length}</p>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Team Size</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-nist-gold">{selectedSport.matches.length}</p>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Matches</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Matches */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-nist-gold" />
                Match Schedule
              </h4>
              <div className="space-y-3">
                {selectedSport.matches.length > 0 ? selectedSport.matches.map((match, i) => (
                  <div key={i} className="glass rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold">vs {match.opponent}</p>
                      <p className="text-xs text-white/40">{new Date(match.date).toLocaleDateString()}</p>
                    </div>
                    {match.status === 'past' ? (
                      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                        {match.result}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-nist-gold bg-nist-gold/10 px-2 py-1 rounded-lg">
                        Upcoming
                      </span>
                    )}
                  </div>
                )) : (
                  <div className="glass rounded-2xl p-8 text-center text-white/20 italic">
                    No matches scheduled
                  </div>
                )}
              </div>
            </div>

            {/* Roster */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-nist-gold" />
                Team Roster
              </h4>
              <div className="glass rounded-3xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  {selectedSport.roster.length > 0 ? selectedSport.roster.map((player, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-nist-gold">
                        {player.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium">{player}</span>
                    </div>
                  )) : (
                    <div className="col-span-2 text-center text-white/20 italic py-4">
                      Roster not finalized
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements & Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-nist-gold" />
                Event Gallery
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square glass rounded-xl overflow-hidden group cursor-pointer">
                    <img 
                      src={`https://picsum.photos/seed/sport-${selectedSport.id}-${i}/300/300`} 
                      alt="Gallery" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <Medal className="w-5 h-5 text-nist-gold" />
                Achievements
              </h4>
              <div className="space-y-3">
                <div className="glass rounded-2xl p-4 flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-nist-gold" />
                  <div>
                    <p className="font-bold text-sm">Zonal Champions</p>
                    <p className="text-[10px] text-white/40">Inter-University 2025</p>
                  </div>
                </div>
                <div className="glass rounded-2xl p-4 flex items-center gap-3">
                  <Activity className="w-8 h-8 text-nist-accent" />
                  <div>
                    <p className="font-bold text-sm">Best Sportsmanship</p>
                    <p className="text-[10px] text-white/40">State Meet 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-nist-navy/80 backdrop-blur-md">
          <div className="glass rounded-3xl p-8 max-w-md w-full space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Sport Registration</h3>
              <button onClick={() => setShowRegForm(false)} className="p-2 hover:bg-white/10 rounded-full">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowRegForm(false); alert('Registration Submitted!'); }}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 uppercase">Select Sport</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 ring-nist-gold">
                  {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 uppercase">Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Pro'].map(l => (
                    <button key={l} type="button" className="py-2 glass rounded-lg text-xs hover:bg-nist-gold hover:text-nist-navy transition-all">{l}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 uppercase">Why do you want to join?</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 ring-nist-gold h-24 resize-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-nist-gold text-nist-navy font-bold rounded-xl hover:scale-[1.02] transition-all">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
