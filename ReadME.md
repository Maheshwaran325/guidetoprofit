``In Frontend need to add .env.local  file``

REACT_APP_SUPABASE_URL=key

REACT_APP_SUPABASE_ANON_KEY=key


``In Backend need to add .env``

PORT=8000
SUPABASE_URL=key
SUPABASE_KEY=key
JWT_SECRET=token

GEMINI_API_KEY=key

<h2> IGNORE BELOW </h2>
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
│   ├── index.js
│   ├── index.css
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
├── .env.development
├── .env.production
├── .env.local
├── .gitignore
└── package.json

server/
│
├── .gitignore
├── logger.js
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
    │     └── dashboard/ 
    │           ├── dashboardController.js 
    │           ├── dashboardModel.js 
    │           └── dashboardRoutes.js
    │     └── finbot/ 
    │           ├── finbotController.js 
    │           ├── finbotModel.js 
    │           └── finbotRoutes.js
    │           └── userProfileModels.js
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


Table Schema:
[
      {
    "table_name": "chats",
    "columns": "id (uuid), message_date (date), message (text), response (text), created_at (timestamp with time zone), user_id (uuid)"
  },
  {
    "table_name": "projects",
    "columns": "created_at (timestamp without time zone), id (uuid), initial_submit_complete (boolean), auth_user_id (uuid), updated_at (timestamp without time zone), status (character varying)"
  },
  {
    "table_name": "assets",
    "columns": "created_at (timestamp without time zone), updated_at (timestamp without time zone), amount (numeric), project_id (uuid), id (integer), description (text)"
  },
  {
    "table_name": "capital_costs",
    "columns": "description (text), years (ARRAY), amount (numeric), updated_at (timestamp without time zone), created_at (timestamp without time zone), id (integer), project_id (uuid)"
  },
  {
    "table_name": "capital_work_progress",
    "columns": "created_at (timestamp without time zone), updated_at (timestamp without time zone), description (text), id (integer), amount (numeric), project_id (uuid)"
  },
  {
    "table_name": "cash_flow",
    "columns": "description (text), updated_at (timestamp without time zone), amount (numeric), project_id (uuid), id (integer), created_at (timestamp without time zone)"
  },
  {
    "table_name": "employee_payrolls",
    "columns": "designation (text), months (ARRAY), updated_at (timestamp without time zone), created_at (timestamp without time zone), salary (numeric), project_id (uuid), id (integer)"
  },
  {
    "table_name": "fixed_expenses",
    "columns": "description (text), updated_at (timestamp without time zone), created_at (timestamp without time zone), amount (numeric), project_id (uuid), id (integer), months (ARRAY)"
  },
  {
    "table_name": "liabilities",
    "columns": "created_at (timestamp without time zone), project_id (uuid), id (integer), description (text), amount (numeric), updated_at (timestamp without time zone)"
  },
  {
    "table_name": "revenue_forecasts",
    "columns": "created_at (timestamp without time zone), month (text), updated_at (timestamp without time zone), id (integer), project_id (uuid), units (numeric), price (numeric), cost (numeric)"
  },
  {
    "table_name": "starting_operations",
    "columns": "updated_at (timestamp without time zone), created_at (timestamp without time zone), project_id (uuid), amount (numeric), id (integer), description (text)"
  },
  {
    "table_name": "startup_capital",
    "columns": "description (text), updated_at (timestamp without time zone), id (integer), amount (numeric), project_id (uuid), created_at (timestamp without time zone)"
  },
  {
    "table_name": "startup_costs",
    "columns": "project_id (uuid), description (text), id (integer), amount (numeric), created_at (timestamp without time zone), updated_at (timestamp without time zone)"
  },
  {
    "table_name": "variable_costs",
    "columns": "created_at (timestamp without time zone), updated_at (timestamp without time zone), description (text), amount (numeric), project_id (uuid), id (integer)"
  },
  
    {
    "table_name": "break_even_calculations",
    "columns": "gross_margin_percent_of_sales (numeric), yearly_breakeven_amount (numeric), monthly_breakeven_amount (numeric), calculated_at (timestamp without time zone), total_sales_for_the_year (numeric), id (integer), project_id (uuid), average_sales_price_per_unit (numeric), gross_profit_for_the_year (numeric), units_to_break_even (numeric), average_cost_per_unit (numeric), sales_required_to_break_even (numeric), gross_profit_margin (numeric), fixed_costs_for_the_year (numeric), contribution_margin (numeric), gross_margin_total_sales (numeric), operating_expenses (numeric)"
  },
  {
    "table_name": "cogs_calculations",
    "columns": "total_variable_costs (numeric), project_id (uuid), id (integer), calculated_at (timestamp without time zone)"
  },
  {
    "table_name": "forecast_pl_calculations",
    "columns": "project_id (uuid), id (integer), monthly_results (jsonb), total_sales (numeric), total_cogs (numeric), total_gross_profit (numeric), total_fixed_expenses (numeric), total_net_profit_or_loss (numeric), gross_profit_margin (numeric), net_profit_margin (numeric), calculated_at (timestamp without time zone)"
  },
  {
    "table_name": "funding_calculations",
    "columns": "total_revenue (numeric), total_funding_required (numeric), calculated_at (timestamp without time zone), yearly_results (jsonb), average_ebitda_margin (numeric), project_id (uuid), average_gross_profit_margin (numeric), id (integer), total_earnings (numeric), total_gross_profit (numeric)"
  },
  {
    "table_name": "salary_calculations",
    "columns": "monthly_totals (jsonb), id (integer), project_id (uuid), calculated_at (timestamp without time zone), grand_total (numeric)"
  },
  {
    "table_name": "sales_forecast_calculations",
    "columns": "id (integer), project_id (uuid), total_units_sold (numeric), total_revenue (numeric), total_cogs (numeric), total_priceperunit (numeric), total_costperunit (numeric), calculated_at (timestamp without time zone)"
  },
  {
    "table_name": "startup_calculations",
    "columns": "id (integer), project_id (uuid), total_startup_costs (numeric), calculated_at (timestamp without time zone), starting_operations_budgeted (numeric), total_startup_capital (numeric), capital_work_progress_amount (numeric)"
  }
]