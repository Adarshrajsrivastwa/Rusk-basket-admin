/**
 * Payment Utility Functions
 * Handles payment URL processing and formatting
 */

/**
 * Processes payment response and returns a clickable payment URL
 * @param {Object} paymentResponse - Payment response object from API
 * @param {string} paymentResponse.payment_url - Payment URL from response
 * @param {string} paymentResponse.payment_session_id - Payment session ID from response
 * @returns {string} - Formatted clickable payment URL
 */
export const getPaymentUrl = (paymentResponse) => {
  if (!paymentResponse) {
    console.error("Payment response is required");
    return null;
  }

  // If payment_url already exists and is complete, use it directly
  if (paymentResponse.payment_url && paymentResponse.payment_url.startsWith("http")) {
    return paymentResponse.payment_url;
  }

  // If payment_url doesn't exist but payment_session_id does, construct the URL
  if (paymentResponse.payment_session_id) {
    // Cashfree payment URL format
    if (paymentResponse.gateway === "cashfree" || paymentResponse.payment_session_id.startsWith("session_")) {
      return `https://payments.cashfree.com/forms/pay/${paymentResponse.payment_session_id}`;
    }
    
    // Generic payment URL construction (can be extended for other gateways)
    return paymentResponse.payment_session_id;
  }

  // Fallback: return payment_url as is (even if incomplete)
  return paymentResponse.payment_url || null;
};

/**
 * Opens payment URL in a new tab/window
 * @param {Object} paymentResponse - Payment response object from API
 */
export const openPaymentUrl = (paymentResponse) => {
  const url = getPaymentUrl(paymentResponse);
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    console.error("Unable to generate payment URL");
    alert("Payment URL is not available");
  }
};

/**
 * Copies payment URL to clipboard
 * @param {Object} paymentResponse - Payment response object from API
 * @returns {Promise<boolean>} - Success status
 */
export const copyPaymentUrl = async (paymentResponse) => {
  const url = getPaymentUrl(paymentResponse);
  if (!url) {
    console.error("Unable to generate payment URL");
    return false;
  }

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (err) {
    console.error("Failed to copy URL to clipboard:", err);
    // Fallback: create temporary textarea and copy
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch (e) {
      document.body.removeChild(textarea);
      return false;
    }
  }
};

/**
 * Formats payment response for display or sending
 * @param {Object} paymentResponse - Payment response object from API
 * @returns {Object} - Formatted payment data
 */
export const formatPaymentResponse = (paymentResponse) => {
  const paymentUrl = getPaymentUrl(paymentResponse);
  
  return {
    success: paymentResponse.success || false,
    paymentUrl: paymentUrl,
    gateway: paymentResponse.gateway || "unknown",
    amount: paymentResponse.amount || 0,
    currency: paymentResponse.currency || "INR",
    orderId: paymentResponse.order_id || paymentResponse.orderId || null,
    paymentSessionId: paymentResponse.payment_session_id || null,
  };
};

/**
 * Generates WhatsApp message with payment link
 * @param {Object} paymentResponse - Payment response object from API
 * @param {string} phoneNumber - Recipient phone number (with country code, e.g., +91XXXXXXXXXX)
 * @returns {string} - WhatsApp URL with pre-filled message
 */
export const getWhatsAppPaymentLink = (paymentResponse, phoneNumber) => {
  const paymentUrl = getPaymentUrl(paymentResponse);
  if (!paymentUrl) {
    return null;
  }

  const message = `Please complete your payment by clicking on this link:\n${paymentUrl}`;
  const encodedMessage = encodeURIComponent(message);
  const formattedPhone = phoneNumber.replace(/[^0-9+]/g, ""); // Remove any non-numeric characters except +
  
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};

/**
 * Generates SMS link with payment URL
 * @param {Object} paymentResponse - Payment response object from API
 * @param {string} phoneNumber - Recipient phone number
 * @returns {string} - SMS URL with pre-filled message
 */
export const getSMSPaymentLink = (paymentResponse, phoneNumber) => {
  const paymentUrl = getPaymentUrl(paymentResponse);
  if (!paymentUrl) {
    return null;
  }

  const message = `Please complete your payment: ${paymentUrl}`;
  const encodedMessage = encodeURIComponent(message);
  const formattedPhone = phoneNumber.replace(/[^0-9]/g, ""); // Remove any non-numeric characters
  
  return `sms:${formattedPhone}?body=${encodedMessage}`;
};
