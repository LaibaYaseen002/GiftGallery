import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn(
    "Warning: RESEND_API_KEY not set. Email features will not work."
  );
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

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
  giftFont?: string | null;
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

  const fontFamilyMap: Record<string, string> = {
    classic: "'Segoe UI', Arial, sans-serif",
    handwritten: "'Dancing Script', cursive",
    elegant: "'Great Vibes', cursive",
    playful: "'Pacifico', cursive",
  };
  const giftFontFamily = fontFamilyMap[data.giftFont || "classic"] || fontFamilyMap.classic;

  const giftMessageHtml = data.giftMessage
    ? `<div style="background: #FFF8F0; border-left: 4px solid #D4A853; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 5px; font-weight: bold; color: #2D2D2D;">Gift Message:</p>
        <p style="margin: 0; color: #6B6B6B; font-style: italic; font-family: ${giftFontFamily}; font-size: 18px;">"${data.giftMessage}"</p>
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
    const result = await resend!.emails.send({
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

// ==================== Order Status Update Email ====================

interface StatusUpdateEmailData {
  to: string;
  customerName: string;
  orderId: string;
  oldStatus: string;
  newStatus: string;
}

const statusMessages: Record<string, { emoji: string; title: string; message: string }> = {
  confirmed: {
    emoji: "✅",
    title: "Order Confirmed",
    message: "Great news! Your order has been confirmed and is being prepared.",
  },
  shipped: {
    emoji: "🚚",
    title: "Order Shipped",
    message: "Your order is on its way! It has been shipped and will arrive soon.",
  },
  delivered: {
    emoji: "📦",
    title: "Order Delivered",
    message: "Your order has been delivered. We hope you love your purchase!",
  },
  cancelled: {
    emoji: "❌",
    title: "Order Cancelled",
    message: "Your order has been cancelled. If you have any questions, please contact us.",
  },
};

export async function sendOrderStatusEmail(data: StatusUpdateEmailData) {
  if (!resendApiKey) {
    console.log("Skipping email — RESEND_API_KEY not configured");
    return null;
  }

  const statusInfo = statusMessages[data.newStatus] || {
    emoji: "📋",
    title: `Order Updated to ${data.newStatus}`,
    message: `Your order status has been updated to ${data.newStatus}.`,
  };

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FFF8F0; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #B76E79, #9A4C5A); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Gift Gallery</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Order Update</p>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #F0E0D6; border-top: none; border-radius: 0 0 12px 12px;">
      <p style="color: #2D2D2D; font-size: 16px;">Hi ${data.customerName},</p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="font-size: 48px;">${statusInfo.emoji}</span>
        <h2 style="color: #B76E79; margin: 10px 0;">${statusInfo.title}</h2>
      </div>
      <div style="background: #FAF5F0; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 0; color: #6B6B6B; font-size: 14px;">Order ID</p>
        <p style="margin: 4px 0 0; color: #2D2D2D; font-weight: bold; font-size: 16px;">#${data.orderId.slice(0, 8)}</p>
      </div>
      <p style="color: #6B6B6B; line-height: 1.8;">${statusInfo.message}</p>
      <p style="color: #6B6B6B; font-size: 14px; margin-top: 20px;">If you have any questions, feel free to contact us.</p>
      <div style="text-align: center; margin-top: 25px;">
        <p style="color: #B76E79; font-weight: bold;">Gift Gallery Team 🎁</p>
      </div>
    </div>
    <div style="text-align: center; padding: 20px; color: #6B6B6B; font-size: 12px;">
      <p>&copy; 2025 Gift Gallery. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend!.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `${statusInfo.title} — #${data.orderId.slice(0, 8)} | Gift Gallery`,
      html,
    });
    console.log("Order status email sent:", result);
    return result;
  } catch (error) {
    console.error("Failed to send order status email:", error);
    return null;
  }
}

// ==================== Return Status Update Email ====================

interface ReturnStatusEmailData {
  to: string;
  customerName: string;
  orderId: string;
  returnStatus: string;
  adminNotes?: string;
}

const returnStatusMessages: Record<string, { emoji: string; title: string; message: string }> = {
  approved: {
    emoji: "✅",
    title: "Return Approved",
    message: "Your return request has been approved. Please follow the return instructions provided by our team.",
  },
  rejected: {
    emoji: "❌",
    title: "Return Rejected",
    message: "Unfortunately, your return request has been rejected. Please contact us if you have any questions.",
  },
  refunded: {
    emoji: "💰",
    title: "Refund Processed",
    message: "Your refund has been processed. The amount will be reflected in your account shortly.",
  },
};

