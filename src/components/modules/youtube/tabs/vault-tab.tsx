"use client";

import React, { useState } from "react";
import {
  Upload,
  Plus,
  Search,
  Grid,
  List,
  FolderPlus,
  Star,
  Film,
  Music,
  FileText,
  Sparkles,
  Palette,
  Image as ImageIcon,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { VaultAsset } from "@/types/youtube";
import { useYouTubeModule } from "@/hooks/use-youtube-module";

interface VaultTabProps {
  assets: VaultAsset[];
}

export function VaultTab({ assets }: VaultTabProps) {
  const { addVaultAsset, deleteVaultAsset, toggleVaultAssetFavorite } = useYouTubeModule();
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState<VaultAsset["type"]>("image");
  const [assetUrl, setAssetUrl] = useState("");
  const [assetCategory, setAssetCategory] = useState("Brand Assets");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;
    setIsSubmitting(true);
    try {
      await addVaultAsset({
        name: assetName,
        type: assetType,
        url: assetUrl,
        category: assetCategory,
        size: "Link",
      });
      setIsAddingAsset(false);
      setAssetName("");
      setAssetUrl("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAssetIcon = (type: VaultAsset["type"]) => {
    switch (type) {
      case "video":
        return <Film className="w-5 h-5 text-rose-400" />;
      case "audio":
        return <Music className="w-5 h-5 text-blue-400" />;
      case "preset":
        return <Palette className="w-5 h-5 text-purple-400" />;
      case "document":
      case "script":
        return <FileText className="w-5 h-5 text-amber-400" />;
      case "image":
      default:
        return <ImageIcon className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Header & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight leading-none">
            Content Vault
          </h2>
          <p className="text-[11.5px] text-slate-400 font-medium mt-1">
            Store and manage scripts, thumbnails, B-roll, LUTs, AI prompts, and brand assets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-slate-400" />
            <span>Create Folder</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddingAsset(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Asset</span>
          </button>
        </div>
      </div>

      {isAddingAsset && (
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-3 p-4 rounded-2xl bg-[#10131E] border border-purple-500/30">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              autoFocus
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="Asset Name (e.g. Intro B-Roll)"
              className="flex-1 bg-[#151828] border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            
            {/* File Upload OR Link Input */}
            <div className="flex-1 relative flex items-center">
              <input
                type="url"
                value={assetUrl}
                onChange={(e) => setAssetUrl(e.target.value)}
                placeholder="Drive / URL link (or pick file 👉)"
                className="w-full bg-[#151828] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none pr-10"
              />
              <label className="absolute right-2 cursor-pointer p-1 text-slate-400 hover:text-purple-400 transition-colors">
                <Plus className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (!assetName) setAssetName(file.name.split('.')[0]);
                      setAssetUrl(`file://${file.name}`);
                      const typeMap: Record<string, any> = { 'image': 'image', 'video': 'video', 'audio': 'audio' };
                      const fType = file.type.split('/')[0];
                      if (typeMap[fType]) setAssetType(typeMap[fType]);
                    }
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as any)}
              className="bg-[#151828] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="document">Document</option>
            </select>
            <select
              value={assetCategory}
              onChange={(e) => setAssetCategory(e.target.value)}
              className="bg-[#151828] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer flex-1"
            >
              {categories.slice(1).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Asset"}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingAsset(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-[#10131E] border border-white/[0.08]">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets, templates, prompts..."
              className="w-full bg-[#151828] border border-white/[0.06] hover:border-white/[0.12] focus:border-purple-500/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#151828] border border-white/[0.06]">
          <button
            onClick={() => setViewMode("grid")}
            type="button"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "grid" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            type="button"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "list" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Layout: Categories Sidebar + Assets Workspace */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
        {/* Categories Sidebar */}
        <div className="w-full lg:w-56 shrink-0 rounded-2xl bg-[#10131E] border border-white/[0.08] p-3 flex flex-col gap-1 max-h-[500px] overflow-y-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
            Asset Categories
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  isSelected
                    ? "bg-purple-600/20 border border-purple-500/40 text-white font-bold"
                    : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
                }`}
              >
                <span className="truncate">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Asset Cards Grid */}
        <div className="flex-1 w-full">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative rounded-2xl p-4 bg-[#10131E] hover:bg-[#131724] border border-white/[0.08] hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0">
                        {getAssetIcon(asset.type)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                          {asset.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {asset.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleVaultAssetFavorite(asset.id, asset.is_favorite)}
                      className="text-slate-500 hover:text-amber-400 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          asset.is_favorite ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-2 border-t border-white/[0.04]">
                    <span>{asset.size}</span>
                    <span>{asset.date_added}</span>
                  </div>
                  <div className="absolute right-3 bottom-3 flex items-center justify-end">
                    <button onClick={() => deleteVaultAsset(asset.id)} className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-white/[0.06] rounded-2xl bg-[#10131E] border border-white/[0.08] overflow-hidden">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group flex items-center justify-between px-4 py-3 hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    {getAssetIcon(asset.type)}
                    <span className="text-xs font-bold text-white">{asset.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>{asset.category}</span>
                    <span>{asset.size}</span>
                    <button
                      onClick={() => toggleVaultAssetFavorite(asset.id, asset.is_favorite)}
                      className="text-slate-500 hover:text-amber-400 cursor-pointer"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          asset.is_favorite ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                    </button>
                    <button onClick={() => deleteVaultAsset(asset.id)} className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
