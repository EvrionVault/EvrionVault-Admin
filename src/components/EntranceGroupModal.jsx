import React from 'react'
import ImageUpload from './ImageUpload.jsx'

export const ENTRANCE_GROUPS = {
  'custom-photo': {
    title: 'Custom Photo Studio & Backdrop',
    icon: '📸',
    description: 'Upload your personal image backdrop; tint controls the border frame, badge glow, and unseal button.',
    styles: [
      { id: 'custom-photo', label: 'Custom Photo Backdrop', desc: 'Full-screen personal photo with luxury framed border' },
    ],
    showPhotoUpload: true,
  },
  curtains: {
    title: 'Curtains Entrance',
    icon: '🎭',
    description: 'Cinematic velvet curtains reveal. Tint controls the fabric color.',
    styles: [
      { id: 'curtains', label: 'Center Open', desc: 'Classic center split velvet curtain draw' },
      { id: 'curtains-swag', label: 'Swag Drapes', desc: 'Elegant side swag curtain unveil' },
      { id: 'curtains-fan', label: 'Fan Unfold', desc: 'Radial arc fan unfold animation' },
      { id: 'curtains-ripple', label: 'Ripple Wave', desc: 'Multi-panel silk wave cascade' },
    ],
  },
  hearts: {
    title: 'Hearts & Romance',
    icon: '❤️',
    description: 'Romantic heart locket and particle effects. Tint controls the heart surfaces and glowing aura.',
    styles: [
      { id: 'heart-beat', label: 'Pulsing Heart Locket', desc: 'Central pulsing heart emblem reveal' },
      { id: 'heart-burst', label: 'Heart Particle Burst', desc: 'Explosive radial heart particles' },
      { id: 'heart-floating', label: 'Floating Hearts', desc: 'Drifting romantic hearts atmosphere' },
      { id: 'heart-swirl', label: 'Heart Swirl Vortex', desc: 'Spiral heart ring unveil' },
    ],
  },
  envelope: {
    title: '3D Wax Seal Envelopes',
    icon: '✉️',
    description: 'Interactive 3D cardstock envelope. Tint controls envelope accents and card lining.',
    styles: [
      { id: 'envelope-open', label: 'Classic Flap Open', desc: 'Interactive 3D wax seal envelope flap open' },
      { id: 'envelope-flyin', label: 'Envelope Fly-In', desc: 'Gliding 3D wax-sealed envelope arrival' },
      { id: 'envelope-letter', label: 'Letter Extraction', desc: 'Sliding invitation card extract animation' },
    ],
    showSealPalette: true,
  },
  castles: {
    title: 'Palace & Castles',
    icon: '🏰',
    description: 'Grand royal gates and palace archways. Tint controls torchlight illumination, banners, and architectural glow.',
    styles: [
      { id: 'castle-gate', label: 'Iron Gate Swing', desc: 'Royal wrought iron gate swing open' },
      { id: 'castle-drawbridge', label: 'Lowering Drawbridge', desc: 'Grand drawbridge unveil sequence' },
      { id: 'castle-build', label: 'Palace Archway', desc: 'Architectural archway lighting reveal' },
    ],
    showPhotoUpload: true,
  },
  scratch: {
    title: 'Interactive Scratch Cards',
    icon: '🎟️',
    description: 'Metallic foil scratch card. Tint controls the scratch foil metallic shimmer.',
    styles: [
      { id: 'scratch-mystery', label: 'Mystery Foil', desc: 'Metallic foil scratch-to-reveal surface' },
      { id: 'scratch-prize', label: 'Prize Unveil', desc: 'Silver/gold metallic shimmer scratch card' },
      { id: 'scratch-photo', label: 'Photo Scratch', desc: 'Photo backdrop with metallic foil layer' },
      { id: 'scratch-match', label: 'Dual Panel Scratch', desc: 'Interactive split scratch panel' },
    ],
    showSealPalette: true,
  },
  bow: {
    title: 'Bow Knots & Ribbons',
    icon: '🎀',
    description: 'Luxury satin velvet ribbon untie sequence. Tint controls ribbon fabric color.',
    styles: [
      { id: 'bow-untie', label: 'Untie Silk Bow', desc: 'Velvet ribbon untie sequence' },
      { id: 'bow-pull', label: 'Pull Ribbon Strip', desc: 'Satin ribbon pull unwrap' },
      { id: 'bow-gift', label: 'Cross Ribbon Gift', desc: 'Decorative cross ribbon unwrap' },
    ],
  },
  balloons: {
    title: 'Balloons Celebration',
    icon: '🎈',
    description: '3D Metallic balloon cluster. Tint determines dominant balloon color palette.',
    styles: [
      { id: 'balloon-float', label: 'Rising Float', desc: 'Rising metallic celebration balloons' },
      { id: 'balloon-pop', label: 'Pop & Reveal', desc: 'Interactive balloon pop reveal' },
      { id: 'balloon-release', label: 'Sky Release', desc: 'Ascending sky balloon launch' },
    ],
  },
  confetti: {
    title: 'Confetti Explosions',
    icon: '🎊',
    description: 'Festive particle showers. Tint controls dominant confetti particle colors.',
    styles: [
      { id: 'confetti-burst', label: 'Confetti Pop Burst', desc: 'Shimmering confetti explosion' },
      { id: 'confetti-fall', label: 'Cascading Shower', desc: 'Falling confetti particle shower' },
      { id: 'confetti-cannon', label: 'Dual Cannon Blast', desc: 'Synchronized confetti cannon blast' },
    ],
  },
  fireworks: {
    title: 'Fireworks Display',
    icon: '🎆',
    description: 'Night sky fireworks display. Tint controls firework rockets, light trails, and explosions.',
    styles: [
      { id: 'fireworks-single', label: 'Single Rocket Launch', desc: 'Grand single rocket launch & burst' },
      { id: 'fireworks-double', label: 'Synchronized Dual Blast', desc: 'Dual firework blast display' },
      { id: 'fireworks-finale', label: 'Midnight Grand Finale', desc: 'Full sky fireworks spectacle' },
    ],
  },
  stars: {
    title: 'Stars & Constellations',
    icon: '⭐',
    description: 'Celestial starlight field. Tint controls star glow and light streaks.',
    styles: [
      { id: 'stars-twinkle', label: 'Twinkling Constellations', desc: 'Shimmering celestial star field' },
      { id: 'stars-burst', label: 'Starlight Explosion', desc: 'Radiant star burst reveal' },
      { id: 'stars-shooting', label: 'Meteor Shooting Stars', desc: 'Shooting star light trails' },
    ],
  },
  sparkles: {
    title: 'Sparkles & Magic',
    icon: '✨',
    description: 'Enchanting particle dust. Tint controls particle light and sparkle glow.',
    styles: [
      { id: 'sparkles-glow', label: 'Ambient Golden Glow', desc: 'Warm glowing light atmosphere' },
      { id: 'sparkles-shimmer', label: 'Diamond Particle Dust', desc: 'Crystallized diamond shimmer' },
      { id: 'sparkles-sweep', label: 'Magic Wand Sweep', desc: 'Sparkle dust wave sweep' },
    ],
  },
  flowers: {
    title: 'Floral Petals & Bloom',
    icon: '🌸',
    description: 'Soft floral bloom animation. Tint controls petal and flower bloom color.',
    styles: [
      { id: 'flowers-bloom', label: 'Rose Flower Bloom', desc: 'Opening rose bloom animation' },
      { id: 'flowers-fall', label: 'Drifting Petal Breeze', desc: 'Soft falling petal breeze' },
      { id: 'flowers-scatter', label: 'Floral Scatter Burst', desc: 'Radial flower petal scatter' },
    ],
  },
  gifts: {
    title: 'Gift Box Surprises',
    icon: '🎁',
    description: '3D Gift box unwrap. Tint controls wrapping paper and ribbon color.',
    styles: [
      { id: 'gift-open', label: '3D Gift Box Open', desc: 'Unwrap gift box lid sequence' },
      { id: 'gift-unwrap', label: 'Ribbon Unwrap', desc: 'Velvet ribbon gift reveal' },
      { id: 'gift-pop', label: 'Surprise Pop Box', desc: 'Surprise pop box unveil' },
    ],
  },
  cakes: {
    title: 'Cakes & Candles',
    icon: '🎂',
    description: 'Multi-tier celebration cake. Tint controls icing accents and decorative trim.',
    styles: [
      { id: 'cake-cut', label: 'Celebration Cake Cut', desc: 'Cake slice unveil sequence' },
      { id: 'cake-candle', label: 'Candle Blow Out', desc: 'Interactive candle flame blow out' },
      { id: 'cake-reveal', label: 'Multi-Tier Reveal', desc: 'Grand multi-tier cake reveal' },
    ],
  },
  graduation: {
    title: 'Graduation Cap & Diploma',
    icon: '🎓',
    description: 'Academic celebration. Tint controls cap tassel, sash, and diploma ribbon.',
    styles: [
      { id: 'grad-captoss', label: 'Mortarboard Cap Toss', desc: 'Cap toss celebration reveal' },
      { id: 'grad-diploma', label: 'Diploma Scroll Unroll', desc: 'Ribbon diploma scroll reveal' },
    ],
  },
  celebration: {
    title: 'Cheers & Glass Toast',
    icon: '🥂',
    description: 'Crystal champagne toast. Tint controls flute glass glow and celebration lighting.',
    styles: [
      { id: 'cheers-toast', label: 'Champagne Toast', desc: 'Crystal glass clink toast' },
      { id: 'cheers-clink', label: 'Glass Clink', desc: 'Sparkling clink animation' },
      { id: 'cheers-sparkle', label: 'Champagne Fountain', desc: 'Bubbly champagne fountain reveal' },
    ],
  },
}

