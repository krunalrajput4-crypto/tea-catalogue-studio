import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  date,
  json,
} from "drizzle-orm/mysql-core";

// ─────────────────────────────────────────────
// USERS & ROLES
// ─────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["superadmin", "admin", "manager", "taster", "viewer"]).default("viewer").notNull(),
  centreId: varchar("centreId", { length: 32 }),
  region: mysqlEnum("region", ["north", "south"]),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─────────────────────────────────────────────
// AUCTION CENTRES
// ─────────────────────────────────────────────
export const centres = mysqlTable("centres", {
  id: varchar("id", { length: 32 }).primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  fullName: varchar("fullName", { length: 256 }),
  region: mysqlEnum("region", ["north", "south"]).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// SALES
// ─────────────────────────────────────────────
export const sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  centreId: varchar("centreId", { length: 32 }).notNull(),
  saleNo: int("saleNo").notNull(),
  saleYear: int("saleYear").notNull(),
  saleLabel: varchar("saleLabel", { length: 32 }),
  viewType: mysqlEnum("viewType", ["auctions", "private"]).default("auctions").notNull(),
  auctionDate: date("auctionDate"),
  weekNo: int("weekNo"),
  weekLabel: varchar("weekLabel", { length: 32 }),
  status: mysqlEnum("status", ["open", "locked", "post_auction", "settled"]).default("open").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// ARRIVALS (from MyArrivals master file upload)
// ─────────────────────────────────────────────
export const arrivals = mysqlTable("arrivals", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  centreId: varchar("centreId", { length: 32 }).notNull(),
  saleNo: int("saleNo"),
  saleYear: int("saleYear"),
  arrivalDate: date("arrivalDate"),
  unit: varchar("unit", { length: 64 }),
  arrivalNo: varchar("arrivalNo", { length: 128 }),
  mark: varchar("mark", { length: 128 }).notNull(),
  sellerName: varchar("sellerName", { length: 256 }),
  teaType: mysqlEnum("teaType", ["Leaf", "Dust", "Green"]),
  category: varchar("category", { length: 64 }),
  invoiceNo: varchar("invoiceNo", { length: 128 }),
  grade: varchar("grade", { length: 64 }),
  gpNo: varchar("gpNo", { length: 64 }),
  gpDate: date("gpDate"),
  cropYear: int("cropYear"),
  packages: int("packages"),
  serialFrom: int("serialFrom"),
  serialUpto: int("serialUpto"),
  unitLocation: varchar("unitLocation", { length: 32 }),
  eachGross: decimal("eachGross", { precision: 10, scale: 3 }),
  eachNet: decimal("eachNet", { precision: 10, scale: 3 }),
  os: int("os").default(0),
  br: int("br").default(0),
  ws: int("ws").default(0),
  tr: int("tr").default(0),
  nr: int("nr").default(0),
  shortage: decimal("shortage", { precision: 10, scale: 3 }).default("0"),
  fis: varchar("fis", { length: 8 }),
  pkgMonth: varchar("pkgMonth", { length: 32 }),
  ewayBillNo: varchar("ewayBillNo", { length: 64 }),
  ewayBillDate: date("ewayBillDate"),
  packageSize: decimal("packageSize", { precision: 10, scale: 3 }),
  packageType: varchar("packageType", { length: 32 }),
  remarks: text("remarks"),
  totalNetWeight: decimal("totalNetWeight", { precision: 12, scale: 3 }),
  isNewGarden: boolean("isNewGarden").default(false),
  awrType: mysqlEnum("awrType", ["ALPHA", "NUM", "OTHER"]),
  categorizationStatus: mysqlEnum("categorizationStatus", ["pending", "auto", "manual", "confirmed"]).default("pending"),
  allocationStatus: mysqlEnum("allocationStatus", ["pending", "allocated", "excluded"]).default("pending"),
  saleAllocation: mysqlEnum("saleAllocation", ["MAIN", "SUPPLEMENTARY", "EXCLUDED"]),
  salePart: mysqlEnum("salePart", ["I", "II"]),
  sopRuleApplied: varchar("sopRuleApplied", { length: 32 }),
  uploadBatchId: varchar("uploadBatchId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// CARRY-FORWARD STOCK
// ─────────────────────────────────────────────
export const carryForwardStock = mysqlTable("carry_forward_stock", {
  id: int("id").autoincrement().primaryKey(),
  centreId: varchar("centreId", { length: 32 }).notNull(),
  currentSaleId: int("currentSaleId").notNull(),
  fromSaleId: int("fromSaleId"),
  fromSaleLabel: varchar("fromSaleLabel", { length: 32 }),
  mark: varchar("mark", { length: 128 }).notNull(),
  grade: varchar("grade", { length: 64 }),
  category: varchar("category", { length: 64 }),
  teaType: varchar("teaType", { length: 32 }),
  packages: int("packages"),
  netWeight: decimal("netWeight", { precision: 12, scale: 3 }),
  reason: mysqlEnum("reason", ["unsold", "withdrawn", "partial"]).default("unsold"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// LOTS (generated in Tables/Review step)
// ─────────────────────────────────────────────
export const lots = mysqlTable("lots", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  centreId: varchar("centreId", { length: 32 }).notNull(),
  lotNo: varchar("lotNo", { length: 32 }).notNull(),
  arrivalId: int("arrivalId"),
  mark: varchar("mark", { length: 128 }).notNull(),
  sellerName: varchar("sellerName", { length: 256 }),
  invoiceNo: varchar("invoiceNo", { length: 128 }),
  grade: varchar("grade", { length: 64 }),
  category: varchar("category", { length: 64 }),
  teaType: varchar("teaType", { length: 32 }),
  packages: int("packages"),
  netWeight: decimal("netWeight", { precision: 12, scale: 3 }),
  invoiceWeight: decimal("invoiceWeight", { precision: 12, scale: 3 }),
  grossWeight: decimal("grossWeight", { precision: 12, scale: 3 }),
  sampleQty: decimal("sampleQty", { precision: 8, scale: 3 }),
  gpNo: varchar("gpNo", { length: 64 }),
  gpDate: date("gpDate"),
  packageType: varchar("packageType", { length: 32 }),
  packageNo: varchar("packageNo", { length: 64 }),
  origin: varchar("origin", { length: 128 }),
  saleAllocation: mysqlEnum("saleAllocation", ["MAIN", "SUPPLEMENTARY"]),
  salePart: mysqlEnum("salePart", ["I", "II"]),
  gardenRank: int("gardenRank"),
  lotSequence: int("lotSequence"),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }),
  reservePrice: decimal("reservePrice", { precision: 10, scale: 2 }),
  auctioneerValuation: decimal("auctioneerValuation", { precision: 10, scale: 2 }),
  musterValue: decimal("musterValue", { precision: 10, scale: 2 }),
  limitPrice: decimal("limitPrice", { precision: 10, scale: 2 }),
  lspSp: varchar("lspSp", { length: 32 }),
  worth: decimal("worth", { precision: 10, scale: 2 }),
  limitsSI: varchar("limitsSI", { length: 64 }),
  qc: varchar("qc", { length: 32 }),
  qualityComments: text("qualityComments"),
  tastingRemarks: text("tastingRemarks"),
  buyerScores: json("buyerScores"),
  soldStatus: mysqlEnum("soldStatus", ["PENDING", "SOLD", "UNSOLD", "WITHDRAWN"]).default("PENDING"),
  sellingPrice: decimal("sellingPrice", { precision: 10, scale: 2 }),
  buyerName: varchar("buyerName", { length: 256 }),
  buyerCode: varchar("buyerCode", { length: 64 }),
  sampleDrawn: boolean("sampleDrawn").default(false),
  stickerGenerated: boolean("stickerGenerated").default(false),
  sampleDespatched: boolean("sampleDespatched").default(false),
  sampleDespatchDate: date("sampleDespatchDate"),
  samplePriority: mysqlEnum("samplePriority", ["urgent", "high", "normal"]).default("normal"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// BIBLE / AWR REFERENCE DATA
// ─────────────────────────────────────────────
export const bibleRecords = mysqlTable("bible_records", {
  id: int("id").autoincrement().primaryKey(),
  centreId: varchar("centreId", { length: 32 }),
  year: int("year").notNull(),
  awrNo: varchar("awrNo", { length: 128 }),
  awrDate: date("awrDate"),
  awrRemarks: text("awrRemarks"),
  season: int("season"),
  category: varchar("category", { length: 64 }),
  saleType: varchar("saleType", { length: 32 }),
  provisionalSaleNo: decimal("provisionalSaleNo", { precision: 8, scale: 1 }),
  sellerName: varchar("sellerName", { length: 256 }),
  mark: varchar("mark", { length: 128 }),
  invoice: varchar("invoice", { length: 128 }),
  gpNo: varchar("gpNo", { length: 64 }),
  gpDate: date("gpDate"),
  grade: varchar("grade", { length: 64 }),
  packageFrom: int("packageFrom"),
  packageTo: int("packageTo"),
  pkgs: int("pkgs"),
  grossWeight: decimal("grossWeight", { precision: 10, scale: 2 }),
  netWeight: decimal("netWeight", { precision: 10, scale: 2 }),
  sampleWeight: decimal("sampleWeight", { precision: 8, scale: 2 }),
  sortWeight: decimal("sortWeight", { precision: 8, scale: 2 }),
  totalNetWeight: decimal("totalNetWeight", { precision: 12, scale: 2 }),
  bagType: varchar("bagType", { length: 16 }),
  bagStatus: varchar("bagStatus", { length: 16 }),
  saleStatus: varchar("saleStatus", { length: 64 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  saleDate: varchar("saleDate", { length: 32 }),
  aucSaleNo: varchar("aucSaleNo", { length: 32 }),
  aucLotNo: decimal("aucLotNo", { precision: 10, scale: 1 }),
  aucPkgs: decimal("aucPkgs", { precision: 10, scale: 1 }),
  aucInvWt: decimal("aucInvWt", { precision: 12, scale: 2 }),
  aucPrice: decimal("aucPrice", { precision: 10, scale: 2 }),
  aucLastSaleNo: varchar("aucLastSaleNo", { length: 32 }),
  aucValuation: decimal("aucValuation", { precision: 10, scale: 2 }),
  buyer1: varchar("buyer1", { length: 256 }),
  buyer2: varchar("buyer2", { length: 256 }),
  buyer3: varchar("buyer3", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// SOP ALLOCATION RULES
// ─────────────────────────────────────────────
export const sopRules = mysqlTable("sop_rules", {
  id: int("id").autoincrement().primaryKey(),
  centreId: varchar("centreId", { length: 32 }),
  ruleNo: int("ruleNo").notNull(),
  ruleName: varchar("ruleName", { length: 256 }).notNull(),
  description: text("description"),
  conditions: json("conditions").notNull(),
  allocation: mysqlEnum("allocation", ["MAIN", "SUPPLEMENTARY", "EXCLUDED"]).notNull(),
  salePart: mysqlEnum("salePart", ["I", "II"]),
  priority: int("priority").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// UPLOAD BATCHES
// ─────────────────────────────────────────────
export const uploadBatches = mysqlTable("upload_batches", {
  id: varchar("id", { length: 64 }).primaryKey(),
  centreId: varchar("centreId", { length: 32 }).notNull(),
  saleId: int("saleId"),
  fileName: varchar("fileName", { length: 256 }),
  fileUrl: varchar("fileUrl", { length: 1024 }),
  fileKey: varchar("fileKey", { length: 512 }),
  totalRows: int("totalRows").default(0),
  processedRows: int("processedRows").default(0),
  errorRows: int("errorRows").default(0),
  newGardensDetected: int("newGardensDetected").default(0),
  status: mysqlEnum("status", ["uploading", "processing", "completed", "failed"]).default("uploading"),
  errors: json("errors"),
  uploadedBy: int("uploadedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// CATALOGUES
// ─────────────────────────────────────────────
export const catalogues = mysqlTable("catalogues", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  centreId: varchar("centreId", { length: 32 }).notNull(),
  catalogueType: mysqlEnum("catalogueType", ["kutcha", "trade", "tasting", "limits"]).notNull(),
  status: mysqlEnum("status", ["draft", "ready", "published"]).default("draft"),
  fileUrl: varchar("fileUrl", { length: 1024 }),
  fileKey: varchar("fileKey", { length: 512 }),
  lotCount: int("lotCount").default(0),
  generatedBy: int("generatedBy"),
  generatedAt: timestamp("generatedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// GARDEN MASTER
// ─────────────────────────────────────────────
export const gardenMaster = mysqlTable("garden_master", {
  id: int("id").autoincrement().primaryKey(),
  mark: varchar("mark", { length: 128 }).notNull().unique(),
  sellerName: varchar("sellerName", { length: 256 }),
  region: varchar("region", { length: 128 }),
  centreId: varchar("centreId", { length: 32 }),
  category: varchar("category", { length: 64 }),
  certifications: json("certifications"),
  firstSeenSale: varchar("firstSeenSale", { length: 32 }),
  lastSeenSale: varchar("lastSeenSale", { length: 32 }),
  totalLotsAllTime: int("totalLotsAllTime").default(0),
  avgPriceAllTime: decimal("avgPriceAllTime", { precision: 10, scale: 2 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─────────────────────────────────────────────
// BUYER MASTER
// ─────────────────────────────────────────────
export const buyerMaster = mysqlTable("buyer_master", {
  id: int("id").autoincrement().primaryKey(),
  buyerCode: varchar("buyerCode", { length: 64 }).unique(),
  buyerName: varchar("buyerName", { length: 256 }).notNull(),
  centreId: varchar("centreId", { length: 32 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// AUCTION RESULTS (post-auction)
// ─────────────────────────────────────────────
export const auctionResults = mysqlTable("auction_results", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  centreId: varchar("centreId", { length: 32 }).notNull(),
  lotId: int("lotId").notNull(),
  lotNo: varchar("lotNo", { length: 32 }),
  mark: varchar("mark", { length: 128 }),
  grade: varchar("grade", { length: 64 }),
  packages: int("packages"),
  netWeight: decimal("netWeight", { precision: 12, scale: 3 }),
  limitPrice: decimal("limitPrice", { precision: 10, scale: 2 }),
  sellingPrice: decimal("sellingPrice", { precision: 10, scale: 2 }),
  buyerName: varchar("buyerName", { length: 256 }),
  buyerCode: varchar("buyerCode", { length: 64 }),
  soldStatus: mysqlEnum("soldStatus", ["SOLD", "UNSOLD", "WITHDRAWN"]).notNull(),
  revenue: decimal("revenue", { precision: 14, scale: 2 }),
  importedAt: timestamp("importedAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// CENTRE SETTINGS
// ─────────────────────────────────────────────
export const centreSettings = mysqlTable("centre_settings", {
  id: int("id").autoincrement().primaryKey(),
  centreId: varchar("centreId", { length: 32 }).notNull().unique(),
  autoCategorizationEnabled: boolean("autoCategorizationEnabled").default(true),
  newGardenDetectionEnabled: boolean("newGardenDetectionEnabled").default(true),
  duplicateAwrDetectionEnabled: boolean("duplicateAwrDetectionEnabled").default(true),
  minLotSizeCtcLeaf: int("minLotSizeCtcLeaf").default(10),
  minLotSizeCtcDust: int("minLotSizeCtcDust").default(10),
  minLotSizeOrthLeaf: int("minLotSizeOrthLeaf").default(5),
  minLotSizeOrthDust: int("minLotSizeOrthDust").default(5),
  currentSaleNo: int("currentSaleNo"),
  currentSaleYear: int("currentSaleYear"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
