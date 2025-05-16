/**
 * Transaction Service
 * Handles all data operations for the transaction table
 */
import { toast } from "react-toastify";

// Transaction table fields for data operations
const TRANSACTION_FIELDS = [
  "Id",
  "Name",
  "date",
  "amount",
  "description",
  "category",
  "type",
  "account"
];

// Fetch all transactions for the current user
export const fetchTransactions = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: TRANSACTION_FIELDS,
      orderBy: [
        {
          field: "date",
          direction: "DESC" // Most recent first
        }
      ],
      // Only fetch non-deleted records
      where: [
        {
          fieldName: "IsDeleted",
          Operator: "ExactMatch",
          values: [false]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("transaction", params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data.map(formatTransactionFromApi);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    toast.error("Failed to load transactions");
    return [];
  }
};

// Create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const formattedData = formatTransactionForApi(transactionData);
    
    const params = {
      records: [formattedData]
    };
    
    const response = await apperClient.createRecord("transaction", params);
    
    if (!response || !response.success || !response.results || !response.results[0].success) {
      const errorMessage = response?.results?.[0]?.message || "Failed to create transaction";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    return formatTransactionFromApi(response.results[0].data);
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

// Update an existing transaction
export const updateTransaction = async (transactionData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const formattedData = formatTransactionForApi(transactionData);
    
    const params = {
      records: [formattedData]
    };
    
    const response = await apperClient.updateRecord("transaction", params);
    
    if (!response || !response.success || !response.results || !response.results[0].success) {
      const errorMessage = response?.results?.[0]?.message || "Failed to update transaction";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    return formatTransactionFromApi(response.results[0].data);
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (transactionId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [transactionId]
    };
    
    const response = await apperClient.deleteRecord("transaction", params);
    
    if (!response || !response.success) {
      toast.error("Failed to delete transaction");
      throw new Error("Failed to delete transaction");
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Format transaction data from API response to client format
function formatTransactionFromApi(apiTransaction) {
  return {
    id: apiTransaction.Id,
    description: apiTransaction.description || apiTransaction.Name,
    amount: Number(apiTransaction.amount) || 0,
    date: apiTransaction.date || new Date().toISOString().split('T')[0],
    category: apiTransaction.category || "shopping",
    type: apiTransaction.type || "expense",
    account: apiTransaction.account || ""
  };
}

// Format transaction data from client to API format
function formatTransactionForApi(clientTransaction) {
  return {
    Id: clientTransaction.id,
    Name: clientTransaction.description, // Use description as Name
    description: clientTransaction.description,
    amount: Number(clientTransaction.amount),
    date: clientTransaction.date,
    category: clientTransaction.category,
    type: clientTransaction.type,
    account: clientTransaction.account || ""
  };
}