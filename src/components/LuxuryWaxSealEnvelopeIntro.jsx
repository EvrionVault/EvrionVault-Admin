import React, { useState } from 'react'

const SEAL_COLORS = {
  gold: { bg: 'linear-gradient(135deg, #e6c875 0%, #d4af37 40%, #aa820a 100%)', border: '#b89018', text: '#594100' },
  pearl: { bg: 'linear-gradient(135deg, #ffffff 0%, #f3eee6 50%, #d9d2c5 100%)', border: '#c7bfb1', text: '#4a4439' },
  burgundy: { bg: 'linear-gradient(135deg, #a31c38 0%, #800020 50%, #4a0011 100%)', border: '#5e0015', text: '#ffd700' },
  emerald: { bg: 'linear-gradient(135deg, #0b8043 0%, #046307 50%, #013603 100%)', border: '#024003', text: '#f3e5ab' },
  velvet: { bg: 'linear-gradient(135deg, #333333 0%, #1a1a1a 50%, #000000 100%)', border: '#444444', text: '#d4af37' }
}

export default function LuxuryWaxSealEnvelopeIntro({
  title = 'David & Anna',
  monogram = '',
  sealColor = 'gold',
  onOpen = () => {},
  isMobilePreview = false,
}) {
  const [animating, setAnimating] = useState(false)
  const [opened, setOpened] = useState(false)

  const derivedMonogram = monogram?.trim() || title
    ? title
        .split(/&|and|\s+/)
        .filter(Boolean)
        .map(w => w[0]?.toUpperCase())
        .slice(0, 2)
        .join(' & ')
    : 'D & A'

  const currentSeal = SEAL_COLORS[sealColor] || SEAL_COLORS.gold

  const handleOpen = () => {
    if (animating || opened) return
    setAnimating(true)
    setTimeout(() => {
      setOpened(true)
      onOpen()
    }, 1200)
  }

  return (
    <div
      onClick={handleOpen}
      className={`relative flex items-center justify-center cursor-pointer select-none transition-all duration-700 ${
        isMobilePreview
          ? 'w-full h-full p-4 bg-amber-950/20'
          : 'absolute inset-0 z-40 bg-[#121212]/90 backdrop-blur-md p-4 sm:p-8'
      }`}
      style={{ perspective: '1200px' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,700;1,600&family=Great+Vibes&display=swap');

        .font-calligraphy {
          font-family: 'Great Vibes', 'Cormorant Garamond', cursive, serif;
        }
        .font-luxury-serif {
          font-family: 'Cormorant Garamond', 'Cinzel', serif;
        }
        
        .bas-relief-pattern {
          background-image: radial-gradient(#d4af37 0.75px, transparent 0.75px), radial-gradient(#d4af37 0.75px, #fdfbf7 0.75px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
          opacity: 0.15;
        }

        .seal-emboss-shadow {
          box-shadow: 
            0 12px 28px rgba(0, 0, 0, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.6),
            inset 0 -4px 8px rgba(0, 0, 0, 0.5);
        }

        .envelope-shadow {
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.35),
            0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .envelope-flap-shadow {
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25));
        }
      `}</style>

      <div
        className={`relative w-full max-w-sm sm:max-w-md aspect-[3/4.2] bg-[#fcf9f2] rounded-3xl overflow-hidden envelope-shadow transition-transform duration-700 ${
          animating ? 'scale-105 opacity-90' : 'hover:scale-[1.02]'
        }`}
        style={{
          border: '1px solid #e8e0d0',
        }}
      >
        <div className="absolute inset-0 bas-relief-pattern pointer-events-none" />

        <div className="absolute inset-x-0 top-0 h-40 pointer-events-none opacity-40 flex justify-center">
          <svg className="w-full h-full text-[#c2b295]" viewBox="0 0 400 150" fill="currentColor">
            <path d="M200,10 C220,40 280,30 310,60 C340,90 380,80 400,110 L400,0 L0,0 L0,110 C20,80 60,90 90,60 C120,30 180,40 200,10 Z" opacity="0.2" />
            <circle cx="200" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <path d="M170,30 Q200,5 230,30 Q200,55 170,30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          </svg>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none opacity-40 flex justify-center rotate-180">
          <svg className="w-full h-full text-[#c2b295]" viewBox="0 0 400 150" fill="currentColor">
            <path d="M200,10 C220,40 280,30 310,60 C340,90 380,80 400,110 L400,0 L0,0 L0,110 C20,80 60,90 90,60 C120,30 180,40 200,10 Z" opacity="0.2" />
            <circle cx="200" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>

        <div
          className={`absolute inset-4 bg-[#fffefb] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-between border border-[#e5dccb] shadow-inner transition-transform duration-1000 ease-out z-10 ${
            animating ? '-translate-y-16 scale-105' : 'translate-y-0'
          }`}
        >
          <div className="text-center space-y-2 mt-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ab9468]">
              Together with their families
            </span>
            <h2 className="font-calligraphy text-4xl sm:text-5xl text-[#2a241b] leading-tight pt-2">
              {title}
            </h2>
            <div className="w-16 h-0.5 bg-[#d4af37] mx-auto my-3 opacity-60" />
            <p className="font-luxury-serif text-xs uppercase tracking-widest text-[#73644d]">
              Request the honour of your presence
            </p>
          </div>

          <div className="text-center space-y-1 mb-4">
            <p className="font-luxury-serif text-sm font-bold text-[#2a241b] tracking-wider">
              CELEBRATION INVITATION
            </p>
            <span className="text-[10px] text-[#ab9468] font-bold tracking-widest uppercase block animate-pulse">
              Tap anywhere to unseal
            </span>
          </div>
        </div>

        <div
          className={`absolute inset-x-0 top-0 h-1/2 z-20 origin-top transition-transform duration-1000 ease-in-out envelope-flap-shadow ${
            animating ? '-rotate-x-180' : 'rotate-x-0'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'top',
          }}
        >
          <svg className="w-full h-full drop-shadow-md" viewBox="0 0 400 240" preserveAspectRatio="none">
            <path
              d="M0,0 L200,220 L400,0 Z"
              fill="#f8f4eb"
              stroke="#e2d7c3"
              strokeWidth="2"
            />
            <path
              d="M20,0 L200,198 L380,0"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              opacity="0.6"
            />
          </svg>
        </div>

        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-700 ease-out ${
            animating ? 'scale-150 opacity-0 -translate-y-24' : 'scale-100 opacity-100 hover:scale-110'
          }`}
        >
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center seal-emboss-shadow relative overflow-hidden"
            style={{
              background: currentSeal.bg,
              border: `3px solid ${currentSeal.border}`,
            }}
          >
            <div className="absolute inset-1 rounded-full border border-white/30 pointer-events-none" />
            <div className="absolute inset-2.5 rounded-full border border-black/20 pointer-events-none" />

            <div className="text-center px-1 z-10">
              <span
                className="font-calligraphy text-xl sm:text-2xl font-bold tracking-tight block drop-shadow-sm"
                style={{ color: currentSeal.text }}
              >
                {derivedMonogram}
              </span>
            </div>
          </div>
        </div>

        {!animating && (
          <div className="absolute bottom-4 inset-x-0 text-center z-30 pointer-events-none">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-1.5 text-[11px] font-bold text-amber-200 backdrop-blur-md shadow-lg border border-amber-400/30 animate-bounce">
              <span>✉️</span>
              <span className="tracking-widest uppercase">Tap Seal to Open</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
