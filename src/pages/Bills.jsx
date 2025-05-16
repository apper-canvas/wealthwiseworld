import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import getIcon from "../utils/iconUtils";

// Icon components
const PlusIcon = getIcon("Plus");
const TrashIcon = getIcon("Trash");
const EditIcon = getIcon("Edit");
const BellIcon = getIcon("Bell");
const DollarSignIcon = getIcon("DollarSign");
const CalendarIcon = getIcon("Calendar");
const FilterIcon = getIcon("Filter");
const CreditCardIcon = getIcon("CreditCard");
const XIcon = getIcon("X");
const ArrowLeftIcon = getIcon("ArrowLeft");

function Bills() {
  const navigate = useNavigate();
  // State for bills list
  const [bills, setBills] = useState(() => {
    const savedBills = localStorage.getItem("bills");
    return savedBills
      ? JSON.parse(savedBills)
      : [
          {
            id: 1,
            name: "Electricity",
            amount: 120.50,
            dueDate: "2023-08-15",
            category: "Utilities",
            isPaid: false,
            recurring: "monthly",
            autopay: false,
          },
          {
            id: 2,
            name: "Internet",
            amount: 75.99,
            dueDate: "2023-08-20",
            category: "Utilities",
            isPaid: true,
            recurring: "monthly",
            autopay: true,
          },
          {
            id: 3,
            name: "Rent",
            amount: 1500.00,
            dueDate: "2023-09-01",
            category: "Housing",
            isPaid: false,
            recurring: "monthly",
            autopay: false,
          },
          {
            id: 4,
            name: "Netflix",
            amount: 15.99,
            dueDate: "2023-08-10",
            category: "Entertainment",
            isPaid: true,
            recurring: "monthly",
            autopay: true,
          },
        ];
  });

  // State for active bill (for edit modal)
  const [activeBill, setActiveBill] = useState(null);
  
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for filter and sort options
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("dueDate");

  // Save bills to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  // Open the modal for adding a new bill
  const handleAddBill = () => {
    setActiveBill({
      id: Date.now(),
      name: "",
      amount: "",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      category: "Other",
      isPaid: false,
      recurring: "monthly",
      autopay: false,
    });
    setIsModalOpen(true);
  };

  // Open the modal for editing an existing bill
  const handleEditBill = (bill) => {
    setActiveBill({ ...bill });
    setIsModalOpen(true);
  };

  // Save the bill (add or update)
  const handleSaveBill = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!activeBill.name.trim()) {
      toast.error("Please enter a bill name");
      return;
    }
    
    if (!activeBill.amount || isNaN(activeBill.amount) || activeBill.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!activeBill.dueDate) {
      toast.error("Please select a due date");
      return;
    }
    
    // Check if this is a new bill or an update
    const isExistingBill = bills.some(bill => bill.id === activeBill.id);
    
    if (isExistingBill) {
      // Update existing bill
      setBills(bills.map(bill => bill.id === activeBill.id ? activeBill : bill));
      toast.success("Bill updated successfully!");
    } else {
      // Add new bill
      setBills([...bills, activeBill]);
      toast.success("Bill added successfully!");
    }
    
    // Close the modal
    setIsModalOpen(false);
  };

  // Delete a bill
  const handleDeleteBill = (id) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      setBills(bills.filter(bill => bill.id !== id));
      toast.success("Bill deleted successfully!");
    }
  };

  // Toggle the paid status of a bill
  const handleTogglePaid = (id) => {
    setBills(bills.map(bill => {
      if (bill.id === id) {
        const updatedBill = { ...bill, isPaid: !bill.isPaid };
        toast.success(updatedBill.isPaid 
          ? `${bill.name} marked as paid!` 
          : `${bill.name} marked as unpaid!`
        );
        return updatedBill;
      }
      return bill;
    }));
  };

  // Apply filters and sorting to bills
  const filteredBills = bills.filter(bill => {
    if (filterOption === "paid") return bill.isPaid;
    if (filterOption === "unpaid") return !bill.isPaid;
    return true; // "all" option
  });
  
  const sortedBills = [...filteredBills].sort((a, b) => {
    if (sortOption === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortOption === "amount") {
      return a.amount - b.amount;
    }
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Calculate summary statistics
  const totalBills = bills.length;
  const paidBills = bills.filter(bill => bill.isPaid).length;
  const unpaidAmount = bills
    .filter(bill => !bill.isPaid)
    .reduce((sum, bill) => sum + parseFloat(bill.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="mr-2 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          aria-label="Back to Dashboard"
        >
          <ArrowLeftIcon size={20} className="text-surface-600 dark:text-surface-300" />
        </button>
        
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BellIcon className="text-accent" />
          Bills Management
        </h1>
        <button 
          onClick={handleAddBill}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon size={18} />
          <span>Add Bill</span>
        </button>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 dark:bg-blue-900/20">
          <div className="flex flex-col">
            <div className="text-blue-600 dark:text-blue-400 text-sm">Total Bills</div>
            <div className="mt-1 text-2xl font-semibold">{totalBills}</div>
          </div>
        </div>
        
        <div className="card bg-green-50 dark:bg-green-900/20">
          <div className="flex flex-col">
            <div className="text-green-600 dark:text-green-400 text-sm">Paid Bills</div>
            <div className="mt-1 text-2xl font-semibold">{paidBills} / {totalBills}</div>
          </div>
        </div>
        
        <div className="card bg-red-50 dark:bg-red-900/20">
          <div className="flex flex-col">
            <div className="text-red-600 dark:text-red-400 text-sm">Unpaid Amount</div>
            <div className="mt-1 text-2xl font-semibold">${unpaidAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-surface-50 dark:bg-surface-800/50 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <FilterIcon size={18} className="text-surface-500" />
          <span className="text-sm">Filter:</span>
          <select 
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="select-field py-1 text-sm"
          >
            <option value="all">All Bills</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by:</span>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="select-field py-1 text-sm"
          >
            <option value="dueDate">Due Date</option>
            <option value="amount">Amount</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      
      {/* Bills list */}
      {sortedBills.length > 0 ? (
        <div className="space-y-4">
          {sortedBills.map((bill) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card flex flex-col md:flex-row md:items-center justify-between ${
                bill.isPaid
                  ? "bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500"
                  : new Date(bill.dueDate) < new Date()
                  ? "bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500"
                  : "border-l-4 border-yellow-500"
              }`}
            >
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">{bill.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-surface-600 dark:text-surface-300">
                  <div className="flex items-center gap-1">
                    <DollarSignIcon size={16} />
                    <span>${parseFloat(bill.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={16} />
                    <span>Due: {format(new Date(bill.dueDate), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BellIcon size={16} />
                    <span>{bill.recurring}</span>
                  </div>
                  {bill.autopay && (
                    <div className="flex items-center gap-1">
                      <CreditCardIcon size={16} />
                      <span>Auto-pay enabled</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <button 
                  onClick={() => handleTogglePaid(bill.id)}
                  className={`btn ${bill.isPaid ? 'btn-outline text-green-600' : 'btn-secondary'}`}
                >
                  {bill.isPaid ? "Paid ✓" : "Mark Paid"}
                </button>
                <button 
                  onClick={() => handleEditBill(bill)}
                  className="btn-outline p-2 rounded-lg"
                  aria-label="Edit"
                >
                  <EditIcon size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteBill(bill.id)}
                  className="btn-outline p-2 rounded-lg text-red-500"
                  aria-label="Delete"
                >
                  <TrashIcon size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-surface-500 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
          <BellIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No bills found</p>
          <p className="mt-2">Add a new bill to get started</p>
        </div>
      )}
      
      {/* Add/Edit Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {activeBill && bills.some(bill => bill.id === activeBill.id)
                    ? "Edit Bill"
                    : "Add New Bill"
                  }
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSaveBill} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Bill Name</label>
                  <input
                    type="text"
                    id="name"
                    className="input-field"
                    placeholder="e.g., Electricity"
                    value={activeBill?.name || ''}
                    onChange={(e) => setActiveBill({...activeBill, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount ($)</label>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0.01"
                    className="input-field"
                    placeholder="0.00"
                    value={activeBill?.amount || ''}
                    onChange={(e) => setActiveBill({...activeBill, amount: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    className="input-field"
                    value={activeBill?.dueDate || ''}
                    onChange={(e) => setActiveBill({...activeBill, dueDate: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                  <select
                    id="category"
                    className="select-field"
                    value={activeBill?.category || 'Other'}
                    onChange={(e) => setActiveBill({...activeBill, category: e.target.value})}
                  >
                    <option value="Utilities">Utilities</option>
                    <option value="Housing">Housing</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="recurring" className="block text-sm font-medium mb-1">Recurring</label>
                  <select
                    id="recurring"
                    className="select-field"
                    value={activeBill?.recurring || 'monthly'}
                    onChange={(e) => setActiveBill({...activeBill, recurring: e.target.value})}
                  >
                    <option value="one-time">One-time</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autopay"
                    className="mr-2 h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                    checked={activeBill?.autopay || false}
                    onChange={(e) => setActiveBill({...activeBill, autopay: e.target.checked})}
                  />
                  <label htmlFor="autopay" className="text-sm font-medium">Enable Auto-pay</label>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary"
                  >
                    Save Bill
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Bills;