"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type PageTitleContextType = {
  title: string | null;
  setTitle: (title: string | null) => void;
};

const PageTitleContext = createContext<PageTitleContextType | null>(null);

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);

  const value = useMemo(() => ({ title, setTitle }), [title]);

  return (
    <PageTitleContext.Provider value={value}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle() {
  const ctx = useContext(PageTitleContext);
  if (!ctx) throw new Error("usePageTitle must be used inside PageTitleProvider");
  return ctx;
}
  