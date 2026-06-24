import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateProjections, formatCurrency } from '../utils/financialCalculations';
import { TrendingUp, Sliders } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const WealthSimulator = () => {
  const { userProfile } = useApp();
  const [monthlyInvestment, setMonthlyInvestment] = useState(userProfile?.monthlySavings?.toString() || '15000');
  const [annualReturn, setAnnualReturn] = useState('12');
  const [salaryGrowth, setSalaryGrowth] = useState('10');
  const [years, setYears] = useState('20');

  if (!userProfile) return null;

  const investment = parseFloat(monthlyInvestment) || 0;
  const returns = parseFloat(annualReturn) || 12;
  const growth = parseFloat(salaryGrowth) / 100 || 0.1;
  const yearsNum = parseInt(years) || 20;

  const projections = generateProjections(investment, returns, yearsNum, growth);

  const finalAmount = projections[projections.length - 1]?.amount || 0;
  const totalInvested = projections[projections.length - 1]?.invested || 0;
  const totalReturns = finalAmount - totalInvested;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white shadow-glow-lg">
        <h1 className="text-3xl font-bold mb-2">Wealth Growth Simulator</h1>
        <p className="text-primary-100">Visualize your financial future with interactive projections</p>
      </div>

      {/* Controls */}
      <div className="card p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-primary-600" />
          Simulation Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Investment (₹)
            </label>
            <input
              type="number"
              className="input-custom"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              className="input-custom"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Annual Salary Growth (%)
            </label>
            <input
              type="number"
              className="input-custom"
              value={salaryGrowth}
              onChange={(e) => setSalaryGrowth(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Horizon (Years)
            </label>
            <input
              type="number"
              className="input-custom"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <p className="text-sm opacity-90 mb-2">Final Portfolio Value</p>
          <p className="text-3xl font-bold mb-1">{formatCurrency(finalAmount)}</p>
          <p className="text-xs opacity-75">After {yearsNum} years</p>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <p className="text-sm opacity-90 mb-2">Total Invested</p>
          <p className="text-3xl font-bold mb-1">{formatCurrency(totalInvested)}</p>
          <p className="text-xs opacity-75">Your contributions</p>
        </div>

        <div className="card p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <p className="text-sm opacity-90 mb-2">Wealth Generated</p>
          <p className="text-3xl font-bold mb-1">{formatCurrency(totalReturns)}</p>
          <p className="text-xs opacity-75">From compounding returns</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          Growth Projection
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={projections}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="year" 
              stroke="#9ca3af"
              label={{ value: 'Years', position: 'insideBottom', offset: -10, fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#9ca3af"
              tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#0ea5e9" 
              strokeWidth={3} 
              name="Portfolio Value"
              dot={{ fill: '#0ea5e9', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="invested" 
              stroke="#d946ef" 
              strokeWidth={3} 
              name="Total Invested"
              dot={{ fill: '#d946ef', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Milestone Table */}
      <div className="card p-8">
        <h2 className="text-xl font-bold mb-6">Key Milestones</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Year</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Invested</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Returns</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {[5, 10, 15, 20].map((year) => {
                const data = projections.find(p => p.year === year);
                if (!data) return null;
                const returns = data.amount - data.invested;
                return (
                  <tr key={year} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="py-3 px-4 text-sm font-medium">Year {year}</td>
                    <td className="py-3 px-4 text-sm text-right">{formatCurrency(data.invested)}</td>
                    <td className="py-3 px-4 text-sm text-right text-green-600 dark:text-green-400">+{formatCurrency(returns)}</td>
                    <td className="py-3 px-4 text-sm text-right font-bold">{formatCurrency(data.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WealthSimulator;