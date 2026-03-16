/**
 * Categorization Engine
 * Auto-classifies tea arrivals based on category, grade, and tea type.
 * Based on Tea Discovery Studio Logic Reference + real data from Bible files.
 */

// Grade → Category mapping based on actual data analysis
export const GRADE_CATEGORY_MAP: Record<string, { category: string; teaType: "Leaf" | "Dust" | "Green" }> = {
  // CTC Leaf grades
  "BOP": { category: "CTC", teaType: "Leaf" },
  "BOP1": { category: "CTC", teaType: "Leaf" },
  "BOPL": { category: "CTC", teaType: "Leaf" },
  "BOPSM": { category: "CTC", teaType: "Leaf" },
  "BOPSM1": { category: "CTC", teaType: "Leaf" },
  "BP": { category: "CTC", teaType: "Leaf" },
  "BP1": { category: "CTC", teaType: "Leaf" },
  "BPS": { category: "CTC", teaType: "Leaf" },
  "BPS1": { category: "CTC", teaType: "Leaf" },
  "BPSM": { category: "CTC", teaType: "Leaf" },
  "BPS(O)": { category: "CTC", teaType: "Leaf" },
  "GBOP": { category: "CTC", teaType: "Leaf" },
  // "GBOP1": duplicate removed
  "GFBOP": { category: "CTC", teaType: "Leaf" },
  "GFBOP1": { category: "CTC", teaType: "Leaf" },
  // "GFOP": duplicate removed
  "GFOP1": { category: "CTC", teaType: "Leaf" },
  "GFOP(S)": { category: "CTC", teaType: "Leaf" },
  "GOF": { category: "CTC", teaType: "Leaf" },
  "OF": { category: "CTC", teaType: "Leaf" },
  "OF1": { category: "CTC", teaType: "Leaf" },
  "FBOP": { category: "CTC", teaType: "Leaf" },
  "FBOP1": { category: "CTC", teaType: "Leaf" },
  "FINE": { category: "CTC", teaType: "Leaf" },
  "BULK II": { category: "CTC", teaType: "Leaf" },
  // CTC Dust grades
  "D": { category: "DUST", teaType: "Dust" },
  "D1": { category: "DUST", teaType: "Dust" },
  "DUST1": { category: "DUST", teaType: "Dust" },
  "CD": { category: "DUST", teaType: "Dust" },
  "CD1": { category: "DUST", teaType: "Dust" },
  "PD": { category: "DUST", teaType: "Dust" },
  "PD1": { category: "DUST", teaType: "Dust" },
  "OD": { category: "DUST", teaType: "Dust" },
  "FANNING": { category: "DUST", teaType: "Dust" },
  "FOF": { category: "DUST", teaType: "Dust" },
  "GTFANNINGS": { category: "DUST", teaType: "Dust" },
  // Orthodox Leaf grades
  "FOP": { category: "ORTHODOX", teaType: "Leaf" },
  "FOP1": { category: "ORTHODOX", teaType: "Leaf" },
  "GFOP": { category: "ORTHODOX", teaType: "Leaf" },
  "FTGFOP": { category: "ORTHODOX", teaType: "Leaf" },
  "FTGFOP1": { category: "ORTHODOX", teaType: "Leaf" },
  "OP": { category: "ORTHODOX", teaType: "Leaf" },
  "OP1": { category: "ORTHODOX", teaType: "Leaf" },
  "MASDANA": { category: "ORTHODOX", teaType: "Leaf" },
  "MOGRA": { category: "ORTHODOX", teaType: "Leaf" },
  "MOGRA1": { category: "ORTHODOX", teaType: "Leaf" },
  "MOGRA2": { category: "ORTHODOX", teaType: "Leaf" },
  "LACCHA": { category: "ORTHODOX", teaType: "Leaf" },
  "LACHHA": { category: "ORTHODOX", teaType: "Leaf" },
  // Orthodox Dust grades
  "GBOP1": { category: "ORTHODOX DUST", teaType: "Dust" },
  // Green Tea grades
  "GREEN DUST": { category: "GREEN DUST", teaType: "Green" },
  "HYSON": { category: "GREEN TEA", teaType: "Green" },
};

