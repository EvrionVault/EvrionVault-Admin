import React, { useState, useEffect } from 'react'
import LuxuryScratchCardIntro from './LuxuryScratchCardIntro.jsx'
import LuxuryWaxSealEnvelopeIntro from './LuxuryWaxSealEnvelopeIntro.jsx'

/**
 * Parses a Hex color to generate category-specific material tints, gradients, and light effects.
 */
function getMaterialTint(tintHex = '#7A0019') {
  const hex = tintHex || '#7A0019'
  return {
    hex,
    // Velvet Curtain Fabric: Deep luxury gradient with subtle fabric fold sheen
    fabric: `linear-gradient(135deg, ${hex} 0%, #08030a 100%)`,
    fabricLeft: `linear-gradient(90deg, ${hex} 0%, ${hex}dd 30%, #08030a 100%)`,
    fabricRight: `linear-gradient(270deg, ${hex} 0%, ${hex}dd 30%, #08030a 100%)`,
    fabricFolds: `repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, transparent 15px, rgba(0,0,0,0.35) 30px)`,
    // Satin Ribbon: High-contrast metallic luster
    satinRibbon: `linear-gradient(135deg, ${hex} 0%, #ffffff33 50%, ${hex} 100%)`,
    ribbonShadow: `0 12px 35px ${hex}88`,
    // Atmosphere Lighting Glow
    ambientGlow: `radial-gradient(circle at center, ${hex}55 0%, rgba(6, 8, 18, 0.95) 85%)`,
    lightBeam: `radial-gradient(ellipse at 50% 30%, ${hex}66 0%, transparent 70%)`,
    // Metallic Foil & Glass Shimmer
    metallicFoil: `linear-gradient(135deg, ${hex} 0%, #ffffff44 45%, ${hex} 100%)`,
    accentBorder: `1px solid ${hex}77`,
    glowShadow: `0 0 30px ${hex}77`,
    buttonBg: hex,
  }
}

