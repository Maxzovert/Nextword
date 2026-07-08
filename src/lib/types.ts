export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "conjunction"
  | "other";

export type ReviewDifficulty = "easy" | "medium" | "hard";

export interface Word {
  id: string;
  word: string;
  meaning: string;
  simpleMeaning: string;
  partOfSpeech: PartOfSpeech;
  pronunciation: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
  tags: string[];
  source: string;
  note: string;
  isFavorite: boolean;
  collectionIds: string[];
  masteryLevel: number;
  nextReviewAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  wordIds: string[];
}

export interface ReviewRecord {
  id: string;
  wordId: string;
  difficulty: ReviewDifficulty;
  reviewedAt: string;
}

export interface AppStats {
  totalWordsSaved: number;
  wordsReviewed: number;
  favoriteWords: number;
  learningStreak: number;
  lastActiveDate: string;
  mostUsedTag: string;
}

export interface AppSettings {
  userName: string;
  initialized: boolean;
}

export interface AppData {
  version: number;
  words: Word[];
  collections: Collection[];
  tags: string[];
  reviewHistory: ReviewRecord[];
  stats: AppStats;
  settings: AppSettings;
}

export interface ImportPreview {
  words: number;
  collections: number;
  tags: number;
}

export type WordFormData = Omit<
  Word,
  "id" | "isFavorite" | "masteryLevel" | "createdAt" | "updatedAt"
>;
