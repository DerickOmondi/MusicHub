import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const audioDir = path.join(process.cwd(), "uploads", "audio");
const coverDir = path.join(process.cwd(), "uploads", "covers");

if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir, { recursive: true });

// Disk Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") {
      cb(null, audioDir);
    } else if (file.fieldname === "cover") {
      cb(null, coverDir);
    } else {
      cb(new Error("Invalid field name"), "");
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File Filter for Security
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === "audio") {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files (MP3, WAV, AAC) are allowed!"));
    }
  } else if (file.fieldname === "cover") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPG, PNG, WEBP) are allowed!"));
    }
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for DJ mixes
  }
});