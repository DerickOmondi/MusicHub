import React, { useState } from "react";
import axios from "axios";
import { Sparkles, X, CheckCircle2, Phone, ShieldCheck, Loader2 } from "lucide-react";

interface ArtistPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ArtistPaymentModal: React.FC<ArtistPaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);

  if (!isOpen) return null;

  const handleMpesaPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      alert("Please enter a valid Safaricom phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/mpesa/stkpush", {
        phoneNumber: phone,
        amount: 100
      });

      if (res.data.success) {
        setPaymentSent(true);
        setTimeout(() => {
          alert("Payment verified successfully! Welcome to Youngsters Sounds Artist Hub 👑");
          setLoading(false);
          setPaymentSent(false);
          onSuccess();
          onClose();
        }, 3500);
      }
    } catch (err) {
      console.error("M-Pesa Error:", err);
      alert("Failed to send M-Pesa prompt. Please check your backend connection.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-[#0d111a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Become a Featured Artist</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Get unlimited studio track uploads, homepage feature spotlights, and direct fan engagement on Youngsters Sounds.
          </p>
        </div>

        {/* Pricing Badge */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">One-Time Artist Access Fee</span>
            <span className="text-xl font-black text-amber-400">KES 100.00</span>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Instant Activation
          </span>
        </div>

        {/* Form */}
        {!paymentSent ? (
          <form onSubmit={handleMpesaPay} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Safaricom M-Pesa Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="0712345678 or 254712345678"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending M-Pesa STK Prompt...
                </>
              ) : (
                "Pay KES 100 via M-Pesa"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-pulse">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-emerald-400 font-bold">STK Push Sent to {phone}!</p>
            <p className="text-[11px] text-slate-400">Please enter your M-Pesa PIN on your phone to complete payment.</p>
          </div>
        )}

      </div>
    </div>
  );
};