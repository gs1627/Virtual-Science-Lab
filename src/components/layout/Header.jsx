import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, User, X, Menu, Sparkles } from 'lucide-react';
import { experimentsData } from '../../data/experiments';

export default function Header({ searchQuery, setSearchQuery, onToggleMobileMenu }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = experimentsData.filter(
        (exp) =>
          exp.title.toLowerCase().includes(query.toLowerCase()) ||
          exp.subject.toLowerCase().includes(query.toLowerCase()) ||
          exp.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 mb-8 bg-white px-5 sm:px-6 py-4 rounded-2xl border border-slate-200 shadow-xs">
      {/* Left: Mobile Menu Button & Greeting */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 shrink-0 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 truncate leading-tight">
              Welcome to your Science Lab!
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Virtual Lab
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
            Explore. Experiment. Discover.
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative" ref={searchContainerRef}>
          <div
            className={`flex items-center h-10 rounded-xl transition-all duration-200 bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 ${
              searchOpen ? 'w-48 sm:w-64 md:w-72' : 'w-10'
            }`}
          >
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (searchOpen) {
                  handleSearch('');
                }
              }}
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors shrink-0 cursor-pointer"
              title="Search experiments"
            >
              {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
            {searchOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search all 8 experiments..."
                autoFocus
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none pr-3 min-w-0"
              />
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchOpen && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute right-0 top-12 w-72 sm:w-80 rounded-xl overflow-hidden z-50 border border-slate-200 bg-white shadow-xl"
              >
                <div className="px-3.5 py-2.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                  Experiments Found ({searchResults.length})
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => {
                        navigate(`/experiment/${exp.id}`);
                        setSearchOpen(false);
                        handleSearch('');
                      }}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {exp.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className={exp.subject === 'Physics' ? 'text-blue-600 font-medium' : 'text-violet-600 font-medium'}>
                            {exp.subject}
                          </span>{' '}
                          · {exp.difficulty} · {exp.estimatedTime}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600" />
          </button>

          <AnimatePresence>
            {notificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute right-0 top-12 w-72 rounded-xl p-3.5 z-50 border border-slate-200 bg-white shadow-xl"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
                  <span className="text-[11px] text-blue-600 font-semibold">1 new</span>
                </div>
                <div className="text-xs text-slate-600 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                  <p className="font-semibold text-blue-900">Virtual Science Lab Ready</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Explore all 8 interactive Physics & Chemistry virtual experiments!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 cursor-pointer shadow-xs bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all"
          title="Student Profile"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
