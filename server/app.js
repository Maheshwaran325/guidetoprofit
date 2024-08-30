import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import startupCostRoutes from './src/modules/finPlanInput/startupCost/startupRoutes.js';
import fundingRoutes from './src/modules/finPlanInput/fundingPlanning/fundingRoutes.js';
import operationsFinRoutes from './src/modules/finPlanInput/operationsFin/operationsFinRoutes.js';
import payrollRoutes from './src/modules/finPlanInput/Emppayroll/payrollRoutes.js';
import startupCostRoutesOut from './src/modules/finOutput/startupCostOut/startupRouterOut.js';
import cogsCalculatorRoutes from './src/modules/finOutput/cogsCalculator/cogsRoutes.js';
import salesForecastRoutes from './src/modules/finOutput/salesForecast/salesForecastRoutes.js';
import salariesRoutes from './src/modules/finOutput/salaries/salariesRoute.js';
import forecastPLRoutes from './src/modules/finOutput/forecastPL/forecastPLRoute.js';
import breakEvenRoutes from './src/modules/finOutput/breakEvenAnalysis/breakEvenRoutes.js';
import fundingOutRoutes from './src/modules/finOutput/funding/fundingRoutes.js';
import authRoutes from './src/modules/auth/authRoutes.js';
import financialDashboardRoutes  from './src/modules/dashboard/dashboardRoutes.js';
import finbotRoutes from './src/modules/finbot/finbotRoutes.js';
import projectRoutes from './src/utils/initialsubmitRoutes.js';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://cashcompassclient-aldlq5hiu-maheshwaran325s-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/startup-cost', startupCostRoutes);
app.use('/funding', fundingRoutes);
app.use('/operations', operationsFinRoutes);
app.use('/payroll', payrollRoutes);
// Output Routes
 app.use('/startup-cost-out', startupCostRoutesOut);
 app.use('/cogs-calculator', cogsCalculatorRoutes);
 app.use('/sales-forecast', salesForecastRoutes);
 app.use('/salaries', salariesRoutes); 
 app.use('/forecast-pl', forecastPLRoutes);
 app.use('/break-even-analysis', breakEvenRoutes);
 app.use('/funding-out', fundingOutRoutes);
 app.use('/auth', authRoutes);

 //Dashboard Routes
 app.use('/financial-dashboard', financialDashboardRoutes);

 //Initial Submit Check
 app.use('/project', projectRoutes);

 // Chatbot Routes
 app.use('/api', finbotRoutes); 

 // Add error handling middleware
app.use((err, res) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
export default app;