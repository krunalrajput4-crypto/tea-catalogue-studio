import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  upsertUser, getUserByOpenId, getAllUsers, updateUserRole,
  getAllCentres, getCentreById, seedCentres,
  getSalesByCentre, getSaleById, createSale,
  getArrivalsBySale, getArrivalsStats, getStockSummary, createArrival, updateArrivalCategorization, updateArrivalAllocation,
  getLotsBySale, getLotById, updateLotTasting, updateLotSampling, updateLotResult,
  getSopRules, seedDefaultSopRules,
  getGardenMaster, upsertGarden,
  getBibleRecordsByMark, getBibleStats,
  createUploadBatch, updateUploadBatch, getUploadBatches,
  getCataloguesBySale,
  getAuctionResultsBySale, getAuctionResultsStats,
  getCentreSettings, upsertCentreSettings,
  getAnalyticsPriceTrend, getAnalyticsGardenPerformance, getAnalyticsBuyerPerformance,
  getAnalyticsCentreComparison, getAnalyticsGradeBreakdown, getAnalyticsSeasonalTrend,
  getAnalyticsSoldUnsoldSummary,
} from "./db";
import { categorizeArrival, getAwrType, parseCertifications } from "./lib/categorizationEngine";
import { applySopRules } from "./lib/sopEngine";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// ─── AUTH ROUTER ─────────────────────────────────────────────
const authRouter = router({
  me: publicProcedure.query(opts => opts.ctx.user),
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),
});

// ─── CENTRES ROUTER ──────────────────────────────────────────
const centresRouter = router({
  list: publicProcedure.query(async () => {
    await seedCentres();
    return getAllCentres();
  }),
  byId: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => getCentreById(input.id)),
});

// ─── SALES ROUTER ────────────────────────────────────────────
const salesRouter = router({
  byCentre: protectedProcedure
    .input(z.object({ centreId: z.string() }))
    .query(({ input }) => getSalesByCentre(input.centreId)),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getSaleById(input.id)),

  create: protectedProcedure
    .input(z.object({
      centreId: z.string(),
      saleNo: z.number(),
      saleYear: z.number(),
      viewType: z.enum(["auctions", "private"]),
      auctionDate: z.date().optional(),
      weekNo: z.number().optional(),
      weekLabel: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return createSale({ ...input, createdBy: ctx.user?.id });
    }),
});

// ─── ARRIVALS ROUTER ─────────────────────────────────────────
const arrivalsRouter = router({
  bySale: protectedProcedure
    .input(z.object({ saleId: z.number(), centreId: z.string() }))
    .query(({ input }) => getArrivalsBySale(input.saleId, input.centreId)),

  stats: protectedProcedure
    .input(z.object({ saleId: z.number(), centreId: z.string() }))
    .query(({ input }) => getArrivalsStats(input.saleId, input.centreId)),

  stockSummary: protectedProcedure
    .input(z.object({ saleId: z.number(), centreId: z.string() }))
    .query(({ input }) => getStockSummary(input.saleId, input.centreId)),

  updateCategorization: protectedProcedure
    .input(z.object({
      id: z.number(),
      category: z.string().optional(),
      teaType: z.enum(["Leaf", "Dust", "Green"]).optional(),
      categorizationStatus: z.enum(["pending", "auto", "manual", "confirmed"]).optional(),
    }))
    .mutation(({ input }) => updateArrivalCategorization(input.id, input)),

  autoCategorizeBatch: protectedProcedure
    .input(z.object({ saleId: z.number(), centreId: z.string() }))
    .mutation(async ({ input }) => {
      const arrivals = await getArrivalsBySale(input.saleId, input.centreId);
      let updated = 0;
      for (const arrival of arrivals) {
        if (arrival.categorizationStatus === "pending") {
          const result = categorizeArrival({ grade: arrival.grade, category: arrival.category, teaType: arrival.teaType });
          await updateArrivalCategorization(arrival.id, {
            category: result.category,
            teaType: result.teaType,
            categorizationStatus: "auto",
          });
          updated++;
        }
      }
      return { updated };
    }),

  applyAllSopRules: protectedProcedure
    .input(z.object({ saleId: z.number(), centreId: z.string() }))
    .mutation(async ({ input }) => {
      const [arrivals, rules] = await Promise.all([
        getArrivalsBySale(input.saleId, input.centreId),
        getSopRules(input.centreId),
      ]);
      let updated = 0;
      for (const arrival of arrivals) {
        const result = applySopRules(arrival as any, rules as any);
        await updateArrivalAllocation(arrival.id, {
          saleAllocation: result.allocation,
          salePart: result.salePart,
          sopRuleApplied: result.ruleApplied,
          allocationStatus: "allocated",
        });
        updated++;
      }
      return { updated };
    }),
});

