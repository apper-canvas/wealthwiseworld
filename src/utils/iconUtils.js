import * as LucideIcons from 'lucide-react';
/**
/**
 * Returns an icon component from the Lucide icons library
 * @param {string} iconName - The name of the icon to retrieve
 * @returns {Function} - A React component that renders the icon
 */
export default function getIcon(iconName) {
 */
    // Navigation and Actions
    home: LucideIcons.Home,
    settings: LucideIcons.Settings,
    logout: LucideIcons.LogOut,
    plus: LucideIcons.Plus,
    edit: LucideIcons.Edit,
    trash: LucideIcons.Trash,
    search: LucideIcons.Search,
    
    // Finance-specific
    barChart: LucideIcons.BarChart,
    barChart2: LucideIcons.BarChart2,
    pieChart: LucideIcons.PieChart,
    trendingUp: LucideIcons.TrendingUp,
    trendingDown: LucideIcons.TrendingDown,
    dollarSign: LucideIcons.DollarSign,
    creditCard: LucideIcons.CreditCard,
    
    // Misc UI Icons
    bell: LucideIcons.Bell,
    alertCircle: LucideIcons.AlertCircle,
    calendar: LucideIcons.Calendar,
    chevronDown: LucideIcons.ChevronDown,
    shoppingBag: LucideIcons.ShoppingBag,
    coffee: LucideIcons.Coffee,
    car: LucideIcons.Car,
    heart: LucideIcons.Heart,
    shoppingCart: LucideIcons.ShoppingCart,
    moon: LucideIcons.Moon,
    sun: LucideIcons.Sun,
    smile: LucideIcons.Smile
  };
  
  return icons[iconName.toLowerCase()] || icons.smile;
}