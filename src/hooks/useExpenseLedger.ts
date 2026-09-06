import { useMemo } from 'react';
import { useAppSelector } from '../store';
import { ExpenseCategory } from '../types';

export function useExpenseLedger() {
  const expenses = useAppSelector((state) => state.expenses.expenses);
  const totalBudgetLimit = useAppSelector((state) => state.expenses.totalBudgetLimit);
  const categoryFilter = useAppSelector((state) => state.expenses.categoryFilter);
  const statusFilter = useAppSelector((state) => state.expenses.statusFilter);

  const metrics = useMemo(() => {
    let totalApprovedSpent = 0;
    let totalPendingRequestsAmount = 0;
    let pendingRequestsCount = 0;
    const categoryTotals: Record<string, number> = {};

    expenses.forEach((item) => {
      if (item.status === 'APPROVED') {
        totalApprovedSpent += item.amount;
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
      } else if (item.status === 'PENDING_APPROVAL') {
        totalPendingRequestsAmount += item.amount;
        pendingRequestsCount++;
      }
    });

    const availableBalance = Math.max(0, totalBudgetLimit - totalApprovedSpent);
    const budgetUtilization = Math.round((totalApprovedSpent / totalBudgetLimit) * 100);

    return {
      totalBudgetLimit,
      totalApprovedSpent,
      availableBalance,
      budgetUtilization,
      totalPendingRequestsAmount,
      pendingRequestsCount,
      categoryTotals,
    };
  }, [expenses, totalBudgetLimit]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchesCategory && matchesStatus;
    });
  }, [expenses, categoryFilter, statusFilter]);

  const pendingRequests = useMemo(() => {
    return expenses.filter((item) => item.status === 'PENDING_APPROVAL');
  }, [expenses]);

  return {
    metrics,
    filteredExpenses,
    pendingRequests,
    categoryFilter,
    statusFilter,
  };
}
