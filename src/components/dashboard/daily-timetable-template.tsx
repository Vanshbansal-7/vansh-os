"use client";

import React, { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, Plus, Edit2, Trash2 } from "lucide-react";
import { useTimetableTemplate, DayOfWeek, TemplateBlock } from "@/hooks/use-timetable-template";
import { TimetableBlockModal } from "./timetable-block-modal";

const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DailyTimetableTemplate() {
  const { templates, isLoading, addBlock, editBlock, deleteBlock, reorderBlocks } = useTimetableTemplate();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Mon");
  const [isClient, setIsClient] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TemplateBlock | null>(null);
  
  // Set default day to true current day
  useEffect(() => {
    setIsClient(true);
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday
    const map: Record<number, DayOfWeek> = {
      0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat"
    };
    setSelectedDay(map[dayIndex]);
  }, []);

  if (!isClient || isLoading) return (
    <div className="rounded-2xl p-3.5 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col h-64 animate-pulse" />
  );

  const currentBlocks = templates[selectedDay] || [];

  const handleSave = (blockData: Omit<TemplateBlock, "id">) => {
    if (editingBlock) {
      editBlock(selectedDay, editingBlock.id, blockData);
    } else {
      addBlock(selectedDay, blockData);
    }
  };

  const openAddModal = () => {
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const openEditModal = (block: TemplateBlock) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this time block from the template?")) {
      deleteBlock(selectedDay, id);
    }
  };

  return (
    <>
      <div className="rounded-2xl p-2.5 bg-[#10131E] border border-white/[0.08] shadow-sm flex flex-col h-full">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-white tracking-tight">Master Template</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {selectedDay}
            </span>
          </div>

          {/* Day Selector */}
          <div className="flex items-center justify-between bg-white/[0.02] p-1 rounded-xl border border-white/[0.04]">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  selectedDay === day
                    ? "bg-purple-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {day.slice(0, 1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col min-h-[200px]">
          {currentBlocks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-slate-500">
              <span className="text-xs font-medium mb-1">No blocks for {selectedDay}</span>
              <span className="text-[10px]">Add slots to build your template</span>
            </div>
          ) : (
            <Reorder.Group 
              axis="y" 
              values={currentBlocks} 
              onReorder={(newOrder) => reorderBlocks(selectedDay, newOrder)}
              className="flex flex-col divide-y divide-white/[0.04]"
            >
              {currentBlocks.map((block) => (
                <Reorder.Item
                  key={block.id}
                  value={block}
                  className="group flex items-center justify-between py-1 transition-colors hover:bg-white/[0.02] -mx-1 px-1 rounded-lg cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0 transition-colors" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[10.5px] text-white leading-tight truncate">
                        {block.title}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {block.time}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(block); }}
                      className="p-1 rounded bg-white/5 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(block.id); }}
                      className="p-1 rounded bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>

        <button 
          onClick={openAddModal}
          className="mt-2 w-full py-1.5 rounded-xl border border-dashed border-white/[0.15] hover:border-purple-500/50 bg-white/[0.02] hover:bg-purple-500/10 text-[11px] font-semibold text-slate-400 hover:text-purple-300 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3 h-3" />
          Add Time Block
        </button>
      </div>

      <TimetableBlockModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingBlock}
      />
    </>
  );
}
