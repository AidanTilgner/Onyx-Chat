import { config } from "dotenv";
import axios from "axios";

config();

const onyxCoreHost = process.env.ONYX_CORE_HOST || "http://localhost";
const onyxCoreApiKey = process.env.ONYX_CORE_API_KEY || "test";

export const onyxCore = axios.create({
  baseURL: onyxCoreHost,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-service": "onyxchat",
    "x-key": onyxCoreApiKey,
  },
});
