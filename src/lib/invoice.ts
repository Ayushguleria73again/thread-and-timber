import { formatCurrency } from "./utils";

export const downloadInvoice = (order: any) => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const itemsHtml = order.items.map((item: any) => `
        <tr style="border-bottom: 1px solid #E5E1DA;">
            <td style="padding: 16px 0;">
                <div style="font-weight: 600; color: #1A1A1A;">${item.name}</div>
                <div style="font-size: 10px; color: #8C8C8C; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;">Artisan Piece</div>
            </td>
            <td style="padding: 16px 0; text-align: center; color: #1A1A1A;">${item.quantity}</td>
            <td style="padding: 16px 0; text-align: right; color: #1A1A1A;">${formatCurrency(item.price)}</td>
            <td style="padding: 16px 0; text-align: right; font-weight: 600; color: #1A1A1A;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>
    `).join('');

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice #${order._id.slice(-6).toUpperCase()}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:italic,wght@400;700&display=swap');
                body { 
                    font-family: 'Inter', sans-serif; 
                    background-color: #FDFCFB; 
                    margin: 0; 
                    padding: 40px; 
                    color: #1A1A1A;
                    line-height: 1.5;
                }
                .invoice-card {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 60px;
                    border: 1px solid #F6F2EC;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.02);
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 2px solid #1A1A1A;
                    padding-bottom: 40px;
                    margin-bottom: 40px;
                }
                .studio-name {
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    font-size: 28px;
                    margin: 0;
                    letter-spacing: -0.02em;
                }
                .studio-label {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.3em;
                    color: #8C8C8C;
                    font-weight: 700;
                    margin-top: 4px;
                }
                .invoice-meta {
                    text-align: right;
                }
                .meta-label {
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #8C8C8C;
                    font-weight: 700;
                }
                .meta-value {
                    font-weight: 600;
                    font-size: 14px;
                    margin-top: 4px;
                }
                .billing-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    margin-bottom: 60px;
                }
                .address-title {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #8C8C8C;
                    font-weight: 700;
                    margin-bottom: 12px;
                }
                .address-content {
                    font-size: 13px;
                    color: #4A4A4A;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 40px;
                }
                th {
                    text-align: left;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #8C8C8C;
                    font-weight: 700;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #1A1A1A;
                }
                .totals {
                    width: 280px;
                    margin-left: auto;
                }
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    font-size: 13px;
                }
                .grand-total {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #1A1A1A;
                    font-weight: 700;
                    font-size: 18px;
                }
                .footer {
                    margin-top: 80px;
                    text-align: center;
                    border-top: 1px solid #F6F2EC;
                    padding-top: 40px;
                }
                .footer-text {
                    font-family: 'Playfair Display', serif;
                    font-style: italic;
                    font-size: 16px;
                    color: #3D4A3E;
                }
                @media print {
                    body { padding: 0; background: white; }
                    .invoice-card { border: none; box-shadow: none; width: 100%; max-width: none; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="invoice-card">
                <div class="header">
                    <div>
                        <h1 class="studio-name">Thread & Timber</h1>
                        <div class="studio-label">Artisan Studio & Registry</div>
                    </div>
                    <div class="invoice-meta">
                        <div style="margin-bottom: 20px;">
                            <div class="meta-label">Registry No.</div>
                            <div class="meta-value">#${order._id.slice(-8).toUpperCase()}</div>
                        </div>
                        <div>
                            <div class="meta-label">Acquisition Date</div>
                            <div class="meta-value">${new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                    </div>
                </div>

                <div class="billing-section">
                    <div>
                        <div class="address-title">Acquired By</div>
                        <div class="address-content">
                            <div style="font-weight: 700; margin-bottom: 4px; color: #1A1A1A;">${order.shippingAddress.name}</div>
                            <div>${order.user?.email || 'Registered Artisan'}</div>
                        </div>
                    </div>
                    <div>
                        <div class="address-title">Dispatch Address</div>
                        <div class="address-content">
                            ${order.shippingAddress.street}<br>
                            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
                            ${order.shippingAddress.country}
                        </div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 50%;">Collection Piece</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Valuation</th>
                            <th style="text-align: right;">Extended</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div class="totals">
                    <div class="total-row">
                        <span style="color: #8C8C8C;">Subtotal</span>
                        <span>${formatCurrency(order.total - (order.discountAmount || 0))}</span>
                    </div>
                    ${order.discountAmount ? `
                        <div class="total-row" style="color: #3D4A3E;">
                            <span>Artisan Discount</span>
                            <span>-${formatCurrency(order.discountAmount)}</span>
                        </div>
                    ` : ''}
                    <div class="total-row grand-total">
                        <span>Total Investment</span>
                        <span>${formatCurrency(order.total)}</span>
                    </div>
                </div>

                <div class="footer">
                    <div class="footer-text">"Handcrafted for mindful makers."</div>
                    <div style="font-size: 9px; color: #8C8C8C; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 12px;">
                        Thread & Timber Studio • Sonoma, California • threadtimber.co
                    </div>
                </div>
            </div>
            <script>
                window.onload = () => {
                    setTimeout(() => {
                        window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;

    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
};
