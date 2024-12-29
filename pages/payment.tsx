import { useEffect } from 'react';
type TPDirectType = {
    setupSDK: (appId: string, appKey: string, env: 'sandbox' | 'production') => void;
    card: {
        setup: (options: any) => void;
        getTappayFieldsStatus: () => { canGetPrime: boolean; hasError: boolean };
        getPrime: (callback: (result: any) => void) => void;
    };
};

declare let TPDirect: TPDirectType;
declare global {
    interface Window {
        TPDirect: TPDirectType;
    }
}

const PaymentPage = () => {
    useEffect(() => {
        if (typeof window !== 'undefined' && window.TPDirect) {
            TPDirect.setupSDK(
                process.env.TAPPAY_APP_ID || '',
                process.env.TAPPAY_APP_KEY || '',
                'sandbox' // 或 'production'
            );

            TPDirect.card.setup({
                fields: {
                    number: { element: '#card-number', placeholder: '卡號' },
                    expirationDate: { element: '#card-expiration-date', placeholder: '有效期限 MM / YY' },
                    ccv: { element: '#card-ccv', placeholder: 'CVV' },
                },
                styles: {
                    input: { color: 'black' },
                    'input.ccv': { 'font-size': '16px' },
                    ':focus': { color: 'blue' },
                    '.valid': { color: 'green' },
                    '.invalid': { color: 'red' },
                },
            });
        }
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // 防止表單的默認提交行為
        const tappayStatus = TPDirect.card.getTappayFieldsStatus();
        console.log(tappayStatus);

        TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
                alert('取得 Prime 失敗：' + result.msg);
                return;
            };

            alert('Prime 取得成功：' + result.card.prime);
            // 傳送至後端 API
            fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prime: result.card.prime,
                    amount: 1000,
                    cardholder: {
                        name: 'John Doe',
                        email: 'john.doe@example.com',
                        phone_number: '0912345678', // 必填欄位：手機號碼
                    },
                }),
            })
                .then((res) => res.json())
                .then(() => alert('交易成功！'))
                .catch((err) => alert('交易失敗：' + err.message));
        });
    };


    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>卡號</label>
                    <div className="form-control" id="card-number"></div>
                </div>
                <div className="form-group">
                    <label>卡片到期日</label>
                    <div className="form-control" id="card-expiration-date"></div>
                </div>
                <div className="form-group">
                    <label>卡片後三碼</label>
                    <div className="form-control" id="card-ccv"></div>
                </div>

                <button type="submit" className="btn btn-default">
                    Pay
                </button>
            </form>
        </div>
    );
};

export default PaymentPage;
