import { useState, useEffect } from "react";
import { GraduationCap, Play, Square } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

function generateTrainingData(epoch: number) {
  const data = [];
  for (let i = 1; i <= epoch; i++) {
    data.push({
      epoch: i,
      loss: 2.5 * Math.exp(-0.15 * i) + 0.1 + Math.random() * 0.1,
      mAP: Math.min(0.95, 0.3 + 0.08 * i - 0.001 * i * i + Math.random() * 0.03),
      precision: Math.min(0.97, 0.4 + 0.06 * i + Math.random() * 0.03),
      recall: Math.min(0.93, 0.35 + 0.07 * i + Math.random() * 0.03),
    });
  }
  return data;
}

export default function TrainingPage() {
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [config, setConfig] = useState({
    epochs: 50,
    batchSize: 16,
    learningRate: 0.001,
    scheduler: "cosine",
  });
  const [trainingData, setTrainingData] = useState(generateTrainingData(0));

  useEffect(() => {
    if (!isTraining) return;
    if (currentEpoch >= config.epochs) {
      setIsTraining(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentEpoch((e) => e + 1);
      setTrainingData(generateTrainingData(currentEpoch + 1));
    }, 500);
    return () => clearTimeout(timer);
  }, [isTraining, currentEpoch, config.epochs]);

  const startTraining = () => {
    setCurrentEpoch(0);
    setTrainingData([]);
    setIsTraining(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-mono font-semibold tracking-wide">ENTRENAMIENTO LIGERO</h1>
        <button
          onClick={isTraining ? () => setIsTraining(false) : startTraining}
          className={`ml-auto status-indicator px-3 py-1 rounded border transition-colors ${
            isTraining
              ? "border-status-error text-status-error hover:bg-status-error/10"
              : "border-status-ok text-status-ok hover:bg-status-ok/10"
          }`}
        >
          {isTraining ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {isTraining ? "DETENER" : "INICIAR"}
        </button>
      </div>

      <div className="glow-line" />

      {/* Config */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Epochs", value: config.epochs, key: "epochs" },
          { label: "Batch Size", value: config.batchSize, key: "batchSize" },
          { label: "Learning Rate", value: config.learningRate, key: "learningRate" },
          { label: "Scheduler", value: config.scheduler, key: "scheduler" },
        ].map((param) => (
          <div key={param.key} className="metric-card">
            <p className="metric-label mb-2">{param.label}</p>
            <input
              type={param.key === "scheduler" ? "text" : "number"}
              value={param.value}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  [param.key]: param.key === "scheduler" ? e.target.value : Number(e.target.value),
                }))
              }
              disabled={isTraining}
              className="w-full bg-background border border-border rounded px-2 py-1.5 text-sm font-mono text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              step={param.key === "learningRate" ? 0.0001 : 1}
            />
          </div>
        ))}
      </div>

      {/* Training Progress */}
      {(isTraining || currentEpoch > 0) && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="metric-card">
              <p className="metric-label mb-1">Epoch</p>
              <p className="metric-value text-xl">{currentEpoch}/{config.epochs}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label mb-1">Loss</p>
              <p className="metric-value text-xl">
                {trainingData.length > 0 ? trainingData[trainingData.length - 1].loss.toFixed(3) : "—"}
              </p>
            </div>
            <div className="metric-card">
              <p className="metric-label mb-1">mAP</p>
              <p className="metric-value text-xl text-status-ok">
                {trainingData.length > 0 ? trainingData[trainingData.length - 1].mAP.toFixed(3) : "—"}
              </p>
            </div>
            <div className="metric-card">
              <p className="metric-label mb-1">Precision</p>
              <p className="metric-value text-xl">
                {trainingData.length > 0 ? trainingData[trainingData.length - 1].precision.toFixed(3) : "—"}
              </p>
            </div>
            <div className="metric-card">
              <p className="metric-label mb-1">ETA</p>
              <p className="metric-value text-xl text-muted-foreground">
                {isTraining ? `${Math.ceil((config.epochs - currentEpoch) * 0.5)}s` : "—"}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="metric-card">
              <p className="metric-label mb-4">Loss</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trainingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 20%)" />
                  <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(220, 14%, 13%)", border: "1px solid hsl(220, 12%, 20%)", borderRadius: "4px", fontSize: 12, fontFamily: "JetBrains Mono" }} />
                  <Line type="monotone" dataKey="loss" stroke="hsl(0, 72%, 51%)" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="metric-card">
              <p className="metric-label mb-4">mAP / Precision / Recall</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trainingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 12%, 20%)" />
                  <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }} domain={[0, 1]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(220, 14%, 13%)", border: "1px solid hsl(220, 12%, 20%)", borderRadius: "4px", fontSize: 12, fontFamily: "JetBrains Mono" }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                  <Line type="monotone" dataKey="mAP" stroke="hsl(142, 71%, 45%)" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="precision" stroke="hsl(187, 80%, 48%)" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="recall" stroke="hsl(38, 92%, 50%)" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
