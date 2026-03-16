/**
 * Excel Parser for MyArrivals master file format.
 * Handles column alias mapping based on Logic Reference.
 */

// Column alias map from Tea Discovery Studio Logic Reference
export const COLUMN_ALIASES: Record<string, string> = {
  // Lot / arrival identification
  "LOT NO": "lotNo", "LOTNO": "lotNo", "LOT NUMBER": "lotNo",
  "MARK": "mark", "GARDEN": "mark", "MARK NAME": "mark",
  "INVOICE NO": "invoiceNo", "INV.NO": "invoiceNo", "INVOICE NUMBER": "invoiceNo", "INVOICE": "invoiceNo",
  "GRADE": "grade",
  "BASE PRICE": "bp", "BP": "bp", "BASEPRICE": "bp",
  "RESERVE PRICE": "rp", "RP": "rp", "RESERVEPRICE": "rp",
  "AUCTIONEER VALUATION": "aVal", "A. VAL": "aVal", "A.VAL": "aVal", "AUCTVALUATION": "aVal",
  "LSP / SP": "lspSp", "LSP/SP": "lspSp",
  "WORTH": "worth",
  "LIMITS / S.I.": "limitsSI", "LIMITS/S.I.": "limitsSI",
  "Q.C.": "qc",
  "QUALITY COMMENTS": "qualityComments", "QUALITY": "qualityComments", "QLTYCMNTS": "qualityComments",
  "NO OF PACKAGES": "noOfPackages", "PKGS": "noOfPackages",
  "NET WEIGHT": "netWeight", "NET WT": "netWeight", "NTWT": "netWeight",
  "INVOICE WEIGHT": "invoiceWeight", "TOTAL NTWT": "invoiceWeight",
  "ORIGIN": "origin",
  "TEA TYPE": "teaType", "TYPE": "teaType",
  "SUB TEA TYPE": "subTeaType", "SUBTEATYPE": "subTeaType",
  "CATEGORY": "category", "CTGRY": "category",
  "PACKAGE TYPE": "packageType", "PACKAGETYPE": "packageType",
  "PACKAGE NO": "packageNo", "PACKAGENO": "packageNo",
  "GROSS WEIGHT": "grossWeight",
  "TARE WEIGHT": "tareWeight",
  "SAMPLE QTY (KGS)": "sampleQty", "SAMPLEQTY": "sampleQty",
  "SHORT/EXCESS WEIGHT": "shortExcessWeight",
  "GP NO": "gpNo", "GPNO": "gpNo",
  "GP DATE": "gpDate", "GPDATE": "gpDate",
  "PERIOD OF MANUFACTURE": "periodOfManufacture", "PERIODOFMANUFACTURE": "periodOfManufacture",
  "MARK & PACK COMMENTS": "markPackComments",
  // MyArrivals specific columns
  "SALENO": "saleNo", "SALE NO": "saleNo",
  "SALEYEAR": "saleYear", "SALE YEAR": "saleYear",
  "ARRIVALDATE": "arrivalDate", "ARRIVAL DATE": "arrivalDate",
  "UNIT": "unit",
  "ARRIVALNO": "arrivalNo", "ARRIVAL NO": "arrivalNo",
  "SELLERNAME": "sellerName", "SELLER NAME": "sellerName",
  "TEATYPE": "teaType",
  "CROPYEAR": "cropYear", "CROP YEAR": "cropYear",
  "PACKAGES": "packages",
  "SERIALFROM": "serialFrom", "SERIAL FROM": "serialFrom",
  "SERIALUPTO": "serialUpto", "SERIAL UPTO": "serialUpto",
  "UNITLOCATION": "unitLocation",
  "EACHGROSS": "eachGross", "EACH GROSS": "eachGross",
  "EACHNET": "eachNet", "EACH NET": "eachNet",
  "OS": "os", "BR": "br", "WS": "ws", "TR": "tr", "NR": "nr",
  "SHORTAGE": "shortage",
  "FIS": "fis",
  "PKGMONTH": "pkgMonth", "PKG MONTH": "pkgMonth",
  "EWAYBILLNO": "ewayBillNo",
  "EWAYBILLDATE": "ewayBillDate",
  "PACKAGESIZE": "packageSize",
  "REMARKS": "remarks",
};

/**
 * Normalize a column header to its canonical field name.
 */
export function normalizeColumnHeader(header: string): string {
  const normalized = String(header).trim().toUpperCase();
  return COLUMN_ALIASES[normalized] || normalized.toLowerCase().replace(/\s+/g, "_");
}

/**
 * Parse a date value from Excel (handles various formats).
 */
export function parseExcelDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") {
    // Excel serial date
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + value * 86400000);
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

/**
 * Parse a numeric value safely.
 */
export function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

/**
 * Validate a parsed arrival row.
 * Returns array of validation errors.
 */
export function validateArrivalRow(row: Record<string, unknown>, rowIndex: number): string[] {
  const errors: string[] = [];
  const prefix = `Row ${rowIndex + 1}`;

  if (!row.mark) errors.push(`${prefix}: Mark/Garden name is required`);
  if (!row.grade) errors.push(`${prefix}: Grade is required`);
  if (row.packages !== undefined && row.packages !== null) {
    const pkgs = Number(row.packages);
    if (isNaN(pkgs) || pkgs <= 0) errors.push(`${prefix}: Invalid number of packages: ${row.packages}`);
  }
  if (row.eachNet !== undefined && row.eachNet !== null) {
    const net = Number(row.eachNet);
    if (isNaN(net) || net <= 0) errors.push(`${prefix}: Invalid net weight: ${row.eachNet}`);
  }

  return errors;
}
