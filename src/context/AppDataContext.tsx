"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppData,
  ReviewDifficulty,
  Word,
  WordFormData,
} from "@/lib/types";
import {
  downloadExport,
  loadData,
  mergeData,
  replaceData,
  saveData,
  validateImportData,
  getImportPreview,
  isWordDuplicate,
} from "@/lib/storage";
import {
  computeStats,
  generateId,
  getNextReviewDate,
  getMostUsedTag,
} from "@/lib/utils";

interface AppDataContextValue {
  data: AppData;
  isLoading: boolean;
  addWord: (form: WordFormData) => Word;
  updateWord: (id: string, form: Partial<WordFormData>) => void;
  deleteWord: (id: string) => void;
  toggleFavorite: (id: string) => void;
  reviewWord: (id: string, difficulty: ReviewDifficulty) => void;
  exportAppData: () => void;
  importAppData: (
    file: File,
    mode: "replace" | "merge",
  ) => Promise<{ success: boolean; message: string }>;
  getImportPreviewFromFile: (
    file: File,
  ) => Promise<{ preview: ReturnType<typeof getImportPreview>; data: AppData } | null>;
  updateSettings: (settings: Partial<AppData["settings"]>) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    setIsLoading(false);
  }, []);

  const persist = useCallback((next: AppData) => {
    setData(next);
    saveData(next);
  }, []);

  const addWord = useCallback(
    (form: WordFormData): Word => {
      if (!data) throw new Error("Data not loaded");
      const now = new Date().toISOString();
      const word: Word = {
        ...form,
        id: generateId(),
        isFavorite: false,
        masteryLevel: 0,
        createdAt: now,
        updatedAt: now,
      };

      const updatedCollections = data.collections.map((col) =>
        form.collectionIds.includes(col.id)
          ? { ...col, wordIds: [...col.wordIds, word.id] }
          : col,
      );

      const newTags = [...new Set([...data.tags, ...form.tags])];
      const words = [word, ...data.words];

      persist({
        ...data,
        words,
        collections: updatedCollections,
        tags: newTags,
        stats: computeStats(words, data.reviewHistory.length),
      });

      return word;
    },
    [data, persist],
  );

  const updateWord = useCallback(
    (id: string, form: Partial<WordFormData>) => {
      if (!data) return;
      const words = data.words.map((w) =>
        w.id === id
          ? { ...w, ...form, updatedAt: new Date().toISOString() }
          : w,
      );
      persist({
        ...data,
        words,
        tags: [...new Set(words.flatMap((w) => w.tags))],
        stats: computeStats(words, data.reviewHistory.length),
      });
    },
    [data, persist],
  );

  const deleteWord = useCallback(
    (id: string) => {
      if (!data) return;
      const words = data.words.filter((w) => w.id !== id);
      const collections = data.collections.map((c) => ({
        ...c,
        wordIds: c.wordIds.filter((wid) => wid !== id),
      }));
      persist({
        ...data,
        words,
        collections,
        reviewHistory: data.reviewHistory.filter((r) => r.wordId !== id),
        stats: computeStats(words, data.reviewHistory.length),
      });
    },
    [data, persist],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (!data) return;
      const words = data.words.map((w) =>
        w.id === id ? { ...w, isFavorite: !w.isFavorite } : w,
      );
      persist({
        ...data,
        words,
        stats: {
          ...computeStats(words, data.reviewHistory.length),
          favoriteWords: words.filter((w) => w.isFavorite).length,
        },
      });
    },
    [data, persist],
  );

  const reviewWord = useCallback(
    (id: string, difficulty: ReviewDifficulty) => {
      if (!data) return;
      const masteryBoost =
        difficulty === "easy" ? 20 : difficulty === "medium" ? 10 : 5;
      const words = data.words.map((w) =>
        w.id === id
          ? {
              ...w,
              masteryLevel: Math.min(100, w.masteryLevel + masteryBoost),
              nextReviewAt: getNextReviewDate(difficulty),
            }
          : w,
      );
      const record = {
        id: generateId(),
        wordId: id,
        difficulty,
        reviewedAt: new Date().toISOString(),
      };
      const reviewHistory = [record, ...data.reviewHistory];
      persist({
        ...data,
        words,
        reviewHistory,
        stats: {
          ...computeStats(words, reviewHistory.length),
          wordsReviewed: reviewHistory.length,
          mostUsedTag: getMostUsedTag(words),
        },
      });
    },
    [data, persist],
  );

  const exportAppData = useCallback(() => {
    if (!data) return;
    downloadExport(data);
  }, [data]);

  const getImportPreviewFromFile = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validated = validateImportData(parsed);
      if (!validated) return null;
      return { preview: getImportPreview(validated), data: validated };
    } catch {
      return null;
    }
  }, []);

  const importAppData = useCallback(
    async (file: File, mode: "replace" | "merge") => {
      try {
        const result = await getImportPreviewFromFile(file);
        if (!result) {
          return { success: false, message: "Invalid backup file. Please check the format." };
        }
        if (!data) {
          return { success: false, message: "App data not loaded yet." };
        }
        const next =
          mode === "replace"
            ? replaceData(result.data)
            : mergeData(data, result.data);
        persist(next);
        return {
          success: true,
          message:
            mode === "replace"
              ? "Your word garden has been restored ✨"
              : "Words merged into your nest successfully 💜",
        };
      } catch {
        return { success: false, message: "Something went wrong during import." };
      }
    },
    [data, persist, getImportPreviewFromFile],
  );

  const updateSettings = useCallback(
    (settings: Partial<AppData["settings"]>) => {
      if (!data) return;
      persist({ ...data, settings: { ...data.settings, ...settings } });
    },
    [data, persist],
  );

  const value = useMemo(
    () => ({
      data: data!,
      isLoading,
      addWord,
      updateWord,
      deleteWord,
      toggleFavorite,
      reviewWord,
      exportAppData,
      importAppData,
      getImportPreviewFromFile,
      updateSettings,
    }),
    [
      data,
      isLoading,
      addWord,
      updateWord,
      deleteWord,
      toggleFavorite,
      reviewWord,
      exportAppData,
      importAppData,
      getImportPreviewFromFile,
      updateSettings,
    ],
  );

  if (isLoading || !data) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-pulse rounded-sm bg-hairline" />
          <p className="text-body-sm text-muted">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}

export { isWordDuplicate };
