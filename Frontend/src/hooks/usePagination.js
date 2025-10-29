import { useState, useMemo, useEffect } from 'react';

export const usePagination = (data, defaultItemsPerPage = 10, storageKey = 'pagination-items-per-page') => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? parseInt(stored, 10) : defaultItemsPerPage;
  });

  const paginationData = useMemo(() => {
    const safeItemsPerPage = Math.max(1, itemsPerPage); // Prevent division by zero
    const totalPages = Math.max(1, Math.ceil(data.length / safeItemsPerPage));
    const safePage = Math.max(1, Math.min(currentPage, totalPages)); // Keep page in bounds
    const startIndex = (safePage - 1) * safeItemsPerPage;
    const endIndex = startIndex + safeItemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    return {
      currentItems,
      totalPages,
      currentPage: safePage,
      totalItems: data.length,
      itemsPerPage: safeItemsPerPage,
      startIndex: data.length > 0 ? startIndex + 1 : 0,
      endIndex: Math.min(endIndex, data.length)
    };
  }, [data, currentPage, itemsPerPage]);

  // Auto-adjust page when data changes or items per page changes
  useEffect(() => {
    if (paginationData.currentPage !== currentPage) {
      setCurrentPage(paginationData.currentPage);
    }
  }, [paginationData.currentPage, currentPage]);

  const updateItemsPerPage = (newItemsPerPage) => {
    const safeValue = Math.max(1, Math.min(100, parseInt(newItemsPerPage, 10) || defaultItemsPerPage));
    setItemsPerPage(safeValue);
    localStorage.setItem(storageKey, safeValue.toString());
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(paginationData.totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(paginationData.totalPages, prev + 1));
  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(paginationData.totalPages, page)));

  return {
    ...paginationData,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage,
    goToPage,
    setCurrentPage,
    updateItemsPerPage
  };
};