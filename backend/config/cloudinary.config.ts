import multer from "multer";
import os from "os";

export const upload = multer({
  dest: os.tmpdir(), // Use the system's default temporary directory
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});