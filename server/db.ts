import { eq, and, desc, asc, sql, like, inArray, isNull, isNotNull, gte, lte, count, sum, max, min, avg } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  users, centres, sales, arrivals, lots, bibleRecords, sopRules,
  uploadBatches, catalogues, gardenMaster, buyerMaster, auctionResults,
  carryForwardStock, centreSettings,
  type InsertUser, type User,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── USER HELPERS ────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(asc(users.name));
}

export async function updateUserRole(userId: number, role: User["role"]) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

// ─── CENTRE HELPERS ──────────────────────────────────────────
export async function getAllCentres() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(centres).where(eq(centres.isActive, true)).orderBy(asc(centres.region));
}

export async function getCentreById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(centres).where(eq(centres.id, id)).limit(1);
  return result[0];
}

export async function seedCentres() {
  const db = await getDb();
  if (!db) return;
  const defaultCentres = [
    { id: "ctta", name: "CTTA", fullName: "Calcutta Tea Traders Association", region: "north" as const },
    { id: "gtac", name: "GTAC", fullName: "Guwahati Tea Auction Centre", region: "north" as const },
    { id: "siliguri", name: "Siliguri", fullName: "Siliguri Tea Auction Centre", region: "north" as const },
    { id: "coimbatore", name: "Coimbatore", fullName: "Coimbatore Tea Auction Centre", region: "south" as const },
    { id: "coonoor", name: "Coonoor", fullName: "Coonoor Tea Auction Centre", region: "south" as const },
    { id: "kochi", name: "Kochi", fullName: "Kochi Tea Auction Centre", region: "south" as const },
  ];
  for (const c of defaultCentres) {
    await db.insert(centres).values(c).onDuplicateKeyUpdate({ set: { name: c.name } });
  }
}

// ─── SALE HELPERS ────────────────────────────────────────────
export async function getSalesByCentre(centreId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sales).where(eq(sales.centreId, centreId)).orderBy(desc(sales.saleYear), desc(sales.saleNo));
}

export async function getSaleById(saleId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sales).where(eq(sales.id, saleId)).limit(1);
  return result[0];
}

export async function createSale(data: {
  centreId: string; saleNo: number; saleYear: number; viewType: "auctions" | "private";
  auctionDate?: Date; weekNo?: number; weekLabel?: string; createdBy?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const saleLabel = `${data.saleNo}/${data.saleYear}`;
  const result = await db.insert(sales).values({ ...data, saleLabel });
  return result[0];
}

// ─── ARRIVALS HELPERS ────────────────────────────────────────
export async function getArrivalsBySale(saleId: number, centreId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(arrivals)
    .where(and(eq(arrivals.saleId, saleId), eq(arrivals.centreId, centreId)))
    .orderBy(asc(arrivals.mark), asc(arrivals.grade));
}

export async function getArrivalsStats(saleId: number, centreId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select({
    totalArrivals: count(),
    totalPackages: sum(arrivals.packages),
    totalNetWeight: sum(arrivals.totalNetWeight),
    newGardens: count(sql`CASE WHEN ${arrivals.isNewGarden} = 1 THEN 1 END`),
    ctcCount: count(sql`CASE WHEN ${arrivals.category} = 'CTC' THEN 1 END`),
    dustCount: count(sql`CASE WHEN ${arrivals.category} = 'DUST' THEN 1 END`),
    orthodoxCount: count(sql`CASE WHEN ${arrivals.category} = 'ORTHODOX' THEN 1 END`),
  }).from(arrivals).where(and(eq(arrivals.saleId, saleId), eq(arrivals.centreId, centreId)));
  return result[0];
}

export async function getStockSummary(saleId: number, centreId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    category: arrivals.category,
    teaType: arrivals.teaType,
    grade: arrivals.grade,
    totalPackages: sum(arrivals.packages),
    totalNetWeight: sum(arrivals.totalNetWeight),
    lotCount: count(),
  }).from(arrivals)
    .where(and(eq(arrivals.saleId, saleId), eq(arrivals.centreId, centreId)))
    .groupBy(arrivals.category, arrivals.teaType, arrivals.grade)
    .orderBy(asc(arrivals.category), asc(arrivals.grade));
}

export async function createArrival(data: typeof arrivals.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(arrivals).values(data);
  return result;
}

