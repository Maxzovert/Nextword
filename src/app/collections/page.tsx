"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppData } from "@/context/AppDataContext";
import { FolderOpen } from "lucide-react";

export default function CollectionsPage() {
  const { data } = useAppData();

  return (
    <AppLayout>
      <PageHeader
        title="Collections"
        subtitle="Organize words into themed groups"
        icon={FolderOpen}
        iconColor="#d6b6f6"
        mobileHidden
      />

      <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
        {data.collections.map((col) => (
          <CollectionCard key={col.id} collection={col} variant="grid" />
        ))}
      </div>
    </AppLayout>
  );
}
