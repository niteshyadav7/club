import { useMemo } from 'react';
import { useAppSelector } from '../store';

export function useDuesMetrics() {
  const dues = useAppSelector((state) => state.dues.dues);
  const statusFilter = useAppSelector((state) => state.dues.statusFilter);
  const searchQuery = useAppSelector((state) => state.dues.searchQuery);

  const metrics = useMemo(() => {
    let totalCollected = 0;
    let totalPending = 0;
    let totalOverdue = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    dues.forEach((item) => {
      if (item.status === 'PAID') {
        totalCollected += item.amount;
        paidCount++;
      } else if (item.status === 'PENDING') {
        totalPending += item.amount;
        pendingCount++;
      } else if (item.status === 'OVERDUE') {
        totalOverdue += item.amount;
        overdueCount++;
      }
    });

    const totalExpected = totalCollected + totalPending + totalOverdue;
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

    return {
      totalCollected,
      totalPending,
      totalOverdue,
      totalExpected,
      paidCount,
      pendingCount,
      overdueCount,
      totalMembersWithDues: dues.length,
      collectionRate,
    };
  }, [dues]);

  const filteredDues = useMemo(() => {
    return dues.filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchesSearch =
        searchQuery === '' ||
        item.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.memberEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.memberPhone.includes(searchQuery) ||
        (item.receiptNo && item.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [dues, statusFilter, searchQuery]);

  return {
    metrics,
    filteredDues,
    statusFilter,
    searchQuery,
  };
}
