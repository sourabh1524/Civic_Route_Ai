
import { Bug, Droplets, Lightbulb, Trash2, HelpCircle } from 'lucide-react';

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  switch (category) {
    case 'Potholes':
      return <Bug className={className} />;
    case 'Water Leakage':
      return <Droplets className={className} />;
    case 'Streetlight Outage':
      return <Lightbulb className={className} />;
    case 'Garbage Collection':
      return <Trash2 className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}
