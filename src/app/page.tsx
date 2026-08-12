"use client";

export const dynamic = 'force-dynamic';


import React from "react";
import { MissionHeroCard } from "@/components/dashboard/mission-hero-card";
import { DomainCardsGrid } from "@/components/dashboard/domain-cards-grid";
import { TimelineCard } from "@/components/dashboard/timeline-card";
import { PrioritiesCard } from "@/components/dashboard/priorities-card";

export default function VijaypathCommandCenter() {
  return (
    <div className="flex flex-col gap-4 w-full pb-16">
      {/* 1. Hero Mission Banner */}
      <MissionHeroCard />

      {/* 2. Four Domain Pillar Cards */}
      <DomainCardsGrid />

      {/* 3. Middle 2-Column Split: Timeline + Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TimelineCard />
        <PrioritiesCard />
      </div>
    </div>
  );
}
