"use client";

import { useState } from "react";
import { useDiagnosticCenterIncomingReferrals } from "@/lib/hooks/useDiagnosticCenter";
import { ReferralHeader } from "./components/ReferralHeader";
import { ReferralList } from "./components/ReferralList";
import { ReferralDetailsModal } from "./components/ReferralDetailsModal";
import { ReferralPagination } from "./components/ReferralPagination";
import { ReferralSkeleton } from "./components/ReferralSkeleton";
import { ReferralEmptyState } from "./components/ReferralEmptyState";
import { ReferralError } from "./components/ReferralError";
import type { DiagnosticCenterIncomingReferral } from "@doctor-contract/shared";

const PAGE_LIMIT = 20;

export default function DiagnosticCenterReferralsPage() {
  const [page, setPage] = useState(1);
  const [selectedReferral, setSelectedReferral] =
    useState<DiagnosticCenterIncomingReferral | null>(null);

  const {
    data: referrals = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useDiagnosticCenterIncomingReferrals({ page, limit: PAGE_LIMIT });

  if (isLoading) {
    return <ReferralSkeleton />;
  }

  if (isError) {
    return <ReferralError onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <ReferralHeader
        page={page}
        count={referrals.length}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      {/* 2. Referrals Content or Empty State */}
      {referrals.length === 0 && page === 1 ? (
        <ReferralEmptyState />
      ) : (
        <div className="space-y-6">
          <ReferralList
            referrals={referrals}
            onViewDetails={(ref) => setSelectedReferral(ref)}
          />

          <ReferralPagination
            page={page}
            returnedCount={referrals.length}
            limit={PAGE_LIMIT}
            isLoading={isFetching}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* 3. Referral Details Modal */}
      <ReferralDetailsModal
        isOpen={!!selectedReferral}
        referral={selectedReferral}
        onClose={() => setSelectedReferral(null)}
      />
    </div>
  );
}
