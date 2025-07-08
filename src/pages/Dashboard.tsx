import { useEffect, useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchBar } from '@/components/SearchBar';
import { PageSizeSelector } from '@/components/PageSizeSelector';
import { Pagination } from '@/components/Pagination';
import { SortableHeader } from '@/components/SortableHeader';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { apiService } from '@/services/api';
import { Comment, TableFilters, SortDirection } from '@/types/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'dashboard-filters';

export default function Dashboard() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [filters, setFilters] = useLocalStorage<TableFilters>(STORAGE_KEY, {
    search: '',
    page: 1,
    pageSize: 10,
    sort: { field: null, direction: null }
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await apiService.getComments();
        setComments(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [toast]);

  // Filter and sort logic
  const filteredAndSortedComments = useMemo(() => {
    let result = [...comments];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(comment => 
        comment.name.toLowerCase().includes(searchLower) ||
        comment.email.toLowerCase().includes(searchLower) ||
        comment.body.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (filters.sort.field && filters.sort.direction) {
      result.sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';

        switch (filters.sort.field) {
          case 'postId':
            aValue = a.postId;
            bValue = b.postId;
            break;
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'email':
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return filters.sort.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return filters.sort.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [comments, filters.search, filters.sort]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedComments.length / filters.pageSize);
  const currentPageComments = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.pageSize;
    const endIndex = startIndex + filters.pageSize;
    return filteredAndSortedComments.slice(startIndex, endIndex);
  }, [filteredAndSortedComments, filters.page, filters.pageSize]);

  // Update functions
  const updateFilters = (updates: Partial<TableFilters>) => {
    const newFilters = { ...filters, ...updates };
    
    // Reset to page 1 when search or page size changes
    if ('search' in updates || 'pageSize' in updates) {
      newFilters.page = 1;
    }
    
    setFilters(newFilters);
  };

  const handleSort = (field: 'postId' | 'name' | 'email') => {
    let newDirection: SortDirection;
    
    if (filters.sort.field === field) {
      // Cycle through: asc -> desc -> null
      if (filters.sort.direction === 'asc') {
        newDirection = 'desc';
      } else if (filters.sort.direction === 'desc') {
        newDirection = null;
        field = null as any; // Reset field when no sort
      } else {
        newDirection = 'asc';
      }
    } else {
      // New field, start with asc
      newDirection = 'asc';
    }

    updateFilters({
      sort: { field: newDirection ? field : null, direction: newDirection }
    });
  };

  if (loading) {
    return (
      <Layout title="Comments Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Comments Dashboard">
      <div className="space-y-6">
        {/* Header with controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <SearchBar
                value={filters.search}
                onChange={(search) => updateFilters({ search })}
                placeholder="Search by name, email, or content..."
              />
              <PageSizeSelector
                value={filters.pageSize}
                onChange={(pageSize) => updateFilters({ pageSize })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="bg-muted/50">
                    <th className="text-left p-0 border-r">
                      <SortableHeader
                        field="postId"
                        currentSort={filters.sort}
                        onSort={handleSort}
                        className="w-full rounded-none border-0"
                      >
                        Post ID
                      </SortableHeader>
                    </th>
                    <th className="text-left p-0 border-r">
                      <SortableHeader
                        field="name"
                        currentSort={filters.sort}
                        onSort={handleSort}
                        className="w-full rounded-none border-0"
                      >
                        Name
                      </SortableHeader>
                    </th>
                    <th className="text-left p-0 border-r">
                      <SortableHeader
                        field="email"
                        currentSort={filters.sort}
                        onSort={handleSort}
                        className="w-full rounded-none border-0"
                      >
                        Email
                      </SortableHeader>
                    </th>
                    <th className="text-left p-4 font-medium">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageComments.length > 0 ? (
                    currentPageComments.map((comment) => (
                      <tr key={comment.id} className="border-b hover:bg-muted/25 transition-colors">
                        <td className="p-4 border-r">
                          <Badge variant="outline">#{comment.postId}</Badge>
                        </td>
                        <td className="p-4 border-r">
                          <div className="font-medium">{comment.name}</div>
                        </td>
                        <td className="p-4 border-r">
                          <div className="text-sm text-muted-foreground">{comment.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="max-w-md">
                            <p className="text-sm line-clamp-3">{comment.body}</p>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        {filters.search ? 'No comments found matching your search.' : 'No comments available.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredAndSortedComments.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                totalItems={filteredAndSortedComments.length}
                pageSize={filters.pageSize}
                onPageChange={(page) => updateFilters({ page })}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}