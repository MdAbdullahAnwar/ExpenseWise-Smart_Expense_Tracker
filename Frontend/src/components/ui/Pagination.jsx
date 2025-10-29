import { Button } from "./button";

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  goToFirstPage, 
  goToPrevPage, 
  goToNextPage, 
  goToLastPage,
  updateItemsPerPage
}) => {
  if (totalItems === 0) return null;

  const itemsPerPageOptions = [5, 10, 15, 20, 25, 50];

  return (
    <div className="space-y-4 mt-6 pt-6 border-t border-border">
      {/* Items per page selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => updateItemsPerPage(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-gradient-to-r from-background to-muted text-foreground cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span className="text-sm font-medium text-foreground">items per page</span>
        </div>
        <div className="px-3 py-2 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <span className="text-sm font-medium text-foreground">
            Showing <span className="text-primary font-bold">{startIndex}-{endIndex}</span> of <span className="text-primary font-bold">{totalItems}</span> items
          </span>
        </div>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-background to-muted hover:from-primary/5 hover:to-primary/10 border-border hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            First
          </Button>
          <Button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-background to-muted hover:from-primary/5 hover:to-primary/10 border-border hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Prev
          </Button>
          <div className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg border border-primary/20">
            <span className="text-sm font-bold">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-background to-muted hover:from-primary/5 hover:to-primary/10 border-border hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Next
          </Button>
          <Button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-background to-muted hover:from-primary/5 hover:to-primary/10 border-border hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Last
          </Button>
        </div>
      )}
    </div>
  );
};