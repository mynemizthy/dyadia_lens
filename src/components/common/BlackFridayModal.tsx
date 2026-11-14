/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export const BlackFridayModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastEmail, setToastEmail] = useState('');

  // Target date: Black Friday 2026 (November 27, 2026)
  const targetDateRef = useRef<number>(new Date('2026-11-27T00:00:00').getTime());

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '12',
    hours: '15',
    minutes: '47',
    seconds: '26',
  });

  // Calculate live countdown timer
  useEffect(() => {
    function calculateTime() {
      const now = Date.now();
      let diff = targetDateRef.current - now;

      // If target passed or invalid, simulate ~12 days 15 hours dynamic countdown
      if (diff <= 0) {
        // Fallback: 12 days, 15 hours from first load
        diff = (12 * 86400 + 15 * 3600 + 47 * 60 + 26) * 1000 - ((now % 86400000) % 3600000);
      }

      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check whether to open modal automatically or via URL / event
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const forceOpen = urlParams.get('bf') === 'true' || urlParams.get('blackfriday') === '1';

    const hasClosed = sessionStorage.getItem('dyadia_bf_popup_closed');

    if (forceOpen || !hasClosed) {
      // Small delay on first page load for smooth natural entry
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen to custom open event
  useEffect(() => {
    const handleOpen = () => {
      setIsSuccess(false);
      setError(null);
      setIsOpen(true);
    };
    window.addEventListener('open_black_friday_modal', handleOpen);
    return () => window.removeEventListener('open_black_friday_modal', handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('dyadia_bf_popup_closed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Send to server endpoint
      await fetch('/api/subscribe-black-friday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrimmed }),
      }).catch(() => null);

      // 2. Save in localStorage
      try {
        const stored = localStorage.getItem('dyadia_bf_subscribers');
        const list = stored ? JSON.parse(stored) : [];
        if (!list.includes(emailTrimmed)) {
          list.push(emailTrimmed);
          localStorage.setItem('dyadia_bf_subscribers', JSON.stringify(list));
        }
      } catch {
        // Safe fallback
      }

      // 3. Switch to Success Screen
      setIsSuccess(true);
      setToastEmail(emailTrimmed);
      setShowToast(true);

      // 4. Auto close popup after 2.8 seconds as requested
      setTimeout(() => {
        handleClose();
      }, 2800);

      // Keep toast visible a bit longer
      setTimeout(() => {
        setShowToast(false);
      }, 6000);
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-[9999] max-w-sm w-full bg-[#18181B] text-white p-4 rounded-2xl shadow-2xl border border-rose-500/40 flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#FF6086] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm">
            <p className="font-bold text-white">Đăng ký Black Friday thành công! 🎉</p>
            <p className="text-gray-300 mt-0.5">
              Dyadia đã ghi nhận email <span className="text-[#FF6086] font-semibold">{toastEmail}</span>. Hãy kiểm tra hộp thư của bạn!
            </p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reopen Floating Trigger Pill (When modal is closed) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsSuccess(false);
            setIsOpen(true);
          }}
          className="fixed bottom-6 left-6 z-40 bg-black hover:bg-zinc-900 text-white px-4 py-2.5 rounded-full border border-[#FF6086]/50 shadow-xl shadow-black/30 hover:scale-105 transition-all flex items-center gap-2 group cursor-pointer"
          title="Xem thông báo ưu đãi Black Friday"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF6086] animate-ping" />
          <span className="text-xs font-bold tracking-wider text-[#FF6086] uppercase">BLACK FRIDAY</span>
          <span className="text-xs text-white/80 font-mono hidden sm:inline">
            {timeLeft.days} ngày {timeLeft.hours} giờ
          </span>
        </button>
      )}

      {/* Modal Backdrop & Container */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="relative w-full max-w-[420px] bg-black text-white rounded-[32px] p-8 sm:p-10 shadow-2xl border border-white/10 text-center overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Top-Right Circular Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng pop-up"
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/80 flex items-center justify-center text-white/90 hover:text-white hover:border-white hover:scale-105 transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {!isSuccess ? (
              /* SCREEN 1: FORM & COUNTDOWN (TIẾNG VIỆT) */
              <div>
                {/* Kicker */}
                <p className="text-white text-xs font-semibold uppercase tracking-[0.22em] mb-2">
                  SẮP DIỄN RA
                </p>

                {/* Big Headline */}
                <h2 className="text-[#FF6086] text-4xl sm:text-[42px] font-black tracking-tight leading-none mb-3">
                  BLACK FRIDAY
                </h2>

                {/* Subtext */}
                <p className="text-white font-bold text-sm sm:text-base leading-snug">
                  Đại tiệc ưu đãi lớn nhất năm sắp bắt đầu
                </p>
                <p className="text-white text-xs sm:text-sm mt-1 mb-6 flex items-center justify-center gap-1.5 font-normal">
                  <span>Nhập email để nhận thông báo sớm nhất ngay khi mở bán</span>
                  <span className="text-base">🔔</span>
                </p>

                {/* Subscription Form */}
                <form onSubmit={handleSubmit} className="mb-6">
                  <div className="mb-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Nhập địa chỉ email của bạn"
                      className="w-full px-5 py-3.5 bg-white text-gray-900 placeholder:text-gray-400 font-medium text-sm sm:text-base rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6086] shadow-inner text-left"
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-[#FF6086] text-xs font-medium text-left px-4">{error}</p>}

                  {/* Countdown Timer */}
                  <div className="flex items-center justify-center gap-1 sm:gap-2 my-6">
                    {/* Days */}
                    <div className="flex flex-col items-center min-w-[54px]">
                      <span className="text-[#FF6086] text-3xl sm:text-4xl font-extrabold tracking-tight font-mono leading-none">
                        {timeLeft.days}
                      </span>
                      <span className="text-[#FF6086] text-[11px] sm:text-xs font-normal lowercase mt-1.5">
                        ngày
                      </span>
                    </div>

                    <span className="text-[#FF6086] text-2xl sm:text-3xl font-extrabold -mt-4">:</span>

                    {/* Hours */}
                    <div className="flex flex-col items-center min-w-[54px]">
                      <span className="text-[#FF6086] text-3xl sm:text-4xl font-extrabold tracking-tight font-mono leading-none">
                        {timeLeft.hours}
                      </span>
                      <span className="text-[#FF6086] text-[11px] sm:text-xs font-normal lowercase mt-1.5">
                        giờ
                      </span>
                    </div>

                    <span className="text-[#FF6086] text-2xl sm:text-3xl font-extrabold -mt-4">:</span>

                    {/* Minutes */}
                    <div className="flex flex-col items-center min-w-[54px]">
                      <span className="text-[#FF6086] text-3xl sm:text-4xl font-extrabold tracking-tight font-mono leading-none">
                        {timeLeft.minutes}
                      </span>
                      <span className="text-[#FF6086] text-[11px] sm:text-xs font-normal lowercase mt-1.5">
                        phút
                      </span>
                    </div>

                    <span className="text-[#FF6086] text-2xl sm:text-3xl font-extrabold -mt-4">:</span>

                    {/* Seconds */}
                    <div className="flex flex-col items-center min-w-[54px]">
                      <span className="text-[#FF6086] text-3xl sm:text-4xl font-extrabold tracking-tight font-mono leading-none">
                        {timeLeft.seconds}
                      </span>
                      <span className="text-[#FF6086] text-[11px] sm:text-xs font-normal lowercase mt-1.5">
                        giây
                      </span>
                    </div>
                  </div>

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#FF6086] hover:bg-[#fa4b75] active:scale-[0.99] disabled:opacity-75 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase rounded-full shadow-lg shadow-[#FF6086]/25 transition-all cursor-pointer"
                  >
                    {isSubmitting ? 'ĐANG ĐĂNG KÝ...' : 'ĐĂNG KÝ NGAY'}
                  </button>
                </form>
              </div>
            ) : (
              /* SCREEN 2: SUCCESS WITH CELEBRATION GRAPHIC (TIẾNG VIỆT) */
              <div className="py-2 animate-in fade-in duration-300 flex flex-col items-center">
                {/* Headline */}
                <h2 className="text-[#FF6086] text-2xl sm:text-[30px] font-extrabold leading-tight text-center mb-6 px-2">
                  Bạn sẽ là người<br />
                  đầu tiên biết khi<br />
                  Black Friday<br />
                  bắt đầu
                </h2>

                {/* 3D Party Popper Illustration */}
                <div className="relative my-2 w-36 h-36 flex items-center justify-center">
                  <svg
                    viewBox="0 0 160 160"
                    className="w-32 h-32 drop-shadow-[0_10px_20px_rgba(255,96,134,0.35)] animate-bounce duration-1000"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Definitions for 3D gradients */}
                    <defs>
                      <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FBBF24" />
                        <stop offset="60%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#D97706" />
                      </linearGradient>
                      <linearGradient id="blueStripeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="100%" stopColor="#2563EB" />
                      </linearGradient>
                      <linearGradient id="pinkRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6086" />
                        <stop offset="100%" stopColor="#DB2777" />
                      </linearGradient>
                      <linearGradient id="cyanRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#0284C7" />
                      </linearGradient>
                    </defs>

                    {/* Confetti dots */}
                    <circle cx="78" cy="28" r="5" fill="#FBBF24" />
                    <circle cx="48" cy="52" r="5" fill="#FF6086" />
                    <circle cx="118" cy="46" r="4.5" fill="#FF6086" />
                    <circle cx="126" cy="98" r="4.5" fill="#FDE68A" />
                    <circle cx="106" cy="74" r="3.5" fill="#38BDF8" />

                    {/* Magenta upper ribbon curl */}
                    <path
                      d="M62 70 C52 50, 60 38, 70 38 C76 38, 78 44, 76 50 C74 56, 68 60, 62 70"
                      fill="none"
                      stroke="url(#pinkRibbonGrad)"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />

                    {/* Cyan center-looping ribbon */}
                    <path
                      d="M74 72 C80 50, 84 36, 96 36 C106 36, 110 46, 102 54 C94 62, 82 66, 78 72"
                      fill="none"
                      stroke="url(#cyanRibbonGrad)"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />

                    {/* Magenta right ribbon */}
                    <path
                      d="M84 76 C102 65, 120 70, 134 78"
                      fill="none"
                      stroke="url(#pinkRibbonGrad)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    {/* Cyan lower right ribbon */}
                    <path
                      d="M80 84 C96 82, 114 86, 132 94"
                      fill="none"
                      stroke="url(#cyanRibbonGrad)"
                      strokeWidth="6.5"
                      strokeLinecap="round"
                    />

                    {/* Party Popper Cone Body */}
                    <g transform="rotate(-36 70 100)">
                      {/* Base Cone */}
                      <path
                        d="M48 68 L78 126 C80 130, 84 130, 86 126 L116 68 Z"
                        fill="url(#coneGrad)"
                      />

                      {/* Blue stripe 1 (lower) */}
                      <path
                        d="M66 102 L70 110 L94 110 L98 102 Z"
                        fill="url(#blueStripeGrad)"
                      />

                      {/* Blue stripe 2 (upper) */}
                      <path
                        d="M56 82 L60 90 L104 90 L108 82 Z"
                        fill="url(#blueStripeGrad)"
                      />

                      {/* Rim ellipse at the mouth */}
                      <ellipse
                        cx="82"
                        cy="68"
                        rx="34"
                        ry="10"
                        fill="#F59E0B"
                        stroke="#FCD34D"
                        strokeWidth="2.5"
                      />
                      <ellipse
                        cx="82"
                        cy="68"
                        rx="31"
                        ry="8"
                        fill="#B45309"
                      />
                    </g>
                  </svg>
                </div>

                {/* Subtitle */}
                <p className="text-white text-xs sm:text-sm font-medium text-center text-white/95 mt-4">
                  Dyadia đã gửi email xác nhận. Hãy kiểm tra hộp thư của bạn nhé!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
