import { Database, Upload, Download, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const datasetInfo = {
  name: "industrial-defects-v4",
  totalImages: 12847,
  totalAnnotations: 28432,
  classes: ["defect_crack", "defect_scratch", "defect_dent", "normal"],
  hardNegatives: 342,
};

const classDistribution = [
  { name: "normal", count: 8420, fill: "hsl(142, 71%, 45%)" },
  { name: "defect_crack", count: 2180, fill: "hsl(0, 72%, 51%)" },
  { name: "defect_scratch", count: 1540, fill: "hsl(38, 92%, 50%)" },
  { name: "defect_dent", count: 707, fill: "hsl(187, 80%, 48%)" },
];

export default function DatasetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Database className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">GESTIÓN DE DATASETS</h1>
        <div className="ml-auto flex gap-2">
          <button className="status-indicator px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            <Upload className="w-3 h-3" />
            SUBIR
          </button>
          <button className="status-indicator px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            <Download className="w-3 h-3" />
            EXPORTAR
          </button>
        </div>
      </div>

      <div className="glow-line" />

      {/* Dataset Info */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="metric-card">
          <p className="metric-label mb-1">Imágenes</p>
          <p className="metric-value text-xl">{datasetInfo.totalImages.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label mb-1">Anotaciones</p>
          <p className="metric-value text-xl">{datasetInfo.totalAnnotations.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label mb-1">Clases</p>
          <p className="metric-value text-xl">{datasetInfo.classes.length}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label mb-1">Hard Negatives</p>
          <p className="metric-value text-xl text-status-warning">{datasetInfo.hardNegatives}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label mb-1">Balance</p>
          <p className="metric-value text-xl text-status-warning">34/66</p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="metric-card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          <p className="metric-label">Distribución por Clase</p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={classDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 20%)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 14%, 13%)",
                border: "1px solid hsl(220, 12%, 20%)",
                borderRadius: "4px",
                fontSize: 12,
                fontFamily: "JetBrains Mono",
              }}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Functions */}
      <div className="metric-card">
        <p className="metric-label mb-3">Funciones Disponibles</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {["Sincronizar con Label Studio", "Generar Augmentations", "Exportar YOLO", "Exportar COCO"].map((fn) => (
            <button
              key={fn}
              className="text-left text-xs font-mono px-3 py-2 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              {fn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
