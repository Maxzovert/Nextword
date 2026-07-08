"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Plus } from "lucide-react";
import { useAppData, isWordDuplicate } from "@/context/AppDataContext";
import type { PartOfSpeech, Word, WordFormData } from "@/lib/types";
import { cn, parseTagsInput } from "@/lib/utils";

const partsOfSpeech: PartOfSpeech[] = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
  "other",
];

const emptyForm: WordFormData = {
  word: "",
  meaning: "",
  simpleMeaning: "",
  partOfSpeech: "noun",
  pronunciation: "",
  example: "",
  synonyms: [],
  antonyms: [],
  tags: [],
  source: "",
  note: "",
  collectionIds: [],
};

function wordToForm(word: Word): WordFormData {
  return {
    word: word.word,
    meaning: word.meaning,
    simpleMeaning: word.simpleMeaning,
    partOfSpeech: word.partOfSpeech,
    pronunciation: word.pronunciation,
    example: word.example,
    synonyms: [],
    antonyms: [],
    tags: word.tags,
    source: word.source,
    note: "",
    collectionIds: word.collectionIds,
  };
}

interface WordFormProps {
  mode: "add" | "edit";
  initialWord?: Word;
  onCancel?: () => void;
}

export function WordForm({ mode, initialWord, onCancel }: WordFormProps) {
  const router = useRouter();
  const { addWord, updateWord, data } = useAppData();
  const [form, setForm] = useState<WordFormData>(
    initialWord ? wordToForm(initialWord) : emptyForm,
  );
  const [tagsInput, setTagsInput] = useState(initialWord?.tags.join(", ") ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (field: keyof WordFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.word.trim()) {
      setError("Please enter a word");
      return;
    }

    const payload: WordFormData = {
      ...form,
      word: form.word.trim(),
      synonyms: [],
      antonyms: [],
      note: "",
      tags: parseTagsInput(tagsInput),
    };

    if (mode === "add") {
      if (isWordDuplicate(data.words, payload.word)) {
        setError("This word is already in your nest!");
        return;
      }
      addWord(payload);
      setSaved(true);
      setTimeout(() => router.push("/"), 600);
      return;
    }

    if (!initialWord) return;

    const duplicate = data.words.find(
      (w) => w.id !== initialWord.id && w.word.toLowerCase() === payload.word.toLowerCase(),
    );
    if (duplicate) {
      setError("Another word with this name already exists.");
      return;
    }

    updateWord(initialWord.id, payload);
    setSaved(true);
    setTimeout(() => onCancel?.(), 500);
  };

  const inputClass = "input-notion";
  const labelClass = "mb-1.5 block text-eyebrow text-ink-secondary";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="hidden sm:block">
        <h1 className="text-heading-2 text-foreground">
          {mode === "add" ? "Add a new word" : "Edit word"}
        </h1>
        <p className="mt-1 text-body-sm text-muted">
          {mode === "add" ? "Save a word you want to remember" : "Update this word in your nest"}
        </p>
      </div>

      <div className="surface-card space-y-5 p-4 sm:p-6">
        {error && (
          <div className="rounded-xs border border-hairline bg-background px-4 py-3 text-body-sm text-primary">
            {error}
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 rounded-xs border border-hairline bg-background px-4 py-3 text-body-sm font-medium text-foreground">
            <Check className="h-4 w-4 text-sticker-green" />
            {mode === "add" ? "Saved to your nest" : "Word updated"}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Word *</label>
            <input
              className={inputClass}
              value={form.word}
              onChange={(e) => update("word", e.target.value)}
              placeholder="e.g. Serendipity"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Meaning</label>
            <textarea
              className={cn(inputClass, "min-h-[80px] resize-none")}
              value={form.meaning}
              onChange={(e) => update("meaning", e.target.value)}
              placeholder="Full definition"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Simple meaning</label>
            <input
              className={inputClass}
              value={form.simpleMeaning}
              onChange={(e) => update("simpleMeaning", e.target.value)}
              placeholder="In your own words"
            />
          </div>

          <div>
            <label className={labelClass}>Part of speech</label>
            <select
              className={inputClass}
              value={form.partOfSpeech}
              onChange={(e) => update("partOfSpeech", e.target.value as PartOfSpeech)}
            >
              {partsOfSpeech.map((pos) => (
                <option key={pos} value={pos}>
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Pronunciation</label>
            <input
              className={inputClass}
              value={form.pronunciation}
              onChange={(e) => update("pronunciation", e.target.value)}
              placeholder="/ˌser.ənˈdip.ə.ti/"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Example usage</label>
            <textarea
              className={cn(inputClass, "min-h-[72px] resize-none")}
              value={form.example}
              onChange={(e) => update("example", e.target.value)}
              placeholder='e.g. Finding that book was pure serendipity.'
            />
            <p className="mt-1.5 text-xs text-faint">
              Write a full sentence showing how the word is used.
            </p>
          </div>

          <div>
            <label className={labelClass}>Tags</label>
            <input
              className={inputClass}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="literature, positive"
            />
          </div>

          <div>
            <label className={labelClass}>Where I heard it</label>
            <input
              className={inputClass}
              value={form.source}
              onChange={(e) => update("source", e.target.value)}
              placeholder="A podcast, book, conversation..."
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Collection</label>
            <div className="flex flex-wrap gap-2">
              {data.collections.map((col) => {
                const selected = form.collectionIds.includes(col.id);
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        collectionIds: selected
                          ? prev.collectionIds.filter((id) => id !== col.id)
                          : [...prev.collectionIds, col.id],
                      }));
                    }}
                    className={cn(
                      "btn-utility !text-eyebrow",
                      selected && "!bg-primary !text-on-primary !border-primary",
                    )}
                  >
                    {col.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="submit" className="btn-primary w-full sm:w-auto">
          {mode === "add" ? (
            <>
              <Plus className="h-4 w-4" />
              Save to Nest
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Save changes
            </>
          )}
        </button>
        {mode === "edit" && onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
