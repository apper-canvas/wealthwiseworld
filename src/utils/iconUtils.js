import * as LucideIcons from 'lucide-react';

/**
 * Utility function to get icon components
 * 
 * We import this where needed and then use as:
 * getIcon("Home")({ className: "w-6 h-6" })
 */
export default function getIcon(iconName) {
  const icons = {
    // navigation and actions
    home: LucideIcons.Home,
    list: LucideIcons.List,
    plus: LucideIcons.Plus,
    settings: LucideIcons.Settings,
    // arrows and actions
    chevronRight: LucideIcons.ChevronRight,
    chevronDown: LucideIcons.ChevronDown,
    check: LucideIcons.Check,
    x: LucideIcons.X,
    trash: LucideIcons.Trash,
    // finance and data
    barChart: LucideIcons.BarChart,
    pieChart: LucideIcons.PieChart,
    dollarSign: LucideIcons.DollarSign,
    creditCard: LucideIcons.CreditCard,
    wallet: LucideIcons.Wallet,
    // misc
    smile: LucideIcons.Smile,
    moon: LucideIcons.Moon,
    sun: LucideIcons.Sun
  };
  
  // Convert to lowercase for case-insensitive lookup
  const normalizedName = iconName.toLowerCase();
  
  // Try to match icon with case-insensitive check
  const icon = Object.entries(icons).find(
    ([key]) => key.toLowerCase() === normalizedName
  );
  
  return icon ? icon[1] : LucideIcons.Smile;
}
    shoppingCart: LucideIcons.ShoppingCart,
    moon: LucideIcons.Moon,
    sun: LucideIcons.Sun,
    smile: LucideIcons.Smile,
    target: LucideIcons.Target
  };
  
  return icons[iconName?.toLowerCase()] || icons.smile;
}