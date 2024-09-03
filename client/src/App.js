import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Modal from 'react-modal';
import { ProjectProvider } from './ProjectContext';
import { AuthProvider } from './auth/AuthContext';
import { SpeedInsights } from '@vercel/speed-insights';
import { Analytics } from "@vercel/analytics/react"
import PrivateRoute from './auth/PrivateRoute';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import MainPage from "./pages/dashboardmain/dashboardmain";
import Entrylog from "./pages/entrylog/entrylog";
import StartupCost from "./pages/startupcost/startupcost";
import CogsCalculator from "./pages/cogs_calculator/cogs_calculator";
import Salesforecast from "./pages/salesforecast/salesforecast";
import EmployeeSalary from "./pages/employeeSalary/employeeSalary";
import Plforecast from "./pages/plforecast/plforecast";
import BreakEvenAnalysis from "./pages/break_even_analysis/breakEvenAnalysis";
import Funding from "./pages/funding/funding";
import Finbot from '../src/components/finbot/finbot';
import Calculator from '../src/components/calculator/calculator.jsx';
import BackToTopButton from '../src/components/backtotop/backtotop.jsx';
import Glossary from './pages/glossary/glossary.jsx';
import Home from './pages/home/home.jsx'
import './App.css';

Modal.setAppElement('#root');

function App() {
  return (
    <AuthProvider>
       <ProjectProvider>       
      <Router>
        <div className="App">
          <Routes>
          <SpeedInsights />
          <Analytics/>
          <Route path="/" element={<><Home /><BackToTopButton /></>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute><MainPage /><Finbot /><Calculator/><BackToTopButton/></PrivateRoute>} />
            <Route path="/entrylog" element={<PrivateRoute><Entrylog /><Finbot /><Calculator/><BackToTopButton/></PrivateRoute>} />
            <Route path="/startupcost" element={<PrivateRoute><StartupCost /><Finbot /><Calculator/><BackToTopButton/></PrivateRoute>} />
            <Route path="/cogs_calculator" element={<PrivateRoute><CogsCalculator /><Finbot /><Calculator/><BackToTopButton/></PrivateRoute>} />
            <Route path="/salesforecast" element={<PrivateRoute><Salesforecast /><Finbot /><Calculator/><BackToTopButton/></PrivateRoute>} />
            <Route path="/employeesalary" element={<PrivateRoute><EmployeeSalary /><Finbot /><Calculator/><BackToTopButton/></PrivateRoute>} />
            <Route path="/plforecast" element={<PrivateRoute><Plforecast /><Finbot /><Calculator/><BackToTopButton/></PrivateRoute>} />
            <Route path="/breakevenanalysis" element={<PrivateRoute><BreakEvenAnalysis /><Finbot /><Calculator/><BackToTopButton/></PrivateRoute>} />
            <Route path="/funding" element={<PrivateRoute><Funding /><Finbot /><Calculator/><BackToTopButton/></PrivateRoute>} />
            <Route path="/glossary" element={<PrivateRoute><Glossary /><Finbot /><Calculator/><BackToTopButton/></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;