export const TINT_PRESETS = [
  { id: 'burgundy', name: 'Burgundy Velvet', hex: '#7A0019' },
  { id: 'emerald', name: 'Imperial Emerald', hex: '#0B3D2E' },
  { id: 'sapphire', name: 'Royal Sapphire', hex: '#1E3A8A' },
  { id: 'purple', name: 'Regal Purple', hex: '#581C87' },
  { id: 'rose', name: 'Blush Rose', hex: '#BE123C' },
  { id: 'gold', name: 'Imperial Gold', hex: '#D4AF37' },
  { id: 'onyx', name: 'Midnight Onyx', hex: '#0F172A' },
  { id: 'slate', name: 'Classic Slate', hex: '#334155' },
]

export const WAX_SEAL_PALETTE = [
  { id: 'gold', name: '24k Gold', hex: '#d4af37', bg: 'from-amber-600 to-amber-700' },
  { id: 'burgundy', name: 'Burgundy', hex: '#7a0019', bg: 'from-rose-900 to-rose-950' },
  { id: 'emerald', name: 'Emerald', hex: '#0b3d2e', bg: 'from-emerald-800 to-emerald-950' },
  { id: 'silver', name: 'Platinum', hex: '#94a3b8', bg: 'from-slate-400 to-slate-600' },
  { id: 'rose', name: 'Rose Gold', hex: '#be123c', bg: 'from-pink-600 to-pink-700' },
  { id: 'purple', name: 'Purple', hex: '#581c87', bg: 'from-purple-800 to-purple-950' },
]

