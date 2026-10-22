import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcrypt";
import prisma from "./config/db";
import { upload } from "./config/upload";

dotenv.config();

console.log("[M-Pesa config diagnostic]", {
  cwd: process.cwd(),
  envFile: require("path").resolve(".env"),
  callbackUrlPresent: Boolean(process.env.MPESA_CALLBACK_URL),
  callbackProtocol: (() => {
    try {
      return new URL(process.env.MPESA_CALLBACK_URL ?? "").protocol;
    } catch {
      return "INVALID";
    }
  })(),
  callbackHasPlaceholder: (
    process.env.MPESA_CALLBACK_URL ?? ""
  ).includes("YOUR-PUBLIC-HTTPS-URL"),
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== M-PESA HELPERS ====================

type MpesaConfig = {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  callbackUrl: string;
  transactionType: string;
  amount: number;
};

function getMpesaConfig(): MpesaConfig {
  const required: Record<string, string | undefined> = {
    MPESA_CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
    MPESA_CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
    MPESA_SHORTCODE: process.env.MPESA_SHORTCODE,
    MPESA_PASSKEY: process.env.MPESA_PASSKEY,
    MPESA_CALLBACK_URL: process.env.MPESA_CALLBACK_URL,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value?.trim())
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing M-Pesa configuration: ${missing.join(", ")}`);
  }

  if (process.env.MPESA_ENV !== "sandbox") {
    throw new Error("This integration is configured for sandbox only.");
  }

  const callbackUrl = process.env.MPESA_CALLBACK_URL!.trim();
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(callbackUrl);
  } catch {
    throw new Error("MPESA_CALLBACK_URL must be a valid public HTTPS URL.");
  }

  if (
    parsedUrl.protocol !== "https:" ||
    callbackUrl.includes("YOUR-PUBLIC-HTTPS-URL")
  ) {
    throw new Error("Configure a real public HTTPS M-Pesa callback URL.");
  }

  const amount = Number(process.env.MPESA_BOOKING_DEPOSIT ?? "5000");

  if (!Number.isInteger(amount) || amount !== 5000) {
    throw new Error("The booking deposit must be KES 5000.");
  }

  return {
    consumerKey: process.env.MPESA_CONSUMER_KEY!.trim(),
    consumerSecret: process.env.MPESA_CONSUMER_SECRET!.trim(),
    shortcode: process.env.MPESA_SHORTCODE!.trim(),
    passkey: process.env.MPESA_PASSKEY!.trim(),
    callbackUrl,
    transactionType:
      process.env.MPESA_TRANSACTION_TYPE?.trim() || "CustomerPayBillOnline",
    amount,
  };
}

function normalizeKenyanPhone(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Enter a valid Kenyan M-Pesa phone number.");
  }

  let phone = value.replace(/\D/g, "");

  if (/^0[17]\d{8}$/.test(phone)) {
    phone = `254${phone.slice(1)}`;
  } else if (/^[17]\d{8}$/.test(phone)) {
    phone = `254${phone}`;
  }

  if (!/^254[17]\d{8}$/.test(phone)) {
    throw new Error(
      "Use a valid Kenyan mobile number, e.g. 0712345678 or 254712345678."
    );
  }

  return phone;
}

function getMpesaTimestamp(): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return `${values.year}${values.month}${values.day}${values.hour}${values.minute}${values.second}`;
}

async function getMpesaAccessToken(config: MpesaConfig): Promise<string> {
  const credentials = Buffer.from(
    `${config.consumerKey}:${config.consumerSecret}`
  ).toString("base64");

  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json",
      },
    }
  );

  const responseText = await response.text();

  let data: {
    access_token?: string;
    errorMessage?: string;
    errorCode?: string;
  };

  try {
    data = JSON.parse(responseText);
  } catch {
    console.error("[M-Pesa OAuth non-JSON response]", {
      httpStatus: response.status,
      contentType: response.headers.get("content-type"),
      bodyPreview: responseText.slice(0, 300),
    });

    throw new Error(
      `M-Pesa OAuth returned non-JSON content (HTTP ${response.status}). Check the backend terminal.`
    );
  }

  console.log("[M-Pesa OAuth diagnostic]", {
    httpStatus: response.status,
    tokenReceived: Boolean(data.access_token),
    errorCode: data.errorCode ?? null,
    errorMessage: data.errorMessage ?? null,
  });

  if (!response.ok || !data.access_token) {
    throw new Error(
      `M-Pesa authentication failed (HTTP ${response.status}): ${
        data.errorMessage || data.errorCode || "No access token returned"
      }`
    );
  }

  return data.access_token;
}

function mpesaAck(res: Response) {
  return res.status(200).json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
}

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to Youngsters Sounds Entertainment API 🎧🔥",
    version: "1.0.0",
  });
});

// ==================== MIXES ROUTES ====================

app.get("/api/mixes", async (req: Request, res: Response) => {
  try {
    const mixes = await prisma.mix.findMany({
      include: { comments: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: mixes });
  } catch (error) {
    console.error("Detailed Mix Fetch Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch mixes",
      details: String(error),
    });
  }
});

app.get("/api/mixes/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid mix ID",
      });
    }

    const mix = await prisma.mix.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!mix) {
      return res.status(404).json({
        success: false,
        error: "Mix not found",
      });
    }

    res.json({ success: true, data: mix });
  } catch (error) {
    console.error("Detailed Single Mix Fetch Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch mix details",
      details: String(error),
    });
  }
});

app.post(
  "/api/mixes/upload",
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      const { title, genre, djName, duration } = req.body;

      if (!files?.audio || files.audio.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Audio file is required",
        });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const audioUrl = `${baseUrl}/uploads/audio/${files.audio[0].filename}`;

      const coverArtUrl = files.cover?.[0]
        ? `${baseUrl}/uploads/covers/${files.cover[0].filename}`
        : null;

      const newMix = await prisma.mix.create({
        data: {
          title,
          genre,
          djName: djName || "DJ Derick",
          audioUrl,
          coverArtUrl,
          duration: duration ? parseInt(duration, 10) : null,
        },
      });

      res.status(201).json({ success: true, data: newMix });
    } catch (error) {
      console.error("Detailed Mix Upload Error:", error);
      res.status(400).json({
        success: false,
        error: "Failed to upload mix",
        details: String(error),
      });
    }
  }
);

app.post("/api/mixes", async (req: Request, res: Response) => {
  try {
    const { title, genre, djName, audioUrl, coverArtUrl, duration } = req.body;

    const newMix = await prisma.mix.create({
      data: {
        title,
        genre,
        djName: djName || "DJ Derick",
        audioUrl,
        coverArtUrl,
        duration: duration ? parseInt(duration, 10) : null,
      },
    });

    res.status(201).json({ success: true, data: newMix });
  } catch (error) {
    console.error("Detailed Mix Creation Error:", error);
    res.status(400).json({
      success: false,
      error: "Failed to create mix",
      details: String(error),
    });
  }
});

// ==================== COMMENTS ROUTES ====================

app.post(
  "/api/mixes/:mixId/comments",
  async (req: Request, res: Response) => {
    try {
      const mixId = req.params.mixId;

      if (typeof mixId !== "string") {
        return res.status(400).json({
          success: false,
          error: "Invalid mix ID",
        });
      }

      const { userName, content } = req.body;

      const mixExists = await prisma.mix.findUnique({
        where: { id: mixId },
      });

      if (!mixExists) {
        return res.status(404).json({
          success: false,
          error: "Mix not found",
        });
      }

      const comment = await prisma.comment.create({
        data: {
          userName: userName || "Anonymous Fan",
          content,
          mixId,
        },
      });

      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      console.error("Detailed Comment Creation Error:", error);
      res.status(400).json({
        success: false,
        error: "Failed to post comment",
        details: String(error),
      });
    }
  }
);

// ==================== BOOKINGS ROUTES ====================

app.get("/api/bookings", async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { eventDate: "asc" },
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Detailed Bookings Fetch Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookings",
      details: String(error),
    });
  }
});

app.post("/api/bookings", async (req: Request, res: Response) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      eventType,
      eventDate,
      location,
      notes,
    } = req.body;

    const booking = await prisma.booking.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        eventType,
        eventDate: new Date(eventDate),
        location,
        notes,
      },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error("Detailed Booking Creation Error:", error);
    res.status(400).json({
      success: false,
      error: "Failed to submit booking request",
      details: String(error),
    });
  }
});

app.patch(
  "/api/bookings/:id/status",
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          error: "Invalid booking ID",
        });
      }

      const { status } = req.body;

      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { status },
      });

      res.json({ success: true, data: updatedBooking });
    } catch (error) {
      console.error("Detailed Booking Status Update Error:", error);
      res.status(400).json({
        success: false,
        error: "Failed to update booking status",
        details: String(error),
      });
    }
  }
);

// ==================== M-PESA PAYMENT ROUTES ====================

app.post(
  "/api/bookings/:id/payment/stkpush",
  async (req: Request, res: Response) => {
    let paymentId: string | undefined;

    try {
      const id = req.params.id;

      if (typeof id !== "string") {
        return res.status(400).json({ success: false, error: "Invalid booking ID" });
      }

      const config = getMpesaConfig();
      const phoneNumber = normalizeKenyanPhone(req.body?.phoneNumber);

      const booking = await prisma.booking.findUnique({ where: { id } });

      if (!booking) {
        return res.status(404).json({ success: false, error: "Booking not found" });
      }

      if (booking.status === "CONFIRMED") {
        return res.status(409).json({
          success: false,
          error: "This booking is already confirmed.",
        });
      }

      const existingPayment = await prisma.payment.findFirst({
        where: { bookingId: id, status: "PENDING" },
        orderBy: { createdAt: "desc" },
      });

      if (existingPayment) {
        return res.status(409).json({
          success: false,
          error: "A payment is already pending for this booking.",
          paymentId: existingPayment.id,
        });
      }

      const payment = await prisma.payment.create({
        data: {
          bookingId: id,
          amount: config.amount,
          phoneNumber,
          status: "PENDING",
        },
      });
      paymentId = payment.id;

      const timestamp = getMpesaTimestamp();
      const password = Buffer.from(
        `${config.shortcode}${config.passkey}${timestamp}`
      ).toString("base64");
      const accessToken = await getMpesaAccessToken(config);

      const stkResponse = await fetch(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            BusinessShortCode: config.shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: config.transactionType,
            Amount: config.amount,
            PartyA: phoneNumber,
            PartyB: config.shortcode,
            PhoneNumber: phoneNumber,
            CallBackURL: config.callbackUrl,
            AccountReference: `DJ${payment.id.replace(/-/g, "").slice(0, 10)}`,
            TransactionDesc: "DJ booking deposit",
          }),
        }
      );

      const stkResponseText = await stkResponse.text();

      let stkData: {
        ResponseCode?: string;
        ResponseDescription?: string;
        CustomerMessage?: string;
        errorMessage?: string;
        MerchantRequestID?: string;
        CheckoutRequestID?: string;
      };

      try {
        stkData = JSON.parse(stkResponseText);
      } catch {
        console.error("[M-Pesa STK non-JSON response]", {
          httpStatus: stkResponse.status,
          contentType: stkResponse.headers.get("content-type"),
          bodyPreview: stkResponseText.slice(0, 300),
        });

        throw new Error(
          `Safaricom STK endpoint returned non-JSON content (HTTP ${stkResponse.status}). Check the backend terminal for response details.`
        );
      }

      console.log("[M-Pesa STK diagnostic]", {
        httpStatus: stkResponse.status,
        contentType: stkResponse.headers.get("content-type"),
        responseCode: stkData.ResponseCode ?? null,
        responseDescription: stkData.ResponseDescription ?? null,
        errorMessage: stkData.errorMessage ?? null,
      });

      if (!stkResponse.ok || stkData.ResponseCode !== "0" || !stkData.CheckoutRequestID) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
            resultDescription:
              stkData.errorMessage ||
              stkData.ResponseDescription ||
              "STK Push request was rejected.",
          },
        });

        return res.status(502).json({
          success: false,
          error: "Safaricom did not accept the STK Push request.",
          details: stkData.errorMessage || stkData.ResponseDescription || undefined,
        });
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          merchantRequestId: stkData.MerchantRequestID,
          checkoutRequestId: stkData.CheckoutRequestID,
        },
      });

      return res.status(200).json({
        success: true,
        message:
          stkData.CustomerMessage ||
          "STK Push initiated. Check your phone and enter your M-Pesa PIN.",
        paymentId: payment.id,
        amount: config.amount,
        currency: "KES",
      });
    } catch (error) {
      console.error("M-Pesa STK Push error:", error);

      return res.status(502).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not confirm the STK Push request outcome.",
        ...(paymentId ? { paymentId } : {}),
      });
    }
  }
);

app.post("/api/mpesa/callback", async (req: Request, res: Response) => {
  try {
    const callback = req.body?.Body?.stkCallback;

    if (!callback?.CheckoutRequestID) {
      console.warn("Received malformed M-Pesa callback.");
      return mpesaAck(res);
    }

    const checkoutRequestId = String(callback.CheckoutRequestID);
    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestId },
    });

    if (!payment) {
      console.warn("M-Pesa callback did not match a payment.");
      return mpesaAck(res);
    }

    if (payment.status === "SUCCESS") {
      return mpesaAck(res);
    }

    const resultCode = Number(callback.ResultCode);
    const resultDescription = String(
      callback.ResultDesc || "No result description provided."
    );

    if (resultCode !== 0) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", resultCode, resultDescription },
      });
      console.log(`M-Pesa payment failed for payment ${payment.id}.`);
      return mpesaAck(res);
    }

    const items: Array<{ Name?: string; Value?: unknown }> =
      callback.CallbackMetadata?.Item || [];
    const metadata = new Map(items.map((item) => [item.Name, item.Value]));
    const paidAmount = Number(metadata.get("Amount"));
    const receipt = metadata.get("MpesaReceiptNumber");
    const callbackPhone = metadata.get("PhoneNumber");

    if (
      paidAmount !== payment.amount ||
      typeof receipt !== "string" ||
      !receipt.trim()
    ) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          resultCode,
          resultDescription:
            "Callback amount or receipt did not match the expected payment.",
        },
      });
      console.error(`M-Pesa callback validation failed for payment ${payment.id}.`);
      return mpesaAck(res);
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          resultCode,
          resultDescription,
          mpesaReceiptNumber: receipt.trim(),
          ...(callbackPhone !== undefined
            ? { phoneNumber: String(callbackPhone) }
            : {}),
        },
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
      });
    });

    console.log(`M-Pesa payment confirmed for payment ${payment.id}.`);
    return mpesaAck(res);
  } catch (error) {
    console.error("M-Pesa callback processing error:", error);
    return res.status(500).json({ ResultCode: 1, ResultDesc: "Processing failed" });
  }
});

// ==================== ADMIN LOGIN ====================

app.post("/api/admin/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid administrator credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid administrator credentials." });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Access denied. Not an administrator." });
    }

    return res.json({
      success: true,
      message: "Admin authenticated successfully",
      admin: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(
    `🚀 Youngsters Sounds server running on http://localhost:${PORT}`
  );
});