export default function DynamicTemplateRenderer({
  event = {},
  isPreview = false,
  isPhonePreview = false,
  children
}) {
  const [unveiled, setUnveiled] = useState(isPreview)
  const [opening, setOpening] = useState(false)

  const {
    title = 'Special Celebration',
    monogram = 'D & A',
    invitationMessage = 'We eagerly invite you to celebrate our special day with us!',
    entranceStyle = 'curtains',
    waxSealColor = 'gold',
    template = 'classic',
    colorPalette = '#7A0019', // CATEGORY TINT (Curtain fabric, ribbon, foil, glow)
    accentColor = '',        // ACTION ACCENT (Buttons, monogram seal)
    coverImage = '',
    customBgImage = ''
  } = event

  const bgPhoto = customBgImage || coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200'
  const tint = getMaterialTint(colorPalette)
  const effectiveAccent = accentColor || colorPalette || '#7A0019'

  useEffect(() => {
    setUnveiled(isPreview)
    setOpening(false)
  }, [entranceStyle, waxSealColor, template, isPreview, colorPalette])

  const handleOpenClick = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    }
    if (opening || unveiled) return
    setOpening(true)
    setTimeout(() => {
      setUnveiled(true)
    }, 2400)
  }

  const isCurtainStyle = entranceStyle?.startsWith('curtains')

  return (
    <div className={`relative ${isPhonePreview ? 'w-full h-full min-h-[560px]' : 'w-full min-h-screen'} font-serif overflow-hidden`}>
      {!unveiled && !isPreview && (
        <div
          style={{ background: tint.ambientGlow }}
          className={`${isPhonePreview ? 'absolute inset-0 z-30 w-full h-full' : 'fixed inset-0 z-50'} flex items-center justify-center overflow-hidden text-white select-none transition-all duration-700`}
        >

          {/* 📸 1. CUSTOM PHOTO BACKDROP ENTRANCE */}
          {entranceStyle === 'custom-photo' && (
            <div onClick={handleOpenClick} className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden cursor-pointer">
              <img
                src={bgPhoto}
                alt="Personal Backdrop"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] ${opening ? 'scale-110' : 'scale-100'}`}
              />
              {/* Tinted Framing Overlay — Preserves uploaded photo colors */}
              <div className="absolute inset-0 backdrop-blur-[2px]" style={{ background: `linear-gradient(180deg, ${colorPalette}44 0%, rgba(6,8,18,0.75) 100%)` }} />
              <div className="absolute inset-4 rounded-3xl border-2 pointer-events-none" style={{ borderColor: `${colorPalette}88`, boxShadow: `inset 0 0 40px ${colorPalette}44` }} />

              <div className={`relative z-30 max-w-md space-y-6 transition-all duration-1000 ${opening ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}`}>
                <div className="mx-auto w-24 h-24 rounded-full p-1 shadow-2xl" style={{ backgroundColor: effectiveAccent }}>
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-white/40">
                    <span className="text-2xl font-serif font-bold text-white tracking-widest">{monogram}</span>
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white drop-shadow-xl">{title}</h1>
                <p className="text-xs sm:text-sm text-amber-100/90 italic font-sans leading-relaxed">"{invitationMessage}"</p>
                <button
                  type="button"
                  onClick={handleOpenClick}
                  style={{ backgroundColor: effectiveAccent, boxShadow: tint.glowShadow }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs font-sans font-bold uppercase tracking-widest text-white hover:scale-105 transition cursor-pointer"
                >
                  <span>Unveil Personal Event</span>
                  <span className="font-serif">[{monogram}]</span>
                </button>
              </div>
            </div>
          )}

          {/* 🎟️ 2. INTERACTIVE METALLIC SCRATCH CARD ENTRANCE */}
          {entranceStyle?.startsWith('scratch') && (
            <LuxuryScratchCardIntro
              title={title}
              monogram={monogram}
              invitationMessage={invitationMessage}
              sealColor={waxSealColor}
              accentColor={colorPalette} // TINT controls scratch foil
              scratchType={entranceStyle}
              onScratchComplete={() => setUnveiled(true)}
            />
          )}

          {/* 🎭 3. ROYAL SILK VELVET CURTAINS ENTRANCE */}
          {isCurtainStyle && (
            <div onClick={handleOpenClick} className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer">
              
              {/* Curtains Motion: Center Open */}
              {entranceStyle === 'curtains' && (
                <>
                  <div
                    style={{ background: tint.fabricLeft }}
                    className={`absolute top-0 left-0 w-1/2 h-full shadow-2xl transition-transform duration-[2400ms] ease-in-out z-20 ${opening ? '-translate-x-full' : 'translate-x-0'}`}
                  >
                    <div className="w-full h-full" style={{ background: tint.fabricFolds }} />
                    <div className="absolute top-0 right-0 w-2 h-full bg-amber-400/60 shadow-lg" />
                  </div>
                  <div
                    style={{ background: tint.fabricRight }}
                    className={`absolute top-0 right-0 w-1/2 h-full shadow-2xl transition-transform duration-[2400ms] ease-in-out z-20 ${opening ? 'translate-x-full' : 'translate-x-0'}`}
                  >
                    <div className="w-full h-full" style={{ background: tint.fabricFolds }} />
                    <div className="absolute top-0 left-0 w-2 h-full bg-amber-400/60 shadow-lg" />
                  </div>
                </>
              )}

              {/* Curtains Motion: Swag Drapes */}
              {entranceStyle === 'curtains-swag' && (
                <>
                  <div
                    style={{ background: tint.fabric }}
                    className={`absolute top-0 left-0 w-3/4 h-full shadow-2xl transition-all duration-[2400ms] ease-in-out z-20 rounded-br-full ${opening ? '-translate-y-full -rotate-12 opacity-0' : 'translate-y-0 rotate-0 opacity-100'}`}
                  >
                    <div className="w-full h-full" style={{ background: tint.fabricFolds }} />
                  </div>
                  <div
                    style={{ background: tint.fabric }}
                    className={`absolute top-0 right-0 w-3/4 h-full shadow-2xl transition-all duration-[2400ms] ease-in-out z-20 rounded-bl-full ${opening ? '-translate-y-full rotate-12 opacity-0' : 'translate-y-0 rotate-0 opacity-100'}`}
                  >
                    <div className="w-full h-full" style={{ background: tint.fabricFolds }} />
                  </div>
                </>
              )}

              {/* Curtains Motion: Fan Unfold */}
              {entranceStyle === 'curtains-fan' && (
                <>
                  <div
                    style={{ background: tint.fabric }}
                    className={`absolute top-0 left-0 w-1/2 h-full shadow-2xl origin-bottom-left transition-transform duration-[2400ms] ease-in-out z-20 ${opening ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                  >
                    <div className="w-full h-full" style={{ background: tint.fabricFolds }} />
                  </div>
                  <div
                    style={{ background: tint.fabric }}
                    className={`absolute top-0 right-0 w-1/2 h-full shadow-2xl origin-bottom-right transition-transform duration-[2400ms] ease-in-out z-20 ${opening ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                  >
                    <div className="w-full h-full" style={{ background: tint.fabricFolds }} />
                  </div>
                </>
              )}

              {/* Curtains Motion: Ripple Wave Cascade */}
              {entranceStyle === 'curtains-ripple' && (
                <div className="absolute inset-0 flex z-20">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      style={{ background: tint.fabric }}
                      className={`w-1/4 h-full border-r border-amber-400/20 transition-transform duration-[2000ms] ease-in-out ${opening ? '-translate-y-full' : 'translate-y-0'}`}
                      style={{ transitionDelay: `${idx * 150}ms`, background: tint.fabric }}
                    >
                      <div className="w-full h-full" style={{ background: tint.fabricFolds }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Centered Monogram & Call to Unveil */}
              <div className={`relative z-30 flex flex-col items-center text-center p-6 transition-all duration-1000 ${opening ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}`}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/10 px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-amber-200">
                  <span>Royal Unveil</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif text-white drop-shadow-2xl mb-3">{title}</h1>
                <p className="max-w-md text-xs sm:text-sm text-amber-100/90 italic font-sans leading-relaxed mb-8 px-4">
                  "{invitationMessage}"
                </p>

                <button
                  type="button"
                  onClick={handleOpenClick}
                  style={{ backgroundColor: effectiveAccent, border: '3 border-amber-300/70', boxShadow: tint.glowShadow }}
                  className="relative group flex items-center justify-center w-24 h-24 rounded-full border-4 border-amber-300/80 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300"
                >
                  <span className="text-xl font-bold font-serif text-white tracking-widest">{monogram}</span>
                  <div className="absolute -bottom-8 whitespace-nowrap text-[10px] font-sans font-bold uppercase tracking-widest text-amber-300 group-hover:underline">
                    Tap to Draw Curtains
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 🎀 4. SILK RIBBON BOW UNTIE ENTRANCE */}
          {entranceStyle?.startsWith('bow') && (
            <div onClick={handleOpenClick} className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden">
              
              {/* Cross Ribbon Gift Layout */}
              {entranceStyle === 'bow-gift' ? (
                <>
                  <div
                    style={{ background: tint.satinRibbon, boxShadow: tint.ribbonShadow }}
                    className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-20 transition-all duration-[2000ms] z-10 ${opening ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
                  />
                  <div
                    style={{ background: tint.satinRibbon, boxShadow: tint.ribbonShadow }}
                    className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-20 transition-all duration-[2000ms] z-10 ${opening ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
                  />
                </>
              ) : entranceStyle === 'bow-pull' ? (
                /* Long Vertical Ribbon Strip */
                <div
                  style={{ background: tint.satinRibbon, boxShadow: tint.ribbonShadow }}
                  className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-28 transition-all duration-[2000ms] z-10 ${opening ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
                />
              ) : (
                /* Classic Bow Knot Untie */
                <div
                  style={{ background: tint.satinRibbon, boxShadow: tint.ribbonShadow }}
                  className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-24 transition-all duration-[2000ms] z-10 ${opening ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'}`}
                />
              )}

              <div className={`relative z-30 max-w-md space-y-6 transition-all duration-1000 ${opening ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
                {/* Photorealistic Ribbon Bow Emblem */}
                <div className="mx-auto w-20 h-20 rounded-full border-2 border-white/50 flex items-center justify-center shadow-2xl" style={{ background: tint.satinRibbon }}>
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C9.5 2 4 2.5 3 6c-1 3.5 3 6.5 9 6.5 6 0 10-3 9-6.5s-6.5-4-9-2zm-6 2.5c.8-.8 3.2-.8 5 .5-2 .5-4.2.2-5-.5zm12 0c-.8.7-3 .9-5 .5 1.8-1.3 4.2-1.3 5-.5z"/>
                  </svg>
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">{title}</h1>
                <p className="text-xs sm:text-sm text-slate-200 italic font-sans leading-relaxed">"{invitationMessage}"</p>

                <button
                  type="button"
                  onClick={handleOpenClick}
                  style={{ backgroundColor: effectiveAccent, boxShadow: tint.glowShadow }}
                  className="mt-6 inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-xs font-bold font-sans uppercase tracking-widest text-white hover:scale-105 transition cursor-pointer"
                >
                  <span>Untie Satin Ribbon</span>
                  <span className="font-serif">[{monogram}]</span>
                </button>
              </div>
            </div>
          )}

          {/* ❤️ 5. HEARTS & ROMANCE */}
          {entranceStyle?.startsWith('heart') && (
            <div onClick={handleOpenClick} className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden">
              <div className="absolute inset-4 rounded-[40px] border-2 pointer-events-none" style={{ borderColor: `${colorPalette}66` }} />

              {/* Photorealistic 3D Glowing Heart Center Emblem */}
              <div className={`relative z-30 max-w-md space-y-6 transition-all duration-1000 ${opening ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}`}>
                <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full blur-2xl opacity-60 animate-pulse" style={{ backgroundColor: colorPalette }} />
                  <button
                    type="button"
                    onClick={handleOpenClick}
                    style={{ background: `radial-gradient(circle, ${colorPalette} 0%, #0f0510 100%)`, border: `3px solid ${colorPalette}`, boxShadow: tint.glowShadow }}
                    className="relative z-10 w-24 h-24 rounded-full border-4 border-white/60 shadow-2xl flex flex-col items-center justify-center text-white cursor-pointer hover:scale-105 transition"
                  >
                    <svg className="w-8 h-8 text-rose-200 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="text-[11px] font-bold tracking-widest font-serif mt-1">{monogram}</span>
                  </button>
                </div>

                <h1 className="text-3xl font-serif font-bold text-white">{title}</h1>
                <p className="text-xs sm:text-sm text-rose-100/90 italic font-sans leading-relaxed">"{invitationMessage}"</p>
                <p className="text-[10px] uppercase font-sans tracking-widest text-amber-200 animate-pulse">
                  Touch Heart Locket to Unveil
                </p>
              </div>
            </div>
          )}

          {/* 🏰 6. CASTLE & PALACE ENTRANCE */}
          {(entranceStyle?.startsWith('castle') || entranceStyle?.startsWith('chandelier') || entranceStyle?.startsWith('arch')) && (
            <div onClick={handleOpenClick} className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden cursor-pointer">
              <img
                src={bgPhoto}
                alt="Palace Backdrop"
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] ${opening ? 'scale-110' : 'scale-100'}`}
              />
              {/* Dynamic Torchlight & Archway Glow using colorPalette TINT */}
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${colorPalette}77 0%, rgba(6,8,18,0.85) 90%)` }} />

              {entranceStyle === 'castle-gate' && (
                <>
                  <div className={`absolute top-0 left-0 w-1/2 h-full bg-slate-950/90 border-r-4 border-amber-400/80 z-20 origin-left transition-transform duration-[2400ms] ${opening ? '-rotate-y-90 opacity-0' : 'rotate-y-0 opacity-100'}`} />
                  <div className={`absolute top-0 right-0 w-1/2 h-full bg-slate-950/90 border-l-4 border-amber-400/80 z-20 origin-right transition-transform duration-[2400ms] ${opening ? 'rotate-y-90 opacity-0' : 'rotate-y-0 opacity-100'}`} />
                </>
              )}

              <div className={`relative z-30 max-w-lg space-y-5 transition-all duration-1000 ${opening ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
                <span className="inline-block rounded-full bg-amber-400/20 border border-amber-300/40 px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-amber-200">
                  Royal Arch Unveil
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white drop-shadow-xl">{title}</h1>
                <p className="text-xs sm:text-sm text-amber-100/90 italic font-sans leading-relaxed">"{invitationMessage}"</p>
                <button
                  type="button"
                  onClick={handleOpenClick}
                  style={{ backgroundColor: effectiveAccent, boxShadow: tint.glowShadow }}
                  className="mt-6 relative inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-xs font-sans font-bold uppercase tracking-widest text-white shadow-2xl hover:scale-105 transition cursor-pointer"
                >
                  <span>Open Royal Palace Gates</span>
                  <span className="font-serif">[{monogram}]</span>
                </button>
              </div>
            </div>
          )}

          {/* 🎈 7. BALLOONS CELEBRATION */}
          {entranceStyle?.startsWith('balloon') && (
            <div onClick={handleOpenClick} className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden cursor-pointer">
              {/* Metallic 3D Balloon Orbs colored in colorPalette */}
              <div className="absolute inset-0 flex justify-around pointer-events-none opacity-40">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="w-20 h-24 rounded-full shadow-2xl animate-bounce"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${colorPalette} 60%, #000000 100%)`,
                      animationDelay: `${idx * 200}ms`
                    }}
                  />
                ))}
              </div>

              <div className={`relative z-30 max-w-md space-y-6 transition-all duration-1000 ${opening ? 'scale-125 opacity-0' : 'scale-100 opacity-100'}`}>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">{title}</h1>
                <p className="text-xs sm:text-sm text-slate-200 italic font-sans leading-relaxed">"{invitationMessage}"</p>
                <button
                  type="button"
                  onClick={handleOpenClick}
                  style={{ backgroundColor: effectiveAccent, boxShadow: tint.glowShadow }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs font-sans font-bold uppercase tracking-widest text-white hover:scale-105 transition"
                >
                  <span>Release Celebration Balloons</span>
                  <span className="font-serif">[{monogram}]</span>
                </button>
              </div>
            </div>
          )}

          {/* 🎊 8. CONFETTI & ALL OTHER CATEGORIES (Fireworks, Stars, Sparkles, Flowers, Gifts, Cakes, Grad, Cheers, Envelope) */}
          {(!isCurtainStyle && !entranceStyle?.startsWith('scratch') && !entranceStyle?.startsWith('bow') && !entranceStyle?.startsWith('heart') && !entranceStyle?.startsWith('castle') && !entranceStyle?.startsWith('balloon') && entranceStyle !== 'custom-photo') && (
            <LuxuryWaxSealEnvelopeIntro
              title={title}
              monogram={monogram}
              sealColor={waxSealColor}
              accentColor={colorPalette} // TINT determines main envelope & accent foil
              isMobilePreview={isPhonePreview}
              onOpen={() => setUnveiled(true)}
            />
          )}

        </div>
      )}

      {/* Main Unveiled Invitation Content */}
      <div className={`transition-opacity duration-1000 ${unveiled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {children}
      </div>
    </div>
  )
}