export async function updateArrivalCategorization(
  id: number,
  data: { category?: string; teaType?: "Leaf" | "Dust" | "Green"; categorizationStatus?: "pending" | "auto" | "manual" | "confirmed" }
) {
  const db = await getDb();
  if (!db) return;
  await db.update(arrivals).set(data).where(eq(arrivals.id, id));
}

export async function updateArrivalAllocation(
  id: number,
  data: { saleAllocation?: "MAIN" | "SUPPLEMENTARY" | "EXCLUDED"; salePart?: "I" | "II"; sopRuleApplied?: string; allocationStatus?: "pending" | "allocated" | "excluded" }
) {
  const db = await getDb();
  if (!db) return;
  await db.update(arrivals).set(data).where(eq(arrivals.id, id));
}

// ─── LOT HELPERS ─────────────────────────────────────────────
export async function getLotsBySale(saleId: number, centreId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lots)
    .where(and(eq(lots.saleId, saleId), eq(lots.centreId, centreId)))
    .orderBy(asc(lots.lotSequence));
}

export async function getLotById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lots).where(eq(lots.id, id)).limit(1);
  return result[0];
}

export async function updateLotTasting(id: number, data: {
  musterValue?: string; limitPrice?: string; basePrice?: string; reservePrice?: string;
  auctioneerValuation?: string; worth?: string; lspSp?: string; limitsSI?: string;
  qc?: string; qualityComments?: string; tastingRemarks?: string; buyerScores?: unknown;
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(lots).set(data as any).where(eq(lots.id, id));
}

export async function updateLotSampling(id: number, data: {
  sampleDrawn?: boolean; stickerGenerated?: boolean; sampleDespatched?: boolean;
  sampleDespatchDate?: Date; samplePriority?: "urgent" | "high" | "normal";
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(lots).set(data).where(eq(lots.id, id));
}

export async function updateLotResult(id: number, data: {
  soldStatus?: "PENDING" | "SOLD" | "UNSOLD" | "WITHDRAWN";
  sellingPrice?: string; buyerName?: string; buyerCode?: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(lots).set(data as any).where(eq(lots.id, id));
}

// ─── SOP RULES HELPERS ───────────────────────────────────────
export async function getSopRules(centreId?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = centreId
    ? sql`${sopRules.centreId} = ${centreId} OR ${sopRules.centreId} IS NULL`
    : isNull(sopRules.centreId);
  return db.select().from(sopRules)
    .where(and(eq(sopRules.isActive, true), conditions))
    .orderBy(asc(sopRules.priority), asc(sopRules.ruleNo));
}

export async function seedDefaultSopRules() {
  const db = await getDb();
  if (!db) return;
  const defaultRules = [
    { ruleNo: 1, ruleName: "FIS CTC Leaf → Main Part I", description: "Fresh-in-season CTC Leaf goes to Main Sale Part I", conditions: JSON.stringify([{field:"fis",op:"eq",value:"Y"},{field:"category",op:"eq",value:"CTC"},{field:"teaType",op:"eq",value:"Leaf"}]), allocation: "MAIN" as const, salePart: "I" as const, priority: 1 },
    { ruleNo: 2, ruleName: "FIS CTC Dust → Main Part I", description: "Fresh-in-season CTC Dust goes to Main Sale Part I", conditions: JSON.stringify([{field:"fis",op:"eq",value:"Y"},{field:"category",op:"in",value:["CTC","DUST"]},{field:"teaType",op:"eq",value:"Dust"}]), allocation: "MAIN" as const, salePart: "I" as const, priority: 2 },
    { ruleNo: 3, ruleName: "FIS Orthodox Leaf → Main Part II", description: "Fresh-in-season Orthodox Leaf goes to Main Sale Part II", conditions: JSON.stringify([{field:"fis",op:"eq",value:"Y"},{field:"category",op:"eq",value:"ORTHODOX"},{field:"teaType",op:"eq",value:"Leaf"}]), allocation: "MAIN" as const, salePart: "II" as const, priority: 3 },
    { ruleNo: 4, ruleName: "Non-FIS CTC → Supplementary", description: "Non-fresh-in-season CTC goes to Supplementary", conditions: JSON.stringify([{field:"fis",op:"eq",value:"N"},{field:"category",op:"in",value:["CTC","DUST"]}]), allocation: "SUPPLEMENTARY" as const, priority: 10 },
    { ruleNo: 5, ruleName: "Non-FIS Orthodox → Supplementary", description: "Non-fresh-in-season Orthodox goes to Supplementary", conditions: JSON.stringify([{field:"fis",op:"eq",value:"N"},{field:"category",op:"in",value:["ORTHODOX","ORTHODOX DUST"]}]), allocation: "SUPPLEMENTARY" as const, priority: 11 },
    { ruleNo: 6, ruleName: "Green Tea → Main Part II", description: "All Green Tea goes to Main Sale Part II", conditions: JSON.stringify([{field:"category",op:"in",value:["GREEN TEA","GREEN DUST"]}]), allocation: "MAIN" as const, salePart: "II" as const, priority: 5 },
    { ruleNo: 7, ruleName: "Carry-Forward Stock → Supplementary", description: "All carry-forward stock goes to Supplementary", conditions: JSON.stringify([{field:"isCarryForward",op:"eq",value:true}]), allocation: "SUPPLEMENTARY" as const, priority: 20 },
  ];
  for (const rule of defaultRules) {
    await db.insert(sopRules).values(rule).onDuplicateKeyUpdate({ set: { ruleName: rule.ruleName } }).catch(() => {});
  }
}

// ─── GARDEN MASTER HELPERS ───────────────────────────────────
export async function getGardenMaster(centreId?: string) {
  const db = await getDb();
  if (!db) return [];
  if (centreId) {
    return db.select().from(gardenMaster).where(eq(gardenMaster.centreId, centreId)).orderBy(asc(gardenMaster.mark));
  }
  return db.select().from(gardenMaster).orderBy(asc(gardenMaster.mark));
}

export async function upsertGarden(data: { mark: string; sellerName?: string; centreId?: string; category?: string; certifications?: unknown }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(gardenMaster).values({ mark: data.mark, sellerName: data.sellerName, centreId: data.centreId, category: data.category, certifications: data.certifications as any })
    .onDuplicateKeyUpdate({ set: { sellerName: data.sellerName, updatedAt: new Date() } });
}

// ─── BIBLE RECORDS HELPERS ───────────────────────────────────
export async function getBibleRecordsByMark(mark: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bibleRecords).where(eq(bibleRecords.mark, mark)).orderBy(desc(bibleRecords.year));
}

export async function getBibleStats(year: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select({
    totalRecords: count(),
    auctionSold: count(sql`CASE WHEN ${bibleRecords.saleStatus} = 'AUCTION SOLD' THEN 1 END`),
    privateSold: count(sql`CASE WHEN ${bibleRecords.saleStatus} = 'PRIVATE SOLD' THEN 1 END`),
    withdrawn: count(sql`CASE WHEN ${bibleRecords.saleStatus} LIKE '%WD%' THEN 1 END`),
    avgPrice: avg(bibleRecords.price),
    maxPrice: max(bibleRecords.price),
    minPrice: min(bibleRecords.price),
  }).from(bibleRecords).where(eq(bibleRecords.year, year));
  return result[0];
}

// ─── UPLOAD BATCH HELPERS ────────────────────────────────────
export async function createUploadBatch(data: {
  id: string; centreId: string; saleId?: number; fileName: string; fileUrl: string; fileKey: string; uploadedBy?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(uploadBatches).values({ ...data, status: "uploading" });
}

export async function updateUploadBatch(id: string, data: Partial<typeof uploadBatches.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(uploadBatches).set(data).where(eq(uploadBatches.id, id));
}

export async function getUploadBatches(centreId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(uploadBatches).where(eq(uploadBatches.centreId, centreId)).orderBy(desc(uploadBatches.createdAt)).limit(20);
}

// ─── CATALOGUE HELPERS ───────────────────────────────────────
export async function getCataloguesBySale(saleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(catalogues).where(eq(catalogues.saleId, saleId));
}

// ─── AUCTION RESULTS HELPERS ─────────────────────────────────
export async function getAuctionResultsBySale(saleId: number, centreId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auctionResults)
    .where(and(eq(auctionResults.saleId, saleId), eq(auctionResults.centreId, centreId)))
    .orderBy(asc(auctionResults.lotNo));
}

export async function getAuctionResultsStats(saleId: number, centreId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select({
    totalLots: count(),
    soldLots: count(sql`CASE WHEN ${auctionResults.soldStatus} = 'SOLD' THEN 1 END`),
    unsoldLots: count(sql`CASE WHEN ${auctionResults.soldStatus} = 'UNSOLD' THEN 1 END`),
    totalRevenue: sum(auctionResults.revenue),
    avgPrice: avg(auctionResults.sellingPrice),
    maxPrice: max(auctionResults.sellingPrice),
    minPrice: min(auctionResults.sellingPrice),
  }).from(auctionResults).where(and(eq(auctionResults.saleId, saleId), eq(auctionResults.centreId, centreId)));
  return result[0];
}

// ─── CENTRE SETTINGS HELPERS ─────────────────────────────────
export async function getCentreSettings(centreId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(centreSettings).where(eq(centreSettings.centreId, centreId)).limit(1);
  return result[0] ?? null;
}

export async function upsertCentreSettings(centreId: string, data: Partial<typeof centreSettings.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.insert(centreSettings).values({ centreId, ...data, updatedAt: new Date() })
    .onDuplicateKeyUpdate({ set: { ...data, updatedAt: new Date() } });
}

// ─── ANALYTICS QUERY HELPERS ─────────────────────────────────

export async function getAnalyticsPriceTrend(params: {
  centreId?: string;
  category?: string;
  grade?: string;
  fromYear?: number;
  toYear?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({
    saleYear: bibleRecords.year,
    saleNo: bibleRecords.aucSaleNo,
    grade: bibleRecords.grade,
    category: bibleRecords.category,
    avgPrice: sql<number>`AVG(${bibleRecords.price})`,
    totalPackages: sql<number>`SUM(${bibleRecords.pkgs})`,
    soldCount: sql<number>`COUNT(CASE WHEN ${bibleRecords.saleStatus} = 'AUCTION SOLD' THEN 1 END)`,
    totalCount: sql<number>`COUNT(*)`,
  })
  .from(bibleRecords)
  .where(and(
    params.centreId ? eq(bibleRecords.centreId, params.centreId) : undefined,
    params.category ? eq(bibleRecords.category, params.category) : undefined,
    params.grade ? eq(bibleRecords.grade, params.grade) : undefined,
    params.fromYear ? gte(bibleRecords.year, params.fromYear) : undefined,
    params.toYear ? lte(bibleRecords.year, params.toYear) : undefined,
  ))
  .groupBy(bibleRecords.year, bibleRecords.aucSaleNo, bibleRecords.grade, bibleRecords.category)
  .orderBy(bibleRecords.year, bibleRecords.aucSaleNo);
  return rows;
}

export async function getAnalyticsGardenPerformance(params: {
  centreId?: string;
  saleYear?: number;
  category?: string;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({
    mark: bibleRecords.mark,
    sellerName: bibleRecords.sellerName,
    category: bibleRecords.category,
    avgPrice: sql<number>`AVG(${bibleRecords.price})`,
    maxPrice: sql<number>`MAX(${bibleRecords.price})`,
    minPrice: sql<number>`MIN(${bibleRecords.price})`,
    totalPackages: sql<number>`SUM(${bibleRecords.pkgs})`,
    soldCount: sql<number>`COUNT(CASE WHEN ${bibleRecords.saleStatus} = 'AUCTION SOLD' THEN 1 END)`,
    totalCount: sql<number>`COUNT(*)`,
  })
  .from(bibleRecords)
  .where(and(
    params.centreId ? eq(bibleRecords.centreId, params.centreId) : undefined,
    params.saleYear ? eq(bibleRecords.year, params.saleYear) : undefined,
    params.category ? eq(bibleRecords.category, params.category) : undefined,
    isNotNull(bibleRecords.price),
  ))
  .groupBy(bibleRecords.mark, bibleRecords.sellerName, bibleRecords.category)
  .orderBy(desc(sql`AVG(${bibleRecords.price})`))
  .limit(params.limit || 50);
  return rows;
}

export async function getAnalyticsBuyerPerformance(params: {
  centreId?: string;
  saleYear?: number;
  category?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({
    buyerCode: bibleRecords.buyer1,
    buyerName: bibleRecords.buyer1,
    category: bibleRecords.category,
    avgPrice: sql<number>`AVG(${bibleRecords.price})`,
    totalPackages: sql<number>`SUM(${bibleRecords.pkgs})`,
    lotsCount: sql<number>`COUNT(*)`,
    totalSpend: sql<number>`SUM(${bibleRecords.price} * ${bibleRecords.pkgs} * ${bibleRecords.netWeight})`,
  })
  .from(bibleRecords)
  .where(and(
    params.centreId ? eq(bibleRecords.centreId, params.centreId) : undefined,
    params.saleYear ? eq(bibleRecords.year, params.saleYear) : undefined,
    params.category ? eq(bibleRecords.category, params.category) : undefined,
    eq(bibleRecords.saleStatus, 'AUCTION SOLD'),
    isNotNull(bibleRecords.buyer1),
  ))
  .groupBy(bibleRecords.buyer1, bibleRecords.category)
  .orderBy(desc(sql`SUM(${bibleRecords.pkgs})`))
  .limit(50);
  return rows;
}

export async function getAnalyticsCentreComparison(params: {
  saleYear?: number;
  category?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({
    centreId: bibleRecords.centreId,
    category: bibleRecords.category,
    avgPrice: sql<number>`AVG(${bibleRecords.price})`,
    totalPackages: sql<number>`SUM(${bibleRecords.pkgs})`,
    soldCount: sql<number>`COUNT(CASE WHEN ${bibleRecords.saleStatus} = 'AUCTION SOLD' THEN 1 END)`,
    totalCount: sql<number>`COUNT(*)`,
    uniqueGardens: sql<number>`COUNT(DISTINCT ${bibleRecords.mark})`,
  })
  .from(bibleRecords)
  .where(and(
    params.saleYear ? eq(bibleRecords.year, params.saleYear) : undefined,
    params.category ? eq(bibleRecords.category, params.category) : undefined,
  ))
  .groupBy(bibleRecords.centreId, bibleRecords.category)
  .orderBy(bibleRecords.centreId);
  return rows;
}

export async function getAnalyticsGradeBreakdown(params: {
  centreId?: string;
  saleYear?: number;
  mark?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({
    grade: bibleRecords.grade,
    category: bibleRecords.category,
    avgPrice: sql<number>`AVG(${bibleRecords.price})`,
    totalPackages: sql<number>`SUM(${bibleRecords.pkgs})`,
    soldCount: sql<number>`COUNT(CASE WHEN ${bibleRecords.saleStatus} = 'AUCTION SOLD' THEN 1 END)`,
    totalCount: sql<number>`COUNT(*)`,
  })
  .from(bibleRecords)
  .where(and(
    params.centreId ? eq(bibleRecords.centreId, params.centreId) : undefined,
    params.saleYear ? eq(bibleRecords.year, params.saleYear) : undefined,
    params.mark ? eq(bibleRecords.mark, params.mark) : undefined,
    isNotNull(bibleRecords.grade),
  ))
  .groupBy(bibleRecords.grade, bibleRecords.category)
  .orderBy(desc(sql`COUNT(*)`));
  return rows;
}

export async function getAnalyticsSeasonalTrend(params: {
  centreId?: string;
  mark?: string;
  grade?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({
    saleYear: bibleRecords.year,
    season: bibleRecords.season,
    category: bibleRecords.category,
    avgPrice: sql<number>`AVG(${bibleRecords.price})`,
    totalPackages: sql<number>`SUM(${bibleRecords.pkgs})`,
    lotsCount: sql<number>`COUNT(*)`,
  })
  .from(bibleRecords)
  .where(and(
    params.centreId ? eq(bibleRecords.centreId, params.centreId) : undefined,
    params.mark ? eq(bibleRecords.mark, params.mark) : undefined,
    params.grade ? eq(bibleRecords.grade, params.grade) : undefined,
    isNotNull(bibleRecords.season),
  ))
  .groupBy(bibleRecords.year, bibleRecords.season, bibleRecords.category)
  .orderBy(bibleRecords.year, bibleRecords.season);
  return rows;
}

export async function getAnalyticsSoldUnsoldSummary(params: {
  centreId?: string;
  saleYear?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({
    category: bibleRecords.category,
    saleStatus: bibleRecords.saleStatus,
    count: sql<number>`COUNT(*)`,
    totalPackages: sql<number>`SUM(${bibleRecords.pkgs})`,
  })
  .from(bibleRecords)
  .where(and(
    params.centreId ? eq(bibleRecords.centreId, params.centreId) : undefined,
    params.saleYear ? eq(bibleRecords.year, params.saleYear) : undefined,
  ))
  .groupBy(bibleRecords.category, bibleRecords.saleStatus)
  .orderBy(bibleRecords.category);
  return rows;
}
