import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { prime, amount, cardholder } = req.body;

        try {
            const response = await axios.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', {
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
                        'x-api-key': 'partner_eLf8pDLmW1lEw414jVd9rSrIQAtaqMNX8utjgOMWgPXNyHoD4dviFIx2', // 設置 x-api-key
                    }
                });

            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ error: error.response?.data || '未知錯誤' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
