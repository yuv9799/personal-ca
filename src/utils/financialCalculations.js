// Financial calculation utilities for Personal CA

export const calculateFinancialHealthScore = (profile) => {
  let score = 0;
  const maxScore = 100;
  const strengths = [];
  const improvements = [];

  // Savings Rate (0-20 points)
  const savingsRate = profile.monthlySavings / profile.monthlySalary;
  if (savingsRate >= 0.3) {
    score += 20;
    strengths.push("Excellent Savings Rate");
  } else if (savingsRate >= 0.2) {
    score += 15;
    strengths.push("Good Savings Rate");
  } else if (savingsRate >= 0.1) {
    score += 10;
    improvements.push("Savings Rate could be higher (aim for 20%)");
  } else {
    score += 5;
    improvements.push("Savings Rate needs improvement (aim for minimum 10%)");
  }

  // Debt Ratio (0-20 points)
  const totalDebt = profile.loans?.reduce((sum, loan) => sum + loan.amount, 0) || 0;
  const debtToIncome = totalDebt / (profile.monthlySalary * 12);
  if (debtToIncome < 1) {
    score += 20;
    strengths.push("Low Debt");
  } else if (debtToIncome < 2) {
    score += 15;
    strengths.push("Manageable Debt");
  } else if (debtToIncome < 3) {
    score += 10;
    improvements.push("Debt ratio is moderate");
  } else {
    score += 5;
    improvements.push("Debt ratio is high, consider debt consolidation");
  }

  // Emergency Fund (0-20 points)
  const monthlyExpenses = profile.monthlyExpenses?.total || 0;
  const emergencyFund = profile.savings?.emergency || 0;
  const fundMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;
  if (fundMonths >= 12) {
    score += 20;
    strengths.push("Excellent Emergency Fund");
  } else if (fundMonths >= 6) {
    score += 15;
    strengths.push("Good Emergency Fund");
  } else if (fundMonths >= 3) {
    score += 10;
    improvements.push("Emergency Fund could be larger (aim for 6 months)");
  } else {
    score += 5;
    improvements.push("Emergency Fund is low, prioritize building it");
  }

  // Investments (0-20 points)
  const totalInvestments = profile.investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const investmentRatio = totalInvestments / (profile.monthlySalary * 12);
  if (investmentRatio >= 2) {
    score += 20;
    strengths.push("Strong Investment Portfolio");
  } else if (investmentRatio >= 1) {
    score += 15;
    strengths.push("Good Investment Portfolio");
  } else if (investmentRatio >= 0.5) {
    score += 10;
    improvements.push("Investments could be increased");
  } else {
    score += 5;
    improvements.push("Investment portfolio needs growth");
  }

  // Insurance Coverage (0-20 points)
  const hasHealth = profile.insurance?.health || 0;
  const hasTerm = profile.insurance?.term || 0;
  if (hasHealth && hasTerm) {
    score += 20;
    strengths.push("Good Insurance Coverage");
  } else if (hasHealth || hasTerm) {
    score += 12;
    improvements.push("Consider additional insurance coverage");
  } else {
    score += 5;
    improvements.push("Insurance coverage needed");
  }

  return { score: Math.min(score, maxScore), strengths, improvements };
};

export const calculateNetWorth = (profile) => {
  const assets = 
    (profile.savings?.emergency || 0) +
    (profile.savings?.fixedDeposits || 0) +
    (profile.investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0) +
    (profile.assets?.property || 0) +
    (profile.assets?.gold || 0);

  const liabilities = 
    (profile.loans?.reduce((sum, loan) => sum + loan.amount, 0) || 0) +
    (profile.liabilities?.creditCard || 0);

  return {
    totalAssets: assets,
    totalLiabilities: liabilities,
    netWorth: assets - liabilities,
  };
};

export const calculateAffordability = (price, monthlySalary, monthlySavings, monthlyExpenses) => {
  const hoursPerDay = 8;
  const workingDaysPerMonth = 22;
  const hourlyRate = monthlySalary / (hoursPerDay * workingDaysPerMonth);
  const hoursOfWork = Math.ceil(price / hourlyRate);
  const monthsOfWork = price / monthlySalary;

  const savingsImpact = (price / monthlySavings).toFixed(1);
  const salaryPercentage = ((price / monthlySalary) * 100).toFixed(1);

  let recommendation, message;
  
  if (monthsOfWork <= 0.5 && price <= monthlySalary * 0.1) {
    recommendation = "Highly Recommended";
    message = "This purchase fits comfortably within your financial capacity.";
  } else if (monthsOfWork <= 1 && price <= monthlySalary * 0.2) {
    recommendation = "Recommended";
    message = "This is a reasonable purchase given your income.";
  } else if (monthsOfWork <= 2 && price <= monthlySavings * 3) {
    recommendation = "Consider";
    message = "This purchase will impact your savings goals.";
  } else if (monthsOfWork <= 6) {
    recommendation = "Caution";
    message = "This purchase requires careful planning and saving for several months.";
  } else {
    recommendation = "Not Recommended";
    message = "This purchase is beyond your current financial capacity. Consider alternatives or saving strategy.";
  }

  const affordableBudget = monthlySalary * 0.2;

  return {
    hoursOfWork,
    monthsOfWork,
    salaryPercentage,
    savingsImpact: `${savingsImpact} months`,
    recommendation,
    message,
    affordableBudget,
    hourlyRate,
  };
};