// ==================== DYNAMIC SERVICES ROUTES ====================

// Get all active company services
app.get("/api/services", async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { isAvailable: true },
      orderBy: { category: "asc" }
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch services" });
  }
});

// Admin: Add or update a service
app.post("/api/admin/services", async (req: Request, res: Response) => {
  try {
    const { name, category, description, basePrice, unit, imageUrl } = req.body;
    const service = await prisma.service.create({
      data: { name, category, description, basePrice: Number(basePrice), unit, imageUrl }
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to create service" });
  }
});

// Admin: Delete service
app.delete("/api/admin/services/:id", async (req: Request, res: Response) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to delete service" });
  }
});

// ==================== PORTFOLIO / EVENT HISTORY ====================

app.get("/api/portfolio", async (req: Request, res: Response) => {
  try {
    const portfolio = await prisma.eventPortfolio.findMany({
      orderBy: { eventDate: "desc" }
    });
    res.json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch portfolio" });
  }
});

app.post("/api/admin/portfolio", async (req: Request, res: Response) => {
  try {
    const { title, eventType, location, eventDate, description, imageUrl, videoUrl } = req.body;
    const item = await prisma.eventPortfolio.create({
      data: { title, eventType, location, eventDate: new Date(eventDate), description, imageUrl, videoUrl }
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to add portfolio item" });
  }
});

// ==================== DYNAMIC BOOKING & PAYMENT ====================

app.post("/api/bookings/multi-service", async (req: Request, res: Response) => {
  try {
    const { clientName, clientEmail, clientPhone, eventType, eventDate, location, notes, selectedServices } = req.body;

    // Calculate dynamic total price
    let totalAmount = 0;
    const serviceRecords = [];

    for (const item of selectedServices) {
      const srv = await prisma.service.findUnique({ where: { id: item.serviceId } });
      if (srv) {
        const linePrice = srv.basePrice * (item.quantity || 1);
        totalAmount += linePrice;
        serviceRecords.push({
          serviceId: srv.id,
          quantity: item.quantity || 1,
          price: linePrice
        });
      }
    }

    const booking = await prisma.booking.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        eventType,
        eventDate: new Date(eventDate),
        location,
        notes,
        totalAmount,
        services: { create: serviceRecords }
      },
      include: { services: { include: { service: true } } }
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to build dynamic booking" });
  }
});