export default function EntranceGroupModal({
  isOpen,
  groupKey = 'curtains',
  form = {},
  onChange = () => {},
  onClose = () => {},
}) {
  if (!isOpen) return null

  const groupConfig = ENTRANCE_GROUPS[groupKey] || ENTRANCE_GROUPS.curtains
  const currentTint = form.colorPalette || '#7A0019'

  const handleSelectStyle = (styleId) => {
    onChange({ entranceStyle: styleId })
  }

  const handleSelectTint = (hexColor) => {
    onChange({ colorPalette: hexColor })
  }

  const handleSelectSealColor = (colorId) => {
    onChange({ waxSealColor: colorId })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{groupConfig.icon}</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{groupConfig.title}</h2>
              <p className="text-xs text-slate-500">{groupConfig.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Custom Photo Upload (If Group supports it) */}
          {groupConfig.showPhotoUpload && (
            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                📸 Entrance Backdrop Photo
              </label>
              <ImageUpload
                value={form.customBgImage || form.coverImage}
                onChange={(url) => onChange({ customBgImage: url })}
                folder="entrances"
              />
            </div>
          )}

          {/* 1. Sub-Style Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2.5">
              1. Select Sub-Style
            </label>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {groupConfig.styles.map((st) => {
                const isSelected = form.entranceStyle === st.id

                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelectStyle(st.id)}
                    className={`flex flex-col justify-between rounded-2xl border-2 p-3.5 text-left transition ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs sm:text-sm">{st.label}</p>
                        {isSelected && (
                          <span className="h-4 w-4 rounded-full bg-white text-slate-900 flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {st.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Category Tint Selection */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  2. Select Tint Color
                </label>
                <p className="text-[11px] text-slate-500">
                  Controls primary element color (fabric, foil, ribbon, lighting, glow).
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1 shrink-0">
                <input
                  type="color"
                  value={currentTint}
                  onChange={(e) => handleSelectTint(e.target.value)}
                  className="h-6 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={currentTint}
                  onChange={(e) => handleSelectTint(e.target.value)}
                  className="w-16 text-[11px] font-mono font-bold text-slate-700 bg-transparent outline-none uppercase"
                />
              </div>
            </div>

            {/* Tint Preset Color Swatches */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
              {TINT_PRESETS.map((preset) => {
                const isSelected = currentTint.toLowerCase() === preset.hex.toLowerCase()
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectTint(preset.hex)}
                    title={preset.name}
                    className={`group relative flex flex-col items-center gap-1 p-1.5 rounded-xl border transition ${
                      isSelected ? 'border-slate-900 bg-white shadow-md ring-2 ring-slate-900' : 'border-transparent hover:bg-white'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-black/10 shadow-sm transition-transform group-hover:scale-110"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="text-[9px] font-medium text-slate-600 truncate max-w-full">
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Wax Seal Stamp Palette (For Envelopes / Scratch) */}
          {groupConfig.showSealPalette && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2.5">
                3. Wax Seal Stamp Color
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {WAX_SEAL_PALETTE.map((pal) => {
                  const isSelected = form.waxSealColor === pal.id
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => handleSelectSealColor(pal.id)}
                      className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition ${
                        isSelected ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${pal.bg} border ${
                          isSelected ? 'border-amber-300 ring-1 ring-amber-400' : 'border-white'
                        }`}
                      />
                      <span className="text-[10px] font-medium truncate w-full">{pal.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Monogram Initials & Intro Statement Input */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Monogram Initials (On Seal / Stamp Emblem)
              </label>
              <input
                type="text"
                maxLength={8}
                value={form.monogram || ''}
                onChange={(e) => onChange({ monogram: e.target.value })}
                placeholder="e.g. D & A"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Host Intro Statement (Displayed on Unveil)
              </label>
              <textarea
                rows={2}
                value={form.invitationMessage || ''}
                onChange={(e) => onChange({ invitationMessage: e.target.value })}
                placeholder="e.g. We eagerly invite you to celebrate our special day with us!"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTint }} />
            <span>Live Preview Ready</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-lg transition uppercase tracking-wider hover:opacity-95"
            style={{ backgroundColor: currentTint }}
          >
            Apply & View Animation ✨
          </button>
        </div>

      </div>
    </div>
  )
}
