// The application form is described here, not written field by field in a page.
// Every field can have a showIf function. When it returns false the field is
// hidden and its old answer is cleared (see clearHiddenAnswers below).

const yesNo = ['Yes', 'No'];
const is = (key, value) => (v) => v[key] === value;

export const sections = [
  {
    id: 'personal',
    title: 'Personal Information',
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text', required: true },
      { name: 'dob', label: 'Date of birth', type: 'date', required: true },
      { name: 'maritalStatus', label: 'Marital status', type: 'select', required: true, options: ['Single', 'Married'] },
      { name: 'spouseWorking', label: 'Is your spouse employed?', type: 'select', options: yesNo, showIf: is('maritalStatus', 'Married') },
      { name: 'dependents', label: 'Number of dependents', type: 'select', required: true, options: ['0', '1', '2', '3+'] },
      { name: 'education', label: 'Education level', type: 'select', required: true, options: ['Graduate', 'Not graduate'] },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Prefer not to say'], hint: 'Optional. May be left out of the model.' },
    ],
  },
  {
    id: 'employment',
    title: 'Employment Information',
    fields: [
      { name: 'employmentStatus', label: 'Employment status', type: 'select', required: true, options: ['Salaried', 'Self-employed', 'Business owner', 'Unemployed'] },
      // salaried
      { name: 'employer', label: 'Employer name', type: 'text', required: true, showIf: is('employmentStatus', 'Salaried') },
      { name: 'designation', label: 'Designation', type: 'text', required: true, showIf: is('employmentStatus', 'Salaried') },
      { name: 'monthlySalary', label: 'Monthly salary', type: 'number', unit: '₹ per month', required: true, min: 1000, showIf: is('employmentStatus', 'Salaried') },
      { name: 'yearsInJob', label: 'Years in current job', type: 'number', unit: 'years', required: true, min: 0, max: 50, showIf: is('employmentStatus', 'Salaried') },
      // self-employed
      { name: 'profession', label: 'Profession or business type', type: 'text', required: true, showIf: is('employmentStatus', 'Self-employed') },
      { name: 'yearsOperating', label: 'Years of operation', type: 'number', unit: 'years', required: true, min: 0, max: 60, showIf: is('employmentStatus', 'Self-employed') },
      { name: 'avgMonthlyIncome', label: 'Average monthly income', type: 'number', unit: '₹ per month', required: true, min: 1000, showIf: is('employmentStatus', 'Self-employed') },
      // business owner
      { name: 'businessName', label: 'Business name', type: 'text', required: true, showIf: is('employmentStatus', 'Business owner') },
      { name: 'businessType', label: 'Business type', type: 'text', required: true, showIf: is('employmentStatus', 'Business owner') },
      { name: 'businessYears', label: 'Years of operation', type: 'number', unit: 'years', required: true, min: 0, max: 60, showIf: is('employmentStatus', 'Business owner') },
      { name: 'monthlyTurnover', label: 'Monthly turnover', type: 'number', unit: '₹ per month', required: true, min: 1000, showIf: is('employmentStatus', 'Business owner') },
      // unemployed
      { name: 'otherIncome', label: 'Other source of income, if any', type: 'number', unit: '₹ per month', min: 0, showIf: is('employmentStatus', 'Unemployed') },
    ],
  },
  {
    id: 'financial',
    title: 'Financial Information',
    fields: [
      { name: 'hasCoApplicant', label: 'Is there a co-applicant?', type: 'select', required: true, options: yesNo },
      { name: 'coRelationship', label: 'Relationship with co-applicant', type: 'select', required: true, options: ['Spouse', 'Parent', 'Sibling', 'Other'], showIf: is('hasCoApplicant', 'Yes') },
      { name: 'coEmployment', label: 'Co-applicant employment', type: 'select', required: true, options: ['Salaried', 'Self-employed', 'Business owner', 'Unemployed'], showIf: is('hasCoApplicant', 'Yes') },
      { name: 'coIncome', label: 'Co-applicant monthly income', type: 'number', unit: '₹ per month', required: true, min: 0, showIf: is('hasCoApplicant', 'Yes') },
      { name: 'hasExistingLoans', label: 'Do you have existing loans?', type: 'select', required: true, options: yesNo },
      { name: 'numLoans', label: 'Number of existing loans', type: 'number', required: true, min: 1, max: 20, showIf: is('hasExistingLoans', 'Yes') },
      { name: 'monthlyRepayment', label: 'Total monthly repayment', type: 'number', unit: '₹ per month', required: true, min: 0, showIf: is('hasExistingLoans', 'Yes') },
      { name: 'creditHistory', label: 'Credit history', type: 'select', required: true, options: ['Good (repaid previous debts)', 'Poor (missed payments)', 'No credit history'] },
    ],
  },
  {
    id: 'loan',
    title: 'Loan Details',
    fields: [
      { name: 'loanType', label: 'Loan type', type: 'select', required: true, options: ['Home loan', 'Personal loan', 'Education loan', 'Business loan'] },
      { name: 'loanAmount', label: 'Requested loan amount', type: 'number', unit: '₹', required: true, min: 10000 },
      { name: 'loanTerm', label: 'Loan term', type: 'number', unit: 'months', required: true, min: 6, max: 480 },
      { name: 'purpose', label: 'Purpose of the loan', type: 'text', required: true },
      // education loan
      { name: 'course', label: 'Course', type: 'text', required: true, showIf: is('loanType', 'Education loan') },
      { name: 'institution', label: 'Institution', type: 'text', required: true, showIf: is('loanType', 'Education loan') },
      { name: 'courseYears', label: 'Course duration', type: 'number', unit: 'years', required: true, min: 1, max: 8, showIf: is('loanType', 'Education loan') },
      // business loan
      { name: 'bizLoanType', label: 'Business type', type: 'text', required: true, showIf: is('loanType', 'Business loan') },
      { name: 'bizLoanYears', label: 'Years of operation', type: 'number', unit: 'years', required: true, min: 0, max: 60, showIf: is('loanType', 'Business loan') },
      { name: 'fundsPurpose', label: 'Purpose of funds', type: 'text', required: true, showIf: is('loanType', 'Business loan') },
      // previous loan
      { name: 'hadPreviousLoan', label: 'Have you taken a loan from us before?', type: 'select', required: true, options: yesNo },
      { name: 'previousRepayment', label: 'Repayment record of the previous loan', type: 'select', required: true, options: ['Repaid on time', 'Some delays', 'Not fully repaid'], showIf: is('hadPreviousLoan', 'Yes') },
    ],
  },
  {
    id: 'property',
    title: 'Property Information',
    note: 'These questions are needed only for home loans.',
    fields: [
      { name: 'propertyType', label: 'Property type', type: 'select', required: true, options: ['Apartment', 'Independent house', 'Plot'], showIf: is('loanType', 'Home loan') },
      { name: 'propertyArea', label: 'Property area', type: 'select', required: true, options: ['Urban', 'Semi-urban', 'Rural'], showIf: is('loanType', 'Home loan') },
      { name: 'propertyValue', label: 'Estimated property value', type: 'number', unit: '₹', required: true, min: 10000, showIf: is('loanType', 'Home loan') },
    ],
  },
];

