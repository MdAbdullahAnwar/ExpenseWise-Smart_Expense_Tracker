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
    <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
      {/* Items per page selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          <span className="text-xs sm:text-sm font-medium text-foreground">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => updateItemsPerPage(e.target.value)}
            className="px-2 sm:px-3 py-1.5 sm:py-2 border border-border rounded-lg bg-background text-foreground cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option} className="bg-background text-foreground">{option}</option>
            ))}
          </select>
          <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">items per page</span>
        </div>
        <div className="px-3 py-2 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <span className="text-xs sm:text-sm font-medium text-foreground text-center">
            Showing <span className="text-primary font-bold">{startIndex}-{endIndex}</span> of <span className="text-primary font-bold">{totalItems}</span>
          </span>
        </div>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <Button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
          >
            First
          </Button>
          <Button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
          >
            Prev
          </Button>
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg border border-primary/20">
            <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
          >
            Next
          </Button>
          <Button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3"
          >
            Last
          </Button>
        </div>
      )}
    </div>
  );
};