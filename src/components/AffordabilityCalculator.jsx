import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateAffordability, formatCurrency } from '../utils/financialCalculations';
import { Calculator, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const AffordabilityCalculator = () => {
  const { userProfile } = useApp();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!price || !userProfile) return;

    const affordability = calculateAffordability(
      parseFloat(price),
      userProfile.monthlySalary,
      userProfile.monthlySavings,
      userProfile.monthlyExpenses.total
    );

    setResult({ ...affordability, productName });
  };

  const getRecommendationColor = (rec) => {
    switch(rec) {
      case 'Highly Recommended': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200';
      case 'Recommended': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200';
      case 'Consider': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
      case 'Caution': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200';
      case 'Not Recommended': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200';
    }
  };

  const getRecommendationIcon = (rec) => {
    switch(rec) {
      case 'Highly Recommended':
      case 'Recommended': return <CheckCircle className="w-6 h-6" />;
      case 'Consider':
      case 'Caution': return <AlertCircle className="w-6 h-6" />;
      case 'Not Recommended': return <XCircle className="w-6 h-6" />;
      default: return <AlertCircle className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white shadow-glow-lg">
        <h1 className="text-3xl font-bold mb-2">Can I Afford This?</h1>
        <p className="text-primary-100">Make informed purchasing decisions based on your financial health</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary-600" />
            Enter Purchase Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What do you want to buy?
              </label>
              <input
                type="text"
                className="input-custom"
                placeholder="e.g., iPhone 15, MacBook, Vacation to Goa"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                className="input-custom"
                placeholder="Enter the price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={!price || !userProfile}
              className="btn-primary w-full mt-6"
            >
              Analyze Affordability
            </button>

            {!userProfile && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                Please complete onboarding first
              </p>
            )}
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="card p-8 animate-scale-in">
            <h2 className="text-xl font-bold mb-6">Analysis Result</h2>

            {/* Recommendation Badge */}
            <div className={`p-4 rounded-xl border-2 mb-6 flex items-center gap-3 ${getRecommendationColor(result.recommendation)}`}>
              {getRecommendationIcon(result.recommendation)}
              <div>
                <p className="font-bold text-lg">{result.recommendation}</p>
                <p className="text-sm opacity-90">{result.message}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hours of Work Required</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white number-fixed">
                  {result.hoursOfWork.toLocaleString()} hours
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  At ₹{Math.round(result.hourlyRate).toLocaleString()}/hour
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Percentage of Monthly Salary</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white number-fixed">
                  {result.salaryPercentage}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {result.monthsOfWork.toFixed(2)} months of salary
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Impact on Savings Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white text-balance-all">
                  {result.savingsImpact}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Based on your current investment capacity
                </p>
              </div>

              {result.recommendation === 'Not Recommended' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl mt-4">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                    💡 Suggested Affordable Budget
                  </p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(result.affordableBudget)}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    20% of your monthly salary
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Examples */}
      {!result && (
        <div className="card p-8">
          <h2 className="text-xl font-bold mb-4">Common Purchases</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click on any item to quickly check affordability
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'iPhone 15', price: 79900 },
              { name: 'MacBook Air', price: 114900 },
              { name: 'Royal Enfield', price: 250000 },
              { name: 'Goa Vacation', price: 50000 },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setProductName(item.name);
                  setPrice(item.price.toString());
                }}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                <p className="font-medium text-sm mb-2">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(item.price)}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AffordabilityCalculator;