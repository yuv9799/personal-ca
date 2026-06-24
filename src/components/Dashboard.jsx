import { useApp } from '../context/AppContext';
import { calculateFinancialHealthScore, calculateNetWorth, formatCurrency } from '../utils/financialCalculations';
import { TrendingUp, Wallet, PiggyBank, Target, Shield, AlertTriangle, ChevronRight, BookOpen, Play, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { userProfile } = useApp();
  
  if (!userProfile) return null;

  const healthScore = calculateFinancialHealthScore(userProfile);
  const netWorth = calculateNetWorth(userProfile);
  
  const savingsRate = ((userProfile.monthlySavings / userProfile.monthlySalary) * 100).toFixed(1);
  const emergencyFundMonths = userProfile.monthlyExpenses.total > 0 
    ? (userProfile.savings.emergency / userProfile.monthlyExpenses.total).toFixed(1) 
    : 0;

  const chartData = [
    { month: 'Jan', savings: 10000, investments: 5000 },
    { month: 'Feb', savings: 15000, investments: 8000 },
    { month: 'Mar', savings: 22000, investments: 12000 },
    { month: 'Apr', savings: 28000, investments: 18000 },
    { month: 'May', savings: 35000, investments: 25000 },
    { month: 'Jun', savings: 42000, investments: 32000 },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="card p-6 hover:shadow-glow transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">{title}</p>
          <p className="text-3xl font-bold gradient-text text-balance-all number-fixed">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl flex-shrink-0 ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white shadow-glow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name} 👋</h1>
        <p className="text-primary-100">Here's your financial overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Savings"
          value={formatCurrency(userProfile.monthlySavings)}
          subtitle={`${savingsRate}% of salary`}
          icon={PiggyBank}
          color="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatCard
          title="Net Worth"
          value={formatCurrency(netWorth.netWorth)}
          subtitle={`${formatCurrency(netWorth.totalAssets)} assets`}
          icon={Wallet}
          color="bg-gradient-to-br from-blue-500 to-cyan-600"
        />
        <StatCard
          title="Emergency Fund"
          value={`${emergencyFundMonths} months`}
          subtitle={formatCurrency(userProfile.savings.emergency)}
          icon={Shield}
          color="bg-gradient-to-br from-purple-500 to-pink-600"
        />
        <StatCard
          title="Financial Goals"
          value={userProfile.goals?.length || 0}
          subtitle="Active goals"
          icon={Target}
          color="bg-gradient-to-br from-orange-500 to-red-600"
        />
      </div>

      {/* Financial Health Score */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary-600" />
          Financial Health Score
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <svg className="w-48 h-48 progress-ring">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                  r="80"
                  cx="96"
                  cy="96"
                />
                <circle
                  className="text-primary-600 progress-ring-circle"
                  strokeWidth="12"
                  strokeDasharray={502}
                  strokeDashoffset={502 - (502 * healthScore.score) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="80"
                  cx="96"
                  cy="96"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold gradient-text">{healthScore.score}</span>
                <span className="text-gray-600 dark:text-gray-400">/100</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {healthScore.strengths.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {healthScore.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {healthScore.improvements.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Needs Improvement
                </h3>
                <ul className="space-y-2">
                  {healthScore.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold mb-6">Wealth Growth Projection</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Line type="monotone" dataKey="savings" stroke="#0ea5e9" strokeWidth={3} name="Total Savings" />
            <Line type="monotone" dataKey="investments" stroke="#d946ef" strokeWidth={3} name="Investments" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 hover:shadow-glow cursor-pointer transition-all duration-300 card-hover">
          <h3 className="font-bold text-lg mb-2">Can I Afford This?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Check if your next purchase fits your budget</p>
          <span className="text-primary-600 font-medium text-sm flex items-center gap-1">
            Try Now <ChevronRight className="w-4 h-4" />
          </span>
        </div>
        
        <div className="card p-6 hover:shadow-glow cursor-pointer transition-all duration-300 card-hover">
          <h3 className="font-bold text-lg mb-2">Investment Planner</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Get personalized investment recommendations</p>
          <span className="text-primary-600 font-medium text-sm flex items-center gap-1">
            Plan Now <ChevronRight className="w-4 h-4" />
          </span>
        </div>
        
        <div className="card p-6 hover:shadow-glow cursor-pointer transition-all duration-300 card-hover">
          <h3 className="font-bold text-lg mb-2">Goal Tracker</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Track progress towards your financial goals</p>
          <span className="text-primary-600 font-medium text-sm flex items-center gap-1">
            View Goals <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;