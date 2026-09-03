import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as paymentService from '../services/paymentService';
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  FileText
} from 'lucide-react';

export const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Confirmation Form State
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentApp, setPaymentApp] = useState('Google Pay');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const loadPaymentDetails = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getOrderPaymentDetails(orderId);
      setPaymentData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order payment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadPaymentDetails();
    }
  }, [orderId]);

  const handleCopyUpiId = () => {
    if (paymentData?.merchantUpiId) {
      navigator.clipboard.writeText(paymentData.merchantUpiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!transactionId.trim()) {
      setFormError('Please enter your 12-digit UPI Reference / UTR Number.');
      return;
    }

    try {
      setSubmitting(true);
      await paymentService.submitPaymentConfirmation(orderId, {
        transactionId: transactionId.trim(),
        paymentApp,
        note
      });
      setShowConfirmForm(false);
      await loadPaymentDetails();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit payment reference');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-xs text-amber-400 font-bold uppercase tracking-widest">
            Preparing Secure Payment Portal...
          </p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-slate-950">
        <div className="max-w-md w-full p-8 rounded-3xl glass-card border border-rose-500/30 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Payment Unavailable</h2>
          <p className="text-xs text-slate-300">{error || 'Order payment record could not be found.'}</p>
          <Link to="/orders" className="inline-block py-2.5 px-6 rounded-xl gold-gradient-btn text-xs font-bold">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const { order, upiUri, qrCode, merchantUpiId, merchantName, amountPayable } = paymentData;
  const paymentStatus = order.paymentStatus;

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>StyleSphere Concierge Settlement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            Custom UPI Payment Portal
          </h1>
          <p className="text-xs text-slate-400">
            Order Reference: <span className="font-mono text-amber-400 font-bold">{order.orderNumber}</span>
          </p>
        </div>

        {/* STATE 1: PAYMENT VERIFIED & PAID */}
        {paymentStatus === 'paid' && (
          <div className="p-8 sm:p-10 rounded-3xl glass-card border border-emerald-500/40 bg-emerald-500/5 text-center space-y-6 shadow-2xl animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                Payment Verified & Settled
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your payment of <strong className="text-emerald-400 font-serif text-sm">₹{amountPayable?.toLocaleString('en-IN')}</strong> has been confirmed by our executive team. Your creation is entering white-glove packaging.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono text-white font-semibold">{order.paymentReference || 'Direct Verification'}</span>
              </div>
              <div className="flex justify-between">
                <span>Settlement Method:</span>
                <span className="text-white font-semibold">{order.paymentMethod}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to={`/orders/${order.orderNumber}`}
                className="py-3 px-6 rounded-xl gold-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <span>View Order Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`/api/orders/${order._id}/invoice?format=html`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-6 rounded-xl glass-panel border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Tax Invoice</span>
              </a>
            </div>
          </div>
        )}

        {/* STATE 2: VERIFICATION PENDING */}
        {paymentStatus === 'pending_verification' && (
          <div className="p-8 sm:p-10 rounded-3xl glass-card border border-amber-500/40 bg-amber-500/5 text-center space-y-6 shadow-2xl animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                Payment Details Under Verification
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you! We have received your submission. Our concierge team is verifying the transaction against our merchant account.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 max-w-sm mx-auto text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">UTR / Ref:</span>
                <span className="font-mono text-amber-400 font-bold">{order.paymentReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Application:</span>
                <span className="font-semibold text-white">{order.paymentApp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payable Amount:</span>
                <span className="font-bold text-white">₹{amountPayable?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/orders/${order.orderNumber}`}
                className="py-3 px-6 rounded-xl gold-gradient-btn text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg"
              >
                <span>Track Order Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* STATE 3: PAYMENT REJECTED */}
        {paymentStatus === 'rejected' && (
          <div className="p-8 sm:p-10 rounded-3xl glass-card border border-rose-500/40 bg-rose-500/5 text-center space-y-6 shadow-2xl animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                Payment Verification Failed
              </h2>
              <p className="text-xs text-rose-300 max-w-md mx-auto">
                {order.paymentRejectionReason || 'The transaction reference provided could not be matched with our bank records.'}
              </p>
            </div>

            <button
              onClick={() => {
                setShowConfirmForm(true);
                setTransactionId('');
              }}
              className="py-3 px-6 rounded-xl gold-gradient-btn text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg"
            >
              <span>Resubmit Corrected Transaction ID</span>
            </button>
          </div>
        )}

        {/* STATE 4: AWAITING PAYMENT (OR SHOW FORM) */}
        {(paymentStatus === 'pending' || showConfirmForm || paymentStatus === 'rejected') && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Amount & QR Code Card */}
            <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6 text-center">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Payable Amount</span>
                <p className="text-3xl sm:text-4xl font-black text-amber-400 font-serif">
                  ₹{amountPayable?.toLocaleString('en-IN')}
                </p>
              </div>

              {/* QR Code Canvas / Container */}
              <div className="p-5 rounded-3xl bg-white max-w-[260px] mx-auto shadow-2xl border-4 border-amber-400/50 relative group">
                {qrCode ? (
                  <img src={qrCode} alt="StyleSphere UPI QR Code" className="w-full h-auto object-contain rounded-xl" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-900 text-xs">
                    Generating QR...
                  </div>
                )}
              </div>

              {/* Supported Apps Badges */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Scan & Pay Using Any UPI Application
                </span>
                <div className="flex flex-wrap justify-center gap-2 text-[10px] font-semibold text-slate-300">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700">Google Pay</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700">PhonePe</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700">Paytm</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700">BHIM UPI</span>
                </div>
              </div>

              {/* Mobile Direct UPI Deep Link */}
              <div className="pt-2">
                <a
                  href={upiUri}
                  className="w-full py-3 px-6 rounded-2xl gold-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-amber-500/20"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Pay ₹{amountPayable?.toLocaleString('en-IN')} via UPI App</span>
                </a>
              </div>
            </div>

            {/* Right: Merchant Details & UTR Confirmation Form */}
            <div className="md:col-span-5 space-y-6">
              
              {/* Merchant Details Box */}
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Beneficiary Details
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Merchant:</span>
                    <span className="font-semibold text-white">{merchantName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">UPI ID:</span>
                    <div className="flex items-center gap-1.5 font-mono text-amber-300">
                      <span>{merchantUpiId}</span>
                      <button onClick={handleCopyUpiId} className="p-1 hover:text-white" title="Copy UPI ID">
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Confirmation Form */}
              <form onSubmit={handleConfirmPayment} className="p-6 rounded-3xl glass-card border border-amber-500/40 space-y-4 shadow-xl">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Have You Completed Payment?</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Enter your 12-digit UTR / Transaction ID from your banking receipt to initiate verification.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                    UPI Transaction ID / UTR *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 408291823901"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                    Payment Application
                  </label>
                  <select
                    value={paymentApp}
                    onChange={(e) => setPaymentApp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                  >
                    <option value="Google Pay">Google Pay</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="BHIM">BHIM UPI</option>
                    <option value="Other">Other UPI App</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                    Optional Note
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Paid from HDFC Bank"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl gold-gradient-btn text-xs font-bold uppercase tracking-wider shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Submitting Reference...' : 'I Have Paid (Confirm)'}
                </button>
              </form>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentPage;
