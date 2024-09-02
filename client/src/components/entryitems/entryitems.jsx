import React, { useState, useEffect, useCallback,useMemo } from 'react';
import './entryitems.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useProject } from '../../ProjectContext';  
import { useAuth } from '../../auth/AuthContext'; 
import { Modal, Button, Form, Table  } from 'react-bootstrap'; 
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility'; 
import LoadingIcon from '../loadingicon/loadingicon';

// icons
import { MdEdit } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";

// Constants for months and years
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = ['Year1', 'Year2', 'Year3', 'Year4', 'Year5'];

const LoadingOverlay = () => (
  <div className="loading-overlay">
    <div className="loading-content">
      <LoadingIcon />
      <p className="loading-text">Submitting...</p>
    </div>
  </div>
);
// =============================================================================
// RevenueForecasts Component
// =============================================================================

const RevenueForecasts = ({ onDataUpdate, projectId, fetchData, setHandleDelete  }) => {
  const [showModal, setShowModal] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentForecast, setCurrentForecast] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);

  const months = useMemo(() => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ], []);

// Function to fetch revenue forecasts from the server
  const fetchRevenueForecasts = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await authenticatedRequest(`/operations/data/${projectId}`, 'GET');
      if (response.data && Array.isArray(response.data.revenueForecasts)) {
        // Sort the fetched data based on the months array
        const sortedRevenueForecasts = response.data.revenueForecasts.sort(
          (a, b) => months.indexOf(a.month) - months.indexOf(b.month)
        );
        setMonthlyData(sortedRevenueForecasts);
        onDataUpdate(sortedRevenueForecasts);
      }
    } catch (err) {
      setError(`Failed to fetch revenue forecasts: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, onDataUpdate, months]);

  // Fetch revenue forecasts when the component mounts and projectId changes
  useEffect(() => {
    fetchRevenueForecasts();
  }, [fetchRevenueForecasts]);

  // Update parent component's data whenever monthlyData changes
  useEffect(() => {
    onDataUpdate(monthlyData);
  }, [monthlyData, onDataUpdate]);

    // Format number with commas for display
  const formatNumber = (num) => {
    if (num === '') return '';
    const parts = num.toString().split('.');
    // Convert the integer part into Indian number format
    let integerPart = parts[0];
    let lastThreeDigits = integerPart.slice(-3);
    let otherDigits = integerPart.slice(0, -3);
    if (otherDigits !== '') {
        lastThreeDigits = ',' + lastThreeDigits;
    }
    const formattedIntegerPart = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits;
    // Combine with decimal part if it exists
    return parts.length > 1 ? formattedIntegerPart + '.' + parts[1] : formattedIntegerPart;
    };

  // Functions to show/hide the modal for adding/editing forecasts
  const handleShowModal = (forecast = null) => {
    setError('');
    setCurrentForecast(forecast || { months: [], units: '', price: '', cost: '' });
    setSelectedMonths(forecast && forecast.months ? [...forecast.months] : []);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentForecast(null);
    setSelectedMonths([]);
    setError('');
  };

  // Handle changes in month selection
  const handleMonthChange = (month) => {
    setError(''); 
    setSelectedMonths(prev => {
      const currentSelection = Array.isArray(prev) ? prev : [];
      const newSelection = currentSelection.includes(month) 
        ? currentSelection.filter(m => m !== month) 
        : [...currentSelection, month];
      
      // Sort the new selection based on the months array order
      return newSelection.sort((a, b) => months.indexOf(a) - months.indexOf(b));
    });
  };

  const handleInputChange = (field, value) => {
    setError('');  
    setCurrentForecast(prev => ({ ...prev, [field]: value }));
  };

   const handleSave = async () => {
    if (selectedMonths.length === 0 || !currentForecast.units || !currentForecast.price || !currentForecast.cost) {
      setError('At least one month must be selected and all fields must be filled.');
      return;
    }
  
    try {
      // selectedMonths is already sorted due to the change in handleMonthChange
      const forecastsToSave = selectedMonths.map(month => ({
        month,
        units: currentForecast.units,
        price: currentForecast.price,
        cost: currentForecast.cost
      }));
  
      const response = await authenticatedRequest(
        `/operations/add-revenue-forecast/${projectId}`,
        'POST',
        { forecasts: forecastsToSave }
      );
  
      if (response.data && Array.isArray(response.data.revenueForecasts)) {
        // Sort the received data based on the months array
        const sortedRevenueForecasts = response.data.revenueForecasts.sort(
          (a, b) => months.indexOf(a.month) - months.indexOf(b.month)
        );
        setMonthlyData(sortedRevenueForecasts);
        handleCloseModal();
        await fetchRevenueForecasts();
      } else {
        throw new Error(`Invalid server response: ${JSON.stringify(response.data)}`);
      }
    } catch (err) {
      console.error('Error saving revenue forecasts:', err);
      setError(`Failed to save revenue forecasts: ${err.message}`);
    }
  };

  const handleDelete = useCallback(async (forecastId) => {
    try {
      const response = await authenticatedRequest(
        `/operations/delete-revenue-forecast/${projectId}?forecastId=${forecastId}`,
        'DELETE'
      );
  
      if (response.data && Array.isArray(response.data.revenueForecasts)) {
        setMonthlyData(response.data.revenueForecasts);
        onDataUpdate(response.data.revenueForecasts);
        await fetchData();
      } else {
        throw new Error('Updated forecasts not found in response');
      }
    } catch (err) {
      setError(`Failed to delete revenue forecast: ${err.message}`);
    }
  }, [projectId, onDataUpdate, fetchData, setError]);
  
  useEffect(() => {
    setHandleDelete(() => handleDelete);
  }, [setHandleDelete, handleDelete]);
  
  if (isLoading) {
    return <div>Loading revenue forecasts...</div>;
  }

  if (error && !showModal) {
    return <div>Error: {error}</div>;
  }

  const calculateTotal = (field) => {
    return monthlyData.reduce((sum, item) => sum + Number(item[field] || 0), 0);
  };

  return (
    <div className="container-fluid form-container">
      <h6>Revenue Forecast:</h6>
      <div className="form-group row">
        <div className="col-sm-10">
          <button className="btn btn-add" onClick={() => handleShowModal()}><i className="fas fa-plus"></i> Add Item</button>
        </div>
      </div>
      {monthlyData.length === 0 ? (
        <p>No revenue forecasts available. Click 'Add Item' to create one.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Month</th>
              <th>Units Sold</th>
              <th>Price Per Unit</th>
              <th>Cost Per Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((item, index) => (
              <tr key={index}>
                <td>{item.month}</td>
                <td>{item.units}</td>
                <td>{formatNumber(item.price)}</td>
                <td>{formatNumber(item.cost)}</td>
                <td>
                  <button className="btn btn-sm btnEditDelete me-2" onClick={() => handleShowModal(item)}><MdEdit /></button>
                  <button className="btn btn-sm btnEditDelete" onClick={() => handleDelete(item.id)}><MdOutlineDeleteOutline /></button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{calculateTotal('units')}</th>
              <th>{formatNumber(calculateTotal('price'))}</th>
              <th>{formatNumber(calculateTotal('cost'))}</th>
              <th></th>
            </tr>
          </tfoot>
        </Table>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentForecast && currentForecast.id ? 'Edit' : 'Add'} Revenue Forecast</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Month</Form.Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {months.map((month) => (
                  <Form.Check
                    key={month}
                    type="checkbox"
                    id={`month-${month}`}
                    label={month}
                    checked={selectedMonths.includes(month)}
                    onChange={() => handleMonthChange(month)}
                    disabled={selectedMonths.includes(month) || monthlyData.some(forecast => forecast.month === month)}
                  />
                ))}
              </div>

            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Units Sold</Form.Label>
              <Form.Control
                type="number"
                value={currentForecast ? currentForecast.units : ''}
                onChange={(e) => handleInputChange('units', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control
                type="number"
                value={currentForecast ? currentForecast.price : ''}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost Per Unit</Form.Label>
              <Form.Control
                type="number"
                value={currentForecast ? currentForecast.cost : ''}
                onChange={(e) => handleInputChange('cost', e.target.value)}
              />
            </Form.Group>
          </Form>
          {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
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
  const [handleDeleteRevenueForecast, setHandleDeleteRevenueForecast] = useState(() => async () => {});
  const [variableCosts, setVariableCosts] = useState([{ description: '', amount: '' }]);
  
  
  // State for active tab and loading/error states
  const [activeTab, setActiveTab] = useState('nav-startup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [, setDataModified] = useState(false);

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
  // const tabs = ['nav-startup', 'nav-funding', 'nav-operations', 'nav-payroll'];
  const [initialSubmitted, setInitialSubmitted] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // =============================================================================
  // Helper Functions
  // =============================================================================

  // Format number with commas
  const formatNumber = (num) => {
    if (num === '') return '';
    const parts = num.toString().split('.');
    // Convert the integer part into Indian number format
    let integerPart = parts[0];
    let lastThreeDigits = integerPart.slice(-3);
    let otherDigits = integerPart.slice(0, -3);
    if (otherDigits !== '') {
        lastThreeDigits = ',' + lastThreeDigits;
    }
    const formattedIntegerPart = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits;
    // Combine with decimal part if it exists
    return parts.length > 1 ? formattedIntegerPart + '.' + parts[1] : formattedIntegerPart;
  };

  // Parse number from formatted string
  const parseNumber = (str) => {
    return str.replace(/,/g, '');
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

  // =============================================================================
  // Necessary Functions 
  // =============================================================================
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
              value={item.amount !== null ? formatNumber(item.amount) : ''} 
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
    setDataModified(true); 
  };

  // Add a new item to a specific input section
  const handleAddItem = (setFunction) => {
    setFunction(prevItems => [...prevItems, { description: '', amount: '' }]);
    setDataModified(true); // Set the dataModified flag but don't trigger validation
  };
    
  // Delete an item from a specific section 
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
          else if (setter === setVariableCosts) {
            table = 'variable_costs';
            endpoint = 'operations';
          }
  
          // Delete from the server
          authenticatedRequest(`/${endpoint}/delete-item/${itemToDelete.id}/${projectId}?table=${table}`, 'DELETE')
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

  // Navigate to the next tab
  const handleNextTab = () => {
    const tabs = ['nav-startup', 'nav-funding', 'nav-operations', 'nav-payroll'];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };

  const handleRevenueDataUpdate = useCallback((data) => {
    setRevenueForecasts(data);
  }, []);

  // validates the data for all sections to ensure all required fields are filled correctly.
  const validateData = useCallback(() => {
    const sections = [
      { data: startupCosts, name: 'Startup Costs' },
      { data: startupCapital, name: 'Startup Capital' },
      { data: capitalWorkProgress, name: 'Capital Work in Progress' },
      { data: startingOperations, name: 'Starting Operations' },
      { data: fixedExpenses, name: 'Fixed Expenses' },
      { data: assets, name: 'Assets' },
      { data: liabilities, name: 'Liabilities' },
      { data: capitalCosts, name: 'Capital Costs' },
      { data: cashFlow, name: 'Cash Flow' },
      {
        data: revenueForecasts,
        name: 'Revenue Forecasts',
        validate: item => item.month && item.units && item.price && item.cost,
      },
      { data: variableCosts, name: 'Variable Costs' },
      {
        data: employeePayrolls,
        name: 'Employee Payrolls',
        validate: item => item.designation && item.salary && item.months.length > 0,
      },
    ];
  
    for (const section of sections) {
      let validItems;
      if (section.validate) {
        // Use custom validation function if provided
        validItems = section.data.filter(section.validate);
      } else {
        // Default validation for description and amount
        validItems = section.data.filter(item => item.description && item.amount);
      }
  
      if (validItems.length === 0) {
        setError(`Please fill at least one item correctly in ${section.name}.`);
        setShowError(true);
        return false; // Invalid data
      }
    }
  
    setError(null); // Clear any previous error
    return true; // Data is valid
  }, [startupCosts, startupCapital, capitalWorkProgress, startingOperations, fixedExpenses, assets, liabilities, capitalCosts, cashFlow, revenueForecasts, variableCosts, employeePayrolls]);

  // =============================================================================
  // Financial and Capital Cost Modal Handlers
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
          `/funding/update-fixed-expense/${projectId}`,
          'PUT',
          expenseData
        );
      } else {
        // Add new expense
        response = await authenticatedRequest(
          `/funding/add-fixed-expense/${projectId}`,
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

  // Save a Capital Cost 
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
          `/funding/update-capital-cost/${projectId}`,
          'PUT',
          costData
        );
      } else {
        // Add new cost
        response = await authenticatedRequest(
          `/funding/add-capital-cost/${projectId}`,
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
      const response = await authenticatedRequest(`/funding/delete-fixed-expense/${projectId}?index=${index}`, 'DELETE');
      setFixedExpenses(response.data.fixed_expenses);
    } catch (err) {
      setError('Failed to delete fixed expense. Please try again.');
      console.error('Error deleting fixed expense:', err);
    }
  };

  // Delete a capital cost
  const handleDeleteCapitalCost = async (index) => {
    try {
      const response = await authenticatedRequest(`/funding/delete-capital-cost/${projectId}?index=${index}`, 'DELETE');
      setCapitalCosts(response.data.capital_costs);
    } catch (err) {
      setError('Failed to delete capital cost. Please try again.');
      console.error('Error deleting capital cost:', err);
    }
  };

  // =============================================================================
  // Employee Payroll Modal Handlers
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
          `/payroll/update-employee-payroll/${projectId}`,
          'PUT',
          payrollData
        );
      } else {
        response = await authenticatedRequest(
          `/payroll/add-employee-payroll/${projectId}`,
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

 // Toggle month selection
  const handleMonthChangePayroll = (month) => {
    setSelectedMonthsPayroll(prevMonths => {
      const updatedMonths = prevMonths.includes(month)
        ? prevMonths.filter(m => m !== month)
        : [...prevMonths, month];
      return updatedMonths;
    });
  };

  // Handle deleting employee payroll
  const handleDeleteEmployeePayroll = async (index) => {
    try {
      const response = await authenticatedRequest(
        `/payroll/delete-employee-payroll/${projectId}?index=${index}`,
        'DELETE'
      );
      setEmployeePayrolls(response.data.employee_payrolls);
    } catch (err) {
      setError('Failed to delete employee payroll. Please try again.');
      console.error('Error deleting employee payroll:', err);
    }
  };
  
  // =============================================================================
  // Data Fetching From Sever
  // =============================================================================

  // Fetch Startup Cost tab data 
  const fetchProjectData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedRequest(`/startup-cost/project-data/${projectId}`, 'GET');
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

  // Use effect to fetch Startup cost tab data when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, fetchProjectData]);

  // Fetch Finanicial tab data
  const fetchFundingData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedRequest(`/funding/project-data/${projectId}`, 'GET');
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

  // Fetches funding tab data when projectId changes.
  useEffect(() => {
    if (projectId) {
      fetchFundingData();
    }
  }, [projectId, fetchFundingData]);

  // Fetch Operation tab data
  const fetchOperationsFinanceData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedRequest(`/operations/data/${projectId}`, 'GET');
      const data = response.data;
      setRevenueForecasts(data.revenueForecasts || []);
      setVariableCosts(data.variableCosts || []);
    } catch (err) {
      setError('Failed to fetch operations and finance data. Please try again.');
      console.error('Error fetching operations and finance data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Fetches Operation tab data when projectId changes.
  useEffect(() => {
    if (projectId) {
      fetchOperationsFinanceData();
    }
  }, [projectId, fetchOperationsFinanceData]);

  // Fetch EmployeePayroll tab data
  const fetchPayrollData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedRequest(`/payroll/project-data/${projectId}`, 'GET');
      const data = response.data;
      setEmployeePayrolls(data.employee_payrolls || []);
    } catch (err) {
      setError('Failed to fetch payroll data. Please try again.');
      console.error('Error fetching payroll data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Fetches EmployeePayroll tab data when projectId changes.
  useEffect(() => {
    if (projectId) {
      fetchPayrollData();
    }
  }, [projectId, fetchPayrollData]);

  // =============================================================================
  // Data Submission to server
  // =============================================================================

  // Checks if the initial submission for the project has been completed.
  const checkInitialSubmitStatus = useCallback(async () => {
    if (!projectId) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authenticatedRequest(
        `/project/${projectId}/check-initial-submit`,
        'GET'
      );
   // Access the isComplete property within the data object
   const isComplete = response.data?.isComplete;

   if (typeof isComplete === 'boolean') {
     setInitialSubmitted(isComplete);
   } else {
     console.error('Invalid response structure:', response);
     setError('Unexpected response from server. Please try again.');
   }
   setError(null);
 } catch (err) {
   console.error('Error checking initial submit status:', err);
   setError('Failed to check initial submit status. Please try again.');
 } finally {
   setIsLoading(false);
 }
  }, [projectId]);

  // Checks the initial submission status for the project when projectId changes and initialSubmitted is null.
  useEffect(() => {
    // Only check the status if it hasn't been determined yet
    if (projectId && initialSubmitted === null) {
      checkInitialSubmitStatus();
    }
  }, [projectId, checkInitialSubmitStatus, initialSubmitted]);

  //Handle Initial Submission
  const handleInitialSubmit = async () => {
    setError(null);
    setShowError(false);
      
    if (!validateData()) { // Stop submission if validation fails
      // Automatically hide the error after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
  
    setIsSubmitting(true);
    try {
      if (!projectId) {
        throw new Error('Project ID is not available. Please try again later.');
      }
  
      // Prepare all data
      const startupData = { projectId, startupCosts, startupCapital, capitalWorkProgress, startingOperations };
      const fundingData = { userId: user.id, projectId, fixedExpenses, assets, liabilities, capitalCosts, cashFlow };
      const operationsData = { projectId, revenueForecasts, variableCosts };
      const payrollData = { userId: user.id, projectId, employeePayrolls };
  
      // Submit data to existing endpoints without triggering recalculations
      await authenticatedRequest('/startup-cost/startup-data', 'POST', startupData);
      await authenticatedRequest('/funding/funding-data', 'POST', fundingData);
      await authenticatedRequest('/operations/submit-data', 'POST', operationsData);
      await authenticatedRequest('/payroll/submit-data', 'POST', payrollData);
  
      // Trigger recalculations only once after all data is submitted
      await authenticatedRequest(`/project/${projectId}/mark-initial-submit-complete`, 'POST');
      
      // Refresh all data
      await fetchProjectData();
      await fetchFundingData();
      await fetchOperationsFinanceData();
      await fetchPayrollData();
  
      setInitialSubmitted(true); // Mark initial submission as done
    } catch (err) {
      console.error('Error submitting data:', err);
      setError(err.message || 'An error occurred while submitting the data. Please try again.');
      setShowError(true);
      // Automatically hide the error after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Submit startup cost data to the server
  const handleSubmit = async () => {
    setError(null);
    setShowError(false);
      
    if (!validateData()) { // Stop submission if validation fails
      // Automatically hide the error after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
  
    setIsLoading(true);
    try {
      if (!projectId) {
        throw new Error('Project ID is not available. Please try again later.');
      }
  
      const requestData = { projectId, startupCosts, startupCapital, capitalWorkProgress, startingOperations };
      await authenticatedRequest('/startup-cost/startup-data', 'POST', requestData);
      
      await triggerAllRecalculations(projectId);
      fetchProjectData(); // Refresh data after submission
    } catch (err) {
      console.error('Error submitting data:', err);
      setError(err.message || 'An error occurred while submitting the data. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit funding data to the server
  const handleFundingSubmit = async () => {
    setError(null);
    setShowError(false);
      
    if (!validateData()) { // Stop submission if validation fails
      // Automatically hide the error after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
  
    setIsLoading(true);
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
      
      await authenticatedRequest('/funding/funding-data', 'POST', requestData);
      
      await triggerAllRecalculations(projectId);
      fetchFundingData(); // Refresh data after submission
    } catch (err) {
      console.error('Error submitting funding data:', err);
      setError(err.message || 'An error occurred while submitting the funding data. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit operations and finance data to the server
  const handleOperationsFinanceSubmit = async () => {
    setError(null);
    setShowError(false);
      
    if (!validateData()) { // Stop submission if validation fails
      // Automatically hide the error after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
  
    setIsLoading(true);
    try {
      if (!projectId) {
        throw new Error('Project ID is not available. Please try again later.');
      }
  
      const requestData = {
        projectId,
        revenueForecasts,
        variableCosts: variableCosts.filter(item => item.description && item.amount),
      };
      
      const response = await authenticatedRequest('/operations/submit-data', 'POST', requestData);
  
      if (response.data && response.data.message) {
        await triggerAllRecalculations(projectId);
        fetchOperationsFinanceData(); // Refresh data after submission
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (err) {
      console.error('Error submitting operations and finance data:', err);
      setError(err.message || 'An error occurred while submitting the data. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit payroll data to the server
  const handlePayrollSubmit = async () => {
    setError(null);
    setShowError(false);
      
    if (!validateData()) { // Stop submission if validation fails
      // Automatically hide the error after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
      return;
    }
  
    setIsLoading(true);
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
      
      const response = await authenticatedRequest('/payroll/submit-data', 'POST', requestData);
      
      await triggerAllRecalculations(projectId);
      setEmployeePayrolls(response.data.employee_payrolls);
      fetchPayrollData(); // Refresh data after submission
    } catch (err) {
      console.error('Error submitting payroll data:', err);
      setError(err.message || 'An error occurred while submitting the payroll data. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // When new data submits it trigger Recalculation
  const triggerAllRecalculations = async (projectId) => {
    try {
      const endpoints = [
        '/startup-cost-out/calculations',
        '/cogs-calculator/calculations',
        '/sales-forecast/calculations',
        '/salaries/calculations',
        '/forecast-pl/calculations',
        '/break-even-analysis/calculations',
        '/funding-out/calculations'
      ];
  
      const recalculationPromises = endpoints.map(endpoint => 
        authenticatedRequest(`${endpoint}/${projectId}`, 'GET')
          .catch(error => ({ endpoint, error })) // Catch errors for each request
      );
  
      const results = await Promise.all(recalculationPromises);
      
      const errors = [];
      results.forEach(result => {
        if (result.error) {
          console.error(`Error in endpoint ${result.endpoint}:`, result.error);
          errors.push(result);
        }
      });
  
      if (errors.length > 0) {
        throw new Error(`Recalculations failed for ${errors.length} endpoints. Check logs for details.`);
      }
  
    } catch (error) {
      console.error('Error during recalculations:', error);
      throw error;
    }
  };

   // =============================================================================
  //  Clear all items
  // =============================================================================

  // Clears all data from all tabs.
  const handleClearAll = (setFunction) => {
    setShowWarning(true);
  };

  //Handle Warning Cancel
  const handleWarningCancel = () => {
    setShowWarning(false);
  };

  // Confirms the user's decision to clear all data from all tabs.
  const handleWarningConfirm = async () => {
    setShowWarning(false);
    setIsSubmitting(true);
    try {
      await Promise.all([
        clearDataForSection(setStartupCosts, 'startup_costs', 'startup-cost'),
        clearDataForSection(setStartupCapital, 'startup_capital', 'startup-cost'),
        clearDataForSection(setCapitalWorkProgress, 'capital_work_progress', 'startup-cost'),
        clearDataForSection(setStartingOperations, 'starting_operations', 'startup-cost'),
      ]);

      await Promise.all([
        clearDataForSection(setAssets, 'assets', 'funding'),
        clearDataForSection(setLiabilities, 'liabilities', 'funding'),
        clearDataForSection(setCashFlow, 'cash_flow', 'funding'),
        clearSpecialSection(setFixedExpenses, 'fixed_expenses', handleDeleteFixedExpense),
        clearSpecialSection(setCapitalCosts, 'capital_costs', handleDeleteCapitalCost),
        clearRevenueSection(setRevenueForecasts, 'revenue_forecasts', handleDeleteRevenueForecast),
        clearEmployeePayrollSection(setEmployeePayrolls, handleDeleteEmployeePayroll),
      ]);

      await clearDataForSection(setVariableCosts, 'variable_costs', 'operations');

    // Reset the initial submission status after clearing all data
    setInitialSubmitted(false);

    // Update the initial_submit_complete status in the database
    if (!projectId) {
      throw new Error('Project ID is not available. Please try again later.');
    }
   await authenticatedRequest(`/project/${projectId}/mark-initial-submit-incomplete`, 'POST');

      await Promise.all([
        fetchProjectData(),
        fetchFundingData(),
        fetchOperationsFinanceData(),
      ]);
    } catch (error) {
      console.error('Error in handleWarningConfirm:', error);
      setError('Failed to clear all data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clears all data from a specific section (e.g., startup costs, assets, etc.)
  const clearDataForSection = async (setter, tableName, endpoint) => {
    try {
      const itemsToDelete = await new Promise(resolve => {
        setter(prevState => {
          const toDelete = prevState.filter(item => item.id != null);
          resolve(toDelete);
          return prevState; // Don't modify the state yet
        });
      });

      if (itemsToDelete.length === 0) {
        return;
      }

      const deletePromises = itemsToDelete.map(item => 
        authenticatedRequest(`/${endpoint}/delete-item/${item.id}/${projectId}?table=${tableName}`, 'DELETE')
      );

      await Promise.all(deletePromises);

      setter(() => [{ description: '', amount: '' }]);
    } catch (error) {
      throw error;
    }
  };

  // Clears all data from a Financial and Capital cost section
  const clearSpecialSection = async (setter, sectionName, deleteHandler) => {
    try {
      const itemsToDelete = await new Promise(resolve => {
        setter(prevState => {
          resolve([...prevState]);
          return prevState; // Don't modify the state yet
        });
      });

      if (itemsToDelete.length === 0) {
        return;
      }

      for (let i = itemsToDelete.length - 1; i >= 0; i--) {
        await deleteHandler(i);
      }
    } catch (error) {
      throw error;
    }
  };
  // Clears all data from Revenue section
  const clearRevenueSection = async (setter, sectionName, deleteHandler) => {
    try {
      const itemsToDelete = await new Promise(resolve => {
        setter(prevState => {
          resolve([...prevState]);
          return prevState; // Don't modify the state yet
        });
      });

      if (itemsToDelete.length === 0) {
        return;
      }

      for (let item of itemsToDelete) {
        if (item.id) {
          await deleteHandler(item.id);
        }
      }
    } catch (error) {
      throw error;
    }
  };
 // Clears all data from EmployeePayroll Section 
  const clearEmployeePayrollSection = async (setter, deleteHandler) => {
    try {
      const itemsToDelete = await new Promise(resolve => {
        setter(prevState => {
          resolve([...prevState]);
          return prevState; // Don't modify the state yet
        });
      });

      if (itemsToDelete.length === 0) {
        return;
      }

      for (let i = itemsToDelete.length - 1; i >= 0; i--) {
        await deleteHandler(i);
      }
    } catch (error) {
      throw error;
    }
  };
  

  
  // =============================================================================
  // JSX Rendering
  // =============================================================================

  return (
    <div className="entryitems d-flex flex-column justify-content-center">
      {/* Warning Window */}
      {showWarning && (
        <div className="warning-window">
          <div className="warning-content">
            <p>Are you sure you want to permanently delete all data from all tabs?</p>
            <div className="warning-buttons">
              <button onClick={handleWarningConfirm}  disabled={isSubmitting}>Confirm</button>
              <button onClick={handleWarningCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Error Message */}
      {showError && error && (
        <div className="floating-error">
          <span>{error}</span>
          <button className="close-error-btn" onClick={() => setShowError(false)}>
            &times;
          </button>
        </div>
      )}

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
          {/*   */}

          <div className="d-flex justify-content-center">
          <button className="submit-btn-last btn mx-2" onClick={handleClearAll}>Clear All</button>
            {initialSubmitted && (
                  <button className="submit-btn-last btn mx-2" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Startup Data'}
                  </button>
                )}
            <button className="submit-btn-last btn mx-2" onClick={handleNextTab}>Next</button>
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
                      <button type="button" className="btn btn-add" onClick={() => handleModalOpen('capitalCost')}>Yearly Expenses</button>
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
            <button className="submit-btn-last btn mx-2" onClick={handleClearAll}>Clear All</button>
              {initialSubmitted && (
                <button className="submit-btn-last btn mx-2" onClick={handleFundingSubmit} disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Funding Data'}
                </button>
              )}
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
            onChange={(e) => {
              setError(''); // Clear error when input changes
              handleModalInputChange('description', e.target.value);
            }}
          />
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter amount"
          value={modalAmount}
          onChange={(e) => {
            setError(''); // Clear error when input changes
            handleModalInputChange('amount', e.target.value);
          }}
        />
      </Form.Group>

      {modalType === 'fixedExpense' && (
        <Form.Group>
          <Form.Label>Select Months:</Form.Label>
          <Form.Check
            type="checkbox"
            id="select-all-fixed-expenses"
            label="Select All"
            checked={selectedMonths.length === months.length}
            onChange={() => {
              setError(''); // Clear error when input changes
              setSelectedMonths(selectedMonths.length === months.length ? [] : months);
            }}
          />
          <div className="d-flex flex-wrap">
            {months.map((month) => (
              <Form.Check
                key={month}
                type="checkbox"
                id={`month-${month}`}
                label={month}
                checked={selectedMonths.includes(month)}
                onChange={() => {
                  setError(''); // Clear error when input changes
                  handleMonthChange(month);
                }}
                className="me-3 mb-2"
              />
            ))}
          </div>
        </Form.Group>
      )}
      {modalType === 'capitalCost' && (
        <Form.Group>
          <Form.Label>Select Years:</Form.Label>
          <Form.Check
            type="checkbox"
            id="select-all-capital-costs"
            label="Select All"
            checked={selectedYears.length === years.length}
            onChange={() => {
              setError(''); // Clear error when input changes
              setSelectedYears(selectedYears.length === years.length ? [] : years);
            }}
          />
          <div className="d-flex flex-wrap">
            {years.map(year => (
              <Form.Check
                key={year}
                type="checkbox"
                id={`year-${year}`}
                label={year}
                checked={selectedYears.includes(year)}
                onChange={() => {
                  setError(''); // Clear error when input changes
                  handleYearChange(year);
                }}
                className="me-3 mb-2"
              />
            ))}
          </div>
        </Form.Group>
      )}
    </Form>

    {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
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
          <RevenueForecasts 
              onDataUpdate={handleRevenueDataUpdate} 
              projectId={projectId} 
              fetchData={fetchOperationsFinanceData} 
              setHandleDelete={setHandleDeleteRevenueForecast}
            />
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
        <button className="submit-btn-last btn mx-2" onClick={handleClearAll}>Clear All</button>
          {initialSubmitted && (
        <button className="submit-btn-last btn mx-2" onClick={handleOperationsFinanceSubmit} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Operations Data'}
            </button>
          )}
          <button className="submit-btn-last btn mx-2" onClick={handleNextTab}>Next</button>
        </div>
        {/*   */}
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
            <button className="submit-btn-last btn mx-2" onClick={handleClearAll} >Clear All</button>
            {!initialSubmitted && (
                <button className="submit-btn-last btn mx-2" onClick={handleInitialSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit All Data'}
                </button>
              )}
              {initialSubmitted && (
              
                  <button className="submit-btn-last btn mx-2" onClick={handlePayrollSubmit} disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Payroll Data'}
                  </button>
                
              )}
              {/* <button className="submit-btn-last btn mx-2" onClick={handleNextTab}>Next</button> */}
            </div>
            {/*   */}
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
                  type="number"
                  placeholder="Enter salary"
                  value={payrollSalary}
                  onChange={(e) => setPayrollSalary(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Select Months:</Form.Label>
                <Form.Check
                    type="checkbox"
                    id="select-all-employee-payrolls"
                    label="Select All"
                    checked={selectedMonthsPayroll.length === months.length}
                    onChange={() => {
                      setSelectedMonthsPayroll(selectedMonthsPayroll.length === months.length ? [] : months);
                    }}
                  />
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
      {isSubmitting && <LoadingOverlay />}
    </div>
  );
}

export default Entryitems;
