"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { AddWordForm } from "@/components/words/AddWordForm";

export default function AddPage() {
  return (
    <AppLayout>
      <div className="w-full min-w-0">
        <AddWordForm />
      </div>
    </AppLayout>
  );
}
