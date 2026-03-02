import { useEffect, useState } from "react";
import { Video, Camera, Maximize2, RefreshCw } from "lucide-react";
import { jarvisApi } from "@/services/jarvisApi";

export function VideoFeedWidget() {
  const [streamKey, setStreamKey] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(
    typeof document === "undefined" ? true : document.visibilityState === "visible",
  );
  const streamUrl = jarvisApi.getStreamUrl();

  const refreshStream = () => setStreamKey((k) => k + 1);

  const takeSnapshot = () => {
    window.open(jarvisApi.getSnapshotUrl(), "_blank");
  };

  const toggleFullscreen = () => {
    const el = document.getElementById("jarvis-video-stream");
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const onVisibilityChange = () => setIsPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return (
    <div className="metric-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-primary" />
          <p className="metric-label">LIVE FEED</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={refreshStream} className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={takeSnapshot} className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
            <Camera className="w-3.5 h-3.5" />
          </button>
          <button onClick={toggleFullscreen} className="p-1.5 rounded hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="relative flex-1 bg-background rounded border border-border overflow-hidden min-h-[300px]">
        <img
          id="jarvis-video-stream"
          key={streamKey}
          src={isPageVisible ? `${streamUrl}?t=${streamKey}` : ""}
          alt="Jarvis Live Feed"
          className="w-full h-full object-contain bg-black"
          onError={(e) => {
            (e.target as HTMLImageElement).alt = "Stream no disponible — Jarvis offline";
          }}
        />
        {!isPageVisible && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center pointer-events-none">
            <p className="text-xs font-mono text-muted-foreground">Stream pausado (pestaña inactiva)</p>
          </div>
        )}
      </div>
    </div>
  );
}
