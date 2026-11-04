// Demo data. Everything in this file is made up for the prototype.

const day = 24 * 3600 * 1000;
export const daysAgo = (n) => new Date(Date.now() - n * day).toISOString();

export const DEMO_APPLICANT = 'applicant@demo.com';

const people = [
  ['Anjali Menon', 'Salaried', 'Home loan', 2400000, 240, 62000, 'Approved', 'Likely Approved', 0.86, 4],
  ['Rahul Nair', 'Self-employed', 'Business loan', 800000, 60, 45000, 'Pending', 'Likely Approved', 0.64, 9],
  ['Sneha Pillai', 'Salaried', 'Personal loan', 300000, 36, 38000, 'Approved', 'Likely Approved', 0.78, 15],
  ['Arjun Das', 'Unemployed', 'Education loan', 500000, 84, 8000, 'Rejected', 'Likely Not Approved', 0.31, 22],
  ['Meera Krishnan', 'Business owner', 'Business loan', 1500000, 120, 95000, 'Pending', 'Likely Approved', 0.71, 3],
  ['Vishnu Prasad', 'Salaried', 'Personal loan', 450000, 48, 29000, 'Rejected', 'Likely Not Approved', 0.42, 31],
  ['Divya Thomas', 'Salaried', 'Home loan', 3200000, 300, 88000, 'Approved', 'Likely Approved', 0.91, 40],
  ['Kiran Joseph', 'Self-employed', 'Personal loan', 200000, 24, 26000, 'Pending', 'Likely Not Approved', 0.47, 6],
  ['Lakshmi Iyer', 'Salaried', 'Education loan', 700000, 96, 41000, 'Approved', 'Likely Approved', 0.74, 55],
  ['Manoj Varma', 'Business owner', 'Home loan', 4100000, 360, 120000, 'Pending', 'Likely Approved', 0.69, 2],
  ['Nisha George', 'Salaried', 'Personal loan', 150000, 18, 22000, 'Approved', 'Likely Approved', 0.8, 70],
  ['Pranav Kumar', 'Unemployed', 'Personal loan', 250000, 36, 6000, 'Rejected', 'Likely Not Approved', 0.22, 12],
  ['Reshma Ali', 'Salaried', 'Home loan', 1800000, 240, 54000, 'Pending', 'Likely Approved', 0.67, 1],
  ['Sanjay Mohan', 'Self-employed', 'Business loan', 950000, 72, 52000, 'Approved', 'Likely Approved', 0.73, 85],
  ['Tina Samuel', 'Salaried', 'Personal loan', 350000, 36, 31000, 'Rejected', 'Likely Not Approved', 0.45, 95],
  ['Uday Shenoy', 'Business owner', 'Business loan', 2200000, 120, 140000, 'Approved', 'Likely Approved', 0.82, 110],
];

function makeApplication(p, i) {
  const [name, emp, loanType, amount, term, income, status, label, prob, ago] = p;
  return {
    id: `LA-2026-${String(i + 1).padStart(4, '0')}`,
    // the first four belong to the demo applicant account, the rest to other users
    userEmail: i < 4 ? DEMO_APPLICANT : `user${i}@example.com`,
    applicantName: name,
    createdAt: daysAgo(ago),
    status,
    loanType,
    loanAmount: amount,
    loanTerm: term,
    income,
    employmentStatus: emp,
    label,
    probability: prob,
    answers: {
      fullName: name,
      employmentStatus: emp,
      loanType,
      loanAmount: amount,
      loanTerm: term,
      creditHistory: prob > 0.5 ? 'Good (repaid previous debts)' : 'Poor (missed payments)',
      purpose: loanType === 'Home loan' ? 'Purchase of a house' : 'General purpose',
    },
  };
}

export const mockApplications = people.map(makeApplication);

export const mockModels = [
  { id: 'M1', algorithm: 'Logistic Regression', split: 80, seed: 42, accuracy: 0.8, precision: 0.79, recall: 0.92, f1: 0.85, auc: 0.84, trainedAt: daysAgo(14), active: false },
  { id: 'M2', algorithm: 'Decision Tree', split: 80, seed: 42, accuracy: 0.76, precision: 0.78, recall: 0.82, f1: 0.8, auc: 0.74, trainedAt: daysAgo(14), active: false },
  { id: 'M3', algorithm: 'Random Forest', split: 80, seed: 42, accuracy: 0.84, precision: 0.83, recall: 0.9, f1: 0.86, auc: 0.89, trainedAt: daysAgo(14), active: true },
  { id: 'M4', algorithm: 'SVM', split: 80, seed: 42, accuracy: 0.81, precision: 0.8, recall: 0.91, f1: 0.85, auc: 0.85, trainedAt: daysAgo(14), active: false },
  { id: 'M5', algorithm: 'KNN', split: 80, seed: 42, accuracy: 0.78, precision: 0.79, recall: 0.86, f1: 0.82, auc: 0.8, trainedAt: daysAgo(14), active: false },
];

export const mockAudit = [
  { id: 1, time: daysAgo(14), user: 'admin@demo.com', action: 'Training', detail: 'Trained 5 models (demo) with 80/20 split, seed 42' },
  { id: 2, time: daysAgo(14), user: 'admin@demo.com', action: 'Model', detail: 'Random Forest set as active model (demo)' },
  { id: 3, time: daysAgo(9), user: 'admin@demo.com', action: 'Dataset', detail: 'Loaded sample_loan_data.csv (62 rows)' },
  { id: 4, time: daysAgo(5), user: 'admin@demo.com', action: 'Application', detail: 'Status of LA-2026-0003 changed to Approved' },
  { id: 5, time: daysAgo(2), user: 'admin@demo.com', action: 'Settings', detail: 'Gender and Married excluded from model features' },
];

export const defaultSettings = {
  systemName: 'LoanPredict',
  currency: 'INR',
  retentionDays: 90,
  excludeGender: true,
  excludeMarried: true,
  showDemoBanner: true,
  emailNotifications: false,
};

export const defaultPreprocessing = {
  missing: 'mode',        // mode for categories, median for numbers
  encoding: 'onehot',
  scaling: 'standard',
  imbalance: 'class_weight',
  features: {
    Gender: false,
    Married: false,
    Dependents: true,
    Education: true,
    Self_Employed: true,
    ApplicantIncome: true,
    CoapplicantIncome: true,
    LoanAmount: true,
    Loan_Amount_Term: true,
    Credit_History: true,
    Property_Area: true,
  },
};
