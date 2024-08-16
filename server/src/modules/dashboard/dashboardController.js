import FinancialDashboardModel from './dashboardModel.js';

const FinancialDashboardController = {
    async getDashboardData(req, res) {
      try {
        const { projectId } = req.params;
        const dashboardData = await FinancialDashboardModel.getDashboardData(projectId);
        
        if (!dashboardData) {
          return res.status(404).json({ message: 'No dashboard data found for this project' });
        }
  
        res.status(200).json(dashboardData);
      } catch (error) {
        console.error('Error in getDashboardData:', error);
        res.status(500).json({ error: error.message || 'An unexpected error occurred' });
      }
    }
  };
  
  export default FinancialDashboardController;