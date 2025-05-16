import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import getIcon from "../utils/iconUtils";

// Icon components
const PlusIcon = getIcon("Plus");
const ChevronDownIcon = getIcon("ChevronDown");
const ShoppingBagIcon = getIcon("ShoppingBag");
const CoffeeIcon = getIcon("Coffee");
const HomeIcon = getIcon("Home");
const CarIcon = getIcon("Car");
const HeartIcon = getIcon("Heart");
const DollarSignIcon = getIcon("DollarSign");
const ShoppingCartIcon = getIcon("ShoppingCart");
const TrashIcon = getIcon("Trash");
const EditIcon = getIcon("Edit");
const XIcon = getIcon("X");

// Transaction categories with icons
const categories = [
  { id: "groceries", name: "Groceries", icon: ShoppingCartIcon, color: "text-green-500" },
  { id: "dining", name: "Dining", icon: CoffeeIcon, color: "text-amber-500" },
  { id: "shopping", name: "Shopping", icon: ShoppingBagIcon, color: "text-blue-500" },
  { id: "housing", name: "Housing", icon: HomeIcon, color: "text-purple-500" },
  { id: "transportation", name: "Transportation", icon: CarIcon, color: "text-cyan-500" },
  { id: "health", name: "Health", icon: HeartIcon, color: "text-red-500" },
  { id: "income", name: "Income", icon: DollarSignIcon, color: "text-emerald-500" },
];

// Transaction form fields
const initialFormState = {
  description: "",
  amount: "",
  date: format(new Date(), "yyyy-MM-dd"),
  category: "shopping",
  type: "expense",
};

// Sample transaction data
const sampleTransactions = [
  {
    id: "t1",
    description: "Salary",
    amount: 3500,
    date: "2023-05-28",
    category: "income",
    type: "income",
  },
  {
    id: "t2",
    description: "Apartment Rent",
    amount: 1200,
    date: "2023-05-27",
    category: "housing",
    type: "expense",
  },
  {
    id: "t3",
    description: "Grocery Shopping",
    amount: 185.75,
    date: "2023-05-26",
    category: "groceries",
    type: "expense",
  },
  {
    id: "t4",
    description: "Dinner with Friends",
    amount: 68.50,
    date: "2023-05-25",
    category: "dining",
    type: "expense",
  },
];

function MainFeature() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const modalRef = useRef(null);
  
  // Load sample transactions
  useEffect(() => {
    setTransactions(sampleTransactions);
  }, []);

  // Handle click outside modal
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  // Toggle modal visibility
  const openModal = () => setShowModal(true);
  const closeModal = () => {
  const toggleForm = () => {
    setShowModal(false);
    if (editingId) {
      setEditingId(null);
      setFormData(initialFormState);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Create new transaction or update existing
    if (editingId) {
      // Update existing transaction
      const updatedTransactions = transactions.map(transaction => 
        transaction.id === editingId 
          ? { 
              ...transaction, 
              description: formData.description,
              amount: Number(formData.amount),
              date: formData.date,
              category: formData.category,
              type: formData.type
            }
          : transaction
      );
      
      setTransactions(updatedTransactions);
      toast.success("Transaction updated successfully");
      setEditingId(null);
    } else {
      // Add new transaction
      const newTransaction = {
        id: `t${Date.now()}`,
        description: formData.description,
        amount: Number(formData.amount),
        date: formData.date,
        category: formData.category,
        type: formData.type,
      };
      
      setTransactions([newTransaction, ...transactions]);
      toast.success("Transaction added successfully");
    }
    
    // Reset form data and hide form
    setFormData(initialFormState);
    setShowModal(false);
  };

  // Edit transaction
  const handleEdit = (transaction) => {
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      date: transaction.date,
      category: transaction.category,
      type: transaction.type,
    });
    setEditingId(transaction.id);
    setShowModal(true);
  };

  // Delete transaction
  const handleDelete = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    toast.success("Transaction deleted successfully");
  };

  // Get category details by ID
  const getCategoryById = (categoryId) => {
    return categories.find(category => category.id === categoryId) || categories[0];
  };

  return (
    <div className="space-y-6">
      {/* Add transaction button */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h3 className="text-lg md:text-xl font-semibold">
          Recent Transactions
        </h3>
          onClick={openModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleForm}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>{editingId ? "Edit Transaction" : "Add Transaction"}</span>
        </motion.button>
      </div>

      {/* Add/Edit transaction form */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-backdrop"
            onClick={handleClickOutside}
          >
            <motion.div 
              className="modal-container"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              ref={modalRef}
            >
              <div className="modal-content">
                <form onSubmit={handleSubmit} className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">
                      {editingId ? "Edit Transaction" : "Add New Transaction"}
                    </h4>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                      aria-label="Close modal"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-surface-600 dark:text-surface-400">
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="What was this for?"
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-surface-600 dark:text-surface-400">
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          $
                        </span>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="input-field pl-7"
                          step="0.01"
                          min="0.01"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-surface-600 dark:text-surface-400">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-surface-600 dark:text-surface-400">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="input-field appearance-none pr-10"
                          required
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 text-surface-500" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:col-span-2">
                      <label className="mb-1 text-sm text-surface-600 dark:text-surface-400">
                        Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value="expense"
                            checked={formData.type === "expense"}
                            onChange={handleInputChange}
                            className="form-radio h-4 w-4 text-primary"
                          />
                          <span>Expense</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value="income"
                            checked={formData.type === "income"}
                            onChange={handleInputChange}
                            className="form-radio h-4 w-4 text-primary"
                          />
                          <span>Income</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingId ? "Update" : "Add"} Transaction
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions list */}
      <div className="card border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-100 dark:bg-surface-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-surface-500">
                    No transactions found. Add your first transaction to get started.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const category = getCategoryById(transaction.category);
                  const CategoryIcon = category.icon;
                  return (
                    <tr
                      key={transaction.id}
                      className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium">{transaction.description}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className={`w-4 h-4 ${category.color}`} />
                          <span>{category.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-surface-600 dark:text-surface-400">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap text-right font-semibold ${
                        transaction.type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-1 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400"
                            aria-label="Edit transaction"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-surface-600 dark:text-surface-400 hover:text-red-600 dark:hover:text-red-400"
                            aria-label="Delete transaction"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MainFeature;