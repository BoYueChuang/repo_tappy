import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 設置 CORS 頭部
    res.setHeader('Access-Control-Allow-Origin', '*'); // 允許所有域名進行跨域請求
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 允許的 HTTP 方法
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key'); // 允許的標頭

    // 處理 Preflight（預檢）請求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { prime, amount, cardholder } = req.body;

        try {
            const response = await axios.post(
                'https://prod.tappaysdk.com/tpc/payment/pay-by-prime',
                {
                    prime,
                    partner_key: process.env.TAPPAY_PARTNER_KEY,
                    merchant_id: process.env.TAPPAY_MERCHANT_ID,
                    amount,
                    currency: 'TWD',
                    details: '支付測試',
                    cardholder,
                },
                {
                    headers: {
                        'x-api-key': process.env.TAPPAY_PARTNER_KEY,
                        'Content-Type': 'application/json',
                    },
                }
            );

            res.status(200).json(response.data);
        } catch (error: any) {
            res.status(500).json({ error: error.response?.data || '未知錯誤' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
