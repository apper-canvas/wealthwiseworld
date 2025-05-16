import { 
  Home, User, Settings, BarChart, PieChart, LineChart, 
  Plus, Trash, Pencil, Search, Menu, X, ChevronLeft, 
  ChevronRight, ChevronDown, ChevronUp, Calendar, 
  DollarSign, CreditCard, Wallet, Clock, Filter, 
  ExternalLink, Download, Upload, Moon, Sun, Smile, Target
} from 'lucide-react';
/**
 * Utility to get icon components from Lucide
 */
export default function getIcon(iconName) {
  const icons = {
    home: Home,
    user: User,
    settings: Settings,
    barchart: BarChart,
    piechart: PieChart,
    linechart: LineChart,
    plus: Plus,
    trash: Trash,
    edit: Pencil,
    search: Search,
    menu: Menu,
    x: X,
    chevronleft: ChevronLeft,
    chevronright: ChevronRight,
    chevrondown: ChevronDown,
    chevronup: ChevronUp,
    calendar: Calendar,
    dollarsign: DollarSign,
    creditcard: CreditCard,
    wallet: Wallet,
    clock: Clock,
    filter: Filter,
    externallink: ExternalLink,
    download: Download,
    upload: Upload,
    moon: Moon,
    sun: Sun,
    smile: Smile,
    target: Target
  };
  
  // Case-insensitive lookup
  const key = iconName?.toLowerCase();
  return icons[key] || Smile;
}
