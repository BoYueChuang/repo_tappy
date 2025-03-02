import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // 設置 CORS 頭部
    res.setHeader('Access-Control-Allow-Origin', '*'); // 允許所有域名進行跨域請求
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // 允許的 HTTP 方法
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key'); // 允許的標頭

    if (req.method === 'POST') {
        const { prime, amount, cardholder } = req.body;

        try {
            const response = await axios.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', {
                prime,
                // 帳號金鑰(Partner Key)
                partner_key: process.env.TAPPAY_PARTNER_KEY,
                // 商家 ID
                merchant_id: process.env.TAPPAY_MERCHANT_ID,
                amount,
                currency: 'TWD',
                details: '支付測試',
                cardholder,
            }, {
                headers: {
                    'x-api-key': process.env.TAPPAY_PARTNER_KEY,
                }
            });

            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ error: error.response?.data || '未知錯誤' });
        };
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    };
}
