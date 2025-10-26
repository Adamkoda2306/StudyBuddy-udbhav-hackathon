import express, { Request, Response } from "express";
import { fileUpload, askQuery } from "../services/file.service";
import authMiddleware from "../middleware/auth.middleware";
import { upload } from "../config/cloudinary.config";
const router = express.Router();


router.post('/upload', upload.fields([
    { name: "file", maxCount: 1 },
  ]), async (req: Request, res: Response) => {
    const files = req.files;
    const result: { success: true; message: string }
  | { success: false; message: string } = await fileUpload(files);
  return res.status(result.success ? 200 : 400).json(result);
});

router.get('/ask', async (req: Request, res: Response) => {
    let query = req.query as unknown as string;
    const result: { success: true; answer: string; source: [] } 
    | { success: false; message: string } = await askQuery(query);
    return res.status(result.success ? 200 : 400).json(result);
});

export default router;