/**
 * Service for financial goal operations
 * Handles all API calls to the financial_goal table
 */

// Get all financial goals for the current user
export const fetchFinancialGoals = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Fetch all financial goals owned by the current user
    const response = await apperClient.fetchRecords('financial_goal', {
      Fields: ['Id', 'Name', 'target', 'current', 'targetDate', 'category'],
      where: [
        {
          fieldName: "IsDeleted",
          Operator: "ExactMatch",
          values: [false]
        }
      ],
      orderBy: [
        {
          field: "targetDate",
          direction: "ASC"
        }
      ]
    });

    if (!response || !response.data) {
      return [];
    }

    return response.data.map(goal => ({
      id: goal.Id,
      name: goal.Name,
      target: goal.target,
      current: goal.current,
      targetDate: goal.targetDate,
      category: goal.category
    }));
  } catch (error) {
    console.error("Error fetching financial goals:", error);
    throw error;
  }
};

// Create a new financial goal
export const createFinancialGoal = async (goalData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord('financial_goal', {
      records: [{
        Name: goalData.name,
        target: goalData.target,
        current: goalData.current,
        targetDate: goalData.targetDate,
        category: goalData.category
      }]
    });

    if (!response || !response.success) {
      throw new Error("Failed to create financial goal");
    }

    return response.results[0].data;
  } catch (error) {
    console.error("Error creating financial goal:", error);
    throw error;
  }
};

// Update an existing financial goal
export const updateFinancialGoal = async (goalData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.updateRecord('financial_goal', {
      records: [{
        Id: goalData.id,
        Name: goalData.name,
        target: goalData.target,
        current: goalData.current,
        targetDate: goalData.targetDate,
        category: goalData.category
      }]
    });

    if (!response || !response.success) {
      throw new Error("Failed to update financial goal");
    }

    return response.results[0].data;
  } catch (error) {
    console.error("Error updating financial goal:", error);
    throw error;
  }
};

// Delete a financial goal by ID
export const deleteFinancialGoal = async (goalId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.deleteRecord('financial_goal', {
      RecordIds: [goalId]
    });

    if (!response || !response.success) {
      throw new Error("Failed to delete financial goal");
    }

    return true;
  } catch (error) {
    console.error("Error deleting financial goal:", error);
    throw error;
  }
};