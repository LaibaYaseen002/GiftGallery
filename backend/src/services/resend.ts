import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn(
    "Warning: RESEND_API_KEY not set. Email features will not work."
  );
}

export const resend = new Resend(resendApiKey || "");

// Default sender — use Resend's test address or your verified domain
const FROM_EMAIL = process.env.FROM_EMAIL || "Gift Gallery <onboarding@resend.dev>";

interface OrderEmailData {
  to: string;
  orderId: string;
  customerName: string;
  items: { product_name: string; price: number; quantity: number }[];
  subtotal: number;
  discountCode?: string | null;
  discountAmount: number;
  totalAmount: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
  giftMessage?: string | null;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  if (!resendApiKey) {
    console.log("Skipping email — RESEND_API_KEY not configured");
    return null;
  }

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #F0E0D6;">${item.product_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #F0E0D6; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #F0E0D6; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const discountHtml = data.discountCode
    ? `<tr>
        <td colspan="2" style="padding: 8px 10px; color: #6B9E78;">Discount (${data.discountCode})</td>
        <td style="padding: 8px 10px; text-align: right; color: #6B9E78;">-$${data.discountAmount.toFixed(2)}</td>
      </tr>`
    : "";

  const giftMessageHtml = data.giftMessage
    ? `<div style="background: #FFF8F0; border-left: 4px solid #D4A853; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 5px; font-weight: bold; color: #2D2D2D;">Gift Message:</p>
        <p style="margin: 0; color: #6B6B6B; font-style: italic;">"${data.giftMessage}"</p>
      </div>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FFF8F0; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #B76E79, #9A4C5A); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Gift Gallery</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Order Confirmation</p>
    </div>

    <!-- Body -->
    <div style="background: white; padding: 30px; border: 1px solid #F0E0D6; border-top: none; border-radius: 0 0 12px 12px;">
      <p style="color: #2D2D2D; font-size: 16px;">Hi ${data.customerName},</p>
      <p style="color: #6B6B6B;">Thank you for your order! Here are the details:</p>

      <div style="background: #FAF5F0; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 0; color: #6B6B6B; font-size: 14px;">Order ID</p>
        <p style="margin: 4px 0 0; color: #2D2D2D; font-weight: bold; font-size: 16px;">#${data.orderId.slice(0, 8)}</p>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #FAF5F0;">
            <th style="padding: 10px; text-align: left; color: #2D2D2D; font-size: 14px;">Item</th>
            <th style="padding: 10px; text-align: center; color: #2D2D2D; font-size: 14px;">Qty</th>
            <th style="padding: 10px; text-align: right; color: #2D2D2D; font-size: 14px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 8px 10px; color: #6B6B6B;">Subtotal</td>
            <td style="padding: 8px 10px; text-align: right; color: #6B6B6B;">$${data.subtotal.toFixed(2)}</td>
          </tr>
          ${discountHtml}
          <tr>
            <td colspan="2" style="padding: 8px 10px; color: #6B6B6B;">Shipping</td>
            <td style="padding: 8px 10px; text-align: right; color: #6B9E78;">Free</td>
          </tr>
          <tr style="border-top: 2px solid #B76E79;">
            <td colspan="2" style="padding: 12px 10px; font-weight: bold; color: #2D2D2D; font-size: 16px;">Total</td>
            <td style="padding: 12px 10px; text-align: right; font-weight: bold; color: #B76E79; font-size: 16px;">$${data.totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      ${giftMessageHtml}

      <!-- Shipping Details -->
      <div style="background: #FAF5F0; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 8px; font-weight: bold; color: #2D2D2D;">Shipping To:</p>
        <p style="margin: 0; color: #6B6B6B; line-height: 1.6;">
          ${data.shippingName}<br>
          ${data.shippingAddress}<br>
          ${data.shippingCity}<br>
          Phone: ${data.shippingPhone}
        </p>
      </div>

      <p style="color: #6B6B6B; font-size: 14px; margin-top: 20px;">
        We'll notify you when your order ships. If you have any questions, feel free to contact us.
      </p>

      <div style="text-align: center; margin-top: 25px;">
        <p style="color: #B76E79; font-weight: bold;">Thank you for shopping with Gift Gallery! 🎁</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #6B6B6B; font-size: 12px;">
      <p>&copy; 2025 Gift Gallery. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Order Confirmed — #${data.orderId.slice(0, 8)} | Gift Gallery`,
      html,
    });

    console.log("Order confirmation email sent:", result);
    return result;
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return null;
  }
}
