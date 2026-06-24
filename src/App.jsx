import { useState } from 'react';
import { useApp } from './context/AppContext';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import AffordabilityCalculator from './components/AffordabilityCalculator';
import InvestmentPlanner from './components/InvestmentPlanner';
import WealthSimulator from './components/WealthSimulator';
import GoalPlanner from './components/GoalPlanner';
import LearningResources from './components/LearningResources';
import Sidebar from './components/Sidebar';

function App() {
  const { isOnboarded, completeOnboarding } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'affordability':
        return <AffordabilityCalculator />;
      case 'investments':
        return <InvestmentPlanner />;
      case 'wealth-simulator':
        return <WealthSimulator />;
      case 'goals':
        return <GoalPlanner />;
      case 'learn':
        return <LearningResources />;
      default:
        return <Dashboard />;
    }
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
      />
      
      <main 
        className="transition-all duration-300"
        style={{ marginLeft: '16rem' }}
      >
        <div className="p-8 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>

      {/* Floating Learning Resources Button */}
      <LearningResources isFloating />
    </div>
  );
}

export default App;
