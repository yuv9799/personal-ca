import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Onboarding = ({ onComplete }) => {
  const { darkMode, toggleDarkMode } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    monthlySalary: '',
    otherIncome: '',
    monthlyExpenses: {
      rent: '',
      food: '',
      transportation: '',
      utilities: '',
      entertainment: '',
      shopping: '',
      subscriptions: '',
    },
    savings: {
      emergency: '',
      fixedDeposits: '',
    },
    investments: [],
    loans: [],
    goals: [],
    riskAppetite: 'Moderate',
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateExpense = (field, value) => {
    setFormData(prev => ({
      ...prev,
      monthlyExpenses: { ...prev.monthlyExpenses, [field]: value }
    }));
  };

  const updateSavings = (field, value) => {
    setFormData(prev => ({
      ...prev,
      savings: { ...prev.savings, [field]: value }
    }));
  };

  const addInvestment = () => {
    setFormData(prev => ({
      ...prev,
      investments: [...prev.investments, { name: '', amount: '', type: 'Stocks' }]
    }));
  };

  const updateInvestment = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      investments: prev.investments.map((inv, i) => 
        i === index ? { ...inv, [field]: value } : inv
      )
    }));
  };

  const addLoan = () => {
    setFormData(prev => ({
      ...prev,
      loans: [...prev.loans, { name: '', amount: '', interestRate: '', emi: '' }]
    }));
  };

  const updateLoan = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      loans: prev.loans.map((loan, i) => 
        i === index ? { ...loan, [field]: value } : loan
      )
    }));
  };

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, { name: '', targetAmount: '', targetDate: '' }]
    }));
  };

  const updateGoal = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => 
        i === index ? { ...goal, [field]: value } : goal
      )
    }));
  };

  const calculateTotalExpenses = () => {
    return Object.values(formData.monthlyExpenses)
      .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  const handleSubmit = () => {
    console.log('Submitting onboarding...');
    const profile = {
      name: formData.name,
      age: parseInt(formData.age),
      occupation: formData.occupation,
      monthlySalary: parseFloat(formData.monthlySalary) + parseFloat(formData.otherIncome || 0),
      monthlyExpenses: {
        ...formData.monthlyExpenses,
        total: calculateTotalExpenses(),
      },
      savings: {
        ...formData.savings,
        total: (parseFloat(formData.savings.emergency) || 0) + (parseFloat(formData.savings.fixedDeposits) || 0),
      },
      investments: formData.investments.filter(inv => inv.name && inv.amount),
      loans: formData.loans.filter(loan => loan.name && loan.amount),
      goals: formData.goals.filter(goal => goal.name && goal.targetAmount),
      riskAppetite: formData.riskAppetite,
      monthlySavings: (parseFloat(formData.monthlySalary) || 0) + parseFloat(formData.otherIncome || 0) - calculateTotalExpenses(),
    };

    console.log('Profile created:', profile);
    onComplete(profile);
    console.log('onComplete called');
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.name && formData.age && formData.monthlySalary;
    }
    return true;
  };

  const steps = [
    { id: 1, title: 'Personal Info' },
    { id: 2, title: 'Income & Expenses' },
    { id: 3, title: 'Savings & Investments' },
    { id: 4, title: 'Goals & Risk' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 relative">
      {/* Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-glow transition-all duration-300 z-50 group"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <Moon className="w-5 h-5 text-primary-600 group-hover:rotate-12 transition-transform duration-300" />
        )}
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Personal CA</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Your AI Financial Operating System</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                step >= s.id 
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow scale-110' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                <span className="font-bold">{s.id}</span>
              </div>
              <span className={`text-xs font-medium ${step >= s.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <div className="card p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Let's start with the basics</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  className="input-custom"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age *</label>
                <input
                  type="number"
                  className="input-custom"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Occupation</label>
                <input
                  type="text"
                  className="input-custom"
                  placeholder="e.g., Software Engineer, Doctor"
                  value={formData.occupation}
                  onChange={(e) => updateFormData('occupation', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Salary (₹) *</label>
                <input
                  type="number"
                  className="input-custom"
                  placeholder="Enter your monthly salary"
                  value={formData.monthlySalary}
                  onChange={(e) => updateFormData('monthlySalary', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Other Income Sources (₹)</label>
                <input
                  type="number"
                  className="input-custom"
                  placeholder="Freelancing, rental income, etc."
                  value={formData.otherIncome}
                  onChange={(e) => updateFormData('otherIncome', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Monthly Expenses</h2>
              
              {[
                { key: 'rent', label: 'Rent / Housing' },
                { key: 'food', label: 'Food & Groceries' },
                { key: 'transportation', label: 'Transportation' },
                { key: 'utilities', label: 'Utilities (Electricity, Water, Internet)' },
                { key: 'entertainment', label: 'Entertainment' },
                { key: 'shopping', label: 'Shopping' },
                { key: 'subscriptions', label: 'Subscriptions' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                  </label>
                  <input
                    type="number"
                    className="input-custom"
                    placeholder={`Monthly ${label}`}
                    value={formData.monthlyExpenses[key]}
                    onChange={(e) => updateExpense(key, e.target.value)}
                  />
                </div>
              ))}

              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Monthly Expenses: <span className="font-bold text-primary-600 dark:text-primary-400 text-lg ml-2">
                    ₹{calculateTotalExpenses().toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Savings & Investments</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emergency Fund (₹)</label>
                <input
                  type="number"
                  className="input-custom"
                  placeholder="Current emergency fund"
                  value={formData.savings.emergency}
                  onChange={(e) => updateSavings('emergency', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fixed Deposits (₹)</label>
                <input
                  type="number"
                  className="input-custom"
                  placeholder="Current fixed deposits"
                  value={formData.savings.fixedDeposits}
                  onChange={(e) => updateSavings('fixedDeposits', e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Investments</label>
                  <button
                    type="button"
                    onClick={addInvestment}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Add Investment
                  </button>
                </div>
                
                {formData.investments.map((inv, index) => (
                  <div key={index} className="grid grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      className="input-custom"
                      placeholder="Investment name"
                      value={inv.name}
                      onChange={(e) => updateInvestment(index, 'name', e.target.value)}
                    />
                    <input
                      type="number"
                      className="input-custom"
                      placeholder="Amount (₹)"
                      value={inv.amount}
                      onChange={(e) => updateInvestment(index, 'amount', e.target.value)}
                    />
                    <select
                      className="select-custom"
                      value={inv.type}
                      onChange={(e) => updateInvestment(index, 'type', e.target.value)}
                    >
                      <option>Stocks</option>
                      <option>Mutual Funds</option>
                      <option>Gold</option>
                      <option>Property</option>
                      <option>Crypto</option>
                      <option>Other</option>
                    </select>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loans / EMIs</label>
                  <button
                    type="button"
                    onClick={addLoan}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Add Loan
                  </button>
                </div>
                
                {formData.loans.map((loan, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      className="input-custom"
                      placeholder="Loan name (e.g., Home Loan)"
                      value={loan.name}
                      onChange={(e) => updateLoan(index, 'name', e.target.value)}
                    />
                    <input
                      type="number"
                      className="input-custom"
                      placeholder="Outstanding Amount (₹)"
                      value={loan.amount}
                      onChange={(e) => updateLoan(index, 'amount', e.target.value)}
                    />
                    {index === 0 && (
                      <>
                        <input
                          type="number"
                          className="input-custom"
                          placeholder="Interest Rate (%)"
                          value={loan.interestRate}
                          onChange={(e) => updateLoan(index, 'interestRate', e.target.value)}
                        />
                        <input
                          type="number"
                          className="input-custom"
                          placeholder="Monthly EMI (₹)"
                          value={loan.emi}
                          onChange={(e) => updateLoan(index, 'emi', e.target.value)}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Financial Goals & Risk Appetite</h2>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Financial Goals</label>
                  <button
                    type="button"
                    onClick={addGoal}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Add Goal
                  </button>
                </div>
                
                {formData.goals.map((goal, index) => (
                  <div key={index} className="grid grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      className="input-custom"
                      placeholder="Goal (e.g., Goa Trip)"
                      value={goal.name}
                      onChange={(e) => updateGoal(index, 'name', e.target.value)}
                    />
                    <input
                      type="number"
                      className="input-custom"
                      placeholder="Target Amount (₹)"
                      value={goal.targetAmount}
                      onChange={(e) => updateGoal(index, 'targetAmount', e.target.value)}
                    />
                    <input
                      type="date"
                      className="input-custom"
                      value={goal.targetDate}
                      onChange={(e) => updateGoal(index, 'targetDate', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Risk Appetite</label>
                <div className="grid grid-cols-3 gap-4">
                  {['Conservative', 'Moderate', 'Aggressive'].map((risk) => (
                    <button
                      key={risk}
                      type="button"
                      onClick={() => updateFormData('riskAppetite', risk)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.riskAppetite === risk
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-glow'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                      }`}
                    >
                      <p className="font-medium text-center">{risk}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                ← Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  console.log('Moving to step', step + 1);
                  setStep(step + 1);
                }}
                disabled={!canProceed()}
                className="btn-primary ml-auto"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  console.log('Complete button clicked');
                  handleSubmit();
                }}
                disabled={!formData.name || !formData.age || !formData.monthlySalary}
                className="btn-primary ml-auto"
              >
                Complete Setup ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;