// ============================================================
// React hooks for consuming Jarvis API with polling
// Uses TanStack Query for caching + automatic refetch
// ============================================================

import { useQuery } from "@tanstack/react-query";
import { jarvisApi } from "@/services/jarvisApi";
import type { JarvisMetrics, JarvisAlert, JarvisHealth, JarvisContention, JarvisSystemStats } from "@/services/jarvisApi";

function adaptiveInterval(visibleMs: number, hiddenMs = visibleMs * 3) {
  if (typeof document !== "undefined" && document.visibilityState !== "visible") return hiddenMs;
  return visibleMs;
}

export function useJarvisHealth(enabled = true) {
  return useQuery<JarvisHealth>({
    queryKey: ["jarvis", "health"],
    queryFn: jarvisApi.getHealth,
    refetchInterval: () => adaptiveInterval(5000, 15000),
    refetchIntervalInBackground: false,
    enabled,
    retry: 2,
  });
}

export function useJarvisMetrics(enabled = true) {
  return useQuery<JarvisMetrics>({
    queryKey: ["jarvis", "metrics"],
    queryFn: jarvisApi.getMetrics,
    refetchInterval: () => adaptiveInterval(1000, 4000),
    refetchIntervalInBackground: false,
    enabled,
    retry: 1,
  });
}

export function useJarvisAlerts(enabled = true) {
  return useQuery<JarvisAlert[]>({
    queryKey: ["jarvis", "alerts"],
    queryFn: jarvisApi.getAlerts,
    refetchInterval: () => adaptiveInterval(3000, 10000),
    refetchIntervalInBackground: false,
    enabled,
    retry: 1,
  });
}

export function useJarvisContention(enabled = true) {
  return useQuery<JarvisContention>({
    queryKey: ["jarvis", "contention"],
    queryFn: jarvisApi.getContention,
    refetchInterval: () => adaptiveInterval(1000, 4000),
    refetchIntervalInBackground: false,
    enabled,
    retry: 1,
  });
}

export function useJarvisSystemStats(enabled = true) {
  return useQuery<JarvisSystemStats>({
    queryKey: ["jarvis", "system-stats"],
    queryFn: jarvisApi.getSystemStats,
    refetchInterval: () => adaptiveInterval(2000, 6000),
    refetchIntervalInBackground: false,
    enabled,
    retry: 1,
  });
}
