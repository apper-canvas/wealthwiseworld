import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; 
import { format } from "date-fns";
import { fetchTransactions } from "../services/transactionService";
import { useSelector } from "react-redux";
import getIcon from "../utils/iconUtils";
import MainFeature from "../components/MainFeature";

// Icon components
const BarChart2Icon = getIcon("BarChart2");
const PieChartIcon = getIcon("PieChart");
const TrendingUpIcon = getIcon("TrendingUp");
const DollarSignIcon = getIcon("DollarSign");
const CreditCardIcon = getIcon("CreditCard");
const BellIcon = getIcon("Bell");
const PieChartIconForFeature = getIcon("PieChart");
const TargetIcon = getIcon("Target");
const CalendarIcon = getIcon("Calendar");
const EditIcon = getIcon("Edit");

import { useNavigate } from "react-router-dom";
function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  
  // Financial data state
  const [financialData, setFinancialData] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  });
  
  // User from Redux store
  const { user } = useSelector((state) => state.user);
  
  // Load financial data from transactions
  useEffect(() => {
    const calculateFinancialData = async () => {
      try {
        setIsLoading(true);
        const transactions = await fetchTransactions();
        
        // Calculate summary data
        const income = transactions
          .filter(t => t && typeof t === 'object' && t.type === 'Credit' && !isNaN(t.amount))
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        
        const expenses = transactions
          .filter(t => t && typeof t === 'object' && t.type === 'Debit' && !isNaN(t.amount))
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        
        const savings = income - expenses;
        const balance = 10000 + savings; // Starting balance + savings
        
        setFinancialData({
          balance: balance || 0,
          income: income || 0,
          expenses: expenses || 0,
          savings: savings || 0
        });
      } catch (error) {
        console.error("Error calculating financial data:", error.message || error);
        
        // Reset financial data to prevent display errors
        setFinancialData({
          balance: 0,
          income: 0, 
          expenses: 0,
          savings: 0
        });
        toast.error("Unable to load financial data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    calculateFinancialData();
  }, [user]);
  
  const navigate = useNavigate();

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "budgets") {
      navigate("/budget");
      return;
    }
    if (tab === "goals") {
      navigate("/goals");
      return;
    }
    if (tab === "bills") {
      navigate("/bills");
      return;
    }
    if (tab !== "dashboard" && tab !== "transactions" && tab !== "budgets") {
      toast.info(`${tab.charAt(0).toUpperCase() + tab.slice(1)} feature coming soon!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* App navigation */}
      <nav className="flex overflow-x-auto scrollbar-hide pb-2">
        <div className="flex rounded-xl p-1 bg-surface-100 dark:bg-surface-800 mx-auto">
          {[
            { id: "dashboard", icon: BarChart2Icon, label: "Dashboard" },
            { id: "transactions", icon: CreditCardIcon, label: "Transactions" },
            { id: "budgets", icon: PieChartIcon, label: "Budgets" },
            { id: "goals", icon: TrendingUpIcon, label: "Goals" },
            { id: "bills", icon: BellIcon, label: "Bills" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-surface-600 dark:text-surface-300 hover:text-surface-800 dark:hover:text-white"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-primary rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Financial overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="card"
            >
              <div className="flex flex-col animate-pulse">
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-3/4"></div>
              </div>
            </motion.div>
          ))
        ) : (
          <><motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex flex-col">
            <div className="text-surface-500 dark:text-surface-400 text-sm flex items-center gap-2">
              <DollarSignIcon className="w-4 h-4" />
              <span>Balance</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold">
              ${financialData.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-green-50 dark:bg-green-900/20"
        >
          <div className="flex flex-col">
            <div className="text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4" />
              <span>Income</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold text-green-600 dark:text-green-400">
              ${financialData.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-red-50 dark:bg-red-900/20"
        >
          <div className="flex flex-col">
            <div className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <CreditCardIcon className="w-4 h-4" />
              <span>Expenses</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold text-red-600 dark:text-red-400">
              ${financialData.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-blue-50 dark:bg-blue-900/20"
        >
          <div className="flex flex-col">
            <div className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              <span>Savings</span>
            </div>
            <div className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400">
              ${financialData.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </motion.div></>
        )}
      </div>

      {/* Main feature content based on active tab */}
      <div className="mt-6">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">Dashboard Overview</h2>
            <p className="text-surface-600 dark:text-surface-400">
              Track your finances and manage your money with WealthWise. View your financial summary, add transactions, and monitor your spending.
            </p>
            {/* Financial overview cards are shown only in Dashboard tab */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <MainFeature />
            </div>
          </div>
        )}
        
        {activeTab === "transactions" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold">Transaction Management</h2>
              <p className="text-surface-600 dark:text-surface-400">
                Focus on managing your transactions in one place. Add, edit, delete, and track your expenses and income over time.</p>
              <MainFeature />
            </div>
          </div>
        )}
        
        {activeTab !== "dashboard" && activeTab !== "transactions" && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="text-surface-400 dark:text-surface-500 mb-4">
              {activeTab === "budgets" ? (
                <PieChartIconForFeature size={64} className="mx-auto opacity-50" />
              ) : activeTab === "goals" ? (
                <TargetIcon size={64} className="mx-auto opacity-50" />
              ) : (
                <CalendarIcon size={64} className="mx-auto opacity-50" />
              )}
            </div>
            <h3 className="text-xl font-medium mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Feature Coming Soon
            </h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
              We're working hard to bring you the best financial management tools. This feature will be available in a future update.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;