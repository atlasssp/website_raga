interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export class PaymentService {
  private static readonly RAZORPAY_KEY = 'rzp_live_RkwWM34FBYYRNX';

  static async initiatePayment(
    amount: number,
    customerDetails: {
      name: string;
      email: string;
      phone: string;
    },
    orderDetails: {
      orderId: string;
      items: any[];
    }
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      const options: RazorpayOptions = {
        key: this.RAZORPAY_KEY,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'RAGA BY MALLIKA',
        description: `Order #${orderDetails.orderId}`,
        handler: (response) => {
          // Payment successful
          console.log('Payment successful:', response);
          this.handlePaymentSuccess(response, orderDetails);
          resolve(true);
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        theme: {
          color: '#C9A961', // Logo gold color
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            resolve(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  }

  private static handlePaymentSuccess(response: any, orderDetails: any) {
    // Send payment confirmation to WhatsApp
    const whatsappNumber = '+918886999477';
    let message = `💳 *Payment Successful - RAGA BY MALLIKA*\n\n`;
    message += `✅ *Payment ID:* ${response.razorpay_payment_id}\n`;
    message += `📋 *Order ID:* ${orderDetails.orderId}\n`;
    message += `📅 *Date:* ${new Date().toLocaleString()}\n\n`;
    message += `🛒 *Items:*\n`;
    
    orderDetails.items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Size: ${item.size}, Color: ${item.color}\n`;
      message += `   Qty: ${item.quantity} x ₹${item.product.price}\n\n`;
    });

    message += `💰 *Total Paid:* ₹${orderDetails.items.reduce((total: number, item: any) => total + (item.product.price * item.quantity), 0)}\n\n`;
    message += `📦 *Please prepare the order for shipping.*`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  static generateOrderId(): string {
    return `RBM${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
}