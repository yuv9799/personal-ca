import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Calculator, 
  TrendingUp, 
  Target, 
  MessageSquare, 
  Wallet, 
  Shield, 
  Settings, 
  Moon,
  Sun,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const Sidebar = ({ currentPage, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { darkMode, toggleDarkMode, userProfile, resetProfile } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'affordability', label: 'Can I Afford This?', icon: Calculator },
    { id: 'investments', label: 'Investment Planner', icon: TrendingUp },
    { id: 'wealth-simulator', label: 'Wealth Simulator', icon: TrendingUp },
    { id: 'goals', label: 'Goal Planner', icon: Target },
    // { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    // { id: 'networth', label: 'Net Worth', icon: Wallet },
    // { id: 'emergency', label: 'Emergency Fund', icon: Shield },
  ];

  const bottomMenuItems = [
    { id: 'learn', label: 'Learn & Grow', icon: BookOpen },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold">
              PC
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg gradient-text">Personal CA</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Financial OS</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'sidebar-link-active'
                    : 'sidebar-link'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}

          {/* Learn Section Separator */}
          {!isCollapsed && (
            <div className="pt-4 pb-2">
              <div className="flex items-center gap-2 px-4">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Resources</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          )}

          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'sidebar-link-active'
                    : 'sidebar-link'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl sidebar-link"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {!isCollapsed && <span className="font-medium">Toggle Theme</span>}
          </button>

          {/* Reset Profile */}
          <button
            onClick={resetProfile}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl sidebar-link text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Reset Profile</span>}
          </button>

          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl sidebar-link"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!isCollapsed && <span className="font-medium">Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;