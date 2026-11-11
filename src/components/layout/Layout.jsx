import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] text-slate-800 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar (Desktop Sticky / Mobile Drawer) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onToggleMobileMenu={() => setMobileOpen(true)}
          />

          <div className="flex-1 w-full min-w-0">
            {typeof children === 'function' ? children({ searchQuery }) : children}
          </div>
        </div>
      </div>
    </div>
  );
}
