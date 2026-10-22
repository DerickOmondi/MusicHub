import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ================= M-PESA STK PUSH ENDPOINT =================
app.post("/api/mpesa/stkpush", async (req: express.Request, res: express.Response) => {
  try {
    const { phoneNumber, amount } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }

    let formattedPhone = phoneNumber.trim().replace("+", "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = `254${formattedPhone.substring(1)}`;
    }

    console.log(`[M-PESA STK PUSH] Received KES ${amount || 100} request for phone: ${formattedPhone}`);

    // Simulate successful M-Pesa Daraja STK Push response
    return res.status(200).json({
      success: true,
      message: `STK push successfully sent to ${formattedPhone}. Please check your phone to enter your M-Pesa PIN.`,
      checkoutRequestId: `ws_CO_${Date.now()}`
    });

  } catch (error) {
    console.error("M-Pesa error:", error);
    return res.status(500).json({ success: false, message: "Internal server error during M-Pesa processing." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Youngsters Sounds server running on http://localhost:${PORT}`);
});