// ─── UPLOAD ROUTER ───────────────────────────────────────────
const uploadRouter = router({
  getSignedUrl: protectedProcedure
    .input(z.object({ fileName: z.string(), centreId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const batchId = nanoid();
      const fileKey = `uploads/${input.centreId}/${batchId}-${input.fileName}`;
      // Return batch ID for tracking
      return { batchId, fileKey };
    }),

  processFile: protectedProcedure
    .input(z.object({
      batchId: z.string(),
      centreId: z.string(),
      saleId: z.number(),
      fileUrl: z.string(),
      fileKey: z.string(),
      fileName: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await createUploadBatch({
        id: input.batchId,
        centreId: input.centreId,
        saleId: input.saleId,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        fileKey: input.fileKey,
        uploadedBy: ctx.user?.id,
      });
      // In production, this would trigger background processing
      // For now, mark as completed
      await updateUploadBatch(input.batchId, { status: "completed" });
      return { success: true, batchId: input.batchId };
    }),

  history: protectedProcedure
    .input(z.object({ centreId: z.string() }))
    .query(({ input }) => getUploadBatches(input.centreId)),
});

// ─── LOTS ROUTER ─────────────────────────────────────────────
const lotsRouter = router({
  bySale: protectedProcedure
    .input(z.object({ saleId: z.number(), centreId: z.string() }))
    .query(({ input }) => getLotsBySale(input.saleId, input.centreId)),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getLotById(input.id)),

  updateTasting: protectedProcedure
    .input(z.object({
      id: z.number(),
      musterValue: z.string().optional(),
      limitPrice: z.string().optional(),
      basePrice: z.string().optional(),
      reservePrice: z.string().optional(),
      auctioneerValuation: z.string().optional(),
      worth: z.string().optional(),
      lspSp: z.string().optional(),
      limitsSI: z.string().optional(),
      qc: z.string().optional(),
      qualityComments: z.string().optional(),
      tastingRemarks: z.string().optional(),
      buyerScores: z.record(z.string(), z.number()).optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateLotTasting(id, data as any);
    }),

  updateSampling: protectedProcedure
    .input(z.object({
      id: z.number(),
      sampleDrawn: z.boolean().optional(),
      stickerGenerated: z.boolean().optional(),
      sampleDespatched: z.boolean().optional(),
      sampleDespatchDate: z.date().optional(),
      samplePriority: z.enum(["urgent", "high", "normal"]).optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateLotSampling(id, data);
    }),

  updateResult: protectedProcedure
    .input(z.object({
      id: z.number(),
      soldStatus: z.enum(["PENDING", "SOLD", "UNSOLD", "WITHDRAWN"]).optional(),
      sellingPrice: z.string().optional(),
      buyerName: z.string().optional(),
      buyerCode: z.string().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateLotResult(id, data as any);
    }),
});

// ─── SOP RULES ROUTER ────────────────────────────────────────
const sopRouter = router({
  list: protectedProcedure
    .input(z.object({ centreId: z.string().optional() }))
    .query(async ({ input }) => {
      await seedDefaultSopRules();
      return getSopRules(input.centreId);
    }),
});

// ─── GARDEN MASTER ROUTER ────────────────────────────────────
const gardensRouter = router({
  list: protectedProcedure
    .input(z.object({ centreId: z.string().optional() }))
    .query(({ input }) => getGardenMaster(input.centreId)),

  bibleHistory: protectedProcedure
    .input(z.object({ mark: z.string() }))
    .query(({ input }) => getBibleRecordsByMark(input.mark)),

  bibleStats: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(({ input }) => getBibleStats(input.year)),
});

// ─── CATALOGUES ROUTER ───────────────────────────────────────
const cataloguesRouter = router({
  bySale: protectedProcedure
    .input(z.object({ saleId: z.number() }))
    .query(({ input }) => getCataloguesBySale(input.saleId)),
});

// ─── POST-AUCTION ROUTER ─────────────────────────────────────
const postAuctionRouter = router({
  results: protectedProcedure
    .input(z.object({ saleId: z.number(), centreId: z.string() }))
    .query(({ input }) => getAuctionResultsBySale(input.saleId, input.centreId)),

  stats: protectedProcedure
    .input(z.object({ saleId: z.number(), centreId: z.string() }))
    .query(({ input }) => getAuctionResultsStats(input.saleId, input.centreId)),
});

// ─── SETTINGS ROUTER ─────────────────────────────────────────
const settingsRouter = router({
  get: protectedProcedure
    .input(z.object({ centreId: z.string() }))
    .query(({ input }) => getCentreSettings(input.centreId)),

  update: protectedProcedure
    .input(z.object({
      centreId: z.string(),
      autoCategorizationEnabled: z.boolean().optional(),
      newGardenDetectionEnabled: z.boolean().optional(),
      duplicateAwrDetectionEnabled: z.boolean().optional(),
      minLotSizeCtcLeaf: z.number().optional(),
      minLotSizeCtcDust: z.number().optional(),
      minLotSizeOrthLeaf: z.number().optional(),
      minLotSizeOrthDust: z.number().optional(),
      currentSaleNo: z.number().optional(),
      currentSaleYear: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { centreId, ...data } = input;
      await upsertCentreSettings(centreId, data);
      return { success: true };
    }),
});

// ─── USERS ROUTER ────────────────────────────────────────────
const usersRouter = router({
  list: protectedProcedure.query(() => getAllUsers()),
  updateRole: protectedProcedure
    .input(z.object({ userId: z.number(), role: z.enum(["superadmin", "admin", "manager", "taster", "viewer"]) }))
    .mutation(({ input }) => updateUserRole(input.userId, input.role)),
});

// ─── ANALYTICS ROUTER ────────────────────────────────────────
const analyticsRouter = router({
  bibleStats: protectedProcedure
    .input(z.object({ year: z.number() }))
    .query(({ input }) => getBibleStats(input.year)),

  saleStats: protectedProcedure
    .input(z.object({ saleId: z.number(), centreId: z.string() }))
    .query(async ({ input }) => {
      const [arrivals, results] = await Promise.all([
        getArrivalsStats(input.saleId, input.centreId),
        getAuctionResultsStats(input.saleId, input.centreId),
      ]);
      return { arrivals, results };
    }),
});

// ─── APP ROUTER ──────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  centres: centresRouter,
  sales: salesRouter,
  arrivals: arrivalsRouter,
  upload: uploadRouter,
  lots: lotsRouter,
  sop: sopRouter,
  gardens: gardensRouter,
  catalogues: cataloguesRouter,
  postAuction: postAuctionRouter,
  settings: settingsRouter,
  users: usersRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
