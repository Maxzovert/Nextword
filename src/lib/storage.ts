import type { AppData, ImportPreview, Word } from "./types";
import { computeStats, generateId } from "./utils";
import { createInitialData } from "./mock-data";

const STORAGE_KEY = "wordnest-data";

const SAMPLE_WORDS = new Set([
  "serendipity",
  "ephemeral",
  "resilient",
  "ubiquitous",
  "melancholy",
  "pragmatic",
]);

export function getDefaultData(): AppData {
  return createInitialData();
}

export function loadData(): AppData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultData();
      saveData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppData;
    const migrated = validateAndMigrate(parsed);
    if ((parsed.version ?? 1) < 2) {
      saveData(migrated);
    }
    return migrated;
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function validateAndMigrate(data: Partial<AppData>): AppData {
  const defaults = getDefaultData();
  let words = Array.isArray(data.words) ? data.words : defaults.words;

  if ((data.version ?? 1) < 2) {
    words = words.filter(
      (w) => !SAMPLE_WORDS.has(w.word.toLowerCase()),
    );
  }

  const collections = (Array.isArray(data.collections)
    ? data.collections
    : defaults.collections
  ).map((col) => ({
    ...col,
    wordIds: col.wordIds.filter((id) => words.some((w) => w.id === id)),
  }));

  const tags = [...new Set(words.flatMap((w) => w.tags))];

  const migrated: AppData = {
    version: 2,
    words,
    collections,
    tags,
    reviewHistory: Array.isArray(data.reviewHistory)
      ? data.reviewHistory.filter((r) => words.some((w) => w.id === r.wordId))
      : defaults.reviewHistory,
    stats: computeStats(
      words,
      Array.isArray(data.reviewHistory) ? data.reviewHistory.length : 0,
    ),
    settings: { ...defaults.settings, ...data.settings },
  };

  return migrated;
}

export function validateImportData(raw: unknown): AppData | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Partial<AppData>;
  if (!Array.isArray(data.words)) return null;
  return validateAndMigrate(data);
}

export function getImportPreview(data: AppData): ImportPreview {
  return {
    words: data.words.length,
    collections: data.collections.length,
    tags: data.tags.length,
  };
}

export function mergeData(existing: AppData, incoming: AppData): AppData {
  const existingWords = new Map(existing.words.map((w) => [w.word.toLowerCase(), w]));
  const mergedWords = [...existing.words];

  incoming.words.forEach((word) => {
    const key = word.word.toLowerCase();
    if (!existingWords.has(key)) {
      mergedWords.push({ ...word, id: generateId() });
    }
  });

  const existingCollectionIds = new Set(existing.collections.map((c) => c.id));
  const mergedCollections = [...existing.collections];
  incoming.collections.forEach((col) => {
    if (!existingCollectionIds.has(col.id)) {
      mergedCollections.push(col);
    }
  });

  const mergedTags = [...new Set([...existing.tags, ...incoming.tags])];
  const mergedReviewHistory = [
    ...existing.reviewHistory,
    ...incoming.reviewHistory,
  ];

  return {
    version: 2,
    words: mergedWords,
    collections: mergedCollections,
    tags: mergedTags,
    reviewHistory: mergedReviewHistory,
    stats: computeStats(mergedWords, mergedReviewHistory.length),
    settings: { ...existing.settings, ...incoming.settings },
  };
}

export function replaceData(incoming: AppData): AppData {
  const data = validateAndMigrate(incoming);
  data.stats = computeStats(data.words, data.reviewHistory.length);
  return data;
}

export function exportData(data: AppData): Blob {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    app: "WordNest",
    version: data.version,
    words: data.words,
    collections: data.collections,
    tags: data.tags,
    favorites: data.words.filter((w) => w.isFavorite).map((w) => w.id),
    reviewHistory: data.reviewHistory,
    stats: data.stats,
    settings: data.settings,
  };
  return new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: "application/json",
  });
}

export function downloadExport(data: AppData): void {
  const date = new Date().toISOString().split("T")[0];
  const blob = exportData(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wordnest-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function isWordDuplicate(words: Word[], newWord: string, excludeId?: string): boolean {
  return words.some(
    (w) =>
      w.word.toLowerCase() === newWord.toLowerCase() && w.id !== excludeId,
  );
}
