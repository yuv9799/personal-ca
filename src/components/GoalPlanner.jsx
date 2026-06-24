import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateGoalPlan, formatCurrency, calculateFutureValue } from '../utils/financialCalculations';
import { Target, Calendar, Plus, Trash2, TrendingUp } from 'lucide-react';

const GoalPlanner = () => {
  const { userProfile, updateProfile } = useApp();
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', targetDate: '' });
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(null);

  if (!userProfile) return null;

  const goals = userProfile.goals || [];

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return;

    const goal = {
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      targetDate: newGoal.targetDate,
      currentSavings: 0,
    };

    updateProfile({
      goals: [...goals, goal],
    });
    setNewGoal({ name: '', targetAmount: '', targetDate: '' });
  };

  const handleDeleteGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    updateProfile({ goals: updatedGoals });
  };

  const calculateGoalMetrics = (goal, index) => {
    const monthlySavings = userProfile.monthlySavings * 0.3; // Allocate 30% of savings to goals
    const plan = calculateGoalPlan(goal.targetAmount, goal.currentSavings, monthlySavings, 12);
    const futureValue = calculateFutureValue(monthlySavings, 12, plan.monthsRemaining / 12);
    
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const monthsRemaining = targetDate > today 
      ? (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth())
      : 0;

    return {
      ...plan,
      monthsRemaining: Math.min(plan.monthsRemaining, monthsRemaining || plan.monthsRemaining),
      monthlyRequired: plan.monthsRequired,
      currentSavings: goal.currentSavings || 0,
      progress: Math.min(100, ((goal.currentSavings || 0) / goal.targetAmount) * 100),
    };
  };

  const selectedGoal = selectedGoalIndex !== null ? goals[selectedGoalIndex] : null;
  const selectedGoalMetrics = selectedGoal ? calculateGoalMetrics(selectedGoal, selectedGoalIndex) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white shadow-glow-lg">
        <h1 className="text-3xl font-bold mb-2">Goal Planner</h1>
        <p className="text-primary-100">Track and achieve your financial goals</p>
      </div>

      {/* Add New Goal */}
      <div className="card p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary-600" />
          Create New Goal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goal Name
            </label>
            <input
              type="text"
              className="input-custom"
              placeholder="e.g., Goa Trip, New Car"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Amount (₹)
            </label>
            <input
              type="number"
              className="input-custom"
              placeholder="e.g., 50000"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Date
            </label>
            <input
              type="date"
              className="input-custom"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
            />
          </div>

          <div className="flex items-end">
            <button onClick={handleAddGoal} className="btn-primary w-full">
              Add Goal
            </button>
          </div>
        </div>
      </div>

      {/* Goals List */}
      {goals.length > 0 && (
        <div className="card p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" />
            Your Financial Goals
          </h2>

          <div className="space-y-4">
            {goals.map((goal, index) => {
              const metrics = calculateGoalMetrics(goal, index);
              const isSelected = selectedGoalIndex === index;

              return (
                <div
                  key={index}
                  onClick={() => setSelectedGoalIndex(isSelected ? null : index)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{goal.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Target: {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGoal(index);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium">{metrics.progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${metrics.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Monthly Savings Needed</p>
                      <p className="font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(metrics.monthlyRequired)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Time Remaining</p>
                      <p className="font-bold text-primary-600 dark:text-primary-400">
                        {metrics.monthsRemaining} months
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Goal Details */}
      {selectedGoal && selectedGoalMetrics && (
        <div className="card p-8 animate-scale-in">
          <h2 className="text-xl font-bold mb-6">{selectedGoal.name} - Detailed Plan</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Details */}
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">Target Amount</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(selectedGoal.targetAmount)}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <p className="text-sm text-green-800 dark:text-green-300 mb-1">Monthly Investment Required</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(selectedGoalMetrics.monthlyRequired)}
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <p className="text-sm text-purple-800 dark:text-purple-300 mb-1">Completion Timeline</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {selectedGoalMetrics.monthsRemaining} months
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                <p className="text-sm text-amber-800 dark:text-amber-300 mb-1">Future Value (with 12% returns)</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(selectedGoalMetrics.monthlyRequired * selectedGoalMetrics.monthsRemaining * 1.5)}
                </p>
              </div>
            </div>

            {/* Roadmap */}
            <div>
              <h3 className="font-bold text-lg mb-4">Goal Roadmap</h3>
              <div className="space-y-3">
                {Array.from({ length: Math.min(5, Math.ceil(selectedGoalMetrics.monthsRemaining / 3)) }, (_, i) => {
                  const month = (i + 1) * 3;
                  const saved = selectedGoalMetrics.monthlyRequired * month;
                  const progress = Math.min(100, (saved / selectedGoal.targetAmount) * 100);
                  
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Month {month}
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-accent-600 h-3 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex-shrink-0 w-24 text-right text-sm font-medium">
                        {formatCurrency(saved)}
                      </div>
                    </div>
                  );
                })}
                
                {selectedGoalMetrics.monthsRemaining > 15 && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                    ... and more milestones ahead
                  </div>
                )}
              </div>

              <div className="mt-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 p-4 rounded-xl border border-primary-200 dark:border-primary-800">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-1">
                      Pro Tip
                    </p>
                    <p className="text-xs text-primary-700 dark:text-primary-300">
                      Increase your monthly investment by just 10% to reach this goal {(selectedGoalMetrics.monthsRemaining * 0.1).toFixed(0)} months earlier!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Goals Message */}
      {goals.length === 0 && (
        <div className="card p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Goals Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start by adding your first financial goal above
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Goa Trip', 'New Laptop', 'Emergency Fund', 'Retirement'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setNewGoal({ ...newGoal, name: suggestion })}
                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/20 text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalPlanner;