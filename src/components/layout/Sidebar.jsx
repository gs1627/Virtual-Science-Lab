import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Atom,
  FlaskConical,
  Beaker,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Microscope,
  X,
  Compass,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/physics', label: 'Physics Lab', icon: Atom, count: '4' },
  { to: '/chemistry', label: 'Chemistry Lab', icon: FlaskConical, count: '4' },
  { to: '/experiments', label: 'All Experiments', icon: Beaker },
  { to: '/progress', label: 'My Progress', icon: TrendingUp },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const handleLinkClick = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const navContent = (isMobile = false) => {
    const isCollapsed = isMobile ? false : collapsed;
    return (
      <div className="flex flex-col h-full bg-white select-none">
        {/* Logo Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 h-20 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
              }}
            >
              <Microscope className="w-5 h-5 text-white" />
            </div>
            {(!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                className="overflow-hidden"
              >
                <h1 className="text-sm font-bold text-slate-900 whitespace-nowrap leading-tight tracking-tight">
                  Virtual Science Lab
                </h1>
                <p className="text-[11px] text-blue-600 font-semibold tracking-wide">
                  Interactive Platform
                </p>
              </motion.div>
            )}
          </div>

          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          {(!isCollapsed || isMobile) && (
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
          )}

          {navItems.map((item) => {
            const isActive =
              item.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.to);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                className="block relative group"
              >
                <div
                  className={`flex items-center justify-between rounded-xl transition-all duration-150 ${isCollapsed ? 'justify-center px-0 py-3' : 'px-3.5 py-2.5'
                    } ${isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                    />
                    {(!isCollapsed || isMobile) && (
                      <span className="text-sm whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {(!isCollapsed || isMobile) && item.count && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isActive
                        ? 'bg-blue-200/60 text-blue-800'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>

                {/* Desktop hover tooltip when collapsed */}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs text-white bg-slate-900 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Lab Shortcut Card */}
        {(!isCollapsed || isMobile) && (
          <div className="mx-3 mb-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 mb-1.5">
              <Compass className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">Virtual Lab v2.0</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              8 interactive Physics & Chemistry virtual simulations available.
            </p>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        {!isMobile && (
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center py-2.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Collapse Menu</span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:flex flex-col sticky top-0 h-screen shrink-0 transition-all duration-200 z-40 select-none bg-white border-r border-slate-200 shadow-xs ${collapsed ? 'w-[76px]' : 'w-[260px]'
          }`}
      >
        {navContent(false)}
      </aside>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 lg:hidden bg-white shadow-xl border-r border-slate-200"
            >
              {navContent(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
