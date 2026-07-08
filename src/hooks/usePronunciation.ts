"use client";

import { useCallback, useEffect, useState } from "react";
import { isSpeechSupported, speakWord, stopSpeaking } from "@/lib/speech";

export function usePronunciation(word: string) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSupported());

    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      stopSpeaking();
    };
  }, []);

  const pronounce = useCallback(() => {
    if (!supported) return;

    setSpeaking(true);
    const started = speakWord(word, () => setSpeaking(false));
    if (!started) setSpeaking(false);
  }, [supported, word]);

  return { pronounce, speaking, supported };
}