// The sixth section (review and submit) is built by the form page itself.
export const stepTitles = [...sections.map((s) => s.title), 'Review and Submit'];

export function isVisible(field, values) {
  return field.showIf ? field.showIf(values) : true;
}

export function visibleFields(section, values) {
  return section.fields.filter((f) => isVisible(f, values));
}

// Removes answers of hidden fields. It repeats until nothing changes,
// because clearing one answer can hide another question.
export function clearHiddenAnswers(values) {
  let current = { ...values };
  let changed = true;
  while (changed) {
    changed = false;
    for (const s of sections) {
      for (const f of s.fields) {
        const hidden = !isVisible(f, current);
        const hasValue = current[f.name] !== undefined && current[f.name] !== '';
        if (hidden && hasValue) {
          current = { ...current };
          delete current[f.name];
          changed = true;
        }
      }
    }
  }
  return current;
}

// Returns an error message for one field, or an empty string.
export function validateField(field, value) {
  const empty = value === undefined || value === null || String(value).trim() === '';
  if (empty) return field.required ? 'This field is required' : '';
  if (field.type === 'number') {
    const n = Number(value);
    if (Number.isNaN(n)) return 'Enter a number';
    if (field.min !== undefined && n < field.min) return `Must be at least ${field.min}`;
    if (field.max !== undefined && n > field.max) return `Must be at most ${field.max}`;
  }
  if (field.name === 'fullName' && String(value).trim().length < 3) return 'Enter your full name';
  if (field.name === 'dob') {
    const age = (Date.now() - new Date(value).getTime()) / (365.25 * 24 * 3600 * 1000);
    if (age < 18) return 'Applicant must be at least 18 years old';
    if (age > 100) return 'Enter a valid date of birth';
  }
  return '';
}

export function validateSection(section, values) {
  const errors = {};
  for (const f of visibleFields(section, values)) {
    const msg = validateField(f, values[f.name]);
    if (msg) errors[f.name] = msg;
  }
  return errors;
}