export interface CategorizationResult {
  category: string;
  teaType: "Leaf" | "Dust" | "Green";
  confidence: "high" | "medium" | "low";
  source: "grade_map" | "category_field" | "manual";
}

/**
 * Categorize a tea arrival based on grade and existing category field.
 * Returns categorization result with confidence level.
 */
export function categorizeArrival(input: {
  grade?: string | null;
  category?: string | null;
  teaType?: string | null;
}): CategorizationResult {
  const grade = input.grade?.toUpperCase().trim();
  const existingCategory = input.category?.toUpperCase().trim();

  // If grade is in our map, use it (high confidence)
  if (grade && GRADE_CATEGORY_MAP[grade]) {
    return { ...GRADE_CATEGORY_MAP[grade], confidence: "high", source: "grade_map" };
  }

  // If existing category is provided, use it (medium confidence)
  if (existingCategory) {
    const categoryMap: Record<string, { category: string; teaType: "Leaf" | "Dust" | "Green" }> = {
      "CTC": { category: "CTC", teaType: "Leaf" },
      "DUST": { category: "DUST", teaType: "Dust" },
      "ORTHODOX": { category: "ORTHODOX", teaType: "Leaf" },
      "ORTHODOX DUST": { category: "ORTHODOX DUST", teaType: "Dust" },
      "OR-DUST": { category: "ORTHODOX DUST", teaType: "Dust" },
      "GREEN TEA": { category: "GREEN TEA", teaType: "Green" },
      "GREEN DUST": { category: "GREEN DUST", teaType: "Green" },
    };
    if (categoryMap[existingCategory]) {
      return { ...categoryMap[existingCategory], confidence: "medium", source: "category_field" };
    }
  }

  // Fallback: try to infer from grade suffix patterns
  if (grade) {
    if (grade.endsWith("D") || grade.endsWith("D1") || grade.includes("DUST") || grade.includes("FANNING")) {
      return { category: "DUST", teaType: "Dust", confidence: "low", source: "grade_map" };
    }
    if (grade.includes("FOP") || grade.includes("OP") || grade.includes("MOGRA") || grade.includes("FTGFOP")) {
      return { category: "ORTHODOX", teaType: "Leaf", confidence: "low", source: "grade_map" };
    }
    if (grade.includes("GREEN")) {
      return { category: "GREEN TEA", teaType: "Green", confidence: "low", source: "grade_map" };
    }
    // Default to CTC Leaf
    return { category: "CTC", teaType: "Leaf", confidence: "low", source: "grade_map" };
  }

  return { category: "CTC", teaType: "Leaf", confidence: "low", source: "manual" };
}

/**
 * Detect if a garden (mark) is new compared to known gardens.
 */
export function isNewGarden(mark: string, knownMarks: Set<string>): boolean {
  return !knownMarks.has(mark.toUpperCase().trim());
}

/**
 * Determine AWR type from arrival number prefix.
 * ALPHA = letter prefix (e.g. PPFL/25-26/U1/000059)
 * NUM = numeric prefix
 */
export function getAwrType(arrivalNo: string | null | undefined): "ALPHA" | "NUM" | "OTHER" {
  if (!arrivalNo) return "OTHER";
  const prefix = arrivalNo.trim().charAt(0);
  if (/[A-Z]/i.test(prefix)) return "ALPHA";
  if (/[0-9]/.test(prefix)) return "NUM";
  return "OTHER";
}

/**
 * Parse certifications from garden remarks/name.
 * Detects TRUSTEA, ZED, ISO 22000, ISO 9001, etc.
 */
export function parseCertifications(text: string | null | undefined): string[] {
  if (!text) return [];
  const certs: string[] = [];
  if (/TRUSTEA/i.test(text)) certs.push("TRUSTEA");
  if (/ZED/i.test(text)) certs.push("ZED");
  if (/ISO\s*22000/i.test(text)) certs.push("ISO 22000");
  if (/ISO\s*9001/i.test(text)) certs.push("ISO 9001");
  if (/ORGANIC/i.test(text)) certs.push("ORGANIC");
  if (/RAINFOREST/i.test(text)) certs.push("Rainforest Alliance");
  return certs;
}
