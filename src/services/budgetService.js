/**
 * Service for budget operations
 * Handles all API calls to the budget table
 */

// Get all budgets for the current user
export const fetchBudgets = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Fetch all budgets owned by the current user
    const response = await apperClient.fetchRecords('budget', {
      Fields: [
        'Id', 'Name', 'category', 'amount', 'spent', 
        'period', 'color'
      ],
      where: [
        {
          fieldName: "IsDeleted",
          Operator: "ExactMatch",
          values: [false]
        }
      ],
      orderBy: [
        {
          field: "category",
          direction: "ASC"
        }
      ]
    });

    if (!response || !response.data) {
      return [];
    }

    return response.data.map(budget => ({
      id: budget.Id,
      category: budget.category,
      amount: budget.amount,
      spent: budget.spent,
      period: budget.period,
      color: budget.color || 'blue'
    }));
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
};

// Create a new budget
export const createBudget = async (budgetData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord('budget', {
      records: [{
        Name: budgetData.category, // Using category as the Name
        category: budgetData.category,
        amount: parseFloat(budgetData.amount),
        spent: parseFloat(budgetData.spent),
        period: budgetData.period,
        color: budgetData.color
      }]
    });

    if (!response || !response.success) {
      throw new Error("Failed to create budget");
    }

    return response.results[0].data;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};

// Update an existing budget
export const updateBudget = async (budgetData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.updateRecord('budget', {
      records: [{
        Id: budgetData.id,
        Name: budgetData.category, // Using category as the Name
        category: budgetData.category,
        amount: parseFloat(budgetData.amount),
        spent: parseFloat(budgetData.spent),
        period: budgetData.period,
        color: budgetData.color
      }]
    });

    if (!response || !response.success) {
      throw new Error("Failed to update budget");
    }

    return response.results[0].data;
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error;
  }
};

// Delete a budget by ID
export const deleteBudget = async (budgetId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.deleteRecord('budget', {
      RecordIds: [budgetId]
    });

    if (!response || !response.success) {
      throw new Error("Failed to delete budget");
    }

    return true;
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
};