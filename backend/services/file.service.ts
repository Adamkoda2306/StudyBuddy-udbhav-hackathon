import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const apiClient = axios.create({
  baseURL: process.env.USER_SERVICE_URL || 'https://uncounterbalanced-diapedetic-rosalie.ngrok-free.dev',
});

// ------------ File Upload ------------
const fileUpload = async (files?: any): Promise<{ success: boolean; message: string }> => {
  const file = files?.file[0];

  if (!file) {
    return { success: false, message: "No file was received by the Node.js server." };
  }

  const filePath = file.path;
  const originalFilename = file.originalname;

  try {
    const fileStream = fs.createReadStream(filePath);

    const formData = new FormData(); 
    formData.append("file", fileStream, originalFilename);

    const response = await apiClient.post("/upload", formData, {
      headers: formData.getHeaders(),
    });

    const FlaskResponse = response.data as { success: boolean; message: string };

    if (!FlaskResponse.success) {
      return { success: false, message: FlaskResponse.message };
    }

    return { success: true, message: FlaskResponse.message };
  } catch (error: any) {
    console.error(`❌ Registration failed: ${error.message}`);
    return { success: false, message: error.message };
  } finally {
    // 
    // ⚠️ CRITICAL: Clean up the temporary file from the Node.js server
    //
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete temporary file: ${filePath}`, err);
      } else {
        console.log(`Successfully deleted temporary file: ${filePath}`);
      }
    });
  }
};

// ------------ Login User ------------
const askQuery = async (query: string): Promise<
  | { success: true; answer: string; source: [] }
  | { success: false; message: string }
> => {
  const userquery = query;
  try {
    const response = await apiClient.post("/ask", {
      query: userquery,
      history: [],
    });

    const FlaskResponse = response.data as { success: boolean; answer: string; source: [] };

    if (!FlaskResponse.success) {
      return { success: false, message: "Failed to get the response" };
    }

    return { success: true, answer: FlaskResponse.answer, source: FlaskResponse.source };
  } catch (error: any) {
    console.error(`❌ Registration failed: ${error.message}`);
    return { success: false, message: error.message };
  }
};

export { fileUpload, askQuery };