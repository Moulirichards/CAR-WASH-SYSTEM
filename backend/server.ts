import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Type declaration for global mongoose cache
declare global {
  var mongoose: any;
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sparkle-drive";
mongoose.set("strictQuery", true);

// Cache the connection to avoid reconnecting on each request in serverless
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("MongoDB connection error", err);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    // Accept any object shape for carDetails to avoid cast issues
    carDetails: { type: Schema.Types.Mixed, default: {} },
    serviceType: String,
    date: Date,
    timeSlot: String,
    duration: Number,
    price: Number,
    status: String,
    rating: Number,
    addOns: [String],
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

// Helpers
function parsePagination(req: express.Request) {
  const page = Math.max(parseInt(String(req.query.page || 1)), 1);
  const pageSize = Math.max(Math.min(parseInt(String(req.query.pageSize || 10)), 50), 1);
  return { page, pageSize };
}

// Validation schemas
const carDetailsSchema = z
  .object({
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().int().optional(),
    type: z.string().optional(),
  })
  .passthrough()
  .optional();

const createBookingSchema = z.object({
  customerName: z.string().min(1),
  carDetails: carDetailsSchema,
  serviceType: z.string().optional(),
  date: z.union([z.string(), z.date()]).optional(),
  timeSlot: z.string().optional(),
  duration: z.union([z.string(), z.number()]).optional(),
  price: z.union([z.string(), z.number()]).optional(),
  status: z.string().optional(),
  rating: z.union([z.number(), z.null()]).optional(),
  addOns: z.array(z.string()).optional(),
});

const updateBookingSchema = createBookingSchema.partial();

// Create
app.post("/api/bookings", async (req, res) => {
  try {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
    }
    req.body = parsed.data;
    // Coerce carDetails if client sends a string
    if (typeof req.body?.carDetails === "string") {
      req.body.carDetails = { make: String(req.body.carDetails), type: req.body.carType };
    }
    // Ensure numeric types where expected
    if (typeof req.body?.duration === "string") req.body.duration = Number(req.body.duration);
    if (typeof req.body?.price === "string") req.body.price = Number(req.body.price);
    if (typeof req.body?.date === "string") req.body.date = new Date(req.body.date);

    // Sanitize invalid values so validation doesn't fail on casts
    if (typeof req.body?.price !== "number" || Number.isNaN(req.body.price)) {
      delete req.body.price;
    }
    if (typeof req.body?.duration !== "number" || Number.isNaN(req.body.duration)) {
      delete req.body.duration;
    }
    if (req.body?.date instanceof Date) {
      if (Number.isNaN(req.body.date.getTime())) delete req.body.date;
    }

    // Default status if missing
    if (!req.body?.status) {
      req.body.status = "Pending";
    }
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (e: any) {
    console.error("Create booking error:", e);
    if (e?.name === "ValidationError" && e?.errors) {
      const details = Object.fromEntries(
        Object.entries(e.errors).map(([k, v]: any) => [k, v?.message || String(v)])
      );
      return res.status(400).json({ error: e.message, details });
    }
    res.status(400).json({ error: e?.message || "Bad Request" });
  }
});

// Read (list with filters/search/sort)
app.get("/api/bookings", async (req, res) => {
  try {
    const { page, pageSize } = parsePagination(req);
    const skip = (page - 1) * pageSize;

    const {
      q,
      serviceType,
      carType,
      status,
      dateFrom,
      dateTo,
      sort = "-date",
    } = req.query as Record<string, string>;

    const filter: any = {};
    if (serviceType && serviceType !== "all") filter.serviceType = serviceType;
    if (carType && carType !== "all") filter["carDetails.type"] = carType;
    if (status && status !== "all") filter.status = status;
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    if (q) {
      filter.$or = [
        { customerName: { $regex: q, $options: "i" } },
        { "carDetails.make": { $regex: q, $options: "i" } },
        { "carDetails.model": { $regex: q, $options: "i" } },
      ];
    }

    const sortObj: any = {};
    const sortFields = Array.isArray(sort) ? sort : String(sort).split(",");
    for (const f of sortFields) {
      if (!f) continue;
      if (f.startsWith("-")) sortObj[f.slice(1)] = -1;
      else sortObj[f] = 1;
    }

    const [items, total] = await Promise.all([
      Booking.find(filter).sort(sortObj).skip(skip).limit(pageSize),
      Booking.countDocuments(filter),
    ]);
    res.json({ items, total, page, pageSize });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Read (detail)
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const item = await Booking.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Update
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const parsed = updateBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
    }
    req.body = parsed.data;
    const item = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Search endpoint
app.get("/api/bookings/search", async (req, res) => {
  try {
    const { q } = req.query as Record<string, string>;
    if (!q) return res.json({ items: [] });
    const items = await Booking.find({
      $or: [
        { customerName: { $regex: q, $options: "i" } },
        { "carDetails.make": { $regex: q, $options: "i" } },
        { "carDetails.model": { $regex: q, $options: "i" } },
      ],
    }).limit(20);
    res.json({ items });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Centralized error handler (fallback)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Health check endpoint to diagnose DB connectivity in production
app.get("/api/health", async (_req, res) => {
  try {
    await connectDB();
    const state = mongoose.connection.readyState; // 1 = connected, 2 = connecting
    res.json({ ok: true, mongoState: state });
  } catch (e: any) {
    console.error("Health check DB error:", e);
    res.status(500).json({ ok: false, error: e?.message || "DB error" });
  }
});

// Delete (hard)
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const item = await Booking.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// In serverless environments (e.g., Vercel), we export the app as the handler
// and avoid calling app.listen(). For local development, start the server.
const isVercel = Boolean(process.env.VERCEL);
if (!isVercel) {
  const port = Number(process.env.PORT || 3001);
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

export default app;
