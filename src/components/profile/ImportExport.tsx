"use client";

import { useRef, useState } from "react";
import { Download, Upload, Check, AlertCircle, Loader2, Package } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import type { ImportPreview } from "@/lib/types";
import { cn } from "@/lib/utils";

type ImportStep = "idle" | "preview" | "confirm" | "importing" | "success" | "error";

export function ImportExport() {
  const { exportAppData, importAppData, getImportPreviewFromFile } = useAppData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ImportStep>("idle");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<"replace" | "merge">("merge");
  const [message, setMessage] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    exportAppData();
    setMessage("Backup saved successfully");
    setTimeout(() => setExporting(false), 1500);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStep("preview");
    setMessage("");
    const result = await getImportPreviewFromFile(file);
    if (!result) {
      setStep("error");
      setMessage("Invalid backup file. Please upload a valid WordNest .json file.");
      return;
    }
    setPendingFile(file);
    setPreview(result.preview);
    setStep("confirm");
  };

  const handleImport = async () => {
    if (!pendingFile) return;
    setStep("importing");
    const result = await importAppData(pendingFile, importMode);
    setStep(result.success ? "success" : "error");
    setMessage(result.message);
    setPendingFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const reset = () => {
    setStep("idle");
    setPreview(null);
    setPendingFile(null);
    setMessage("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="feature-card">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-sticker-sky">
            <Package className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <h3 className="text-title text-foreground">Pack your word nest</h3>
            <p className="text-caption text-muted">Export or import your vocabulary backup</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button onClick={handleExport} disabled={exporting} className="btn-primary flex-1">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export data
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn-secondary flex-1">
            <Upload className="h-4 w-4" />
            Import data
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFileSelect} />
        </div>
      </div>

      {step === "confirm" && preview && (
        <div className="feature-card animate-in">
          <h4 className="text-title text-foreground">Bring your words back home</h4>
          <p className="mt-1 text-body-sm text-muted">Preview of backup file:</p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
            {[
              { label: "Words", value: preview.words },
              { label: "Collections", value: preview.collections },
              { label: "Tags", value: preview.tags },
            ].map((item) => (
              <div key={item.label} className="feature-card !p-3 text-center">
                <p className="text-heading-3">{item.value}</p>
                <p className="text-caption text-muted">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-eyebrow text-foreground">Import mode</p>
            {(["merge", "replace"] as const).map((mode) => (
              <label key={mode} className="flex cursor-pointer items-center gap-3 feature-card !p-3 hover:border-primary/30">
                <input type="radio" name="importMode" checked={importMode === mode} onChange={() => setImportMode(mode)} className="accent-primary" />
                <div>
                  <p className="text-body-sm font-medium">{mode === "merge" ? "Merge with existing data" : "Replace existing data"}</p>
                  <p className="text-caption text-muted">{mode === "merge" ? "Skip duplicate words" : "Overwrite all current data"}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button onClick={handleImport} className="btn-primary w-full sm:flex-1">Confirm import</button>
            <button onClick={reset} className="btn-utility w-full sm:w-auto">Cancel</button>
          </div>
        </div>
      )}

      {step === "importing" && (
        <div className="feature-card flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-body-sm text-muted">Restoring your word garden…</p>
        </div>
      )}

      {message && (
        <div className={cn("feature-card flex items-center gap-3 text-body-sm", step === "error" ? "text-primary" : "text-foreground")}>
          {step === "error" ? <AlertCircle className="h-4 w-4 shrink-0" /> : <Check className="h-4 w-4 shrink-0 text-sticker-green" />}
          {message}
        </div>
      )}
    </div>
  );
}
