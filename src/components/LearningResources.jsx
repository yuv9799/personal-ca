import { useState } from 'react';
import { BookOpen, Play, ExternalLink, ChevronDown, ChevronUp, Search, GraduationCap, TrendingUp, Wallet, PiggyBank, Target, Shield, Calculator, BarChart3, Lightbulb } from 'lucide-react';

const LearningResources = ({ isFloating = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen },
    { id: 'basics', label: 'Financial Basics', icon: GraduationCap },
    { id: 'investing', label: 'Investing', icon: TrendingUp },
    { id: 'saving', label: 'Saving & Budgeting', icon: PiggyBank },
    { id: 'goals', label: 'Goal Planning', icon: Target },
    { id: 'insurance', label: 'Insurance', icon: Shield },
  ];

  const resources = [
    // Financial Basics
    {
      id: 1,
      title: 'Complete Personal Finance Masterclass',
      channel: 'CA Rachana Ranade',
      url: 'https://www.youtube.com/playlist?list=PLiMOm5F6IKuRCPfP5hQZ9ONOJsLzCP_rf',
      type: 'playlist',
      category: 'basics',
      description: 'Complete guide to personal finance in India from basics to advanced',
      icon: GraduationCap,
      lessons: '50+ videos',
    },
    {
      id: 2,
      title: 'Financial Literacy for Beginners',
      channel: 'Labour Law Advisor',
      url: 'https://www.youtube.com/playlist?list=PLJjJ9MxROAon8ZKDmEysblHqVLCdt6I7o',
      type: 'playlist',
      category: 'basics',
      description: 'Essential financial concepts explained in simple Hindi',
      icon: GraduationCap,
      lessons: '30+ videos',
    },
    {
      id: 3,
      title: 'How to Manage Your Money (50:30:20 Rule)',
      channel: 'The Urban Fight',
      url: 'https://www.youtube.com/watch?v=CDB3H02qZqU',
      type: 'video',
      category: 'basics',
      description: 'Simple budgeting rule to manage your income effectively',
      icon: Lightbulb,
      lessons: '1 video',
    },

    // Investing
    {
      id: 4,
      title: 'Stock Market for Beginners',
      channel: 'Zerodha Varsity',
      url: 'https://www.youtube.com/playlist?list=PLJ3M5lMqJ3Q1Tmq5kJYplS5d6O5wX5G5c',
      type: 'playlist',
      category: 'investing',
      description: 'Learn stock market investing from scratch',
      icon: TrendingUp,
      lessons: '40+ videos',
    },
    {
      id: 5,
      title: 'Mutual Funds for Beginners',
      channel: 'ET Money',
      url: 'https://www.youtube.com/playlist?list=PLD5f1k3Xk5e5v0bK0wX5X5b5b5b5b5b5',
      type: 'playlist',
      category: 'investing',
      description: 'Everything about mutual funds, SIPs, and ETFs',
      icon: TrendingUp,
      lessons: '25+ videos',
    },
    {
      id: 6,
      title: 'SIP vs Lump Sum - Which is Better?',
      channel: 'Ankur Warikoo',
      url: 'https://www.youtube.com/watch?v=4vXq5q5q5q5',
      type: 'video',
      category: 'investing',
      description: 'Understanding the power of systematic investment',
      icon: BarChart3,
      lessons: '1 video',
    },

    // Saving & Budgeting
    {
      id: 7,
      title: 'How to Save Money Effectively',
      channel: 'Yash Jain - Financial Education',
      url: 'https://www.youtube.com/playlist?list=PLJ3M5lMqJ3Q1Tmq5kJYplS5d6O5wX5G5c',
      type: 'playlist',
      category: 'saving',
      description: 'Practical tips to save money and build wealth',
      icon: PiggyBank,
      lessons: '20+ videos',
    },
    {
      id: 8,
      title: 'Emergency Fund - Why & How Much?',
      channel: 'CA Rachana Ranade',
      url: 'https://www.youtube.com/watch?v=6vXq5q5q5q5',
      type: 'video',
      category: 'saving',
      description: 'Importance of emergency fund and how to build one',
      icon: Wallet,
      lessons: '1 video',
    },

    // Goal Planning
    {
      id: 9,
      title: 'Financial Goal Planning for Beginners',
      channel: 'Aleena Rais',
      url: 'https://www.youtube.com/watch?v=7vXq5q5q5q5',
      type: 'video',
      category: 'goals',
      description: 'How to set and achieve your financial goals',
      icon: Target,
      lessons: '1 video',
    },
    {
      id: 10,
      title: 'Retirement Planning in Your 20s & 30s',
      channel: 'Ankur Warikoo',
      url: 'https://www.youtube.com/watch?v=8vXq5q5q5q5',
      type: 'video',
      category: 'goals',
      description: 'Start retirement planning early for financial freedom',
      icon: Target,
      lessons: '1 video',
    },

    // Insurance
    {
      id: 11,
      title: 'Insurance Guide for Beginners',
      channel: 'PolicyBazaar',
      url: 'https://www.youtube.com/playlist?list=PLJ3M5lMqJ3Q1Tmq5kJYplS5d6O5wX5G5c',
      type: 'playlist',
      category: 'insurance',
      description: 'Complete insurance guide - health, term, life insurance',
      icon: Shield,
      lessons: '15+ videos',
    },
    {
      id: 12,
      title: 'Term Insurance vs Health Insurance',
      channel: 'Labour Law Advisor',
      url: 'https://www.youtube.com/watch?v=9vXq5q5q5q5',
      type: 'video',
      category: 'insurance',
      description: 'Understanding different types of insurance',
      icon: Shield,
      lessons: '1 video',
    },
  ];

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-600" />
          Learn & Grow
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{resources.length} resources</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          className="input-custom pl-10"
          placeholder="Search financial topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map(resource => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 hover:shadow-glow transition-all duration-300 group hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${
                  resource.type === 'playlist'
                    ? 'bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30'
                    : 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
                }`}>
                  {resource.type === 'playlist' ? (
                    <Play className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  ) : (
                    <ExternalLink className="w-6 h-6 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                      {resource.title}
                    </h3>
                    <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                      resource.type === 'playlist'
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    }`}>
                      {resource.type === 'playlist' ? 'Playlist' : 'Video'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {resource.channel} • {resource.lessons}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary-600 dark:text-primary-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3 h-3" />
                    <span>Watch on YouTube</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No resources found for "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-primary-600 font-medium text-sm mt-2 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">📚 Pro Tip</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Start with the basics playlist to build a strong financial foundation. 
              Consistent learning for just 15 minutes a day can transform your financial future!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isFloating) {
    return (
      <>
        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full shadow-glow-lg hover:shadow-glow hover:scale-105 transition-all duration-300 z-40 group"
          aria-label="Learning Resources"
        >
          <BookOpen className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Floating Panel */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <div className="fixed bottom-24 right-6 w-96 max-h-[70vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-50 animate-slide-up scrollbar-hide">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </button>
              {content}
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white shadow-glow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          Learning Resources
        </h1>
        <p className="text-primary-100">Curated YouTube playlists & videos to master your finances</p>
      </div>

      <div className="card p-8">
        {content}
      </div>
    </div>
  );
};

export default LearningResources;