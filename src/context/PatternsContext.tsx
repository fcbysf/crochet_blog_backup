import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { samplePatterns, type CrochetPattern } from "@/data/patterns";

interface PatternsContextValue {
  patterns: CrochetPattern[];
  loading: boolean;
  error: string | null;
  getPatternById: (id: string) => CrochetPattern | undefined;
  getPatternsByCategory: (category: string) => CrochetPattern[];
  addPattern: (pattern: CrochetPattern) => void;
}

const PatternsContext = createContext<PatternsContextValue | undefined>(
  undefined
);

export function PatternsProvider({ children }: { children: ReactNode }) {
  const [patterns, setPatterns] = useState<CrochetPattern[]>(samplePatterns);
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  const getPatternById = useCallback(
    (id: string) => patterns.find((p) => p.id === id),
    [patterns]
  );

  const getPatternsByCategory = useCallback(
    (category: string) =>
      patterns.filter((p) => p.category.toLowerCase() === category.toLowerCase()),
    [patterns]
  );

  const addPattern = useCallback((pattern: CrochetPattern) => {
    setPatterns((prev) => [...prev, pattern]);
  }, []);

  const value = useMemo(
    () => ({
      patterns,
      loading,
      error,
      getPatternById,
      getPatternsByCategory,
      addPattern,
    }),
    [patterns, loading, error, getPatternById, getPatternsByCategory, addPattern]
  );

  return (
    <PatternsContext.Provider value={value}>
      {children}
    </PatternsContext.Provider>
  );
}

export function usePatterns(): PatternsContextValue {
  const context = useContext(PatternsContext);
  if (context === undefined) {
    throw new Error("usePatterns must be used within a PatternsProvider");
  }
  return context;
}