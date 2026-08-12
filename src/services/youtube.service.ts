import { youtubeRepository } from "@/repositories/youtube.repository";
import {
  YouTubeChannelProfile,
  VaultAsset,
  YouTubeResource,
  YouTubeNote,
} from "@/types/youtube";

export class YouTubeService {
  async getModuleData(): Promise<{
    profile: YouTubeChannelProfile | null;
    vaultAssets: VaultAsset[];
    resources: YouTubeResource[];
    notes: YouTubeNote[];
  }> {
    const [profile, vaultAssets, resources, notes] = await Promise.all([
      youtubeRepository.getProfile(),
      youtubeRepository.getVaultAssets(),
      youtubeRepository.getResources(),
      youtubeRepository.getNotes(),
    ]);

    return { profile, vaultAssets, resources, notes };
  }
}

export const youtubeService = new YouTubeService();
