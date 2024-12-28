// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    TAPPAY_APP_ID: process.env.TAPPAY_APP_ID,
    TAPPAY_APP_KEY: process.env.TAPPAY_APP_KEY,
    TAPPAY_MERCHANT_ID: process.env.TAPPAY_MERCHANT_ID,
    TAPPAY_PARTNER_KEY: process.env.TAPPAY_PARTNER_KEY,
  },
};

export default nextConfig;