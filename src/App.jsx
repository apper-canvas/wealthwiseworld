import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import getIcon from "./utils/iconUtils";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";

// Icon components
const MoonIcon = getIcon("Moon");
const BarChartIcon = getIcon("BarChart");
const SunIcon = getIcon("Sun");

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for user preference in localStorage or system preference
    if (localStorage.getItem("darkMode") === "true") return true;
    if (localStorage.getItem("darkMode") === "false") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm z-10 shadow-sm dark:shadow-none border-b border-surface-200 dark:border-surface-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="text-accent"
            >
              <BarChartIcon size={28} />
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WealthWise
            </h1>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-surface-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-surface-200 dark:border-surface-800 text-surface-500">
        <div className="container mx-auto text-center text-sm">
          <p>© 2023 WealthWise - Your Personal Finance Manager</p>
        </div>
      </footer>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="rounded-xl shadow-soft"
      />
    </div>
  );
}

export default App;