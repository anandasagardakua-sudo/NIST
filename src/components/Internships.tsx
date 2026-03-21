import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Filter, 
  Bell, 
  Sparkles,
  Search,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Loader2
} from 'lucide-react';
import { Internship, Language } from '../types';
import { LANGUAGES } from '../constants';

interface InternshipsProps {
  internships: Internship[];
  language: Language;
}

export default function Internships({ internships: initialInternships, language }: InternshipsProps) {
  const [internships, setInternships] = useState<Internship[]>(initialInternships);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});

  const filtered = internships.filter(i => {
    const matchesFilter = filter === 'All' || i.tags.includes(filter);
    const matchesSearch = i.company.toLowerCase().includes(search.toLowerCase()) || 
                          i.role.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleNotify = (id: string) => {
    setInternships(prev => prev.map(i => 
      i.id === id ? { ...i, isNotified: !i.isNotified } : i
    ));
  };

  const summarizeInternship = async (internship: Internship) => {
    setSummarizingId(internship.id);
    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey || '',
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 300,
          system: `Summarize this internship opportunity in ${LANGUAGES.find(l => l.code === language)?.name}. Keep it concise and professional.`,
          messages: [{ role: 'user', content: JSON.stringify(internship) }]
        })
      });

      const data = await response.json();
      setSummaries(prev => ({ ...prev, [internship.id]: data.content[0].text }));
    } catch (error) {
      console.error('Summary Error:', error);
      setSummaries(prev => ({ ...prev, [internship.id]: 'Failed to generate summary. Please check your API key.' }));
    } finally {
      setSummarizingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gradient">Internship Mail Center</h2>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 glass rounded-xl bg-white/5 border-white/10 focus:ring-1 ring-nist-gold outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2 glass p-1 rounded-xl">
            {['All', 'CSE', 'ECE', 'Remote'].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filter === t ? 'bg-nist-gold text-nist-navy' : 'text-white/60 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map(internship => (
          <div key={internship.id} className="glass rounded-3xl p-6 flex flex-col md:flex-row gap-6 hover:bg-white/10 transition-all group">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-2xl font-bold text-nist-gold shrink-0">
              {internship.company[0]}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-nist-gold transition-colors">{internship.role}</h3>
                  <p className="text-white/60 font-medium">{internship.company}</p>
                </div>
                <button 
                  onClick={() => toggleNotify(internship.id)}
                  className={`p-2 rounded-xl transition-all ${
                    internship.isNotified ? 'bg-nist-gold text-nist-navy' : 'glass hover:bg-white/10 text-white/40'
                  }`}
                >
                  <Bell className={`w-5 h-5 ${internship.isNotified ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <DollarSign className="w-3.5 h-3.5 text-nist-gold" />
                  <span>{internship.stipend}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Clock className="w-3.5 h-3.5 text-nist-gold" />
                  <span>{internship.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <MapPin className="w-3.5 h-3.5 text-nist-gold" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Calendar className="w-3.5 h-3.5 text-nist-gold" />
                  <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {internship.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-white/5 text-white/40 rounded-lg uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              {summaries[internship.id] && (
                <div className="p-4 bg-nist-gold/10 border border-nist-gold/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3 h-3 text-nist-gold" />
                    <span className="text-[10px] font-bold text-nist-gold uppercase tracking-widest">AI Summary</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">{summaries[internship.id]}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => summarizeInternship(internship)}
                  disabled={summarizingId === internship.id}
                  className="flex-1 py-2.5 glass bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {summarizingId === internship.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-nist-gold" />
                  )}
                  AI Summary
                </button>
                <button className="flex-1 py-2.5 bg-nist-gold text-nist-navy rounded-xl text-xs font-bold hover:scale-105 transition-all flex items-center justify-center gap-2">
                  Apply Now
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
