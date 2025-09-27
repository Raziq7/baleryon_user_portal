import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const getConfig = () => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? process.env.PORT : undefined,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    AWS_REGION: process.env.AWS_REGION,
    RAZOR_KEY_ID: process.env.RAZOR_KEY_ID,
    RAZOR_KEY_SECRET: process.env.RAZOR_KEY_SECRET,
    YOUR_WEBHOOK_SECRET : process.env.YOUR_WEBHOOK_SECRET,
    POSTMARK_API_TOKEN :process.env.POSTMARK_API_TOKEN
    // AWS_ACCESS: process.env.AWS_ACCESS,
    // AWS_SECRETACCESS: process.env.AWS_SECRETACCESS,
    // S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  };
};

const getSanitizedConfig = (config) => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;