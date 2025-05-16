/**
 * Service for bill operations
 * Handles all API calls to the bill table
 */

// Get all bills for the current user
export const fetchBills = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Fetch all bills owned by the current user
    const response = await apperClient.fetchRecords('bill', {
      Fields: [
        'Id', 'Name', 'amount', 'dueDate', 'category', 
        'isPaid', 'recurring', 'autopay'
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
          field: "dueDate",
          direction: "ASC"
        }
      ]
    });

    if (!response || !response.data) {
      return [];
    }

    return response.data.map(bill => ({
      id: bill.Id,
      name: bill.Name,
      amount: bill.amount,
      dueDate: bill.dueDate,
      category: bill.category,
      isPaid: bill.isPaid,
      recurring: bill.recurring,
      autopay: bill.autopay
    }));
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw error;
  }
};

// Create a new bill
export const createBill = async (billData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.createRecord('bill', {
      records: [{
        Name: billData.name,
        amount: parseFloat(billData.amount),
        dueDate: billData.dueDate,
        category: billData.category,
        isPaid: billData.isPaid,
        recurring: billData.recurring,
        autopay: billData.autopay
      }]
    });

    if (!response || !response.success) {
      throw new Error("Failed to create bill");
    }

    return response.results[0].data;
  } catch (error) {
    console.error("Error creating bill:", error);
    throw error;
  }
};

// Update an existing bill
export const updateBill = async (billData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.updateRecord('bill', {
      records: [{
        Id: billData.id,
        Name: billData.name,
        amount: parseFloat(billData.amount),
        dueDate: billData.dueDate,
        category: billData.category,
        isPaid: billData.isPaid,
        recurring: billData.recurring,
        autopay: billData.autopay
      }]
    });

    if (!response || !response.success) {
      throw new Error("Failed to update bill");
    }

    return response.results[0].data;
  } catch (error) {
    console.error("Error updating bill:", error);
    throw error;
  }
};

// Delete a bill by ID
export const deleteBill = async (billId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.deleteRecord('bill', {
      RecordIds: [billId]
    });

    if (!response || !response.success) {
      throw new Error("Failed to delete bill");
    }

    return true;
  } catch (error) {
    console.error("Error deleting bill:", error);
    throw error;
  }
};