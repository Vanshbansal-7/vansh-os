"use client";

import { useState } from "react";
import { CalendarDays, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCompanyStatusAction, deleteCompanyAction } from "@/actions/career";

export function CompanyCard({ company }: { company: any }) {
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "wishlist": return "bg-muted text-muted-foreground border-border";
      case "applied": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "interviewing": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "offer": return "bg-primary text-primary-foreground border-primary";
      case "rejected": return "bg-destructive/10 text-destructive border-destructive/30";
      default: return "bg-muted text-foreground border-border";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateCompanyStatusAction(company.id, newStatus);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${company.name}?`)) return;
    setLoading(true);
    try {
      await deleteCompanyAction(company.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/60 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 overflow-hidden">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate">
              {company.name}
            </h3>
            <p className="text-sm font-medium text-muted-foreground truncate">
              {company.role}
            </p>
            {company.applied_date && (
              <span className="text-xs text-muted-foreground/80 flex items-center gap-1.5 mt-3 font-medium">
                <CalendarDays className="w-3.5 h-3.5" /> Applied: {company.applied_date}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="w-[120px]">
              <Select
                defaultValue={company.status}
                onValueChange={handleStatusChange}
                disabled={loading}
              >
                <SelectTrigger className={`h-7 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(company.status)}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wishlist">Wishlist</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-70 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
              disabled={loading}
              title="Delete Company"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
