"use client";

import React, { useState } from "react";
import { useCompaniesModule } from "@/hooks/use-companies-module";
import { CompaniesHeader } from "@/components/modules/companies/companies-header";
import { AddCompanyCard } from "@/components/modules/companies/add-company-card";
import { CompaniesToolbar } from "@/components/modules/companies/companies-toolbar";
import { CompaniesTable } from "@/components/modules/companies/companies-table";
import { CompanyDetailsModal } from "@/components/modules/companies/company-details-modal";
import { EmptyState } from "@/components/crud/empty-state";
import { CompanyApplication } from "@/types/company";

export default function CompaniesPage() {
  const {
    companies,
    isLoading,
    createCompany,
    deleteCompany,
    updateCompanyStatus,
    updateCompanyDetails,
  } = useCompaniesModule();

  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortValue, setSortValue] = useState("Latest");
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyApplication | null>(null);

  const filteredCompanies = companies.filter((c) =>
    searchValue
      ? c.company_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        c.role.toLowerCase().includes(searchValue.toLowerCase()) ||
        c.location.toLowerCase().includes(searchValue.toLowerCase())
      : true
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortValue === "Company A-Z") {
      return a.company_name.localeCompare(b.company_name);
    }
    if (sortValue === "Status") {
      return a.status.localeCompare(b.status);
    }
    // Default: Latest
    return (b.applied_date || "").localeCompare(a.applied_date || "");
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full p-6 animate-pulse">
        <div className="h-10 bg-[#10131E] rounded-xl w-48" />
        <div className="h-64 bg-[#10131E] rounded-2xl w-full" />
        <div className="h-64 bg-[#10131E] rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full pb-20 min-h-screen">
      {/* Detail Inspector Modal */}
      <CompanyDetailsModal
        isOpen={!!selectedCompany}
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onUpdateStatus={updateCompanyStatus}
        onUpdateDetails={updateCompanyDetails}
      />

      {/* 1. Top Header */}
      <CompaniesHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      {/* 2. Section 1: Add New Company Form Card */}
      {companies.length === 0 && !showForm ? (
        <EmptyState
          title="No companies tracked yet"
          description="Start tracking your placement applications by adding your first company."
          actionLabel="+ Add Your First Company"
          onAction={() => setShowForm(true)}
          icon="general"
        />
      ) : (
        <AddCompanyCard
          onAddCompany={async (data) => {
            await createCompany(data);
          }}
        />
      )}

      {/* 3. Section 2 Toolbar */}
      {companies.length > 0 && (
        <CompaniesToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortValue={sortValue}
          onSortChange={setSortValue}
        />
      )}

      {/* 4. Section 2: Data Table */}
      {companies.length > 0 && (
        <CompaniesTable
          companies={sortedCompanies}
          onDelete={deleteCompany}
          onUpdateStatus={updateCompanyStatus}
          onViewCompanyDetails={(company) => setSelectedCompany(company)}
        />
      )}
    </div>
  );
}
