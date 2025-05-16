import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; 
import { format } from "date-fns";
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
  
  // Sample financial overview data
  const financialData = {
    balance: 12467.89,
    income: 3850.00,
    expenses: 2243.50,
    savings: 1606.50,
  };
  
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
        <motion.div
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
        </motion.div>
      </div>

      {/* Main feature content based on active tab */}
      <div className="mt-6">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">Financial Overview</h2>
            <p className="text-surface-600 dark:text-surface-400">
              Track your finances and manage your money with WealthWise. Add transactions, set budgets, and monitor your spending.
            </p>
            <MainFeature />
          </div>
        )}
        
        {activeTab === "transactions" && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold">Recent Transactions</h2>
            <MainFeature />
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