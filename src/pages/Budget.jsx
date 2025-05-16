import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from "../services/budgetService";
import getIcon from "../utils/iconUtils";

// Icon components
const PieChartIcon = getIcon("PieChart");
const PlusIcon = getIcon("Plus");
const EditIcon = getIcon("Edit");
const TrashIcon = getIcon("Trash");
const ArrowLeftIcon = getIcon("ArrowLeft");
const LoaderIcon = getIcon("Loader");
const CheckIcon = getIcon("Check");
const XIcon = getIcon("X");
const AlertCircleIcon = getIcon("AlertCircle");
const AlertTriangleIcon = getIcon("AlertTriangle");

// Sample categories
const categories = [
  "Housing", "Transportation", "Food", "Utilities", 
  "Healthcare", "Entertainment", "Shopping", "Personal Care",
  "Education", "Travel", "Gifts", "Savings", "Investments", "Debt", "Other"
];

// Default budgets if none are found
const defaultBudgets = [
  // Empty by default, will load from API
];

// Color options for budgets
const colorOptions = {
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", progress: "bg-blue-500" },
  green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400", progress: "bg-green-500" },
  red: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", progress: "bg-red-500" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", progress: "bg-purple-500" },
  amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", progress: "bg-amber-500" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400", progress: "bg-indigo-500" },
  pink: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-600 dark:text-pink-400", progress: "bg-pink-500" },
  teal: { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-600 dark:text-teal-400", progress: "bg-teal-500" },
};

