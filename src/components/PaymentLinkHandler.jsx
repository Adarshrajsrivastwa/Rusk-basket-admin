import React, { useState, useEffect } from "react";
import { ExternalLink, Copy, Check, Send } from "lucide-react";
import {
  getPaymentUrl,
  openPaymentUrl,
  copyPaymentUrl,
  formatPaymentResponse,
  getWhatsAppPaymentLink,
  getSMSPaymentLink,
} from "../utils/paymentUtils";

/**
 * PaymentLinkHandler Component
 * Displays and handles payment URLs from payment responses
 * 
 * @param {Object} props
 * @param {Object} props.paymentResponse - Payment response object from API
 * @param {string} props.phoneNumber - Optional phone number for sending via WhatsApp/SMS
 * @param {boolean} props.autoOpen - Whether to automatically open payment URL
 * @param {string} props.className - Additional CSS classes
 */
const PaymentLinkHandler = ({
  paymentResponse,
  phoneNumber = null,
  autoOpen = false,
  className = "",
}) => {
  const [paymentData, setPaymentData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paymentResponse) {
      const formatted = formatPaymentResponse(paymentResponse);
      setPaymentData(formatted);

      // Auto-open payment URL if enabled
      if (autoOpen && formatted.paymentUrl) {
        setTimeout(() => {
          openPaymentUrl(paymentResponse);
        }, 500); // Small delay to ensure component is mounted
      }
    }
  }, [paymentResponse, autoOpen]);

  const handleOpenPayment = () => {
    if (paymentResponse) {
      openPaymentUrl(paymentResponse);
    }
  };

  const handleCopyUrl = async () => {
    if (paymentResponse) {
      setLoading(true);
      const success = await copyPaymentUrl(paymentResponse);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      setLoading(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (paymentResponse && phoneNumber) {
      const whatsappUrl = getWhatsAppPaymentLink(paymentResponse, phoneNumber);
      if (whatsappUrl) {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  const handleSendSMS = () => {
    if (paymentResponse && phoneNumber) {
      const smsUrl = getSMSPaymentLink(paymentResponse, phoneNumber);
      if (smsUrl) {
        window.location.href = smsUrl;
      }
    }
  };

  if (!paymentData || !paymentData.paymentUrl) {
    return (
      <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <p className="text-yellow-800 text-sm">
          Payment URL is not available
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex flex-col gap-3">
        {/* Payment Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Payment Gateway</p>
            <p className="font-semibold text-gray-900 capitalize">
              {paymentData.gateway}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Amount</p>
            <p className="font-semibold text-gray-900">
              {paymentData.currency} {paymentData.amount}
            </p>
          </div>
        </div>

        {/* Payment URL Display */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p className="text-xs text-gray-600 mb-1">Payment Link</p>
          <a
            href={paymentData.paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 break-all hover:underline flex items-center gap-1"
          >
            <span className="truncate">{paymentData.paymentUrl}</span>
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleOpenPayment}
            className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Payment
          </button>

          <button
            onClick={handleCopyUrl}
            disabled={loading}
            className="flex-1 min-w-[120px] bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>

          {phoneNumber && (
            <>
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send WhatsApp
              </button>

              <button
                onClick={handleSendSMS}
                className="flex-1 min-w-[120px] bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send SMS
              </button>
            </>
          )}
        </div>

        {/* Order ID Display */}
        {paymentData.orderId && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Order ID: <span className="font-semibold text-gray-900">{paymentData.orderId}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentLinkHandler;
