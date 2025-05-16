import * as LucideIcons from 'lucide-react';

/**
 * Utility function to get icon components by name
 * @param {string} name - Name of the icon from lucide-react
 * @returns {function} React component for the requested icon
 */
export default function getIcon(name) {
  // Check if the icon exists in the lucide-react library
  if (!LucideIcons[name]) {
    console.warn(`Icon "${name}" not found in lucide-react library`);
    // Return a fallback icon or null
    return LucideIcons.HelpCircle || (() => null);
  }
  
  // Return the icon component
  return LucideIcons[name];
}

// Additional utility function to get all available icon names
export function getAvailableIcons() {
  return Object.keys(LucideIcons).filter(
    // Filter out non-icon exports from the package
    key => typeof LucideIcons[key] === 'function' && 
           // Ensure it's a component (has displayName)
           LucideIcons[key].displayName
  );
}

// Export common icons directly for better performance
export const Icons = {
  Moon: LucideIcons.Moon,
  Sun: LucideIcons.Sun
};
  return Icons[iconName] || Icons.Smile;
}