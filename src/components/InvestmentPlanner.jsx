import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateInvestmentPlan, calculateFutureValue, formatCurrency, generateProjections } from '../utils/financialCalculations';
import { TrendingUp, PieChart as PieChartIcon, Calendar, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const InvestmentPlanner = () => {
  const { userProfile } = useApp();
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [years, setYears] = useState('10');
  const [expectedReturn, setExpectedReturn] = useState('12');

  if (!userProfile) return null;

  const investment = parseFloat(monthlyInvestment) || 0;
  const yearsNum = parseInt(years) || 10;
  const returns = parseFloat(expectedReturn) || 12;

  const plan = calculateInvestmentPlan(investment, userProfile.riskAppetite);
  const futureValue10Yr = calculateFutureValue(investment, returns, 10);
  const futureValue20Yr = calculateFutureValue(investment, returns, 20);
  const futureValue30Yr = calculateFutureValue(investment, returns, 30);

  const projections = generateProjections(investment, returns, Math.min(yearsNum, 30));

  const pieData = Object.entries(plan).map(([name, value]) => ({
    name: name.replace(/([A-Z])/g, ' $1').trim(),
    value,
  }));

  const COLORS = ['#0ea5e9', '#d946ef', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6'];

  const availableCapacity = userProfile.monthlySavings;
  const recommended = Math.min(availableCapacity, investment || availableCapacity * 0.7);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white shadow-glow-lg">
        <h1 className="text-3xl font-bold mb-2">Investment Planner</h1>
        <p className="text-primary-100">Smart allocation based on your risk appetite</p>
      </div>

      {/* Input Section */}
      <div className="card p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary-600" />
          Investment Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Investment (₹)
            </label>
            <input
              type="number"
              className="input-custom"
              placeholder="Amount you want to invest"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Horizon (Years)
            </label>
            <input
              type="number"
              className="input-custom"
              placeholder="Investment period"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected Returns (%)
            </label>
            <input
              type="number"
              className="input-custom"
              placeholder="Annual return expectation"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl mt-6">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Your available investment capacity:</strong> {formatCurrency(availableCapacity)}/month
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
            <strong>Risk Appetite:</strong> {userProfile.riskAppetite}
          </p>
        </div>
      </div>

      {/* Investment Allocation */}
      <div className="card p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary-600" />
          Recommended Allocation
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {Object.entries(plan).map(([key, value], index) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Value Projections */}
      <div className="card p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Future Value Projections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
            <p className="text-sm opacity-90 mb-2">10 Years</p>
            <p className="text-xl sm:text-3xl font-bold mb-1 break-all">{formatCurrency(futureValue10Yr)}</p>
            <p className="text-xs opacity-75">
              Invested: {formatCurrency(investment * 12 * 10)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white">
            <p className="text-sm opacity-90 mb-2">20 Years</p>
            <p className="text-xl sm:text-3xl font-bold mb-1 break-all">{formatCurrency(futureValue20Yr)}</p>
            <p className="text-xs opacity-75">
              Invested: {formatCurrency(investment * 12 * 20)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white">
            <p className="text-sm opacity-90 mb-2">30 Years</p>
            <p className="text-xl sm:text-3xl font-bold mb-1 break-all">{formatCurrency(futureValue30Yr)}</p>
            <p className="text-xs opacity-75">
              Invested: {formatCurrency(investment * 12 * 30)}
            </p>
          </div>
        </div>

        {/* Growth Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projections}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="year" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
            />
            <Bar dataKey="amount" fill="#0ea5e9" radius={[8, 8, 0, 0]} name="Portfolio Value" />
            <Bar dataKey="invested" fill="#d946ef" radius={[8, 8, 0, 0]} name="Total Invested" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income Allocation */}
      {!monthlyInvestment && (
        <div className="card p-8">
          <h2 className="text-xl font-bold mb-6">Suggested Income Allocation (50:30:20 Rule)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-xl text-white text-center">
              <p className="text-sm opacity-90 mb-2">Needs (50%)</p>
              <p className="text-3xl font-bold mb-1">{formatCurrency(userProfile.monthlySalary * 0.5)}</p>
              <p className="text-xs opacity-75">Rent, Food, Utilities</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-xl text-white text-center">
              <p className="text-sm opacity-90 mb-2">Wants (30%)</p>
              <p className="text-3xl font-bold mb-1">{formatCurrency(userProfile.monthlySalary * 0.3)}</p>
              <p className="text-xs opacity-75">Entertainment, Shopping</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white text-center">
              <p className="text-sm opacity-90 mb-2">Investments (20%)</p>
              <p className="text-3xl font-bold mb-1">{formatCurrency(userProfile.monthlySalary * 0.2)}</p>
              <p className="text-xs opacity-75">Savings & Investments</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPlanner;