In Forecast Profit & Loss in Sales 
 Other Cash Receipts Input is Missing

 client/
│
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── App.js
│   ├── App.css
│   ├── components/
│   │   ├── backtotop/
│   │   │   ├── backtotop.jsx
│   │   │   └── backtotop.css
│   │   ├── calculator/
│   │   │   └── calculator.jsx
│   │   ├── dashboard/
│   │   │   └── dashboard.jsx
│   │   ├── dashboard-footer/
│   │   │   └── dashboardFooter.css
│   │   ├── dashboard-navbar/
│   │   │   └── dashboardNavbar.css
│   │   ├── entryitems/
│   │   │   ├── entryitems.jsx
│   │   │   └── entryitems.css
│   │   ├── finbot/
│   │   │   ├── finbot.jsx
│   │   │   └── finbot.css
│   │   ├── salary/
│   │   │   └── salary.jsx
│   │   ├── sidebar/
│   │   │   ├── sidebar.jsx
│   │   │   └── sidebar.css
│   │   └── startupcosttable/
│   │       ├── startupcosttable.jsx
│   │       └── startupcosttable.css
│   │
│   ├── pages/
│   │   ├── break_even_analysis/
│   │   │   ├── breakEvenAnalysis.jsx
│   │   │   └── breakEvenAnalysis.css
│   │   ├── cogs_calculator/
│   │   │   ├── cogs_calculator.jsx
│   │   │   └── cogs_calculator.css
│   │   ├── dashboardmain/
│   │   │   ├── dashboardmain.jsx
│   │   │   └── dashboardmain.css
│   │   ├── employeeSalary/
│   │   │   ├── employeeSalary.jsx
│   │   │   └── employeeSalary.css
│   │   ├── entrylog/
│   │   │   ├── entrylog.jsx
│   │   │   └── entrylog.css
│   │   ├── funding/
│   │   │   ├── funding.jsx
│   │   │   └── funding.css
│   │   ├── login/
│   │   │   ├── login.jsx
│   │   │   └── login.css
│   │   ├── plforecast/
│   │   │   ├── plforecast.jsx
│   │   │   └── plforecast.css
│   │   ├── salesforecast/
│   │   │   ├── salesforecast.jsx
│   │   │   └── salesforecast.css
│   │   ├── signup/
│   │   │   ├── signup.jsx
│   │   │   └── signup.css
│   │   └── startupcost/
│   │       ├── startupcost.jsx
│   │       └── startupcost.css
│   │── utility
|   |     ├── authenticatedRequestUtility.js
│   └── ProjectContext.js
│
├── .gitignore
└── package.json

server/
│
├── .gitignore
├── app.js
├── server.js
├── .env
├── package.json
└── src/
    ├── config/ │
    │      ├── supabase.js
    ├── middleware/
    │      ├── authMiddleware.js
    ├── modules/
    │     └── auth/ 
    │           ├── authController.js 
    │           ├── authModel.js 
    │           └── authRoutes.js
    │   ├── finOutput/
    │   │   ├── breakEvenAnalysis/
    │   │   │   ├── breakEvenCalc.js
    │   │   │   ├── breakEvenController.js
    │   │   │   ├── breakEvenModel.js
    │   │   │   └── breakEvenRoutes.js
    │   │   ├── cogsCalculator/
    │   │   │   ├── cogsController.js
    │   │   │   └── cogsRoutes.js
    │   │   ├── forecastPL/
    │   │   │   ├── forecastPLCalc.js
    │   │   │   ├── forecastPLController.js
    │   │   │   ├── forecastPLModel.js
    │   │   │   └── forecastPLRoute.js
    │   │   ├── funding/
    │   │   │   ├── fundingController.js
    │   │   │   └── fundingRoutes.js
    │   │   ├── salaries/
    │   │   │   ├── salariesController.js
    │   │   │   ├── salariesModel.js
    │   │   │   └── salariesRoute.js
    │   │   ├── salesForecast/
    │   │   │   ├── salesForecastController.js
    │   │   │   ├── salesForecastModel.js
    │   │   │   └── salesForecastRoutes.js
    │   │   └── startupCostOut/
    │   │       ├── startupControllerOut.js
    │   │       └── startupRouterOut.js
    │   └── finPlanInput/
    │       ├── Emppayroll/
    │       │   ├── payrollController.js
    │       │   └── payrollRoutes.js
    │       ├── fundingPlanning/
    │       │   ├── fundingController.js
    │       │   └── fundingRoutes.js
    │       ├── operationsFin/
    │       │   ├── operationsFinController.js
    │       │   └── operationsFinRoutes.js
    │       └── startupCost/
    │           ├── startupController.js
    │           └── startupRoutes.js
    └── tests/

This is my project folder structure


	
assets
capital_costs
capital_work_progress
cash_flow
employee_payrolls
startup_costs
fixed_expenses
startup_capital
variable_costs
starting_operations
liabilities
revenue_forecasts

funding_calculations
forecast_pl_calculations
break_even_calculations
cogs_calculations
salary_calculations
sales_forecast_calculations
startup_calculations
sessions
users