function Budget() {
  const navigate = useNavigate();
  
  // State for budgets
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load budgets from API
  useEffect(() => {
    fetchBudgets()
      .then(data => setBudgets(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const [currentBudget, setCurrentBudget] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    spent: "0",
    period: "Monthly",
    color: "blue"
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.amount) {
      newErrors.amount = "Budget amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Budget amount must be a positive number";
    }
    
    if (isNaN(formData.spent) || parseFloat(formData.spent) < 0) {
      newErrors.spent = "Spent amount must be a non-negative number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open modal to add new budget
  const openAddModal = () => {
    setCurrentBudget(null);
    setFormData({
      category: "",
      amount: "",
      spent: "0",
      period: "Monthly",
      color: "blue"
    });
    setIsModalOpen(true);
  };

  // Open modal to edit budget
  const openEditModal = (budget) => {
    setCurrentBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      spent: budget.spent.toString(),
      period: budget.period,
      color: budget.color
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitting(true);
    if (!validateForm()) {
      return;
    }
    
    const budgetData = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      spent: parseFloat(formData.spent),
      period: formData.period,
      color: formData.color
    };
    
    if (currentBudget) {
      // Update existing budget in database
      const updateData = {
        ...budgetData,
        id: currentBudget.id
      };
      
      updateBudget(updateData)
        .then(() => {
          const updatedBudgets = budgets.map(budget => 
            budget.id === currentBudget.id 
              ? { ...budget, ...budgetData } 
              : budget
          );
          setBudgets(updatedBudgets);
          toast.success("Budget updated successfully!");
          setIsModalOpen(false);
        })
        .catch(err => {
          toast.error(`Error updating budget: ${err.message}`);
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      // Add new budget to database
      createBudget(budgetData)
        .then(newBudget => {
          const formattedBudget = {
            id: newBudget.Id,
            category: newBudget.category,
            amount: newBudget.amount,
            spent: newBudget.spent,
            period: newBudget.period,
            color: newBudget.color
          };
          setBudgets([...budgets, formattedBudget]);
          toast.success("Budget added successfully!");
          setIsModalOpen(false);
        })
        .catch(err => {
          toast.error(`Error creating budget: ${err.message}`);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirm = (budget) => {
    setBudgetToDelete(budget);
    setIsDeleteConfirmOpen(true);
  };

  // Handle budget deletion
  const handleDeleteBudget = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete.id)
        .then(() => {
          const filteredBudgets = budgets.filter(budget => budget.id !== budgetToDelete.id);
          setBudgets(filteredBudgets);
          toast.success("Budget deleted successfully!");
          setIsDeleteConfirmOpen(false);
        })
        .catch(err => {
          toast.error(`Error deleting budget: ${err.message}`);
        });
    }
  };

  // Get status color based on budget progress
  const getBudgetStatus = (budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    
    if (percentage >= 100) {
      return { 
        icon: AlertCircleIcon,
        color: "text-red-500",
        message: "Exceeded"
      };
    } else if (percentage >= 85) {
      return { 
        icon: AlertTriangleIcon,
        color: "text-amber-500",
        message: "Warning"
      };
    } else {
      return { 
        icon: CheckIcon,
        color: "text-green-500",
        message: "On Track"
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <PieChartIcon className="text-primary" />
            Budget Management
          </h1>
        </div>
        <button 
          onClick={openAddModal}
          className="btn btn-primary"
        > 
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Budget
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <LoaderIcon className="w-10 h-10 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading budgets...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          <p className="font-medium">Error loading budgets</p>
          <p className="text-sm mt-1">{error}</p>
          <button className="mt-2 btn-outline text-red-600 border-red-300" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* Budget stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-surface-500 text-sm">Total Budgets</div>
          <div className="text-2xl font-semibold mt-1">{budgets.length}</div>
        </div>
        <div className="card">
          <div className="text-surface-500 text-sm">Total Budgeted</div>
          <div className="text-2xl font-semibold mt-1">
            ${budgets.reduce((sum, budget) => sum + budget.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="card">
          <div className="text-surface-500 text-sm">Total Spent</div>
          <div className="text-2xl font-semibold mt-1">
            ${budgets.reduce((sum, budget) => sum + budget.spent, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="card">
          <div className="text-surface-500 text-sm">Remaining</div>
          <div className="text-2xl font-semibold mt-1">
            ${(budgets.reduce((sum, budget) => sum + budget.amount, 0) - budgets.reduce((sum, budget) => sum + budget.spent, 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Budget list */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Budgets</h2>
        
        {!loading && !error && budgets.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-surface-500 dark:text-surface-400 mb-4">You haven't set up any budgets yet.</p>
            <button onClick={openAddModal} className="btn btn-primary">
              <PlusIcon className="w-5 h-5 mr-2" />
              Create your first budget
            </button>
          </div>
        ) : (!loading && !error) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((budget) => {
              const percentage = Math.min(100, (budget.spent / budget.amount) * 100);
              const status = getBudgetStatus(budget);
              const colorStyle = colorOptions[budget.color];
              
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`card ${colorStyle.bg}`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`font-medium ${colorStyle.text}`}>{budget.category}</div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => openEditModal(budget)}
                        className="p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                        aria-label="Edit budget"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteConfirm(budget)}
                        className="p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                        aria-label="Delete budget"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mt-2">
                    <div>
                      <span className="text-surface-500 dark:text-surface-400">Spent: </span>
                      <span className="font-medium">${budget.spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="text-surface-500 dark:text-surface-400">of </span>
                      <span className="font-medium">${budget.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colorStyle.progress} ${percentage >= 100 ? 'animate-pulse' : ''}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <span className={`${status.color}`}>
                        <status.icon className="w-4 h-4" />
                      </span>
                      <span className={`${status.color} font-medium`}>
                        {status.message}
                      </span>
                    </div>
                    <div className="text-surface-500 dark:text-surface-400">
                      {percentage.toFixed(0)}% used
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          null
        )}
      </div>
      
      {/* Add/Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {currentBudget ? 'Edit Budget' : 'Add New Budget'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                aria-label="Close"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`input-field ${errors.category ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">
                  Budget Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">$</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={`input-field pl-8 ${errors.amount ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="spent" className="block text-sm font-medium mb-1">
                  Amount Spent
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500">$</span>
                  <input
                    type="number"
                    id="spent"
                    name="spent"
                    value={formData.spent}
                    onChange={handleInputChange}
                    className={`input-field pl-8 ${errors.spent ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.spent && (
                  <p className="text-red-500 text-sm mt-1">{errors.spent}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="period" className="block text-sm font-medium mb-1">
                  Budget Period
                </label>
                <select
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Budget Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(colorOptions).map(([color, style]) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, color})}
                      className={`w-8 h-8 rounded-full ${style.progress} ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-surface-800' : ''}`}
                      aria-label={`${color} color`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting && (
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {currentBudget ? 'Save Changes' : 'Create Budget'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex items-center gap-3 text-red-500 mb-2">
              <AlertCircleIcon className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            </div>
            
            <p className="text-surface-600 dark:text-surface-300 mb-4">
              Are you sure you want to delete the budget for <span className="font-medium">{budgetToDelete?.category}</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBudget}
                className="btn bg-red-500 hover:bg-red-600 text-white active:scale-95"
              >
                <TrashIcon className="w-5 h-5 mr-1" />
                Delete Budget
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Budget;