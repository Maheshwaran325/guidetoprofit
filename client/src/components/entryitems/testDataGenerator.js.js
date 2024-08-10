import React, { useState, useEffect, useCallback } from 'react';
import './entryitems.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useProject } from '../../ProjectContext';  
import { useAuth } from '../../auth/AuthContext'; 
import { Modal, Button, Form, Table  } from 'react-bootstrap'; 
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility'; 

// icons
import { MdEdit } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";

// Constants for months and years
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = ['Year1', 'Year2', 'Year3', 'Year4', 'Year5'];

// =============================================================================
// RevenueForecasts Component
// =============================================================================
const RevenueForecasts = ({ onDataUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [monthlyData, setMonthlyData] = useState(
    months.map(month => ({
      month,
      units: '',
      price: '',
      cost: ''
    }))
  );
  const [error, setError] = useState('');

  // Update parent component with monthly data whenever it changes
  useEffect(() => {
    onDataUpdate(monthlyData);
  }, [monthlyData, onDataUpdate]);

  // Modal show/hide handlers
  const handleShowModal = () => {
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  // Handle changes in the input fields
  const handleDataChange = (index, field, value) => {
    setMonthlyData(prevData => 
      prevData.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Check if all fields are filled
  const isDataComplete = () => {
    return monthlyData.every(item => 
      item.units !== '' && item.price !== '' && item.cost !== ''
    );
  };

  // Save data if complete, otherwise show error
  const handleSave = () => {
    if (!isDataComplete()) {
      setError('All fields for all months must be filled out.');
    } else {
      setShowModal(false);
      setError('');
    }
  };

  // Calculate total for units, price, and cost
  const calculateTotal = (field) => {
    return monthlyData.reduce((sum, item) => sum + Number(item[field] || 0), 0);
  };

  return (
    <div className="container-fluid form-container">
      <h6>Revenue Forecast:</h6>
      {/* Display input field showing data completeness */}
      <div className="form-group row">
        <div className="col-sm-10">
          <input 
            type="text" 
            className="form-control" 
            value={isDataComplete() ? 'All data filled' : 'Incomplete'} 
            readOnly 
          />
        </div>
        {/* Edit button to open the modal */}
        <div className="col-sm-2">
          <button className="btn btnEditDelete" onClick={handleShowModal}><MdEdit /></button>
        </div>
      </div>

      {/* Modal for editing revenue forecast data */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Revenue Forecast</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Table to display and edit monthly data */}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Units Sold</th>
                  <th>Price Per Unit</th>
                  <th>Cost Per Unit</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, index) => (
                  <tr key={item.month}>
                    <td>{item.month}</td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.units}
                        onChange={(e) => handleDataChange(index, 'units', e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.price}
                        onChange={(e) => handleDataChange(index, 'price', e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.cost}
                        onChange={(e) => handleDataChange(index, 'cost', e.target.value)}
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Display totals for units, price, and cost */}
              <tfoot>
                <tr>
                  <th>Total</th>
                  <th>{calculateTotal('units')}</th>
                  <th>{calculateTotal('price')}</th>
                  <th>{calculateTotal('cost')}</th>
                </tr>
              </tfoot>
            </Table>
          </Form>
          {/* Display error message if any */}
          {error && <div className="text-danger">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// =============================================================================
// Entryitems Component (Main Component)
// =============================================================================
function Entryitems() {
  // Context and State
  const { projectId } = useProject();
  const { user } = useAuth();

  // State for various input sections
  const [startupCosts, setStartupCosts] = useState([{ description: '', amount: '' }]);
  const [startupCapital, setStartupCapital] = useState([{ description: '', amount: '' }]);
  const [capitalWorkProgress, setCapitalWorkProgress] = useState([{ description: '', amount: '' }]);
  const [startingOperations, setStartingOperations] = useState([{ description: '', amount: '' }]);
  const [assets, setAssets] = useState([{ description: '', amount: '' }]);
  const [liabilities, setLiabilities] = useState([{ description: '', amount: '' }]);
  const [cashFlow, setCashFlow] = useState([{ description: '', amount: '' }]);
  const [revenueForecasts, setRevenueForecasts] = useState([]);
  const [variableCosts, setVariableCosts] = useState([{ description: '', amount: '' }]);
  
  // State for active tab and loading/error states
  const [activeTab, setActiveTab] = useState('nav-startup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for Employee Payroll Modal
  const [employeePayrolls, setEmployeePayrolls] = useState([]);
  const [showModalPayroll, setShowModalPayroll] = useState(false);
  const [payrollDesignation, setPayrollDesignation] = useState('');
  const [payrollSalary, setPayrollSalary] = useState('');
  const [selectedMonthsPayroll, setSelectedMonthsPayroll] = useState([]);
  const [editingIndexPayroll, setEditingIndexPayroll] = useState(null);
  
  // State for Funding & Financial Planning Modals
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [capitalCosts, setCapitalCosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalDescription, setModalDescription] = useState('');
  const [modalAmount, setModalAmount] = useState('');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // =============================================================================
  // Helper Functions
  // =============================================================================

  // Add a new item to a specific input section
  const handleAddItem = (setFunction) => {
    setFunction(prevItems => [...prevItems, { description: '', amount: '' }]);
  };

  // Format number with commas
  const formatNumber = (num) => {
    if (num === '') return '';
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  // Parse number from formatted string
  const parseNumber = (str) => {
    return str.replace(/,/g, '');
  };

  // Handle input changes for description and amount fields
  const handleInputChange = (index, setFunction, field, value) => {
    setFunction(prevItems => {
      const newItems = [...prevItems];
      if (field === 'amount') {
        const sanitizedValue = value.replace(/[^\d,]/g, '');
        const numberValue = parseNumber(sanitizedValue);
        newItems[index][field] = numberValue;
      } else {
        newItems[index][field] = value;
      }
      return newItems;
    });
  };

  // Options for input datalists
  const inputOptions = {
    startupCosts: [
      'Business Registration fees',
      'Product Development',
      'Website Design',
      'Website Development',
      'Computer Systems',
      'Market Research',
      'Legal Fees',
      'Initial Inventory',
      'Marketing and Advertising',
      'Leasehold Improvements',
      'Furniture and Fixtures'
    ],
    startupCapital: [
        'Share Capital (By team)',
        'Loans (from Bank)',
        'Loans (from Others)',
        'Angel Investors',
        'Venture Capital',
        'Crowdfunding',
        'Government Grants',
        'Personal Savings',
        'Family and Friends\' Contributions'
    ],
    capitalWorkProgress: [
        'Additional Workstation',
        'Office Renovation',
        'Equipment Installation',
        'Research and Development Facilities',
        'Production Line Setup',
        'IT Infrastructure Development',
        'Custom Software Development'
    ],
    startingOperations: [
        'Product Launch Expenses',
        'Rental Expenses',
        'Stationary & Office Supplies',
        'Miscellaneous',
        'Initial Marketing Campaign',
        'Staff Training Programs',
        'Initial Stock Purchase',
        'Office Setup Costs',
        'Grand Opening Events'
    ],
    assets: [
      'Cash',
      'Accounts Receivable',
      'Inventory',
      'Equipment',
      'Intellectual Property',
      'Vehicles',
      'Real Estate',
      'Prepaid Expenses',
      'Investments'
    ],
    liabilities: [
        'Loans',
        'Accounts Payable',
        'Mortgages',
        'Credit Card Debt',
        'Deferred Revenue',
        'Accrued Expenses',
        'Tax Liabilities',
        'Lease Obligations'
    ],
    cashFlow: [
        'Cash from Operations',
        'Cash from Investing',
        'Cash from Financing',
        'Accounts Receivable Collections',
        'Proceeds from Asset Sales',
        'Interest and Dividends',
        'Issuance of Stock',
        'Debt Repayments'
    ],
    capitalCosts: [
        'Equipment Purchases',
        'Facility Upgrades',
        'Major Renovations',
        'Long-term Marketing Campaigns',
        'Development of New Products',
        'Major Software Overhauls',
        'Infrastructure Expansion'
    ],
    variableCosts: [
        'Cost of Goods Sold',
        'Direct Labor Costs',
        'Materials',
        'Commissions',
        'Raw Materials',
        'Packaging Costs',
        'Sales Commissions',
        'Shipping and Handling',
        'Production Supplies'
    ],
  };
  
  // Handle revenue data updates from RevenueForecasts component
  const handleRevenueDataUpdate = (data) => {
    setRevenueForecasts(data);
  };

  // Clear all items in a specific input section
  const handleClearAll = (setFunction) => {
    setFunction([{ description: '', amount: '' }]);
  };
  
  // Navigate to the next tab
  const handleNextTab = () => {
    const tabs = ['nav-startup', 'nav-funding', 'nav-operations', 'nav-payroll'];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };

  // Render input fields for a specific section
  const renderInputs = (items, setFunction, inputType) => (
    items.map((item, index) => (
      <div className="form-group row" key={index}>
        {/* Description input with datalist */}
        <div className="col-sm-6">
          <input
            type="text"
            className="form-control"
            placeholder="Add description"
            value={item.description}
            onChange={(e) => handleInputChange(index, setFunction, 'description', e.target.value)}
            list={`options-${inputType}-${index}`}
          />
          <datalist id={`options-${inputType}-${index}`}>
            {inputOptions[inputType].map((option, optIndex) => (
              <option key={optIndex} value={option} />
            ))}
          </datalist>
        </div>
        {/* Amount input */}
        <div className="col-sm-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="₹"
              value={formatNumber(item.amount)}
              onChange={(e) => handleInputChange(index, setFunction, 'amount', e.target.value)}
            />
          </div>
        </div>
        {/* Delete button */}
        <div className="col-sm-2">
          <button 
            className="btn btn-sm btnEditDelete"
            onClick={() => handleDeleteItem(index, setFunction)}
          >
            <MdOutlineDeleteOutline />
          </button>
        </div>
      </div>
    ))
  );
  
  // =============================================================================
  // Financial Modal Handlers
// =============================================================================

// Open the modal for fixed expenses and capital costs
const handleModalOpen = (type, index = null) => {
  setModalType(type);
  setEditingIndex(index);

  if (index !== null) {
    // Editing an existing item
    if (type === 'fixedExpense') {
      const expense = fixedExpenses[index];
      setModalDescription(expense.description);
      setModalAmount(formatNumber(expense.amount));
      setSelectedMonths(expense.months);
    } else if (type === 'capitalCost') {
      const cost = capitalCosts[index];
      setModalDescription(cost.description);
      setModalAmount(formatNumber(cost.amount));
      setSelectedYears(cost.years);
    }
  } else {
    // Adding a new item
    setModalDescription('');
    setModalAmount('');
    setSelectedMonths([]);
    setSelectedYears([]);
  }

  setShowModal(true);
};

// Close the modal and reset all related states
const handleModalClose = () => {
  setShowModal(false);
  setModalType(null);
  setEditingIndex(null);
  setModalDescription('');
  setModalAmount('');
  setSelectedMonths([]);
  setSelectedYears([]);
};

// Handle input changes in the modal
const handleModalInputChange = (field, value) => {
  if (field === 'amount') {
    // Sanitize the amount input to allow only numbers and commas
    const sanitizedValue = value.replace(/[^\d,]/g, '');
    setModalAmount(sanitizedValue);
  } else {
    setModalDescription(value);
  }
};

// Save a fixed expense
const handleSaveFixedExpense = async () => {
  // Validate input
  if (!modalDescription || !modalAmount) {
    alert('Please fill out description and amount fields.');
    return;
  }

  if (selectedMonths.length === 0) {
    alert('Please select at least one month.');
    return;
  }

  const expenseData = {
    id: editingIndex !== null ? fixedExpenses[editingIndex].id : null,
    description: modalDescription,
    amount: parseNumber(modalAmount),
    months: selectedMonths
  };

  try {
    let response;
    if (editingIndex !== null) {
      // Update existing expense
      response = await authenticatedRequest(
        `http://localhost:8000/funding/update-fixed-expense/${projectId}`,
        'PUT',
        expenseData
      );
    } else {
      // Add new expense
      response = await authenticatedRequest(
        `http://localhost:8000/funding/add-fixed-expense/${projectId}`,
        'POST',
        expenseData
      );
    }

    if (response.data && response.data.fixed_expenses) {
      setFixedExpenses(response.data.fixed_expenses);
      handleModalClose();
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (err) {
    console.error('Error saving fixed expense:', err);
    setError(`Failed to save fixed expense: ${err.message}`);
  }
};


const handleSaveCapitalCost = async () => {
  // Validate input
  if (!modalDescription || !modalAmount) {
    alert('Please fill out description and amount fields.');
    return;
  }

  if (selectedYears.length === 0) {
    alert('Please select at least one year.');
    return;
  }

  const costData = {
    id: editingIndex !== null ? capitalCosts[editingIndex].id : null,
    description: modalDescription,
    amount: parseNumber(modalAmount),
    years: selectedYears
  };

  try {
    let response;
    if (editingIndex !== null) {
      // Update existing cost
      response = await authenticatedRequest(
        `http://localhost:8000/funding/update-capital-cost/${projectId}`,
        'PUT',
        costData
      );
    } else {
      // Add new cost
      response = await authenticatedRequest(
        `http://localhost:8000/funding/add-capital-cost/${projectId}`,
        'POST',
        costData
      );
    }

    if (response.data && response.data.capital_costs) {
      setCapitalCosts(response.data.capital_costs);
      handleModalClose();
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (err) {
    setError(`Failed to save capital cost: ${err.message}`);
  }
};
// Toggle month selection for fixed expenses
    const handleMonthChange = (month) => {
      setSelectedMonths(prevMonths => 
        prevMonths.includes(month)
          ? prevMonths.filter(m => m !== month)
          : [...prevMonths, month]
      );
    };

// Toggle year selection for capital costs
  const handleYearChange = (year) => {
    setSelectedYears(prevYears => 
      prevYears.includes(year)
        ? prevYears.filter(y => y !== year)
        : [...prevYears, year]
    );
  };

  // Delete a fixed expense
  const handleDeleteFixedExpense = async (index) => {
    try {
      const response = await authenticatedRequest(`http://localhost:8000/funding/delete-fixed-expense/${projectId}`, 'DELETE', { index });
      setFixedExpenses(response.data.fixed_expenses);
    } catch (err) {
      setError('Failed to delete fixed expense. Please try again.');
      console.error('Error deleting fixed expense:', err);
    }
  };

  // Delete a capital cost
  const handleDeleteCapitalCost = async (index) => {
    try {
      const response = await authenticatedRequest(`http://localhost:8000/funding/delete-capital-cost/${projectId}`, 'DELETE', { index });
      setCapitalCosts(response.data.capital_costs);
    } catch (err) {
      setError('Failed to delete fixed expense. Please try again.');
      console.error('Error deleting fixed expense:', err);
    }
  };

  // Delete an item from a specific section and update the server if necessary
  const handleDeleteItem = async (index, setter) => {
    try {
      setter(prev => {
        const newItems = [...prev];
        const itemToDelete = newItems[index];
        if (itemToDelete.id) {
          // Determine the table name based on the setter function
          let table;
          let endpoint;
          if (setter === setStartupCosts) {
            table = 'startup_costs';
            endpoint = 'startup-cost';
          }
          else if (setter === setStartupCapital) {
            table = 'startup_capital';
            endpoint = 'startup-cost';
          }
          else if (setter === setCapitalWorkProgress) {
            table = 'capital_work_progress';
            endpoint = 'startup-cost';
          }
          else if (setter === setStartingOperations) {
            table = 'starting_operations';
            endpoint = 'startup-cost';
          }
          else if (setter === setFixedExpenses) {
            table = 'fixed_expenses';
            endpoint = 'funding';
          }
          else if (setter === setCapitalCosts) {
            table = 'capital_costs';
            endpoint = 'funding';
          }
          else if (setter === setAssets) {
            table = 'assets';
            endpoint = 'funding';
          }
          else if (setter === setLiabilities) {
            table = 'liabilities';
            endpoint = 'funding';
          }
          else if (setter === setCashFlow) {
            table = 'cash_flow';
            endpoint = 'funding';
          }
  
          // Delete from the server
          authenticatedRequest(`http://localhost:8000/${endpoint}/delete-item/${itemToDelete.id}/${projectId}?table=${table}`, 'DELETE')
            .catch(err => {
              console.error('Error deleting item from server:', err);
              setError('Failed to delete item from server. Please try again.');
            });
        }
        // Remove the item from the local state
        return newItems.filter((_, i) => i !== index);
      });
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error('Error deleting item:', err);
    }
  };
  // =============================================================================
  // Data Fetching and Submission
  // =============================================================================
  
  // Fetch project data from the server
  const fetchProjectData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedRequest(`http://localhost:8000/startup-cost/project-data/${projectId}`, 'GET');
      const data = response.data;
      setStartupCosts(data.startup_costs || []);
      setStartupCapital(data.startup_capital || []);
      setCapitalWorkProgress(data.capital_work_progress || []);
      setStartingOperations(data.starting_operations || []);
    } catch (err) {
      setError('Failed to fetch project data. Please try again.');
      console.error('Error fetching project data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Fetch project data for Finanicial Model
  const fetchFundingData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedRequest(`http://localhost:8000/funding/project-data/${projectId}`, 'GET');
      const data = response.data;
      setFixedExpenses(data.fixed_expenses || []);
      setCapitalCosts(data.capital_costs || []);
      setAssets(data.assets || []);
      setLiabilities(data.liabilities || []);
      setCashFlow(data.cash_flow || []);
    } catch (err) {
      setError('Failed to fetch funding data. Please try again.');
      console.error('Error fetching funding data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Use effect to fetch data when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, fetchProjectData]);

  useEffect(() => {
    if (projectId) {
      fetchFundingData();
    }
  }, [projectId, fetchFundingData]);

  // Submit startup cost data to the server
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      if (!projectId) {
        throw new Error('Project ID is not available. Please try again later.');
      }
      const requestData = {
        projectId,
        startupCosts,
        startupCapital,
        capitalWorkProgress,
        startingOperations
      };
      
      const response = await authenticatedRequest('http://localhost:8000/startup-cost/startup-data', 'POST', requestData);
      console.log('Server response:', response);
      fetchProjectData(); // Refresh data after submission
    } catch (err) {
      console.error('Error submitting data:', err);
      setError(err.message || 'An error occurred while submitting the data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  // Submit funding data to the server
  const handleFundingSubmit = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      if (!projectId) {
        throw new Error('Project ID is not available. Please try again later.');
      }
  
      const requestData = {
        userId: user.id,
        projectId,
        fixedExpenses: fixedExpenses.filter(item => item.description && item.amount && item.months.length > 0),
        assets: assets.filter(item => item.description && item.amount),
        liabilities: liabilities.filter(item => item.description && item.amount),
        capitalCosts: capitalCosts.filter(item => item.description && item.amount && item.years.length > 0),
        cashFlow: cashFlow.filter(item => item.description && item.amount),
      };
  
      console.log('Submitting request with data:', requestData);
      const response = await authenticatedRequest('http://localhost:8000/funding/funding-data', 'POST', requestData);
  
      console.log('Server response:', response);
      fetchFundingData(); // Refresh data after submission
  
    } catch (err) {
      console.error('Error submitting funding data:', err);
      setError(err.message || 'An error occurred while submitting the funding data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit operations and finance data to the server
  const handleOperationsFinanceSubmit = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      if (!projectId) {
        throw new Error('Project ID is not available. Please try again later.');
      }
  
      const requestData = {
        userId: user.id,
        projectId,
        revenueForecasts: revenueForecasts,
        variableCosts: variableCosts.filter(item => item.description && item.amount),
      };
  
      console.log('Submitting request with data:', requestData);
      const response = await authenticatedRequest('http://localhost:8000/operations/data', 'POST', requestData);
  
      console.log('Server response:', response);
  
      if (response.data && response.data.message) {
        // You might want to add some user feedback here, e.g., a success message
      } else {
        console.error('Unexpected response structure');
        setError('Unexpected response structure. Please check the server response.');
      }
    } catch (err) {
      console.error('Error submitting operations and finance data:', err);
      setError(err.message || 'An error occurred while submitting the data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // Employee Payroll Handlers
  // =============================================================================

  // Open the modal for employee payroll
  const handleEmployeePayrollModal = (index = null) => {
    setEditingIndexPayroll(index);
  
    if (index !== null && index >= 0 && index < employeePayrolls.length) {
      const payroll = employeePayrolls[index];
      setPayrollDesignation(payroll.designation);
      setPayrollSalary(payroll.salary);
      setSelectedMonthsPayroll(payroll.months);
    } else {
      // Reset fields for new entry or invalid index
      setPayrollDesignation('');
      setPayrollSalary('');
      setSelectedMonthsPayroll([]);
    }
  
    setShowModalPayroll(true);
  };

  
  // Function to handle modal close
  const handleEmployeePayrollModalClose = () => {
    setShowModalPayroll(false);
    setEditingIndexPayroll(null);
    setPayrollDesignation('');
    setPayrollSalary('');
    setSelectedMonthsPayroll([]);
  };

  // Add this function to handle saving employee payroll
// Save employee payroll
const handleSaveEmployeePayroll = async () => {
  if (!payrollDesignation || !payrollSalary || selectedMonthsPayroll.length === 0) {
    alert('Please fill out all fields and select at least one month.');
    return;
  }

  const payrollData = {
    id: editingIndexPayroll !== null ? employeePayrolls[editingIndexPayroll].id : null,
    designation: payrollDesignation,
    salary: parseFloat(payrollSalary),
    months: selectedMonthsPayroll
  };

  try {
    let response;
    if (editingIndexPayroll !== null) {
      response = await authenticatedRequest(
        `http://localhost:8000/payroll/update-employee-payroll/${projectId}`,
        'PUT',
        payrollData
      );
    } else {
      response = await authenticatedRequest(
        `http://localhost:8000/payroll/add-employee-payroll/${projectId}`,
        'POST',
        payrollData
      );
    }

    if (response.data && response.data.employee_payrolls) {
      setEmployeePayrolls(response.data.employee_payrolls);
      handleEmployeePayrollModalClose();
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (err) {
    console.error('Error saving employee payroll:', err);
    setError(`Failed to save employee payroll: ${err.message}`);
  }
};


  // Add handleMonthChangePayroll
  const handleMonthChangePayroll = (month) => {
    setSelectedMonthsPayroll(prevMonths => {
      const updatedMonths = prevMonths.includes(month)
        ? prevMonths.filter(m => m !== month)
        : [...prevMonths, month];
      return updatedMonths;
    });
  };

  // Add this function to handle deleting employee payroll
  const handleDeleteEmployeePayroll = async (index) => {
    try {
      const response = await authenticatedRequest(
        `http://localhost:8000/payroll/delete-employee-payroll/${projectId}`,
        'DELETE',
        { index }
      );
      setEmployeePayrolls(response.data.employee_payrolls);
    } catch (err) {
      setError('Failed to delete employee payroll. Please try again.');
      console.error('Error deleting employee payroll:', err);
    }
  };
  

  const fetchPayrollData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedRequest(`http://localhost:8000/payroll/project-data/${projectId}`, 'GET');
      const data = response.data;
      setEmployeePayrolls(data.employee_payrolls || []);
    } catch (err) {
      setError('Failed to fetch payroll data. Please try again.');
      console.error('Error fetching payroll data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchPayrollData();
    }
  }, [projectId, fetchPayrollData]);
  // Submit payroll data to the server

  const handlePayrollSubmit = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      if (!projectId) {
        throw new Error('Project ID is not available. Please try again later.');
      }
  
      const requestData = {
        userId: user.id,
        projectId,
        employeePayrolls: employeePayrolls.filter(payroll => 
          payroll.designation && payroll.salary && payroll.months.length > 0
        ),
      };
  
      console.log('Submitting request with data:', requestData);
      const response = await authenticatedRequest('http://localhost:8000/payroll/submit-data', 'POST', requestData);
      console.log('Server response:', response);
      fetchPayrollData(); // Refresh data after submission
  
    } catch (err) {
      console.error('Error submitting payroll data:', err);
      setError(err.message || 'An error occurred while submitting the payroll data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================================================
  // JSX Rendering
  // =============================================================================

  return (
    <div className="entryitems d-flex flex-column justify-content-center">
      {/* Navigation Tabs */}
      <nav className="nav nav-tabs justify-content-center">
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button className={`nav-link ${activeTab === 'nav-startup' ? 'active' : ''}`} id="nav-startup-tab" data-bs-toggle="tab" data-bs-target="#nav-startup" type="button" role="tab" aria-controls="nav-startup" aria-selected={activeTab === 'nav-startup'}>Startup Cost</button>
          <button className={`nav-link ${activeTab === 'nav-funding' ? 'active' : ''}`} id="nav-funding-tab" data-bs-toggle="tab" data-bs-target="#nav-funding" type="button" role="tab" aria-controls="nav-funding" aria-selected={activeTab === 'nav-funding'}>Funding & Financial Planning</button>
          <button className={`nav-link ${activeTab === 'nav-operations' ? 'active' : ''}`} id="nav-operations-tab" data-bs-toggle="tab" data-bs-target="#nav-operations" type="button" role="tab" aria-controls="nav-operations" aria-selected={activeTab === 'nav-operations'}>Operations & Finance</button>
          <button className={`nav-link ${activeTab === 'nav-payroll' ? 'active' : ''}`} id="nav-payroll-tab" data-bs-toggle="tab" data-bs-target="#nav-payroll" type="button" role="tab" aria-controls="nav-payroll" aria-selected={activeTab === 'nav-payroll'}>Employee Payrolls</button>
        </div>
      </nav>

      {/* Tab Content */}
      <div className="tab-content" id="nav-tabContent">
        {/* Startup Costs Tab */}
        <div className={`tab-pane fade ${activeTab === 'nav-startup' ? 'show active' : ''}`} id="nav-startup" role="tabpanel" aria-labelledby="nav-startup-tab">
        <div className="container-fluid form-container">
          <h5 className="text-center">Startup Costs</h5>
          <div className="row">
            <div className="col-6">
              <div className="container-fluid form-container">
                <h6>Starting up costs:</h6>
                <div className="form-group row">
                  <div className="col-sm-9">
                    <small className="form-text text-muted">(Ex. Business Registration fees, Product Development, Website Design, Website Development, Computer Systems etc.,)</small>
                  </div>
                  <div className="col-sm-3 text-right">
                    <button type="button" className="btn btn-add" onClick={() => handleAddItem(setStartupCosts)}>Add item +</button>
                  </div>
                </div>
                {renderInputs(startupCosts, setStartupCosts, 'startupCosts')}
                <h6 style={{ marginTop: "50px" }}>Startup Capital:</h6>
                <div className="form-group row">
                  <div className="col-sm-9">
                    <small className="form-text text-muted">(Ex. Share Capital (By team), Loans (from Bank or Others))</small>
                  </div>
                  <div className="col-sm-3 text-right">
                    <button type="button" className="btn btn-add" onClick={() => handleAddItem(setStartupCapital)}>Add item +</button>
                  </div>
                </div>
                {renderInputs(startupCapital, setStartupCapital, 'startupCapital')}
              </div>
            </div>
            <div className="col-6">
              <div className="container form-container">
                <div className="form-group row">
                  <div className="col-sm-9">
                    <h6>Capital Work in Progress:</h6>
                    <small className="form-text text-muted">(Ex. Additional Workstation etc.,)</small>
                  </div>
                  <div className="col-sm-3 text-right">
                    <button type="button" className="btn btn-add" onClick={() => handleAddItem(setCapitalWorkProgress)}>Add item +</button>
                  </div>
                </div>
                {renderInputs(capitalWorkProgress, setCapitalWorkProgress, 'capitalWorkProgress')}
                <div className="form-group row">
                  <div className="col-sm-9">
                    <h6 style={{ marginTop: "50px" }}>Starting Operations:</h6>
                    <small className="form-text text-muted">(Ex. Product Launch Expenses, Rental Expenses, Stationary & Office Supplies, Miscellaneous)</small>
                  </div>
                  <div className="col-sm-3 text-right">
                    <button type="button" className="btn btn-add" onClick={() => handleAddItem(setStartingOperations)}>Add item +</button>
                  </div>
                </div>
                {renderInputs(startingOperations, setStartingOperations, 'startingOperations')}
              </div>
            </div>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <div className="d-flex justify-content-center">
            <button className="submit-btn-last btn mx-2" onClick={() => {
              setStartupCosts([]);
              setStartupCapital([]);
              setCapitalWorkProgress([]);
              setStartingOperations([]);
            }}>Clear All</button>
            <button className="submit-btn-last btn mx-2" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
            <button className="submit-btn-last btn mx-2" onClick={() => setActiveTab('nav-next')}>Next</button>
          </div>
        </div>
      </div>

        {/* Funding & Financial Planning Tab */}
        <div className={`tab-pane fade ${activeTab === 'nav-funding' ? 'show active' : ''}`} id="nav-funding" role="tabpanel" aria-labelledby="nav-funding-tab">
          <div className="container-fluid form-container">
            <h5 className="text-center">Funding & Financial Planning</h5>
            <div className="row">
              <div className="col-6">
                <div className="container-fluid form-container">
                  <div className="form-group row">
                    <div className="col-sm-9">
                      <h6>Fixed Expenses:</h6>
                      <small className="form-text text-muted">
                        (Ex. Office Rent, Employee Salaries, Utilities, Insurance)
                      </small>
                    </div>
                    <div className="col-sm-3 text-right">
                      <button
                        type="button"
                        className="btn btn-add"
                        onClick={() => handleModalOpen('fixedExpense')}
                      >
                        Monthly Expenses
                      </button>
                    </div>
                  </div>
                  {fixedExpenses.map((expense, index) => (
                    <div key={index} className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          value={`${expense.description} (${expense.months.join(', ')})`}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          value={formatNumber(expense.amount)}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-3">
                        <button
                          className="btn btn-sm btnEditDelete me-2"
                          onClick={() => handleModalOpen('fixedExpense', index)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="btn btn-sm btnEditDelete"
                          onClick={() => handleDeleteFixedExpense(index)}
                        >
                          <MdOutlineDeleteOutline />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="form-group row" style={{marginTop:"50px"}}>
                    <h6>Assets:</h6>
                    <div className="col-sm-9">
                      <small className="form-text text-muted">(Ex. Cash, Accounts Receivable, Inventory, Equipment)</small>
                    </div>
                    <div className="col-sm-3 text-right">
                      <button type="button" className="btn btn-add" onClick={() => handleAddItem(setAssets)}>Add item +</button>
                    </div>
                  </div>
                  {renderInputs(assets, setAssets, 'assets')}

                  <div className="form-group row" style={{marginTop:"50px"}}>
                    <div className="col-sm-9">
                      <h6>Cash Flow:</h6>
                      <small className="form-text text-muted">(Ex. Cash from Operations, Cash from Investing, Cash from Financing)</small>
                    </div>
                    <div className="col-sm-3 text-right">
                      <button type="button" className="btn btn-add" onClick={() => handleAddItem(setCashFlow)}>Add item +</button>
                    </div>
                  </div>
                  {renderInputs(cashFlow, setCashFlow, 'cashFlow')}
                </div>
              </div>
              <div className="col-6">
                <div className="container form-container">
                  <div className="form-group row">
                    <div className="col-sm-9">
                      <h6>Liabilities:</h6>
                      <small className="form-text text-muted">(Ex. Loans, Accounts Payable, Mortgages)</small>
                    </div>
                    <div className="col-sm-3 text-right">
                      <button type="button" className="btn btn-add" onClick={() => handleAddItem(setLiabilities)}>Add item +</button>
                    </div>
                  </div>
                  {renderInputs(liabilities, setLiabilities, 'liabilities')}

                  <div className="form-group row" style={{marginTop:"50px"}}>
                    <div className="col-sm-9">
                      <h6>Capital Costs (5 Years):</h6>
                      <small className="form-text text-muted">(Ex. Equipment Purchases, Facility Upgrades)</small>
                    </div>
                    <div className="col-sm-3 text-right">
                      <button type="button" className="btn btn-add" onClick={() => handleModalOpen('capitalCost')}>Add Capital Cost</button>
                    </div>
                  </div>
                  {capitalCosts.map((cost, index) => (
                    <div key={index} className="form-group row">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control"
                          value={`${cost.description} (${cost.years.join(', ')})`}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          value={formatNumber(cost.amount)}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-3">
                        <button className="btn btn-sm btnEditDelete me-2" onClick={() => handleModalOpen('capitalCost', index)}><MdEdit /></button>
                        <button className="btn btn-sm btnEditDelete" onClick={() => handleDeleteCapitalCost(index)}>  <MdOutlineDeleteOutline /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button className="submit-btn-last btn mx-2" onClick={() => {
                handleClearAll(setAssets);
                handleClearAll(setLiabilities);
                handleClearAll(setCashFlow);
              }}>Clear All</button>
              <button 
                className="submit-btn-last btn mx-2" 
                onClick={handleFundingSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
              <button className="submit-btn-last btn mx-2" onClick={handleNextTab}>Next</button>
            </div>
          </div>
        </div>

        {/* Funding Modal */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingIndex !== null ? 'Edit' : 'Add'}{' '}
              {modalType === 'fixedExpense' ? 'Monthly Expense' : 'Capital Cost'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  value={modalDescription}
                  onChange={(e) => handleModalInputChange('description', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter amount"
                  value={modalAmount}
                  onChange={(e) => handleModalInputChange('amount', e.target.value)}
                />
              </Form.Group>

              {modalType === 'fixedExpense' && (
                <Form.Group>
                  <Form.Label>Select Months:</Form.Label>
                  <div className="d-flex flex-wrap">
                    {months.map((month) => (
                      <Form.Check
                        key={month}
                        type="checkbox"
                        id={`month-${month}`}
                        label={month}
                        checked={selectedMonths.includes(month)}
                        onChange={() => handleMonthChange(month)}
                        className="me-3 mb-2"
                      />
                    ))}
                  </div>
                </Form.Group>
              )}
              {modalType === 'capitalCost' && (
                <Form.Group>
                  <Form.Label>Select Years:</Form.Label>
                  <div className="d-flex flex-wrap">
                    {years.map(year => (
                      <Form.Check
                        key={year}
                        type="checkbox"
                        id={`year-${year}`}
                        label={year}
                        checked={selectedYears.includes(year)}
                        onChange={() => handleYearChange(year)}
                        className="me-3 mb-2"
                      />
                    ))}
                  </div>
                </Form.Group>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={
                modalType === 'fixedExpense'
                  ? handleSaveFixedExpense
                  : handleSaveCapitalCost
              }
            >
              {editingIndex !== null ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Operations & Finance Tab */}
        <div className={`tab-pane fade ${activeTab === 'nav-operations' ? 'show active' : ''}`} id="nav-operations" role="tabpanel" aria-labelledby="nav-operations-tab">
          <div className="container-fluid form-container">
            <h5 className="text-center">Operations & Finance</h5>
            <div className="row">
              <div className="col-6">
              <RevenueForecasts onDataUpdate={handleRevenueDataUpdate} />
              </div>
              <div className="col-6">
                <div className="container-fluid form-container">
                  <h6>Variable Costs:</h6>
                  <div className="form-group row">
                    <div className="col-sm-9">
                      <small className="form-text text-muted">(Ex. Cost of Goods Sold, Direct Labor Costs)</small>
                    </div>
                    <div className="col-sm-3 text-right">
                      <button type="button" className="btn btn-add" onClick={() => handleAddItem(setVariableCosts)}>Add item +</button>
                    </div>
                  </div>
                  {renderInputs(variableCosts, setVariableCosts, 'variableCosts')}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center">
            <button className="submit-btn-last btn mx-2" onClick={() => handleClearAll(setVariableCosts)}>Clear All</button>
            <button className="submit-btn-last btn mx-2" onClick={handleOperationsFinanceSubmit} disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
              <button className="submit-btn-last btn mx-2" onClick={handleNextTab}>Next</button>
            </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>

        {/* Employee Payrolls Tab */}
        <div className={`tab-pane fade ${activeTab === 'nav-payroll' ? 'show active' : ''}`} id="nav-payroll" role="tabpanel" aria-labelledby="nav-payroll-tab">
          <div className="container-fluid form-container">
            <h5 className="text-center">Employee Payrolls</h5>
            <div className="row justify-content-center">
              <div className="col-8">
                <div className="container-fluid form-container">
                  <div className="form-group row">
                    <div className="col-sm-9">
                      <h6>Payroll:</h6>
                      <small className="form-text text-muted">(Ex. Salary, Wages, Bonuses, etc.,)</small>
                    </div>
                    <div className="col-sm-3 text-right">
                      <button
                        type="button"
                        className="btn btn-add"
                        onClick={() => handleEmployeePayrollModal()}
                      >
                        Add Payroll
                      </button>
                    </div>
                  </div> 
                  {employeePayrolls.map((payroll, index) => (
                    <div key={index} className="form-group row">
                      <div className="col-sm-4">
                        <input
                          type="text"
                          className="form-control"
                          value={payroll.designation}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          value={formatNumber(payroll.salary)}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          value={payroll.months.join(', ')}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-2">
                        <button
                          className="btn btn-sm btnEditDelete me-2"
                          onClick={() => handleEmployeePayrollModal(index)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="btn btn-sm btnEditDelete"
                          onClick={() => handleDeleteEmployeePayroll(index)}
                        >
                          <MdOutlineDeleteOutline />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <button className="submit-btn-last btn mx-2" onClick={() => setEmployeePayrolls([])}>Clear All</button>
              <button className="submit-btn-last btn mx-2" onClick={handlePayrollSubmit} disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>

        {/* Employee Payrolls  Modals */}
        <Modal show={showModalPayroll} onHide={handleEmployeePayrollModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingIndexPayroll !== null ? 'Edit' : 'Add'} Employee Payroll
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter designation"
                  value={payrollDesignation}
                  onChange={(e) => setPayrollDesignation(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter salary"
                  value={payrollSalary}
                  onChange={(e) => setPayrollSalary(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Select Months:</Form.Label>
                <div className="d-flex flex-wrap">
                  {months.map((month) => (
                    <Form.Check
                      key={month}
                      type="checkbox"
                      id={`month-${month}`}
                      label={month}
                      checked={selectedMonthsPayroll.includes(month)}
                      onChange={() => handleMonthChangePayroll(month)}
                      className="me-3 mb-2"
                    />
                  ))}
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleEmployeePayrollModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveEmployeePayroll}>
              {editingIndexPayroll !== null ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Entryitems;


// import React, { useState, useEffect, useCallback } from 'react';
// import './entryitems.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import { useProject } from '../../ProjectContext';  
// import { useAuth } from '../../auth/AuthContext'; 
// import { Modal, Button, Form, Table  } from 'react-bootstrap'; 
// import { authenticatedRequest } from '../../utility/authenticatedRequestUtility'; 

// // icons
// import { MdEdit } from "react-icons/md";
// import { MdOutlineDeleteOutline } from "react-icons/md";

// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// const years = ['Year1', 'Year2', 'Year3', 'Year4', 'Year5'];
// // New RevenueForecasts component
// const RevenueForecasts = ({ onDataUpdate }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [monthlyData, setMonthlyData] = useState(
//     months.map(month => ({
//       month,
//       units: '',
//       price: '',
//       cost: ''
//     }))
//   );
//   const [error, setError] = useState('');
//   useEffect(() => {
//     onDataUpdate(monthlyData);
//   }, [monthlyData, onDataUpdate]);

//   const handleShowModal = () => {
//     setShowModal(true);
//     setError('');
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setError('');
//   };

//   const handleDataChange = (index, field, value) => {
//     setMonthlyData(prevData => 
//       prevData.map((item, i) => 
//         i === index ? { ...item, [field]: value } : item
//       )
//     );
//   };

//   const isDataComplete = () => {
//     return monthlyData.every(item => 
//       item.units !== '' && item.price !== '' && item.cost !== ''
//     );
//   };

//   const handleSave = () => {
//     if (!isDataComplete()) {
//       setError('All fields for all months must be filled out.');
//     } else {
//       setShowModal(false);
//       setError('');
//     }
//   };

//   const calculateTotal = (field) => {
//     return monthlyData.reduce((sum, item) => sum + Number(item[field] || 0), 0);
//   };

//   return (
//     <div className="container-fluid form-container">
//       <h6>Revenue Forecast:</h6>
//       <div className="form-group row">
//         <div className="col-sm-10">
//           <input 
//             type="text" 
//             className="form-control" 
//             value={isDataComplete() ? 'All data filled' : 'Incomplete'} 
//             readOnly 
//           />
//         </div>
//         <div className="col-sm-2">
//           <button className="btn btnEditDelete" onClick={handleShowModal}><MdEdit /></button>
//         </div>
//       </div>

//       <Modal show={showModal} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Revenue Forecast</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>Month</th>
//                   <th>Units Sold</th>
//                   <th>Price Per Unit</th>
//                   <th>Cost Per Unit</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {monthlyData.map((item, index) => (
//                   <tr key={item.month}>
//                     <td>{item.month}</td>
//                     <td>
//                       <Form.Control
//                         type="number"
//                         value={item.units}
//                         onChange={(e) => handleDataChange(index, 'units', e.target.value)}
//                         required
//                       />
//                     </td>
//                     <td>
//                       <Form.Control
//                         type="number"
//                         value={item.price}
//                         onChange={(e) => handleDataChange(index, 'price', e.target.value)}
//                         required
//                       />
//                     </td>
//                     <td>
//                       <Form.Control
//                         type="number"
//                         value={item.cost}
//                         onChange={(e) => handleDataChange(index, 'cost', e.target.value)}
//                         required
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <th>Total</th>
//                   <th>{calculateTotal('units')}</th>
//                   <th>{calculateTotal('price')}</th>
//                   <th>{calculateTotal('cost')}</th>
//                 </tr>
//               </tfoot>
//             </Table>
//           </Form>
//           {error && <div className="text-danger">{error}</div>}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleSave}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };


// function Entryitems() {

//   const { projectId } = useProject();
//   const { user } = useAuth();
//   const [startupCosts, setStartupCosts] = useState([{ description: '', amount: '' }]);
//   const [startupCapital, setStartupCapital] = useState([{ description: '', amount: '' }]);
//   const [capitalWorkProgress, setCapitalWorkProgress] = useState([{ description: '', amount: '' }]);
//   const [startingOperations, setStartingOperations] = useState([{ description: '', amount: '' }]);
//   const [assets, setAssets] = useState([{ description: '', amount: '' }]);
//   const [liabilities, setLiabilities] = useState([{ description: '', amount: '' }]);
//   const [capitalCosts, setCapitalCosts] = useState([]);
//   const [cashFlow, setCashFlow] = useState([{ description: '', amount: '' }]);
//   const [revenueForecasts, setRevenueForecasts] = useState([]);
//   const [variableCosts, setVariableCosts] = useState([{ description: '', amount: '' }]);
//     // Add these to your existing state variables
//     const [activeTab, setActiveTab] = useState('nav-startup');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     // Employee Payroll Modal State
//     const [employeePayrolls, setEmployeePayrolls] = useState([]);
//   const [showModalPayroll, setShowModalPayroll] = useState(false);
//   const [payrollDesignation, setPayrollDesignation] = useState('');
//   const [payrollSalary, setPayrollSalary] = useState('');
//   const [selectedMonthsPayroll, setSelectedMonthsPayroll] = useState([]);
//   const [editingIndexPayroll, setEditingIndexPayroll] = useState(null);
//   // Funding & Financial Planning states
//   const [fixedExpenses, setFixedExpenses] = useState([]);

//   // Modal State
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState(null);
//   const [modalDescription, setModalDescription] = useState('');
//   const [modalAmount, setModalAmount] = useState('');
//   const [selectedMonths, setSelectedMonths] = useState([]);
//   const [selectedYears, setSelectedYears] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
  

//   // Helper functions
//   const handleAddItem = (setFunction) => {
//     setFunction(prevItems => [...prevItems, { description: '', amount: '' }]);
//   };


//   const formatNumber = (num) => {
//     if (num === '') return '';
//     const parts = num.toString().split('.');
//     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     return parts.join('.');
//   };

//   const parseNumber = (str) => {
//     return str.replace(/,/g, '');
//   };

//   const handleInputChange = (index, setFunction, field, value) => {
//     setFunction(prevItems => {
//       const newItems = [...prevItems];
//       if (field === 'amount') {
//         const sanitizedValue = value.replace(/[^\d,]/g, '');
//         const numberValue = parseNumber(sanitizedValue);
//         newItems[index][field] = numberValue;
//       } else {
//         newItems[index][field] = value;
//       }
//       return newItems;
//     });
//   };

//   const inputOptions = {
//     startupCosts: [
//       'Business Registration fees',
//       'Product Development',
//       'Website Design',
//       'Website Development',
//       'Computer Systems',
//       'Market Research',
//       'Legal Fees',
//       'Initial Inventory',
//       'Marketing and Advertising',
//       'Leasehold Improvements',
//       'Furniture and Fixtures'
//   ],
//   startupCapital: [
//       'Share Capital (By team)',
//       'Loans (from Bank)',
//       'Loans (from Others)',
//       'Angel Investors',
//       'Venture Capital',
//       'Crowdfunding',
//       'Government Grants',
//       'Personal Savings',
//       'Family and Friends\' Contributions'
//   ],
//   capitalWorkProgress: [
//       'Additional Workstation',
//       'Office Renovation',
//       'Equipment Installation',
//       'Research and Development Facilities',
//       'Production Line Setup',
//       'IT Infrastructure Development',
//       'Custom Software Development'
//   ],
//   startingOperations: [
//       'Product Launch Expenses',
//       'Rental Expenses',
//       'Stationary & Office Supplies',
//       'Miscellaneous',
//       'Initial Marketing Campaign',
//       'Staff Training Programs',
//       'Initial Stock Purchase',
//       'Office Setup Costs',
//       'Grand Opening Events'
//   ],
//   assets: [
//     'Cash',
//     'Accounts Receivable',
//     'Inventory',
//     'Equipment',
//     'Intellectual Property',
//     'Vehicles',
//     'Real Estate',
//     'Prepaid Expenses',
//     'Investments'
// ],
// liabilities: [
//     'Loans',
//     'Accounts Payable',
//     'Mortgages',
//     'Credit Card Debt',
//     'Deferred Revenue',
//     'Accrued Expenses',
//     'Tax Liabilities',
//     'Lease Obligations'
// ],
// cashFlow: [
//     'Cash from Operations',
//     'Cash from Investing',
//     'Cash from Financing',
//     'Accounts Receivable Collections',
//     'Proceeds from Asset Sales',
//     'Interest and Dividends',
//     'Issuance of Stock',
//     'Debt Repayments'
// ],
// capitalCosts: [
//     'Equipment Purchases',
//     'Facility Upgrades',
//     'Major Renovations',
//     'Long-term Marketing Campaigns',
//     'Development of New Products',
//     'Major Software Overhauls',
//     'Infrastructure Expansion'
// ],
// variableCosts: [
//     'Cost of Goods Sold',
//     'Direct Labor Costs',
//     'Materials',
//     'Commissions',
//     'Raw Materials',
//     'Packaging Costs',
//     'Sales Commissions',
//     'Shipping and Handling',
//     'Production Supplies'
// ],
//   };

//   const renderInputs = (items, setFunction, inputType) => (
//     items.map((item, index) => (
//       <div className="form-group row" key={index}>
//         <div className="col-sm-6">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Add description"
//             value={item.description}
//             onChange={(e) => handleInputChange(index, setFunction, 'description', e.target.value)}
//             list={`options-${inputType}-${index}`}
//           />
//           <datalist id={`options-${inputType}-${index}`}>
//             {inputOptions[inputType].map((option, optIndex) => (
//               <option key={optIndex} value={option} />
//             ))}
//           </datalist>
//         </div>
//         <div className="col-sm-4">
//           <div className="input-group">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="₹"
//               value={formatNumber(item.amount)}
//               onChange={(e) => handleInputChange(index, setFunction, 'amount', e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="col-sm-2">
//           <button 
//             className="btn btn-sm btnEditDelete"
//             onClick={() => handleDeleteItem(index, setFunction)}
//           >
//             <MdOutlineDeleteOutline />
//           </button>
//         </div>
//       </div>
//     ))
//   );
//   const handleRevenueDataUpdate = (data) => {
//     setRevenueForecasts(data);
//   };

//   const handleClearAll = (setFunction) => {
//     setFunction([{ description: '', amount: '' }]);
//   };

//   const handleNextTab = () => {
//     const tabs = ['nav-startup', 'nav-funding', 'nav-operations', 'nav-payroll'];
//     const currentIndex = tabs.indexOf(activeTab);
//     const nextIndex = (currentIndex + 1) % tabs.length;
//     setActiveTab(tabs[nextIndex]);
//   };

//   // Financial Modal functions
//   const handleModalOpen = (type, index = null) => {
//     setModalType(type);
//     setEditingIndex(index);

//     if (index !== null) {
//       if (type === 'fixedExpense') {
//         const expense = fixedExpenses[index];
//         setModalDescription(expense.description);
//         setModalAmount(formatNumber(expense.amount));
//         setSelectedMonths(expense.months);
//       } else if (type === 'capitalCost') {
//         const cost = capitalCosts[index];
//         setModalDescription(cost.description);
//         setModalAmount(formatNumber(cost.amount));
//         setSelectedYears(cost.years);
//       }
//     } else {
//       setModalDescription('');
//       setModalAmount('');
//       setSelectedMonths([]);
//       setSelectedYears([]);
//     }

//     setShowModal(true);
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     setModalType(null);
//     setEditingIndex(null);
//     setModalDescription('');
//     setModalAmount('');
//     setSelectedMonths([]);
//     setSelectedYears([]);
//   };

//   const handleModalInputChange = (field, value) => {
//     if (field === 'amount') {
//       const sanitizedValue = value.replace(/[^\d,]/g, '');
//       setModalAmount(sanitizedValue);
//     } else {
//       setModalDescription(value);
//     }
//   };

//   const handleSaveFixedExpense = () => {
//     if (!modalDescription || !modalAmount || selectedMonths.length === 0) {
//       alert('Please fill out all fields and select at least one month.');
//       return;
//     }

//     const newExpense = {
//       description: modalDescription,
//       amount: modalAmount,
//       months: selectedMonths
//     };

//     setFixedExpenses(prevExpenses => {
//       if (editingIndex !== null) {
//         const updatedExpenses = [...prevExpenses];
//         updatedExpenses[editingIndex] = newExpense;
//         return updatedExpenses;
//       } else {
//         return [...prevExpenses, newExpense];
//       }
//     });

//     handleModalClose();
//   };

//   const handleSaveCapitalCost = () => {
//     if (!modalDescription || !modalAmount || selectedYears.length === 0) {
//       alert('Please fill out all fields and select at least one year.');
//       return;
//     }

//     const newCost = {
//       description: modalDescription,
//       amount: modalAmount,
//       years: selectedYears
//     };

//     setCapitalCosts(prevCosts => {
//       if (editingIndex !== null) {
//         const updatedCosts = [...prevCosts];
//         updatedCosts[editingIndex] = newCost;
//         return updatedCosts;
//       } else {
//         return [...prevCosts, newCost];
//       }
//     });

//     handleModalClose();
//   };

//   const handleMonthChange = (month) => {
//     setSelectedMonths(prevMonths => 
//       prevMonths.includes(month)
//         ? prevMonths.filter(m => m !== month)
//         : [...prevMonths, month]
//     );
//   };

//   const handleYearChange = (year) => {
//     setSelectedYears(prevYears => 
//       prevYears.includes(year)
//         ? prevYears.filter(y => y !== year)
//         : [...prevYears, year]
//     );
//   };

//   const handleDeleteFixedExpense = (index) => {
//     if (index >= 0 && index < fixedExpenses.length) {
//       setFixedExpenses(prevExpenses => prevExpenses.filter((_, i) => i !== index));
//     }
//   };

//   const handleDeleteCapitalCost = (index) => {
//     if (index >= 0 && index < capitalCosts.length) {
//       setCapitalCosts(prevCosts => prevCosts.filter((_, i) => i !== index));
//     }
//   };
  
//   const handleDeleteItem = async (index, setter) => {
//     try {
//       setter(prev => {
//         const newItems = [...prev];
//         const itemToDelete = newItems[index];
//         if (itemToDelete.id) {
//           // Determine the table name based on the setter function
//           let table;
//           if (setter === setStartupCosts) table = 'startup_costs';
//           else if (setter === setStartupCapital) table = 'startup_capital';
//           else if (setter === setCapitalWorkProgress) table = 'capital_work_progress';
//           else if (setter === setStartingOperations) table = 'starting_operations';

//           // Delete from the server
//           authenticatedRequest(`http://localhost:8000/startup-cost/delete-item/${itemToDelete.id}/${projectId}?table=${table}`, 'DELETE')
//             .catch(err => {
//               console.error('Error deleting item from server:', err);
//               setError('Failed to delete item from server. Please try again.');
//             });
//         }
//         return newItems.filter((_, i) => i !== index);
//       });
//     } catch (err) {
//       setError('Failed to delete item. Please try again.');
//       console.error('Error deleting item:', err);
//     }
//   };


//   const fetchProjectData = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await authenticatedRequest(`http://localhost:8000/startup-cost/project-data/${projectId}`, 'GET');
//       const data = response.data;
//       setStartupCosts(data.startup_costs || []);
//       setStartupCapital(data.startup_capital || []);
//       setCapitalWorkProgress(data.capital_work_progress || []);
//       setStartingOperations(data.starting_operations || []);
//     } catch (err) {
//       setError('Failed to fetch project data. Please try again.');
//       console.error('Error fetching project data:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [projectId]);
  
//   useEffect(() => {
//     if (projectId) {
//       fetchProjectData();
//     }
//   }, [projectId, fetchProjectData]);

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     setError(null);
  
//     try {
//       if (!projectId) {
//         throw new Error('Project ID is not available. Please try again later.');
//       }

//       const requestData = {
//         projectId,
//         startupCosts,
//         startupCapital,
//         capitalWorkProgress,
//         startingOperations
//       };
      
//       const response = await authenticatedRequest('http://localhost:8000/startup-cost/startup-data', 'POST', requestData);
//       console.log('Server response:', response);
//       fetchProjectData(); // Refresh data after submission
//     } catch (err) {
//       console.error('Error submitting data:', err);
//       setError(err.message || 'An error occurred while submitting the data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleFundingSubmit = async () => {
//     setIsLoading(true);
//     setError(null);
  
//     try {
//       if (!projectId) {
//         throw new Error('Project ID is not available. Please try again later.');
//       }
  
//       const requestData = {
//         userId: user.id,
//         projectId,
//         fixedExpenses: fixedExpenses.filter(item => item.description && item.amount && item.months.length > 0),
//         assets: assets.filter(item => item.description && item.amount),
//         liabilities: liabilities.filter(item => item.description && item.amount),
//         capitalCosts: capitalCosts.filter(item => item.description && item.amount && item.years.length > 0),
//         cashFlow: cashFlow.filter(item => item.description && item.amount),
//       };
  
//       console.log('Submitting request with data:', requestData);
//       const response = await authenticatedRequest('http://localhost:8000/funding/funding-data', 'POST', requestData);
  
//       console.log('Server response:', response);
  
//     } catch (err) {
//       console.error('Error submitting funding data:', err);
//       setError(err.message || 'An error occurred while submitting the funding data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   //Operation handle submit

//   const handleOperationsFinanceSubmit = async () => {
//     setIsLoading(true);
//     setError(null);
  
//     try {
//       if (!projectId) {
//         throw new Error('Project ID is not available. Please try again later.');
//       }
  
//       const requestData = {
//         userId: user.id,
//         projectId,
//         revenueForecasts: revenueForecasts,
//         variableCosts: variableCosts.filter(item => item.description && item.amount),
//       };
  
//       console.log('Submitting request with data:', requestData);
//       const response = await authenticatedRequest('http://localhost:8000/operations/data', 'POST', requestData);
  
//       console.log('Server response:', response);
  
//       if (response.data && response.data.message) {
//         // You might want to add some user feedback here, e.g., a success message
//       } else {
//         console.error('Unexpected response structure');
//         setError('Unexpected response structure. Please check the server response.');
//       }
//     } catch (err) {
//       console.error('Error submitting operations and finance data:', err);
//       setError(err.message || 'An error occurred while submitting the data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  


//   // Employee Payroll modal handling
//   const handleEmployeePayrollModal = (index = null) => {
//     setEditingIndexPayroll(index);
  
//     if (index !== null && index >= 0 && index < employeePayrolls.length) {
//       const payroll = employeePayrolls[index];
//       setPayrollDesignation(payroll.designation);
//       setPayrollSalary(payroll.salary);
//       setSelectedMonthsPayroll(payroll.months);
//     } else {
//       // Reset fields for new entry or invalid index
//       setPayrollDesignation('');
//       setPayrollSalary('');
//       setSelectedMonthsPayroll([]);
//     }
  
//     setShowModalPayroll(true);
//   };
//   // Function to handle modal close
//   const handleEmployeePayrollModalClose = () => {
//     setShowModalPayroll(false);
//     setEditingIndexPayroll(null);
//     setPayrollDesignation('');
//     setPayrollSalary('');
//     setSelectedMonthsPayroll([]);
//   };

//   // Add this function to handle saving employee payroll
//   const handleSaveEmployeePayroll = () => {
//     console.log("Saving payroll:", { payrollDesignation, payrollSalary, selectedMonthsPayroll });

//     if (!payrollDesignation || !payrollSalary || selectedMonthsPayroll.length === 0) {
//       alert('Please fill out all fields and select at least one month.');
//       return;
//     }

//     const newPayroll = {
//       designation: payrollDesignation,
//       salary: payrollSalary,
//       months: selectedMonthsPayroll
//     };

//     setEmployeePayrolls(prevPayrolls => {
//       if (editingIndexPayroll !== null && editingIndexPayroll >= 0 && editingIndexPayroll < prevPayrolls.length) {
//         const updatedPayrolls = [...prevPayrolls];
//         updatedPayrolls[editingIndexPayroll] = newPayroll;
//         return updatedPayrolls;
//       } else {
//         return [...prevPayrolls, newPayroll];
//       }
//     });

//     handleEmployeePayrollModalClose();
//   };

//   // Add handleMonthChangePayroll
//   const handleMonthChangePayroll = (month) => {
//     setSelectedMonthsPayroll(prevMonths => {
//       const updatedMonths = prevMonths.includes(month)
//         ? prevMonths.filter(m => m !== month)
//         : [...prevMonths, month];
//       return updatedMonths;
//     });
//   };

//   // Add this function to handle deleting employee payroll
//   const handleDeleteEmployeePayroll = (index) => {
//     if (index >= 0 && index < employeePayrolls.length) {
//       setEmployeePayrolls(prevPayrolls => prevPayrolls.filter((_, i) => i !== index));
//     }
//   };

//   // Modify your handlePayrollSubmit function
//   const handlePayrollSubmit = async () => {
//     setIsLoading(true);
//     setError(null);
  
//     try {
//       if (!projectId) {
//         throw new Error('Project ID is not available. Please try again later.');
//       }
  
//       const requestData = {
//         userId: user.id,
//         projectId,
//         payrollData: employeePayrolls.map(payroll => ({
//           designation: payroll.designation,
//           salary: payroll.salary,
//           months: payroll.months
//         })),
//       };
  
//       console.log('Submitting request with data:', requestData);
//       const response = await authenticatedRequest('http://localhost:8000/payroll/data', 'POST', requestData);
//       console.log('Payroll response:', response.data);
  
//       if (response.data && response.data.message) {
//         // You might want to add some user feedback here, e.g., a success message
//       } else {
//         console.error('Unexpected response structure');
//         setError('Unexpected response structure. Please check the server response.');
//       }
//     } catch (err) {
//       console.error('Error submitting payroll data:', err);
//       setError(err.response?.data?.error || 'An error occurred while submitting the data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  


//   return (
//     <div className="entryitems d-flex flex-column justify-content-center">
//       <nav className="nav nav-tabs justify-content-center">
//         <div className="nav nav-tabs" id="nav-tab" role="tablist">
//           <button className={`nav-link ${activeTab === 'nav-startup' ? 'active' : ''}`} id="nav-startup-tab" data-bs-toggle="tab" data-bs-target="#nav-startup" type="button" role="tab" aria-controls="nav-startup" aria-selected={activeTab === 'nav-startup'}>Startup Cost</button>
//           <button className={`nav-link ${activeTab === 'nav-funding' ? 'active' : ''}`} id="nav-funding-tab" data-bs-toggle="tab" data-bs-target="#nav-funding" type="button" role="tab" aria-controls="nav-funding" aria-selected={activeTab === 'nav-funding'}>Funding & Financial Planning</button>
//           <button className={`nav-link ${activeTab === 'nav-operations' ? 'active' : ''}`} id="nav-operations-tab" data-bs-toggle="tab" data-bs-target="#nav-operations" type="button" role="tab" aria-controls="nav-operations" aria-selected={activeTab === 'nav-operations'}>Operations & Finance</button>
//           <button className={`nav-link ${activeTab === 'nav-payroll' ? 'active' : ''}`} id="nav-payroll-tab" data-bs-toggle="tab" data-bs-target="#nav-payroll" type="button" role="tab" aria-controls="nav-payroll" aria-selected={activeTab === 'nav-payroll'}>Employee Payrolls</button>
//         </div>
//       </nav>

//       <div className="tab-content" id="nav-tabContent">
//       <div className={`tab-pane fade ${activeTab === 'nav-startup' ? 'show active' : ''}`} id="nav-startup" role="tabpanel" aria-labelledby="nav-startup-tab">
//       <div className="container-fluid form-container">
//         <h5 className="text-center">Startup Costs</h5>
//         <div className="row">
//           <div className="col-6">
//             <div className="container-fluid form-container">
//               <h6>Starting up costs:</h6>
//               <div className="form-group row">
//                 <div className="col-sm-9">
//                   <small className="form-text text-muted">(Ex. Business Registration fees, Product Development, Website Design, Website Development, Computer Systems etc.,)</small>
//                 </div>
//                 <div className="col-sm-3 text-right">
//                   <button type="button" className="btn btn-add" onClick={() => handleAddItem(setStartupCosts)}>Add item +</button>
//                 </div>
//               </div>
//               {renderInputs(startupCosts, setStartupCosts, 'startupCosts')}
//               <h6 style={{ marginTop: "50px" }}>Startup Capital:</h6>
//               <div className="form-group row">
//                 <div className="col-sm-9">
//                   <small className="form-text text-muted">(Ex. Share Capital (By team), Loans (from Bank or Others))</small>
//                 </div>
//                 <div className="col-sm-3 text-right">
//                   <button type="button" className="btn btn-add" onClick={() => handleAddItem(setStartupCapital)}>Add item +</button>
//                 </div>
//               </div>
//               {renderInputs(startupCapital, setStartupCapital, 'startupCapital')}
//             </div>
//           </div>
//           <div className="col-6">
//             <div className="container form-container">
//               <div className="form-group row">
//                 <div className="col-sm-9">
//                   <h6>Capital Work in Progress:</h6>
//                   <small className="form-text text-muted">(Ex. Additional Workstation etc.,)</small>
//                 </div>
//                 <div className="col-sm-3 text-right">
//                   <button type="button" className="btn btn-add" onClick={() => handleAddItem(setCapitalWorkProgress)}>Add item +</button>
//                 </div>
//               </div>
//               {renderInputs(capitalWorkProgress, setCapitalWorkProgress, 'capitalWorkProgress')}
//               <div className="form-group row">
//                 <div className="col-sm-9">
//                   <h6 style={{ marginTop: "50px" }}>Starting Operations:</h6>
//                   <small className="form-text text-muted">(Ex. Product Launch Expenses, Rental Expenses, Stationary & Office Supplies, Miscellaneous)</small>
//                 </div>
//                 <div className="col-sm-3 text-right">
//                   <button type="button" className="btn btn-add" onClick={() => handleAddItem(setStartingOperations)}>Add item +</button>
//                 </div>
//               </div>
//               {renderInputs(startingOperations, setStartingOperations, 'startingOperations')}
//             </div>
//           </div>
//         </div>
//         {error && <div className="alert alert-danger mt-3">{error}</div>}

//         <div className="d-flex justify-content-center">
//           <button className="submit-btn-last btn mx-2" onClick={() => {
//             setStartupCosts([]);
//             setStartupCapital([]);
//             setCapitalWorkProgress([]);
//             setStartingOperations([]);
//           }}>Clear All</button>
//           <button className="submit-btn-last btn mx-2" onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? 'Submitting...' : 'Submit'}
//           </button>
//           <button className="submit-btn-last btn mx-2" onClick={() => setActiveTab('nav-next')}>Next</button>
//         </div>
//       </div>
//     </div>
 

//         {/* Funding & Financial Planning */}
//         <div className={`tab-pane fade ${activeTab === 'nav-funding' ? 'show active' : ''}`} id="nav-funding" role="tabpanel" aria-labelledby="nav-funding-tab">
//           <div className="container-fluid form-container">
//             <h5 className="text-center">Funding & Financial Planning</h5>
//             <div className="row">
//               <div className="col-6">
//                 <div className="container-fluid form-container">
//                   <div className="form-group row">
//                     <div className="col-sm-9">
//                       <h6>Fixed Expenses:</h6>
//                       <small className="form-text text-muted">
//                         (Ex. Office Rent, Employee Salaries, Utilities, Insurance)
//                       </small>
//                     </div>
//                     <div className="col-sm-3 text-right">
//                       <button
//                         type="button"
//                         className="btn btn-add"
//                         onClick={() => handleModalOpen('fixedExpense')}
//                       >
//                         Monthly Expenses
//                       </button>
//                     </div>
//                   </div>
//                   {fixedExpenses.map((expense, index) => (
//                     <div key={index} className="form-group row">
//                       <div className="col-sm-6">
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={`${expense.description} (${expense.months.join(', ')})`}
//                           readOnly
//                         />
//                       </div>
//                       <div className="col-sm-3">
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={formatNumber(expense.amount)}
//                           readOnly
//                         />
//                       </div>
//                       <div className="col-sm-3">
//                         <button
//                           className="btn btn-sm btnEditDelete me-2"
//                           onClick={() => handleModalOpen('fixedExpense', index)}
//                         >
//                           <MdEdit />
//                         </button>
//                         <button
//                           className="btn btn-sm btnEditDelete"
//                           onClick={() => handleDeleteFixedExpense(index)}
//                         >
//                           <MdOutlineDeleteOutline />
//                         </button>
//                       </div>
//                     </div>
//                   ))}

//                   <div className="form-group row" style={{marginTop:"50px"}}>
//                     <h6>Assets:</h6>
//                     <div className="col-sm-9">
//                       <small className="form-text text-muted">(Ex. Cash, Accounts Receivable, Inventory, Equipment)</small>
//                     </div>
//                     <div className="col-sm-3 text-right">
//                       <button type="button" className="btn btn-add" onClick={() => handleAddItem(setAssets)}>Add item +</button>
//                     </div>
//                   </div>
//                   {renderInputs(assets, setAssets, 'assets')}

//                   <div className="form-group row" style={{marginTop:"50px"}}>
//                     <div className="col-sm-9">
//                       <h6>Cash Flow:</h6>
//                       <small className="form-text text-muted">(Ex. Cash from Operations, Cash from Investing, Cash from Financing)</small>
//                     </div>
//                     <div className="col-sm-3 text-right">
//                       <button type="button" className="btn btn-add" onClick={() => handleAddItem(setCashFlow)}>Add item +</button>
//                     </div>
//                   </div>
//                   {renderInputs(cashFlow, setCashFlow, 'cashFlow')}
//                 </div>
//               </div>
//               <div className="col-6">
//                 <div className="container form-container">
//                   <div className="form-group row">
//                     <div className="col-sm-9">
//                       <h6>Liabilities:</h6>
//                       <small className="form-text text-muted">(Ex. Loans, Accounts Payable, Mortgages)</small>
//                     </div>
//                     <div className="col-sm-3 text-right">
//                       <button type="button" className="btn btn-add" onClick={() => handleAddItem(setLiabilities)}>Add item +</button>
//                     </div>
//                   </div>
//                   {renderInputs(liabilities, setLiabilities, 'liabilities')}

//                   <div className="form-group row" style={{marginTop:"50px"}}>
//                     <div className="col-sm-9">
//                       <h6>Capital Costs (5 Years):</h6>
//                       <small className="form-text text-muted">(Ex. Equipment Purchases, Facility Upgrades)</small>
//                     </div>
//                     <div className="col-sm-3 text-right">
//                       <button type="button" className="btn btn-add" onClick={() => handleModalOpen('capitalCost')}>Add Capital Cost</button>
//                     </div>
//                   </div>
//                   {capitalCosts.map((cost, index) => (
//                     <div key={index} className="form-group row">
//                       <div className="col-sm-6">
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={`${cost.description} (${cost.years.join(', ')})`}
//                           readOnly
//                         />
//                       </div>
//                       <div className="col-sm-3">
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={formatNumber(cost.amount)}
//                           readOnly
//                         />
//                       </div>
//                       <div className="col-sm-3">
//                         <button className="btn btn-sm btn-primary me-2" onClick={() => handleModalOpen('capitalCost', index)}>Edit</button>
//                         <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCapitalCost(index)}>Delete</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="d-flex justify-content-center">
//               <button className="submit-btn-last btn mx-2" onClick={() => {
//                 handleClearAll(setAssets);
//                 handleClearAll(setLiabilities);
//                 handleClearAll(setCashFlow);
//               }}>Clear All</button>
//               <button 
//                 className="submit-btn-last btn mx-2" 
//                 onClick={handleFundingSubmit}
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Submitting...' : 'Submit'}
//               </button>
//               <button className="submit-btn-last btn mx-2" onClick={handleNextTab}>Next</button>
//             </div>
//           </div>
//         </div>

//         {/* Modal */}
//         <Modal show={showModal} onHide={handleModalClose}>
//           <Modal.Header closeButton>
//             <Modal.Title>
//               {editingIndex !== null ? 'Edit' : 'Add'}{' '}
//               {modalType === 'fixedExpense' ? 'Monthly Expense' : 'Capital Cost'}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter description"
//                   value={modalDescription}
//                   onChange={(e) => handleModalInputChange('description', e.target.value)}
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Amount</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter amount"
//                   value={modalAmount}
//                   onChange={(e) => handleModalInputChange('amount', e.target.value)}
//                 />
//               </Form.Group>

//               {modalType === 'fixedExpense' && (
//                 <Form.Group>
//                   <Form.Label>Select Months:</Form.Label>
//                   <div className="d-flex flex-wrap">
//                     {months.map((month) => (
//                       <Form.Check
//                         key={month}
//                         type="checkbox"
//                         label={month}
//                         checked={selectedMonths.includes(month)}
//                         onChange={() => handleMonthChange(month)}
//                         className="me-3 mb-2"
//                       />
//                     ))}
//                   </div>
//                 </Form.Group>
//               )}
//               {modalType === 'capitalCost' && (
//                 <Form.Group>
//                   <Form.Label>Select Years:</Form.Label>
//                   <div className="d-flex flex-wrap">
//                     {years.map(year => (
//                       <Form.Check
//                         key={year}
//                         type="checkbox"
//                         label={year}
//                         checked={selectedYears.includes(year)}
//                         onChange={() => handleYearChange(year)}
//                         className="me-3 mb-2"
//                       />
//                     ))}
//                   </div>
//                 </Form.Group>
//               )}
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleModalClose}>
//               Close
//             </Button>
//             <Button
//               variant="primary"
//               onClick={
//                 modalType === 'fixedExpense'
//                   ? handleSaveFixedExpense
//                   : handleSaveCapitalCost
//               }
//             >
//               {editingIndex !== null ? 'Update' : 'Add'}
//             </Button>
//           </Modal.Footer>
//         </Modal>

//         {/* Operations & Finance */}
//         <div className={`tab-pane fade ${activeTab === 'nav-operations' ? 'show active' : ''}`} id="nav-operations" role="tabpanel" aria-labelledby="nav-operations-tab">
//           <div className="container-fluid form-container">
//             <h5 className="text-center">Operations & Finance</h5>
//             <div className="row">
//               <div className="col-6">
//               <RevenueForecasts onDataUpdate={handleRevenueDataUpdate} />
//               </div>
//               <div className="col-6">
//                 <div className="container-fluid form-container">
//                   <h6>Variable Costs:</h6>
//                   <div className="form-group row">
//                     <div className="col-sm-9">
//                       <small className="form-text text-muted">(Ex. Cost of Goods Sold, Direct Labor Costs)</small>
//                     </div>
//                     <div className="col-sm-3 text-right">
//                       <button type="button" className="btn btn-add" onClick={() => handleAddItem(setVariableCosts)}>Add item +</button>
//                     </div>
//                   </div>
//                   {renderInputs(variableCosts, setVariableCosts, 'variableCosts')}
//                 </div>
//               </div>
//             </div>

//             <div className="d-flex justify-content-center">
//             <button className="submit-btn-last btn mx-2" onClick={() => handleClearAll(setVariableCosts)}>Clear All</button>
//             <button className="submit-btn-last btn mx-2" onClick={handleOperationsFinanceSubmit} disabled={isLoading}>
//                 {isLoading ? 'Submitting...' : 'Submit'}
//               </button>
//               <button className="submit-btn-last btn mx-2" onClick={handleNextTab}>Next</button>
//             </div>
//             {error && <div className="alert alert-danger mt-3">{error}</div>}
//           </div>
//         </div>

//         {/* Employee Payrolls */}
//         <div className={`tab-pane fade ${activeTab === 'nav-payroll' ? 'show active' : ''}`} id="nav-payroll" role="tabpanel" aria-labelledby="nav-payroll-tab">
//           <div className="container-fluid form-container">
//             <h5 className="text-center">Employee Payrolls</h5>
//             <div className="row justify-content-center">
//               <div className="col-8">
//                 <div className="container-fluid form-container">
//                   <div className="form-group row">
//                     <div className="col-sm-9">
//                       <h6>Payroll:</h6>
//                       <small className="form-text text-muted">(Ex. Salary, Wages, Bonuses, etc.,)</small>
//                     </div>
//                     <div className="col-sm-3 text-right">
//                       <button
//                         type="button"
//                         className="btn btn-add"
//                         onClick={() => handleEmployeePayrollModal()}
//                       >
//                         Add Payroll
//                       </button>
//                     </div>
//                   </div> 
//                   {employeePayrolls.map((payroll, index) => (
//                     <div key={index} className="form-group row">
//                       <div className="col-sm-4">
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={payroll.designation}
//                           readOnly
//                         />
//                       </div>
//                       <div className="col-sm-3">
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={formatNumber(payroll.salary)}
//                           readOnly
//                         />
//                       </div>
//                       <div className="col-sm-3">
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={payroll.months.join(', ')}
//                           readOnly
//                         />
//                       </div>
//                       <div className="col-sm-2">
//                         <button
//                           className="btn btn-sm btnEditDelete me-2"
//                           onClick={() => handleEmployeePayrollModal(index)}
//                         >
//                           <MdEdit />
//                         </button>
//                         <button
//                           className="btn btn-sm btnEditDelete"
//                           onClick={() => handleDeleteEmployeePayroll(index)}
//                         >
//                           <MdOutlineDeleteOutline />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="d-flex justify-content-center mt-3">
//               <button className="submit-btn-last btn mx-2" onClick={() => setEmployeePayrolls([])}>Clear All</button>
//               <button className="submit-btn-last btn mx-2" onClick={handlePayrollSubmit} disabled={isLoading}>
//                 {isLoading ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//             {error && <div className="alert alert-danger mt-3">{error}</div>}
//           </div>
//         </div>

//         {/* // Modify your existing modal to include the employee payroll fields */}
//         <Modal show={showModalPayroll} onHide={handleEmployeePayrollModalClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {editingIndexPayroll !== null ? 'Edit' : 'Add'} Employee Payroll
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Designation</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter designation"
//                 value={payrollDesignation}
//                 onChange={(e) => setPayrollDesignation(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Salary</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter salary"
//                 value={payrollSalary}
//                 onChange={(e) => setPayrollSalary(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Select Months:</Form.Label>
//               <div className="d-flex flex-wrap">
//                 {months.map((month) => (
//                   <Form.Check
//                     key={month}
//                     type="checkbox"
//                     id={`month-${month}`}
//                     label={month}
//                     checked={selectedMonthsPayroll.includes(month)}
//                     onChange={() => handleMonthChangePayroll(month)}
//                     className="me-3 mb-2"
//                   />
//                 ))}
//               </div>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleEmployeePayrollModalClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleSaveEmployeePayroll}>
//             {editingIndexPayroll !== null ? 'Update' : 'Add'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
  
//       </div>
//     </div>
//   );
// }

// export default Entryitems;
