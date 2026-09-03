import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 p-2 px-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-6">
          <Mail className="w-3.5 h-3.5" />
          <span>JOIN THE COUTURE INNER CIRCLE</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
          Stay Ahead of the Runway
        </h2>

        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Subscribe for early access to limited edition drops, bespoke styling lookbooks, and private seasonal invitations.
        </p>

        {subscribed ? (
          <div className="p-4 max-w-md mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Thank you for subscribing! Check your inbox for your 20% welcome code.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="flex-1 px-5 py-3.5 rounded-full bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm shadow-inner"
            />
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full gold-gradient-btn text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-slate-500 mt-4">
          We honor your privacy. Unsubscribe whenever you wish with one click.
        </p>

      </div>
    </section>
  );
};

export default Newsletter;
