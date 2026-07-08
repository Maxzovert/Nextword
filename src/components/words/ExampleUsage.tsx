import type { Word } from "@/lib/types";
import { formatExampleUsage, splitExampleWithWord } from "@/lib/utils";

interface ExampleUsageProps {
  example: string;
  word: string;
  className?: string;
}

export function ExampleUsage({ example, word, className }: ExampleUsageProps) {
  const cleaned = formatExampleUsage(example);
  if (!cleaned) return null;

  const parts = splitExampleWithWord(cleaned, word);

  return (
    <blockquote className={className}>
      <p className="text-sm leading-relaxed text-foreground">
        <span className="text-faint">&ldquo;</span>
        {parts?.match ? (
          <>
            {parts.before}
            <mark className="rounded-sm bg-primary/10 px-1 font-semibold text-primary not-italic">
              {parts.match}
            </mark>
            {parts.after}
          </>
        ) : (
          cleaned
        )}
        <span className="text-faint">&rdquo;</span>
      </p>
    </blockquote>
  );
}
