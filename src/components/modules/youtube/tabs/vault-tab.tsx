"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Plus,
  Search,
  Star,
  Film,
  Music,
  FileText,
  Palette,
  Image as ImageIcon,
  MoreVertical,
  Trash2,
  FolderOpen,
  Link as LinkIcon,
} from "lucide-react";
import { VaultAsset } from "@/types/youtube";
import { useYouTubeModule } from "@/hooks/use-youtube-module";
import { RichTextEditor } from "@/components/modules/exams/shared/rich-text-editor";
import { EmptyState } from "@/components/ui/empty-state";

interface VaultTabProps {
  assets: VaultAsset[];
}

export function VaultTab({ assets }: VaultTabProps) {
  const { addVaultAsset, deleteVaultAsset, updateVaultAsset, toggleVaultAssetFavorite } = useYouTubeModule();
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Editor states
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editType, setEditType] = useState<VaultAsset["type"]>("image");
  const [editCategory, setEditCategory] = useState("Brand Assets");
  const [editDescription, setEditDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeAsset = assets.find((a) => a.id === activeAssetId);

  const categories = [
    "All", "Scripts", "Video Ideas", "Thumbnails", "B-roll", "Green Screen Clips",
    "Sound Effects", "Music", "Animations", "Transitions", "Icons", "Logos",
    "Brand Assets", "Stock Videos", "Overlays", "Motion Graphics", "Captions",
    "References", "Prompt Library", "AI Prompts", "Color Presets", "LUTs", "Templates",
  ];

  const filteredAssets = assets.filter((a) => {
    if (selectedCategory !== "All" && a.category !== selectedCategory) return false;
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sync editor when active asset changes
  useEffect(() => {
    if (activeAsset && !isAddingAsset) {
      setEditName(activeAsset.name || "");
      setEditUrl(activeAsset.preview_url || "");
      setEditType(activeAsset.type || "image");
      setEditCategory(activeAsset.category || "Brand Assets");
      setEditDescription(activeAsset.description || "");
    }
  }, [activeAsset, isAddingAsset]);

  const handleCreateNew = () => {
    setActiveAssetId(null);
    setIsAddingAsset(true);
    setEditName("");
    setEditUrl("");
    setEditType("image");
    setEditCategory(selectedCategory !== "All" ? selectedCategory : "Brand Assets");
    setEditDescription("");
  };

  const handleSaveAsset = async () => {
    if (!editName.trim()) return;
    setIsSubmitting(true);
    try {
      if (isAddingAsset) {
        await addVaultAsset({
          name: editName.trim(),
          type: editType,
          url: editUrl,
          category: editCategory,
          size: "Link",
        });
        // We might not have the ID immediately if addVaultAsset doesn't return it
        // so we just reset adding state
        setIsAddingAsset(false);
      } else if (activeAssetId) {
        await updateVaultAsset(activeAssetId, {
          title: editName.trim(),
          url: editUrl,
          description: editDescription,
          metadata: JSON.stringify({
            realCategory: editCategory,
            realType: editType,
            size: activeAsset?.size || "Unknown Size",
          }),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const getAssetIcon = (type: VaultAsset["type"]) => {
    switch (type) {
      case "video":
        return <Film className="w-4 h-4 text-rose-400" />;
      case "audio":
        return <Music className="w-4 h-4 text-blue-400" />;
      case "preset":
        return <Palette className="w-4 h-4 text-purple-400" />;
      case "document":
      case "script":
        return <FileText className="w-4 h-4 text-amber-400" />;
      case "image":
      default:
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getDocColor = (type: string) => {
    switch (type) {
      case "video": return "border-rose-500/20 bg-rose-500/10 text-rose-400";
      case "audio": return "border-blue-500/20 bg-blue-500/10 text-blue-400";
      case "preset": return "border-purple-500/20 bg-purple-500/10 text-purple-400";
      case "document":
      case "script": return "border-amber-500/20 bg-amber-500/10 text-amber-400";
      default: return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[75vh] gap-4 w-full text-white">
      
      {/* LEFT SIDEBAR: Assets List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 border-r-0 lg:border-r border-white/[0.08] lg:pr-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Content Vault</h2>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Asset</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#10131E] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.filter(c => c === 'All' || assets.some(a => a.category === c)).map((cat, idx) => {
              const isActive = selectedCategory === cat;
              const count = cat === 'All' ? assets.length : assets.filter(a => a.category === cat).length;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-[#10131E] border-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                >
                  <FolderOpen className="w-3 h-3" />
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.5 rounded-md bg-black/20 ${isActive ? "text-purple-100" : "text-slate-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Assets List */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 pb-32">
          {filteredAssets.length === 0 ? (
            <div className="py-10">
              <EmptyState
                icon={Upload}
                title="No assets found"
                description="Upload an asset or create a vault note."
                actionLabel="Create Asset"
                onAction={handleCreateNew}
              />
            </div>
          ) : (
            filteredAssets.map((a) => {
              const isActive = activeAssetId === a.id && !isAddingAsset;
              return (
                <div
                  key={a.id}
                  onClick={() => { setActiveAssetId(a.id); setIsAddingAsset(false); }}
                  className={`relative flex flex-col p-3.5 rounded-xl border transition-all cursor-pointer group ${
                    isActive 
                      ? "bg-purple-600/10 border-purple-500/40" 
                      : "bg-[#10131E] border-white/[0.08] hover:border-white/[0.15]"
                  }`}
                >
                  {a.is_favorite && (
                    <div className="absolute top-3 right-3">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </div>
                  )}
                  
                  <div className="pr-6 flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${getDocColor(a.type)}`}>
                      {getAssetIcon(a.type)}
                    </div>
                    <div className="flex flex-col">
                      <h3 className={`text-sm font-bold truncate ${isActive ? "text-purple-300" : "text-white"}`}>
                        {a.name || "Untitled Asset"}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {a.category} • {a.size}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.04]">
                    <div className="text-[10px] font-bold text-slate-500">
                      {a.date_added}
                    </div>
                    
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === a.id ? null : a.id)}
                        className="p-1 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                      {openMenuId === a.id && (
                        <div className="absolute right-0 top-6 z-50 w-32 rounded-xl bg-[#151828] border border-white/[0.1] shadow-xl py-1 flex flex-col text-xs">
                          <button
                            onClick={async () => { setOpenMenuId(null); await toggleVaultAssetFavorite(a.id, a.is_favorite); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>{a.is_favorite ? "Unfavorite" : "Favorite"}</span>
                          </button>
                          <button
                            onClick={async () => { setOpenMenuId(null); await deleteVaultAsset(a.id); if (activeAssetId === a.id) setActiveAssetId(null); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN AREA: Asset Editor */}
      <div className="flex-1 flex flex-col h-full bg-[#090A10] rounded-2xl">
        {(!activeAsset && !isAddingAsset) ? (
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/[0.08] rounded-2xl p-10">
            <div className="flex flex-col items-center text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Asset Selected</h3>
              <p className="text-sm text-slate-400 font-medium mb-6">
                Select an asset from the left sidebar to view and edit its details, or create a new vault entry.
              </p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-slate-200 text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                Upload New Asset
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex flex-col gap-3 mb-4">
              <input
                type="text"
                placeholder="Asset Name..."
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-transparent text-3xl font-bold text-white placeholder-slate-600 focus:outline-none"
              />
              
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="url"
                  placeholder="Asset URL (Google Drive, Dropbox, etc.)..."
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full bg-transparent text-sm text-purple-300 font-medium placeholder-slate-600 focus:outline-none underline-offset-4 hover:underline"
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as any)}
                    className="bg-[#10131E] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document</option>
                    <option value="script">Script</option>
                    <option value="preset">Preset / LUT</option>
                  </select>

                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="bg-[#10131E] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 focus:outline-none focus:border-purple-500/50 cursor-pointer"
                  >
                    {categories.slice(1).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleSaveAsset}
                  disabled={isSubmitting || !editName.trim()}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save Asset"}
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden mt-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Asset Notes & Details
              </div>
              <RichTextEditor
                content={editDescription}
                onChange={setEditDescription}
                placeholder="Write script details, asset instructions, or metadata here..."
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
