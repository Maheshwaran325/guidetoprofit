import React, { useState, useEffect, useCallback } from 'react';
import { useProject } from '../../ProjectContext';
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.css';
import './fundingadvcomp.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend);

const FundingAdvisorComponent = () => {
  const { projectId } = useProject();
  const [criteria, setCriteria] = useState({
    businessStage: '',
    fundingAmountMin: '',
    fundingAmountMax: '',
    willingToGiveEquity: false,
    preferDebtFinancing: false,
    lookingForNonDilutiveFunding: false,
    revenueStatus: '',
    businessType: [],
    strongCreditScore: false,
    collateralAvailable: false,
    noCreditHistory: false,
    timeToRepayment: '',
    geographicalRegion: '',
    growthPotential: '',
    scalability: '',
    productReadiness: '',
    preferredInvestors: [],
    riskLevel: '',
    interestedInMentorship: false,
    interestedInGovernmentSupport: false,
    eligibleForMicrofinance: false,
    compliantWithStockExchangeRegulations: false,
    flexibleRepaymentTerms: false,
    loanRepaymentDuration: '',
    riskToleranceVsSuccessRate: '',
    industryFocus: [],
    geographicalRestrictions: false,
    expectedFundingTimeline: '',
    revenueModel: '',
  });
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const safeNumber = (value, decimals = 2) => {
    return value != null ? Number(value).toFixed(decimals) : 'N/A';
  };

  const loadUserProfile = useCallback(async () => {
    if (!projectId) return;
  
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await authenticatedRequest(`/api/funding-advisor/profile/${projectId}`);
  
      if (response.data) {
        // Handle profile data if available
        if (response.data.profile_data) {
          setCriteria(prevCriteria => ({
            ...prevCriteria,
            ...response.data.profile_data,
          }));
        }
  
        // Handle recommendation history if available
        if (response.data.recommendation_history && response.data.recommendation_history.length > 0) {
          const latestRecommendation = response.data.recommendation_history[response.data.recommendation_history.length - 1];
          setRecommendations(latestRecommendation.recommendations || []);
        } else {
          setRecommendations([]); // Empty state for new users with no recommendations
        }
      }
    } catch (error) {
      // Silently handle 404 errors for new users (no profile)
      if (error.response && error.response.status !== 404) {
        setError('An error occurred while loading your profile. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);
  

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  // const loadRecentRecommendations = useCallback(async () => {
  //   try {
  //     const response = await authenticatedRequest(`/api/funding-advisor/recent-recommendations/${projectId}`);
  //     setRecentRecommendations(response.data.recentRecommendations || []);
  //   } catch (error) {
  //     console.error('Error loading recent recommendations:', error);
  //     setError('Failed to load recent recommendations. Please try again.');
  //   }
  // }, [projectId]);

  // useEffect(() => {
  //   if (projectId) {
  //     loadUserProfile();
  //     loadRecentRecommendations();
  //   }
  // }, [projectId, loadUserProfile, loadRecentRecommendations]);



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

  const parseNumber = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return NaN;
    return parseInt(value.replace(/,/g, ''), 10);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'businessType' || name === 'preferredInvestors' || name === 'industryFocus') {
        setCriteria(prev => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        setCriteria(prev => ({ ...prev, [name]: checked }));
      }
    } else if (name === 'fundingAmountMin' || name === 'fundingAmountMax') {
      const numValue = value === '' ? '' : parseNumber(value);
      
      if (value !== '' && isNaN(numValue)) {
        setError('Please enter a valid number');
        return;
      }

      if (numValue < 0) {
        setError('Negative values are not allowed');
        return;
      }

      setCriteria(prev => {
        const newCriteria = { ...prev, [name]: numValue };
        
        const minValue = parseNumber(newCriteria.fundingAmountMin);
        const maxValue = parseNumber(newCriteria.fundingAmountMax);

        if (name === 'fundingAmountMax' && maxValue !== '' && minValue !== '' && maxValue <= minValue) {
          setError('Maximum value should be greater than minimum value');
        } else if (name === 'fundingAmountMin' && minValue !== '' && maxValue !== '' && minValue >= maxValue) {
          setError('Minimum value should be less than maximum value');
        } else {
          setError('');
        }

        return newCriteria;
      });
    } else {
      setCriteria(prev => ({ ...prev, [name]: value }));
    }
  };


  const saveProfile = async () => {
    try {
      await authenticatedRequest(`/api/funding-advisor/profile/${projectId}`, 'POST', { profileData: criteria });
      // alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile. Please try again.');
    }
  };

  const getRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authenticatedRequest(`/api/funding-advisor/recommendations/${projectId}`, 'POST', criteria);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [criteria, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveProfile();
    await getRecommendations();
  };

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (Object.values(criteria).some(value => value !== '' && value !== false)) {
  //       getRecommendations();
  //     }
  //   }, 500);
  //   return () => clearTimeout(timeoutId);
  // }, [getRecommendations, criteria]);

  return (
    <div className="funding-advisor-container">
      <h1 className="mb-4">Funding Advisor</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className='label-funding'>Business Stage:</label>
          <div>
            {['Idea Stage', 'Early Stage', 'Growth Stage', 'Mature Business'].map((stage) => (
              <label key={stage} className="mr-2" title={getStageDescription(stage)}>
                <input
                  type="radio"
                  name="businessStage"
                  value={stage}
                  checked={criteria.businessStage === stage}
                  onChange={handleChange}
                /> {stage}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Funding Amount Needed:</label>
          <div className="input-row">
            <input 
              type="text" 
              name="fundingAmountMin" 
              onChange={handleChange} 
              value={formatNumber(criteria.fundingAmountMin)}
              className="form-control"
              placeholder="Minimum"
            />
            <input 
              type="text" 
              name="fundingAmountMax" 
              onChange={handleChange} 
              value={formatNumber(criteria.fundingAmountMax)}
              className="form-control"
              placeholder="Maximum"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
        <div className="form-group">
          <label className='label-funding'>Equity vs. Debt:</label>
          <div>
            <label className="mr-2">
              <input
                type="checkbox"
                name="willingToGiveEquity"
                checked={criteria.willingToGiveEquity}
                onChange={handleChange}
              /> Willing to give equity
            </label>
            <label className="mr-2">
              <input
                type="checkbox"
                name="preferDebtFinancing"
                checked={criteria.preferDebtFinancing}
                onChange={handleChange}
              /> Prefer debt financing (loans)
            </label>
            <label>
              <input
                type="checkbox"
                name="lookingForNonDilutiveFunding"
                checked={criteria.lookingForNonDilutiveFunding}
                onChange={handleChange}
              /> Looking for non-dilutive funding
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Revenue Status:</label>
          <div>
            {['Pre-revenue', 'Generating revenue', 'Profitable'].map((status) => (
              <label key={status} className="mr-2">
                <input
                  type="radio"
                  name="revenueStatus"
                  value={status}
                  checked={criteria.revenueStatus === status}
                  onChange={handleChange}
                /> {status}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Business Type:</label>
          <div>
            {['Tech/Software', 'Consumer Products', 'Manufacturing', 'Service-Based', 'Research/Innovation', 'Non-profit/Social Enterprise'].map((type) => (
              <label key={type} className="mr-2">
                <input
                  type="checkbox"
                  name="businessType"
                  value={type}
                  checked={criteria.businessType.includes(type)}
                  onChange={handleChange}
                /> {type}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Financial History:</label>
          <div>
            <label className="mr-2">
              <input
                type="checkbox"
                name="strongCreditScore"
                checked={criteria.strongCreditScore}
                onChange={handleChange}
              /> Strong credit score
            </label>
            <label className="mr-2">
              <input
                type="checkbox"
                name="collateralAvailable"
                checked={criteria.collateralAvailable}
                onChange={handleChange}
              /> Collateral available
            </label>
            <label>
              <input
                type="checkbox"
                name="noCreditHistory"
                checked={criteria.noCreditHistory}
                onChange={handleChange}
              /> No credit or financial history
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Time to Repayment:</label>
          <div>
            {['Immediate repayment (short-term)', 'Long-term repayment', 'No repayment (grants, subsidies)'].map((option) => (
              <label key={option} className="mr-2">
                <input
                  type="radio"
                  name="timeToRepayment"
                  value={option}
                  checked={criteria.timeToRepayment === option}
                  onChange={handleChange}
                /> {option}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Geographical Region:</label>
          <div>
            <label className="mr-2">
              <input
                type="radio"
                name="geographicalRegion"
                value="Developing region"
                checked={criteria.geographicalRegion === "Developing region"}
                onChange={handleChange}
              /> Developing region (e.g., eligible for microfinance)
            </label>
            <label>
              <input
                type="radio"
                name="geographicalRegion"
                value="Developed region"
                checked={criteria.geographicalRegion === "Developed region"}
                onChange={handleChange}
              /> Developed region
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Growth Potential:</label>
          <div>
            {['High-growth potential', 'Steady growth', 'Stable or slow growth'].map((option) => (
              <label key={option} className="mr-2">
                <input
                  type="radio"
                  name="growthPotential"
                  value={option}
                  checked={criteria.growthPotential === option}
                  onChange={handleChange}
                /> {option}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Scalability:</label>
          <div>
            <label className="mr-2">
              <input
                type="radio"
                name="scalability"
                value="Scalable business model"
                checked={criteria.scalability === "Scalable business model"}
                onChange={handleChange}
              /> Scalable business model
            </label>
            <label>
              <input
                type="radio"
                name="scalability"
                value="Local/small market focus"
                checked={criteria.scalability === "Local/small market focus"}
                onChange={handleChange}
              /> Local/small market focus
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Product Readiness:</label>
          <div>
            {['No product (just idea)', 'Prototype/MVP ready', 'Market-ready product'].map((option) => (
              <label key={option} className="mr-2">
                <input
                  type="radio"
                  name="productReadiness"
                  value={option}
                  checked={criteria.productReadiness === option}
                  onChange={handleChange}
                /> {option}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Type of Investors/Partners Preferred:</label>
          <div>
            {['Angel Investors', 'Venture Capitalists', 'Strategic Partnerships', 'Corporate Investors'].map((type) => (
              <label key={type} className="mr-2">
                <input
                  type="checkbox"
                  name="preferredInvestors"
                  value={type}
                  checked={criteria.preferredInvestors.includes(type)}
                  onChange={handleChange}
                /> {type}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Risk Level Willing to Take:</label>
          <div>
            <label className="mr-2">
              <input
                type="radio"
                name="riskLevel"
                value="High risk"
                checked={criteria.riskLevel === "High risk"}
                onChange={handleChange}
              /> High risk (potential for high reward)
            </label>
            <label>
              <input
                type="radio"
                name="riskLevel"
                value="Low risk"
                checked={criteria.riskLevel === "Low risk"}
                onChange={handleChange}
              /> Low risk (prefer stable returns)
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>
            <input 
              type="checkbox" 
              name="interestedInMentorship" 
              checked={criteria.interestedInMentorship}
              onChange={handleChange}
            /> Interested in Mentorship (incubator/accelerator)
          </label>
        </div>
        <div className="form-group">
          <label>
            <input 
              type="checkbox" 
              name="interestedInGovernmentSupport" 
              checked={criteria.interestedInGovernmentSupport}
              onChange={handleChange}
            /> Interested in government grants or subsidies
          </label>
        </div>
        
        {/* New fields */}
        <div className="form-group">
          <label className='label-funding'>Eligibility Criteria:</label>
          <div>
            <label>
              <input
                type="checkbox"
                name="eligibleForMicrofinance"
                checked={criteria.eligibleForMicrofinance}
                onChange={handleChange}
              /> Eligible for microfinance
            </label>
            <label>
              <input
                type="checkbox"
                name="compliantWithStockExchangeRegulations"
                checked={criteria.compliantWithStockExchangeRegulations}
                onChange={handleChange}
              /> Compliant with stock exchange regulations
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Loan Terms:</label>
          <div>
            <label>
              <input
                type="checkbox"
                name="flexibleRepaymentTerms"
                checked={criteria.flexibleRepaymentTerms}
                onChange={handleChange}
              /> Willing to accept flexible repayment terms
            </label>
          </div>
          
        </div >
        <div className="form-group">
            <label className='label-funding' style={{fontWeight:"550"}}>Typical loan repayment duration:</label>
            <select name="loanRepaymentDuration" onChange={handleChange} value={criteria.loanRepaymentDuration} className="form-control">
              <option value="">Select duration</option>
              <option value="short">Short-term (&lt; 1 year)</option>
              <option value="medium">Medium-term (1-5 years)</option>
              <option value="long">Long-term (&gt; 5 years)</option>
            </select>
        </div>
        <div className="form-group">
          <label className='label-funding'>Risk Tolerance vs Success Rate:</label>
          <div>
            <select name="riskToleranceVsSuccessRate" onChange={handleChange} value={criteria.riskToleranceVsSuccessRate} className="form-control">
              <option value="">Select preference</option>
              <option value="lowRisk">Lower risk, potentially lower returns</option>
              <option value="balanced">Balanced risk and returns</option>
              <option value="highRisk">Higher risk, potentially higher returns</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Industry Focus:</label>
          <div>
            {['Tech', 'Healthcare', 'Finance', 'Education', 'Energy', 'Retail', 'Manufacturing'].map((industry) => (
              <label key={industry} className="mr-2">
                <input
                  type="checkbox"
                  name="industryFocus"
                  value={industry}
                  checked={criteria.industryFocus.includes(industry)}
                  onChange={handleChange}
                /> {industry}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Geographical Restrictions:</label>
          <div>
            <label>
              <input
                type="checkbox"
                name="geographicalRestrictions"
                checked={criteria.geographicalRestrictions}
                onChange={handleChange}
              /> Face geographical restrictions on business operations
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Expected Funding Timeline:</label>
          <div>
            <select name="expectedFundingTimeline" onChange={handleChange} value={criteria.expectedFundingTimeline} className="form-control">
              <option value="">Select timeline</option>
              <option value="immediate">Immediate (1-3 months)</option>
              <option value="short">Short-term (3-6 months)</option>
              <option value="long">Long-term (over 6 months)</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className='label-funding'>Revenue Model:</label>
          <div>
            <select name="revenueModel" onChange={handleChange} value={criteria.revenueModel} className="form-control">
              <option value="">Select revenue model</option>
              <option value="subscription">Subscription-based</option>
              <option value="transaction">Transaction-based</option>
              <option value="advertising">Advertising-based</option>
              <option value="licensing">Licensing/Royalty</option>
              <option value="freemium">Freemium</option>
            </select>
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={isLoading}> 
          {isLoading ? 'Recommending...' : 'Get Recommendation'}
          </button>
      </form>
      
         
      {isLoading && <div className="loading-spinner">Loading...</div>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && recommendations && recommendations.length > 0 && (
        <div className="recommendations mt-4">
          <div className="charts-container d-flex justify-content-between mb-4">
            <div className="chart-wrapper" style={{width: '48%'}}>
              <h5>Funding Type Distribution</h5>
              <Pie data={getChartData(recommendations)} />
            </div>
            <div className="chart-wrapper" style={{width: '48%'}}>
              <h5>Match Scores</h5>
              <Line data={getLineChartData(recommendations)} options={getLineChartOptions()} />
            </div>
          </div>
          <ul className="recommendation-list">
            {recommendations.map((rec, index) => (
              <li key={index} className="recommendation-item card mb-3">
                <div className="card-body">
                  <h3 className="card-title">{rec.name}</h3>
                  <p className="card-text">{rec.description}</p>
                  <p className="card-text">
                    <strong>Match score:</strong> {safeNumber(rec.score)}
                  </p>
                  <details>
                    <summary className="text-primary cursor-pointer">Learn More</summary>
                    <div className="mt-2">
                      <p>{rec.detailed_info}</p>
                      <p><strong>Typical terms:</strong> {rec.typical_terms}</p>
                      <p><strong>Average time to funding:</strong> {rec.average_time_to_funding}</p>
                      <p><strong>Success rate:</strong> {rec.success_rate}%</p>
                    </div>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

function getStageDescription(stage) {
  const descriptions = {
    'Idea Stage': 'You have a business idea but haven\'t started operations yet.',
    'Early Stage': 'You\'ve started your business and are working on product-market fit.',
    'Growth Stage': 'Your business is established and you\'re looking to scale.',
    'Mature Business': 'Your business is well-established with a stable market position.'
  };
  return descriptions[stage] || '';
}

function getChartData(recommendations) {
  return {
    labels: recommendations.map(rec => rec.name),
    datasets: [
      {
        data: recommendations.map(rec => rec.score),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        ],
      },
    ],
  };
}

function getLineChartData(recommendations) {
  return {
    labels: recommendations.map(rec => rec.name),
    datasets: [
      {
        label: 'Match Score',
        data: recommendations.map(rec => rec.score),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };
}

function getLineChartOptions() {
  return {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };
}

export default FundingAdvisorComponent;



  /* // const profileCompletionPercentage = useMemo(() => {
    //   const totalFields = Object.keys(criteria).length;
    //   const filledFields = Object.values(criteria).filter(value => value !== '' && value !== false).length;
    //   return Math.round((filledFields / totalFields) * 100);
    // }, [criteria]);
  
    // const submitFeedback = async () => {
    //   try {
    //     await authenticatedRequest('/api/funding-advisor/feedback', 'POST', { feedback, rating: parseInt(rating) });
    //     alert('Thank you for your feedback!');
    //     setFeedback('');
    //     setRating('');
    //   } catch (error) {
    //     console.error('Error submitting feedback:', error);
    //     setError('Failed to submit feedback. Please try again.');
    //   }
    // }; */

          /*{ <div className="profile-completion">
        <h2>Profile Completion</h2>
        <div className="progress">
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{width: `${profileCompletionPercentage}%`}} 
            aria-valuenow={profileCompletionPercentage} 
            aria-valuemin="0" 
            aria-valuemax="100"
          >
            {profileCompletionPercentage}%
          </div>
        </div>
      </div> }*/