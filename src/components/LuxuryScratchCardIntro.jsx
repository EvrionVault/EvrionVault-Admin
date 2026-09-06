import React, { useRef, useEffect, useState } from 'react';

export default function LuxuryScratchCardIntro({
  title = 'Special Celebration',
  monogram = 'D & A',
  invitationMessage = "We eagerly invite you to celebrate our special day with us!",
  sealColor = 'gold',
  onScratchComplete
}) {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [percent, setPercent] = useState(0);
  const isDrawingRef = useRef(false);

  const foilType = sealColor === 'silver' ? 'silver' : sealColor === 'rose-gold' || sealColor === 'rose' ? 'rose-gold' : 'gold';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set resolution
    const rect = canvas.getBoundingClientRect();
    const width = rect.width > 0 ? rect.width : (canvas.parentElement?.clientWidth || 340);
    const height = rect.height > 0 ? rect.height : (canvas.parentElement?.clientHeight || 580);
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // 1. Draw Foil Background
    let grad;
    if (foilType === 'silver') {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#cbd5e1');
      grad.addColorStop(0.3, '#f8fafc');
      grad.addColorStop(0.6, '#94a3b8');
      grad.addColorStop(1, '#e2e8f0');
    } else if (foilType === 'rose-gold') {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fda4af');
      grad.addColorStop(0.3, '#fff1f2');
      grad.addColorStop(0.6, '#f43f5e');
      grad.addColorStop(1, '#fecdd3');
    } else {
      // Gold Foil Default
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#bf953f');
      grad.addColorStop(0.25, '#fcf6ba');
      grad.addColorStop(0.5, '#b38728');
      grad.addColorStop(0.75, '#fbf5b7');
      grad.addColorStop(1, '#aa771c');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Add Metallic Speckle Dust
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 1.5;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.15)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Draw Center Seal Stamp (Circular Emblem)
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.22;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = foilType === 'silver' ? '#e2e8f0' : foilType === 'rose-gold' ? '#ffe4e6' : '#fef08a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = foilType === 'silver' ? '#475569' : foilType === 'rose-gold' ? '#9f1239' : '#854d0e';
    ctx.stroke();

    // Circular Inner Dotted Border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 6, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Text Monogram
    ctx.fillStyle = foilType === 'silver' ? '#1e293b' : foilType === 'rose-gold' ? '#881337' : '#713f12';
    ctx.font = 'italic bold 22px "Great Vibes", "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(monogram, centerX, centerY - 8);

    ctx.font = '600 9px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('SCRATCH TO REVEAL ✦', centerX, centerY + 14);
    ctx.restore();

  }, [foilType, monogram]);

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = (x - rect.left);
    const clientY = (y - rect.top);

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(clientX, clientY, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    checkScratchedPercent();
  };

  const checkScratchedPercent = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    
    // Sample small 50x50 grid for performance
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    const step = 64; // Sample every 16th pixel rgba

    for (let i = 3; i < pixels.length; i += step) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampled = pixels.length / step;
    const calcPercent = Math.round((transparentCount / totalSampled) * 100);
    setPercent(calcPercent);

    if (calcPercent > 35) {
      triggerUnveil();
    }
  };

  const triggerUnveil = () => {
    if (isScratched) return;
    setIsScratched(true);
    setTimeout(() => {
      if (onScratchComplete) onScratchComplete();
    }, 600);
  };

  const handleMouseDown = (e) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[520px] bg-slate-950 overflow-hidden select-none">
      
      {/* Background Content Underneath Card (Being Scratched Off) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100/60 font-serif">
        <div className="max-w-xs space-y-3 p-6 rounded-3xl border border-amber-200/80 bg-white/90 shadow-2xl backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-amber-700">✦ Official Invitation ✦</p>
          <h2 className="text-3xl font-bold text-slate-900 leading-snug">{title}</h2>
          <p className="text-sm font-semibold text-amber-800 italic">"{invitationMessage}"</p>
          <div className="pt-2 text-xs font-sans text-slate-500 border-t border-amber-100">
            <span>{monogram}</span>
          </div>
        </div>
      </div>

      {/* HTML5 Metallic Scratch Foil Overlay */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-700 z-20 touch-none ${
          isScratched ? 'opacity-0 pointer-events-none scale-105 transition-all duration-700' : 'opacity-100'
        }`}
      />

      {/* Instruction Badge & Quick Skip */}
      {!isScratched && (
        <div className="absolute bottom-6 z-30 flex flex-col items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 bg-slate-900/80 text-amber-200 text-xs px-4 py-2 rounded-full shadow-lg border border-amber-500/30 backdrop-blur-md animate-bounce">
            <span>✨ Swipe / Scratch with finger to reveal ({percent}%)</span>
          </div>
          <button
            onClick={triggerUnveil}
            className="text-[11px] font-sans font-bold text-white/70 hover:text-white underline tracking-wider pt-1"
          >
            Instant Reveal →
          </button>
        </div>
      )}
    </div>
  );
}