export const calculateInvestmentPlan = (availableAmount, riskAppetite) => {
  let plan = {};

  switch (riskAppetite) {
    case 'Conservative':
      plan = {
        fixedDeposits: Math.round(availableAmount * 0.4),
        debtFunds: Math.round(availableAmount * 0.3),
        gold: Math.round(availableAmount * 0.15),
        emergencyFund: Math.round(availableAmount * 0.15),
      };
      break;
    case 'Moderate':
      plan = {
        indexFunds: Math.round(availableAmount * 0.35),
        sip: Math.round(availableAmount * 0.25),
        debtFunds: Math.round(availableAmount * 0.2),
        gold: Math.round(availableAmount * 0.1),
        emergencyFund: Math.round(availableAmount * 0.1),
      };
      break;
    case 'Aggressive':
      plan = {
        equities: Math.round(availableAmount * 0.45),
        indexFunds: Math.round(availableAmount * 0.25),
        sip: Math.round(availableAmount * 0.2),
        gold: Math.round(availableAmount * 0.05),
        internationalFunds: Math.round(availableAmount * 0.05),
      };
      break;
    default:
      plan = {
        indexFunds: Math.round(availableAmount * 0.35),
        sip: Math.round(availableAmount * 0.25),
        fixedDeposits: Math.round(availableAmount * 0.2),
        gold: Math.round(availableAmount * 0.1),
        emergencyFund: Math.round(availableAmount * 0.1),
      };
  }

  return plan;
};

export const calculateFutureValue = (monthlyInvestment, annualReturn, years) => {
  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;
  
  if (monthlyRate === 0) return monthlyInvestment * months;

  // Future Value of Annuity formula
  const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  return Math.round(futureValue);
};

export const calculateGoalPlan = (targetAmount, currentSavings, monthlySavings, expectedReturn) => {
  const monthlyRate = expectedReturn / 12 / 100;
  const remainingAmount = targetAmount - currentSavings;
  
  if (monthlySavings <= 0) return { monthsRemaining: Infinity, monthlyRequired: remainingAmount };
  
  if (monthlyRate === 0) {
    const monthsRemaining = remainingAmount / monthlySavings;
    return { monthsRemaining: Math.ceil(monthsRemaining), monthlyRequired: monthlySavings };
  }

  // Calculate months needed using future value of annuity formula (reversed)
  const monthsRemaining = Math.log(1 + (remainingAmount * monthlyRate) / monthlySavings) / Math.log(1 + monthlyRate);
  
  return {
    monthsRemaining: Math.ceil(monthsRemaining),
    monthlyRequired: monthlySavings,
  };
};

export const calculateTax = (income, deductions, regime) => {
  const taxableIncome = Math.max(0, income - deductions);
  let tax = 0;

  if (regime === 'new') {
    // New Tax Regime (FY 2024-25)
    if (taxableIncome <= 300000) tax = 0;
    else if (taxableIncome <= 700000) tax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 20000 + (taxableIncome - 700000) * 0.1;
    else if (taxableIncome <= 1200000) tax = 50000 + (taxableIncome - 1000000) * 0.15;
    else if (taxableIncome <= 1500000) tax = 80000 + (taxableIncome - 1200000) * 0.2;
    else tax = 140000 + (taxableIncome - 1500000) * 0.3;
  } else {
    // Old Tax Regime
    if (taxableIncome <= 250000) tax = 0;
    else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
    else tax = 112500 + (taxableIncome - 1000000) * 0.3;
  }

  // Add cess (4% of tax)
  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return {
    taxableIncome,
    tax,
    cess,
    totalTax,
    effectiveRate: (totalTax / income) * 100,
  };
};

export const formatCurrency = (amount, currency = '₹') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

export const getMonthName = (monthIndex) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthIndex % 12];
};

export const generateProjections = (monthlyInvestment, annualReturn, years, salaryGrowth = 0.1) => {
  const projections = [];
  let currentAmount = 0;
  let currentMonthlyInvestment = monthlyInvestment;

  for (let year = 0; year <= years; year++) {
    projections.push({
      year,
      amount: Math.round(currentAmount),
      invested: year === 0 ? 0 : Math.round(projections[year - 1]?.invested + (currentMonthlyInvestment * 12) || 0),
    });

    for (let month = 0; month < 12 && year < years; month++) {
      const monthlyRate = annualReturn / 12 / 100;
      currentAmount = (currentAmount + currentMonthlyInvestment) * (1 + monthlyRate);
    }

    currentMonthlyInvestment *= (1 + salaryGrowth);
  }

  return projections;
};