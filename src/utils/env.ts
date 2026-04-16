import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const env = {
  common: {
    port: process.env.PORT ?? 5000,
    nodeEnv: process.env.NODE_ENV as string | undefined,
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "furcare",
  },
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL,
    medicalRecordPromptTemplate: process.env.MEDICAL_RECORD_PROMPT_TEMPLATE,
  },
  whatsapp: {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? "furcare_whatsapp_verify_2026",
    apiVersion: process.env.WHATSAPP_API_VERSION ?? "v22.0",
  },
};

export default env;
