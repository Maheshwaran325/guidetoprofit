// fundingAdvisorController.js
import { getFundingTypes, getUserProfile as getProfile, saveUserProfile as saveProfile, submitFeedback as saveFeedback, saveRecommendationHistory, getRecentRecommendations as fetchRecentRecommendations  } from './fundingAdvisorModel.js';
import logger from '../../../logger.js';

export const getFundingRecommendations = async (req, res) => {
  try {
      const userCriteria = req.body;
      const projectId = req.params.projectId;
      let fundingTypes;

      try {
          fundingTypes = await getFundingTypes();
      } catch (dbError) {
          logger.error('Database error in getFundingTypes:', dbError);
          return res.status(500).json({ error: 'An error occurred while fetching funding types.' });
      }

      if (fundingTypes.length === 0) {
          return res.status(404).json({ error: 'No funding types available.' });
      }

      const recommendations = calculateRecommendations(fundingTypes, userCriteria);

      // Only return top 5 recommendations
      const topRecommendations = recommendations.slice(0, 5);
      try {
          await saveRecommendationHistory(projectId, topRecommendations);
      } catch (saveError) {
          logger.error('Error saving recommendation history:', saveError);
          // Continue with the response even if saving history fails
      }

      res.status(200).json({ recommendations: topRecommendations });
  } catch (error) {
      logger.error('Error in getFundingRecommendations:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const profile = await getProfile(projectId);

    // If no profile is found, return a default empty profile structure
    if (!profile) {
      return res.status(200).json({
        profile_data: null, // or default values
        recommendation_history: [],
        recentRecommendation: null,
      });
    }

    // Include the most recent recommendation if available
    profile.recentRecommendation = (profile.recommendation_history && profile.recommendation_history.length > 0) 
      ? profile.recommendation_history[profile.recommendation_history.length - 1] 
      : null;

    res.status(200).json(profile);
  } catch (error) {
    logger.error('Error in getUserProfile:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user profile.' });
  }
};


export const submitFeedback = async (req, res) => {
  try {
    const { feedback, rating } = req.body;
    await saveFeedback(req.user.id, feedback, rating);
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    logger.error('Error in submitFeedback:', error);
    res.status(500).json({ error: 'An error occurred while submitting feedback.' });
  }
};


export const saveUserProfile = async (req, res) => {
  try {
    const { profileData } = req.body;
    const projectId = req.params.projectId;

    // Save the user profile (model handles both creation and updating)
    await saveProfile(projectId, profileData);

    res.status(200).json({ message: 'Profile saved successfully' });
  } catch (error) {
    logger.error('Error in saveUserProfile:', error);
    res.status(500).json({ error: 'An error occurred while saving the user profile.' });
  }
};

//RECOMMENDATIION ALGORITHM 
function normalize(value, min, max) {
  const numValue = Number(value);
  const numMin = Number(min);
  const numMax = Number(max);
  if (isNaN(numValue) || isNaN(numMin) || isNaN(numMax) || numMin === numMax) {
    return 0; // Return 0 if any input is invalid or min equals max
  }
  return Math.max(0, Math.min(1, (numValue - numMin) / (numMax - numMin)));
}

function calculatePenalty(userValue, fundingValue, tolerance = 0.2) {
  const diff = Math.abs(userValue - fundingValue);
  return Math.max(0, 1 - (diff / (diff + tolerance)));
}

function similarityScore(userValue, fundingValue) {
  const userArray = Array.isArray(userValue) ? userValue : [userValue];
  const fundingArray = Array.isArray(fundingValue) ? fundingValue : [fundingValue];
  
  if (userArray.length === 0 || fundingArray.length === 0) return 0;

  const intersection = userArray.filter(item => 
    fundingArray.some(fItem => 
      String(fItem).toLowerCase() === String(item).toLowerCase()
    )
  );
  return intersection.length / Math.max(userArray.length, fundingArray.length);
}

// Dynamic weight adjustment
function adjustWeights(weights, userCriteria) {
  const adjustedWeights = { ...weights };
  
  // Increase weight for criteria the user has specified
  Object.keys(userCriteria).forEach(key => {
      if (userCriteria[key] !== undefined && adjustedWeights[key]) {
          adjustedWeights[key] *= 1.2;
      }
  });

  // Normalize weights to ensure they still sum to 1
  const totalWeight = Object.values(adjustedWeights).reduce((sum, weight) => sum + weight, 0);
  Object.keys(adjustedWeights).forEach(key => {
      adjustedWeights[key] /= totalWeight;
  });

  return adjustedWeights;
}

