import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import getIcon from "../utils/iconUtils";

// Icon components
const HomeIcon = getIcon("Home");
const AlertCircleIcon = getIcon("AlertCircle");

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="mb-8 text-red-500 dark:text-red-400"
      >
        <AlertCircleIcon className="w-20 h-20 md:w-24 md:h-24 mx-auto" />
      </motion.div>
      
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        404 - Page Not Found
      </motion.h1>
      
      <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-surface-600 dark:text-surface-400 text-lg mb-8 max-w-md"
      >
        The page you're looking for doesn't exist or has been moved.
      </motion.p>
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          to="/"
          className="btn-primary flex items-center justify-center gap-2 px-6 py-3"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;