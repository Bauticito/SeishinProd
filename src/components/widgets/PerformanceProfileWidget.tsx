import { SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { jarvisApi } from "@/services/jarvisApi";

export function PerformanceProfileWidget() {
  const { data, isError } = useQuery({
    queryKey: ["jarvis", "runtime-config", "widget"],
    queryFn: jarvisApi.getRuntimeConfig,
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
    retry: 1,
  });

  const profile = data?.performance_profile?.toUpperCase() ?? "--";
  const conf = data?.conf_thres ?? null;
  const skip = data?.frame_skip ?? null;
  const quality = data?.jpeg_quality ?? null;

  return (
    <div className="metric-card">
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal className="w-4 h-4 text-primary" />
        <p className="metric-label">PERFIL RENDIMIENTO</p>
        {isError && <span className="ml-auto text-[10px] font-mono text-status-error">OFFLINE</span>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-background rounded p-3 border border-border text-center col-span-2">
          <p className="text-lg font-mono font-bold text-primary">{profile}</p>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">PERFIL ACTIVO</p>
        </div>
        <div className="bg-background rounded p-2 border border-border text-center">
          <p className="text-sm font-mono font-bold text-foreground">{conf == null ? "--" : conf.toFixed(2)}</p>
          <p className="text-[9px] font-mono text-muted-foreground">CONF</p>
        </div>
        <div className="bg-background rounded p-2 border border-border text-center">
          <p className="text-sm font-mono font-bold text-foreground">{skip ?? "--"}</p>
          <p className="text-[9px] font-mono text-muted-foreground">FRAME SKIP</p>
        </div>
        <div className="bg-background rounded p-2 border border-border text-center col-span-2">
          <p className="text-sm font-mono font-bold text-foreground">{quality ?? "--"}</p>
          <p className="text-[9px] font-mono text-muted-foreground">MJPEG QUALITY</p>
        </div>
      </div>
    </div>
  );
}