export async function sendReturnStatusEmail(data: ReturnStatusEmailData) {
  if (!resendApiKey) {
    console.log("Skipping email — RESEND_API_KEY not configured");
    return null;
  }

  const statusInfo = returnStatusMessages[data.returnStatus];
  if (!statusInfo) return null; // Skip for "pending" or unknown statuses

  const adminNotesHtml = data.adminNotes
    ? `<div style="background: #FAF5F0; border-left: 4px solid #D4A853; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 5px; font-weight: bold; color: #2D2D2D;">Admin Notes:</p>
        <p style="margin: 0; color: #6B6B6B;">${data.adminNotes}</p>
      </div>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FFF8F0; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #B76E79, #9A4C5A); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Gift Gallery</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Return Update</p>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #F0E0D6; border-top: none; border-radius: 0 0 12px 12px;">
      <p style="color: #2D2D2D; font-size: 16px;">Hi ${data.customerName},</p>
      <div style="text-align: center; margin: 25px 0;">
        <span style="font-size: 48px;">${statusInfo.emoji}</span>
        <h2 style="color: #B76E79; margin: 10px 0;">${statusInfo.title}</h2>
      </div>
      <div style="background: #FAF5F0; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 0; color: #6B6B6B; font-size: 14px;">Order ID</p>
        <p style="margin: 4px 0 0; color: #2D2D2D; font-weight: bold; font-size: 16px;">#${data.orderId.slice(0, 8)}</p>
      </div>
      <p style="color: #6B6B6B; line-height: 1.8;">${statusInfo.message}</p>
      ${adminNotesHtml}
      <p style="color: #6B6B6B; font-size: 14px; margin-top: 20px;">If you have any questions, feel free to contact us.</p>
      <div style="text-align: center; margin-top: 25px;">
        <p style="color: #B76E79; font-weight: bold;">Gift Gallery Team 🎁</p>
      </div>
    </div>
    <div style="text-align: center; padding: 20px; color: #6B6B6B; font-size: 12px;">
      <p>&copy; 2025 Gift Gallery. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend!.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `${statusInfo.title} — Order #${data.orderId.slice(0, 8)} | Gift Gallery`,
      html,
    });
    console.log("Return status email sent:", result);
    return result;
  } catch (error) {
    console.error("Failed to send return status email:", error);
    return null;
  }
}

// ==================== Custom Admin Email ====================

interface CustomEmailData {
  to: string;
  toName?: string;
  subject: string;
  message: string;
}

export async function sendCustomEmail(data: CustomEmailData) {
  if (!resendApiKey) {
    console.log("Skipping email — RESEND_API_KEY not configured");
    return null;
  }

  const greeting = data.toName ? `Hi ${data.toName},` : "Hello,";
  const messageHtml = data.message.replace(/\n/g, "<br>");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FFF8F0; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #B76E79, #9A4C5A); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Gift Gallery</h1>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #F0E0D6; border-top: none; border-radius: 0 0 12px 12px;">
      <p style="color: #2D2D2D; font-size: 16px;">${greeting}</p>
      <div style="color: #6B6B6B; line-height: 1.8; margin: 15px 0;">${messageHtml}</div>
      <div style="text-align: center; margin-top: 25px;">
        <p style="color: #B76E79; font-weight: bold;">Gift Gallery Team 🎁</p>
      </div>
    </div>
    <div style="text-align: center; padding: 20px; color: #6B6B6B; font-size: 12px;">
      <p>&copy; 2025 Gift Gallery. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend!.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `${data.subject} | Gift Gallery`,
      html,
    });
    console.log("Custom email sent:", result);
    return result;
  } catch (error) {
    console.error("Failed to send custom email:", error);
    return null;
  }
}

// ==================== Feedback Reply Email ====================

interface FeedbackReplyData {
  to: string;
  customerName: string;
  originalSubject: string;
  replyMessage: string;
}

export async function sendFeedbackReplyEmail(data: FeedbackReplyData) {
  if (!resendApiKey) {
    console.log("Skipping email — RESEND_API_KEY not configured");
    return null;
  }

  const replyHtml = data.replyMessage.replace(/\n/g, "<br>");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #FFF8F0; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #B76E79, #9A4C5A); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎁 Gift Gallery</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Feedback Response</p>
    </div>
    <div style="background: white; padding: 30px; border: 1px solid #F0E0D6; border-top: none; border-radius: 0 0 12px 12px;">
      <p style="color: #2D2D2D; font-size: 16px;">Hi ${data.customerName},</p>
      <p style="color: #6B6B6B;">Thank you for your feedback. Here is our response regarding "<strong>${data.originalSubject}</strong>":</p>
      <div style="background: #FAF5F0; border-left: 4px solid #B76E79; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <div style="color: #2D2D2D; line-height: 1.8;">${replyHtml}</div>
      </div>
      <p style="color: #6B6B6B; font-size: 14px;">If you have further questions, don't hesitate to reach out!</p>
      <div style="text-align: center; margin-top: 25px;">
        <p style="color: #B76E79; font-weight: bold;">Gift Gallery Team 🎁</p>
      </div>
    </div>
    <div style="text-align: center; padding: 20px; color: #6B6B6B; font-size: 12px;">
      <p>&copy; 2025 Gift Gallery. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend!.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Re: ${data.originalSubject} | Gift Gallery`,
      html,
    });
    console.log("Feedback reply email sent:", result);
    return result;
  } catch (error) {
    console.error("Failed to send feedback reply email:", error);
    return null;
  }
}
