"use client";

import useSWR from "swr";
import { CompanyApplication } from "@/types/company";

const fetcher = async (url: string): Promise<CompanyApplication[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error?.message || "Failed to fetch companies");
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "API returned failure");
  return json.data;
};

export function useCompaniesModule() {
  const { data, error, isLoading, mutate } = useSWR<CompanyApplication[]>(
    "/api/v1/companies",
    fetcher,
    { revalidateOnFocus: true, dedupingInterval: 5_000 }
  );

  const companies = data || [];

  const createCompany = async (
    input: Omit<CompanyApplication, "id" | "documents">
  ): Promise<CompanyApplication | null> => {
    try {
      const res = await fetch("/api/v1/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useCompaniesModule] createCompany failed:", json.error);
        throw new Error(json.error?.message || "Failed to create company");
      }

      await mutate();
      return json.data;
    } catch (err) {
      console.error("[useCompaniesModule] error creating company:", err);
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/companies?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useCompaniesModule] deleteCompany failed:", json.error);
        throw new Error(json.error?.message || "Failed to delete company");
      }

      await mutate();
    } catch (err) {
      console.error("[useCompaniesModule] error deleting company:", err);
      throw err;
    }
  };

  const updateCompanyStatus = async (
    id: string,
    status: CompanyApplication["status"]
  ) => {
    try {
      const res = await fetch("/api/v1/companies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useCompaniesModule] updateCompanyStatus failed:", json.error);
        throw new Error(json.error?.message || "Failed to update company status");
      }

      await mutate();
    } catch (err) {
      console.error("[useCompaniesModule] error updating company status:", err);
      throw err;
    }
  };

  const updateCompanyDetails = async (
    id: string,
    updates: Partial<CompanyApplication>
  ) => {
    try {
      const res = await fetch("/api/v1/companies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("[useCompaniesModule] updateCompanyDetails failed:", json.error);
        throw new Error(json.error?.message || "Failed to update company details");
      }

      await mutate();
    } catch (err) {
      console.error("[useCompaniesModule] error updating company details:", err);
      throw err;
    }
  };

  return {
    companies,
    isLoading: isLoading && !data,
    error,
    createCompany,
    deleteCompany,
    updateCompanyStatus,
    updateCompanyDetails,
    refresh: () => mutate(),
  };
}
