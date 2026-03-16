/**
 * SOP Allocation Engine
 * Applies Standard Operating Procedure rules to determine
 * whether a lot goes to MAIN or SUPPLEMENTARY sale.
 */

export interface SopRule {
  id: number;
  ruleNo: number;
  ruleName: string;
  conditions: Array<{ field: string; op: string; value: unknown }>;
  allocation: "MAIN" | "SUPPLEMENTARY" | "EXCLUDED";
  salePart?: "I" | "II" | null;
  priority: number;
}

export interface ArrivalForSop {
  id: number;
  mark: string;
  grade: string | null;
  category: string | null;
  teaType: string | null;
  fis: string | null;
  packages: number | null;
  totalNetWeight: string | null;
  isNewGarden: boolean | null;
  awrType: string | null;
}

/**
 * Evaluate a single condition against an arrival record.
 */
function evaluateCondition(
  condition: { field: string; op: string; value: unknown },
  arrival: ArrivalForSop
): boolean {
  const fieldValue = (arrival as unknown as Record<string, unknown>)[condition.field];
  const { op, value } = condition;

  switch (op) {
    case "eq":
      return String(fieldValue ?? "").toUpperCase() === String(value).toUpperCase();
    case "neq":
      return String(fieldValue ?? "").toUpperCase() !== String(value).toUpperCase();
    case "in":
      return Array.isArray(value) && value.some(v => String(fieldValue ?? "").toUpperCase() === String(v).toUpperCase());
    case "not_in":
      return Array.isArray(value) && !value.some(v => String(fieldValue ?? "").toUpperCase() === String(v).toUpperCase());
    case "gt":
      return Number(fieldValue) > Number(value);
    case "lt":
      return Number(fieldValue) < Number(value);
    case "gte":
      return Number(fieldValue) >= Number(value);
    case "lte":
      return Number(fieldValue) <= Number(value);
    case "contains":
      return String(fieldValue ?? "").toUpperCase().includes(String(value).toUpperCase());
    case "starts_with":
      return String(fieldValue ?? "").toUpperCase().startsWith(String(value).toUpperCase());
    case "is_true":
      return fieldValue === true || fieldValue === 1;
    case "is_false":
      return !fieldValue || fieldValue === 0;
    default:
      return false;
  }
}

/**
 * Apply SOP rules to an arrival record.
 * Returns the first matching rule's allocation.
 * Rules are sorted by priority (lower = higher priority).
 */
export function applySopRules(
  arrival: ArrivalForSop,
  rules: SopRule[]
): { allocation: "MAIN" | "SUPPLEMENTARY" | "EXCLUDED"; salePart?: "I" | "II"; ruleApplied?: string } {
  // Sort rules by priority
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    let conditions: Array<{ field: string; op: string; value: unknown }> = [];
    try {
      conditions = typeof rule.conditions === "string" ? JSON.parse(rule.conditions) : rule.conditions;
    } catch {
      continue;
    }

    // All conditions must match (AND logic)
    const allMatch = conditions.every(c => evaluateCondition(c, arrival));
    if (allMatch) {
      return {
        allocation: rule.allocation,
        salePart: rule.salePart ?? undefined,
        ruleApplied: `R${rule.ruleNo}`,
      };
    }
  }

  // Default: SUPPLEMENTARY if no rule matches
  return { allocation: "SUPPLEMENTARY", ruleApplied: "DEFAULT" };
}

/**
 * Bulk apply SOP rules to all arrivals.
 */
export function bulkApplySopRules(
  arrivals: ArrivalForSop[],
  rules: SopRule[]
): Array<ArrivalForSop & { allocation: "MAIN" | "SUPPLEMENTARY" | "EXCLUDED"; salePart?: "I" | "II"; ruleApplied?: string }> {
  return arrivals.map(arrival => ({
    ...arrival,
    ...applySopRules(arrival, rules),
  }));
}
