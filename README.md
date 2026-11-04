# Loan Approval Prediction System (Frontend)

Semester 7 mini project (CSD481): Machine Learning-Based Loan Approval Prediction System.

This is the frontend only. It uses React, Vite, React Router and plain CSS. There is no backend yet.
All data, logins, predictions and model results are **demo** values kept in the browser, so nothing
here is a real loan decision.

## How to run

You need Node.js 18 or newer. Check with `node -v`.

```
cd loan-frontend
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

To make a production build and preview it:

```
npm run build
npm run preview
```

## Demo logins

On the login page use the "demo applicant" or "demo admin" quick-fill link. Any valid email with a
password of at least eight characters also works. Choose Applicant or Admin before logging in.

## Folder guide

| Path | What it holds |
| --- | --- |
| `src/config.js` | System name, demo notice, loan types |
| `src/data/formConfig.js` | The six form sections, the conditional rules and the validation |
| `src/data/mockData.js` | Demo applications, models and logs |
| `src/services/api.js` | Service layer; each function is a place to call the FastAPI backend later |
| `src/pages/applicant/` | Dashboard, new application form, result, history, profile |
| `src/pages/admin/` | Overview, applications, dataset, preprocessing, training, comparison, retention, audit logs, settings |
| `public/sample_loan_data.csv` | Small demo file for the dataset upload page |

## Manual test steps

1. Open the landing page and click Login. Log in as an applicant.
2. Choose New application and fill the six sections. Set "Employment type" to Salaried and then
   to Self-employed and check that the business questions appear and disappear.
3. Change an answer that hides a question, go back, and confirm the old answer is cleared.
4. Submit. The result page shows the demo notice and an application ID.
5. Open History, search for a loan type and open an application.
6. Log out, log in as admin and open every page in the sidebar.
7. On the Datasets page upload `public/sample_loan_data.csv` and read the row, missing value and
   duplicate counts.
8. Try opening `/admin` while logged in as an applicant. You should be sent back to the applicant dashboard.

## Connecting a backend later

Replace the function bodies in `src/services/api.js` with `fetch` calls to the FastAPI server. The
pages do not need to change.
