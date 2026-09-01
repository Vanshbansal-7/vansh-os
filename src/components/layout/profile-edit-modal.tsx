"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, User, Upload, Check, Sparkles, Image as ImageIcon, Camera } from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentAvatarUrl: string;
  onProfileUpdated?: (name: string, avatarUrl: string) => void;
}

const PRESET_AVATARS = [
  { label: "Founder", url: "/assets/founder_avatar.png" },
  { label: "Cyber Lead", url: "https://api.dicebear.com/7.x/bottts/svg?seed=VanshCyber" },
  { label: "Elite Dev", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=VanshDev" },
  { label: "Architect", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=VanshBansal" },
];

export function ProfileEditModal({
  isOpen,
  onClose,
  currentName,
  currentAvatarUrl,
  onProfileUpdated,
}: ProfileEditModalProps) {
  const [name, setName] = useState(currentName || "Vansh");
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || "/assets/founder_avatar.png");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("vos_user_profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setName(parsed.name);
          if (parsed.avatar_url) setAvatarUrl(parsed.avatar_url);
        } catch (e) {}
      } else {
        setName(currentName || "Vansh");
        setAvatarUrl(currentAvatarUrl || "/assets/founder_avatar.png");
      }
      setSavedSuccess(false);
    }
  }, [isOpen, currentName, currentAvatarUrl]);

  if (!isOpen) return null;

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || "Vansh";
    const finalAvatar = avatarUrl.trim() || "/assets/founder_avatar.png";

    setIsSaving(true);

    try {
      // 1. Save to local storage for instant sync across tabs & pages
      const profileData = { name: finalName, avatar_url: finalAvatar };
      localStorage.setItem("vos_user_profile", JSON.stringify(profileData));

      // 2. Broadcast custom event to update TopHeader, Hero Card, AI greetings
      window.dispatchEvent(
        new CustomEvent("profile-updated", { detail: profileData })
      );

      // 3. Persist to Supabase backend API
      await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: finalName,
          avatar_url: finalAvatar.startsWith("data:") ? undefined : finalAvatar,
        }),
      }).catch(() => {});

      onProfileUpdated?.(finalName, finalAvatar);
      setSavedSuccess(true);

      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 600);
    } catch (err) {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl bg-[#0E111E] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#121526]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Edit Profile</h3>
              <p className="text-[11px] text-slate-400">Update your name & avatar across VOS</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
          {/* Avatar Preview & Upload Area */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] bg-[#161828]">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/founder_avatar.png";
                  }}
                />
              </div>

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Change</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-semibold text-purple-300 transition-colors cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>Upload Photo</span>
            </button>
          </div>

          {/* Avatar Presets Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or Choose Avatar Preset
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AVATARS.map((preset, idx) => {
                const isSelected = avatarUrl === preset.url;
                return (
                  <div
                    key={idx}
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-purple-500/20 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[9.5px] font-medium text-slate-300 truncate">{preset.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Display Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Your Name (Shows in Greetings & AI)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vansh"
              className="w-full h-10 px-3.5 rounded-xl bg-[#141728] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-medium"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 mt-2 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
