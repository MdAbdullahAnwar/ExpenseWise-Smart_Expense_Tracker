import { Button } from "./button";

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  goToFirstPage, 
  goToPrevPage, 
  goToNextPage, 
  goToLastPage 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-border">
      <Button
        onClick={goToFirstPage}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        First
      </Button>
      <Button
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </Button>
      <div className="px-4 py-2 bg-primary/10 rounded-lg">
        <span className="text-sm font-medium text-foreground">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <Button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </Button>
      <Button
        onClick={goToLastPage}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Last
      </Button>
    </div>
  );
};