// Main recommendation calculation function
function calculateRecommendations(fundingTypes, userCriteria) {
  // console.log('Starting recommendation calculation');
  // console.log('User Criteria:', JSON.stringify(userCriteria, null, 2));

  let weights = {
    amount: 0.35,
    stage: 0.25,
    revenue: 0.20,
    risk: 0.10,
    equity: 0.05,
    mentorship: 0.05,
    industry: 0.10,
    eligibility: 0.12,
    terms: 0.08,
    geographical: 0.06,
    timeline: 0.05,
    revenueModel: 0.07,
    successRate: 0.10
  };

  weights = adjustWeights(weights, userCriteria);
  // console.log('Adjusted Weights:', weights);

  const scoredFundingTypes = fundingTypes.map(fundingType => {
    // console.log(`Processing Funding Type: ${fundingType.name}`);
    let scores = {};

    try {
      // Amount score
      const minAmount = Math.min(Number(fundingType.min_amount), Number(fundingType.max_amount));
      const maxAmount = Math.max(Number(fundingType.min_amount), Number(fundingType.max_amount));
      scores.amount = normalize(Number(userCriteria.fundingAmountMin), minAmount, maxAmount);

      // Stage score
      scores.stage = similarityScore(userCriteria.businessStage, fundingType.business_stages);

      // Revenue score (assuming fundingType has a revenue field)
      scores.revenue = fundingType.revenue ? normalize(Number(fundingType.revenue), 0, Number(userCriteria.maxRevenue) || 1000000) : 0;

      // Risk score
      const riskLevels = { 'Low': 0, 'Medium': 0.5, 'High': 1 };
      scores.risk = 1 - Math.abs(riskLevels[fundingType.risk_level] - riskLevels[userCriteria.riskLevel]);
      // Equity match
      scores.equity = fundingType.equity_required === userCriteria.willingToGiveEquity ? 1 : 0;

      // Mentorship match
      scores.mentorship = fundingType.mentorship_provided === userCriteria.interestedInMentorship ? 1 : 0;

      // Industry match
      scores.industry = similarityScore(userCriteria.industryFocus, fundingType.industry_focus);

      // Eligibility match
      scores.eligibility = (fundingType.name === 'Microfinance' && userCriteria.eligibleForMicrofinance) ||
                           (fundingType.name === 'IPO' && userCriteria.compliantWithStockExchangeRegulations) ? 1 : 0;

      // Terms match
      scores.terms = similarityScore(userCriteria.loanRepaymentDuration, fundingType.typical_terms);

      // Geographical match
      scores.geographical = !userCriteria.geographicalRestrictions || fundingType.geographical_restrictions.length === 0 ? 1 :
                            similarityScore(userCriteria.geographicalRestrictions, fundingType.geographical_restrictions);

      // Timeline match
      const timelineMap = { 'short': 3, 'medium': 6, 'long': 12 };
      scores.timeline = 1 - Math.abs(normalize(timelineMap[fundingType.average_time_to_funding] || 6, 0, 12) - normalize(timelineMap[userCriteria.expectedFundingTimeline] || 6, 0, 12));
      // Revenue model match
      scores.revenueModel = fundingType.revenue_model === userCriteria.revenueModel ? 1 : 0;

      // Success rate match
      scores.successRate = parseFloat(fundingType.success_rate) / 100 || 0;
      // Calculate final weighted score
      const finalScore = Object.keys(scores).reduce((total, key) => {
        const score = isNaN(scores[key]) ? 0 : scores[key];
        return total + (weights[key] * score);
      }, 0);

      // console.log(`Scores for ${fundingType.name}:`, scores);
      // console.log(`Final Score for ${fundingType.name}:`, finalScore);

      return {
        ...fundingType,
        score: Math.max(0, Number((finalScore * 100).toFixed(2))) || 0,
        subscores: scores
      };
    } catch (error) {
      console.error(`Error processing ${fundingType.name}:`, error);
      return {
        ...fundingType,
        score: 0,
        subscores: scores,
        error: error.message
      };
    }
  });

  const sortedResults = scoredFundingTypes.sort((a, b) => b.score - a.score);
  // console.log('Sorted Results:', sortedResults.map(r => `${r.name}: ${r.score}`));

  return sortedResults;
}
  

export const getRecentRecommendations = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const recentRecommendations = await fetchRecentRecommendations(projectId);
    
    if (!recentRecommendations || recentRecommendations.length === 0) {
      return res.status(404).json({ error: 'No recommendation history found.' });
    }
    
    res.status(200).json({ recentRecommendations });
  } catch (error) {
    logger.error('Error in getRecentRecommendations:', error);
    res.status(500).json({ error: 'An error occurred while fetching recent recommendations.' });
  }
};