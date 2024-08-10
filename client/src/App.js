import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './ProjectContext';
import { AuthProvider } from './auth/AuthContext';
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
import './App.css';

function App() {
  return (
    <AuthProvider>
       <ProjectProvider>       
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
            <Route path="/entrylog" element={<PrivateRoute><Entrylog /></PrivateRoute>} />
            <Route path="/startupcost" element={<PrivateRoute><StartupCost /></PrivateRoute>} />
            <Route path="/cogs_calculator" element={<PrivateRoute><CogsCalculator /></PrivateRoute>} />
            <Route path="/salesforecast" element={<PrivateRoute><Salesforecast /></PrivateRoute>} />
            <Route path="/employeesalary" element={<PrivateRoute><EmployeeSalary /></PrivateRoute>} />
            <Route path="/plforecast" element={<PrivateRoute><Plforecast /></PrivateRoute>} />
            <Route path="/breakevenanalysis" element={<PrivateRoute><BreakEvenAnalysis /></PrivateRoute>} />
            <Route path="/funding" element={<PrivateRoute><Funding /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;