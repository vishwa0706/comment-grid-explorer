import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortDirection } from '@/types/api';

interface SortableHeaderProps {
  children: React.ReactNode;
  field: 'postId' | 'name' | 'email';
  currentSort: { field: string | null; direction: SortDirection };
  onSort: (field: 'postId' | 'name' | 'email') => void;
  className?: string;
}

export function SortableHeader({ 
  children, 
  field, 
  currentSort, 
  onSort, 
  className = "" 
}: SortableHeaderProps) {
  const isActive = currentSort.field === field;
  const direction = isActive ? currentSort.direction : null;

  const getSortIcon = () => {
    if (!isActive || direction === null) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  return (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className={`h-auto p-2 justify-start font-medium text-left ${className}`}
    >
      <span className="flex items-center gap-2">
        {children}
        {getSortIcon()}
      </span>
    </Button>
  );
}