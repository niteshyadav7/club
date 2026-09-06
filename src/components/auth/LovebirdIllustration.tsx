import React from 'react';

interface LovebirdIllustrationProps {
  className?: string;
}

export const LovebirdIllustration: React.FC<LovebirdIllustrationProps> = ({ className = 'w-full h-auto max-w-xs' }) => {
  return (
    <svg
      viewBox="0 0 360 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Stylized Bird and Botanical Illustration"
    >
      {/* Background Soft Glow */}
      <circle cx="180" cy="200" r="140" fill="rgba(255, 255, 255, 0.08)" />

      {/* --- BOTANICAL STEMS & FLORA BEHIND BIRD --- */}
      
      {/* Main Curving Vine Stem */}
      <path
        d="M 180 320 C 185 240, 160 160, 210 90 C 225 70, 240 60, 248 40"
        stroke="#476251"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      
      {/* Branch to left top tulip */}
      <path
        d="M 175 190 C 150 170, 125 155, 115 110"
        stroke="#476251"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Branch to right flower */}
      <path
        d="M 195 180 C 230 170, 270 180, 290 145"
        stroke="#476251"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Yellow Berries Cluster on Left Top */}
      <path d="M 180 100 C 160 85, 140 75, 125 55" stroke="#476251" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 140 75 L 120 70" stroke="#476251" strokeWidth="2" strokeLinecap="round" />
      <path d="M 150 82 L 140 98" stroke="#476251" strokeWidth="2" strokeLinecap="round" />
      <path d="M 170 95 L 180 80" stroke="#476251" strokeWidth="2" strokeLinecap="round" />
      
      {/* Golden Berries */}
      <circle cx="125" cy="52" r="9" fill="#f6d376" />
      <circle cx="118" cy="69" r="8" fill="#f6d376" />
      <circle cx="138" cy="100" r="8.5" fill="#f6d376" />
      <circle cx="180" cy="78" r="8" fill="#f6d376" />
      <circle cx="160" cy="50" r="7.5" fill="#f6f2dd" />

      {/* Top Rose Bud */}
      <g transform="translate(130, 95)">
        <path
          d="M 0 0 C -12 -5, -15 -25, 0 -30 C 15 -25, 12 -5, 0 0 Z"
          fill="#94263c"
        />
        <path
          d="M -6 -10 C -16 -18, -12 -30, 0 -30 C -4 -20, -2 -14, -6 -10 Z"
          fill="#b73952"
        />
        <path
          d="M 5 -8 C 12 -16, 14 -28, 0 -30 C 6 -22, 6 -14, 5 -8 Z"
          fill="#d8526d"
        />
      </g>

      {/* Large Left Tulip Blossom */}
      <g transform="translate(135, 170)">
        {/* Calyx / Leaves */}
        <path d="M 0 5 C -15 15, -25 0, -20 -15" stroke="#476251" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 0 5 C 10 15, 20 5, 18 -10" stroke="#476251" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        
        {/* Petals */}
        <path
          d="M -25 -15 C -35 -40, -10 -65, 0 -45 C 10 -65, 35 -40, 25 -15 C 20 10, -20 10, -25 -15 Z"
          fill="#e6526e"
        />
        <path
          d="M -15 -18 C -28 -38, -5 -58, 0 -42 C -4 -25, -10 -15, -15 -18 Z"
          fill="#c0324e"
        />
        <path
          d="M 15 -18 C 28 -38, 5 -58, 0 -42 C 4 -25, 10 -15, 15 -18 Z"
          fill="#f4748d"
        />
        <path
          d="M -5 -25 C 0 -40, 0 -40, 5 -25 C 2 -18, -2 -18, -5 -25 Z"
          fill="#fbb0be"
        />
      </g>

      {/* Tiny Pink Flower Accent */}
      <g transform="translate(178, 160)">
        <circle cx="-5" cy="0" r="5" fill="#f8a5b4" />
        <circle cx="5" cy="0" r="5" fill="#f8a5b4" />
        <circle cx="0" cy="-5" r="5" fill="#f8a5b4" />
        <circle cx="0" cy="5" r="5" fill="#f8a5b4" />
        <circle cx="0" cy="0" r="3.5" fill="#f6d376" />
      </g>

      {/* Right Peach Cup Blossom */}
      <g transform="translate(265, 140)">
        <path
          d="M -30 0 C -35 -25, -20 -38, 0 -30 C 20 -38, 35 -25, 30 0 C 25 22, -25 22, -30 0 Z"
          fill="#f3a48e"
        />
        <path
          d="M -20 -5 C -25 -22, -10 -30, 0 -22 C -6 -12, -14 -6, -20 -5 Z"
          fill="#e88970"
        />
        <path
          d="M 20 -5 C 25 -22, 10 -30, 0 -22 C 6 -12, 14 -6, 20 -5 Z"
          fill="#fabcb0"
        />
      </g>

      {/* Small Tulip on Right Ground */}
      <g transform="translate(255, 275)">
        <path d="M 0 0 C 5 -15, 5 -35, 10 -45" stroke="#476251" strokeWidth="2.5" strokeLinecap="round" />
        <path
          d="M 10 -45 C 0 -60, 15 -70, 20 -55 C 25 -70, 40 -60, 30 -45 C 25 -35, 15 -35, 10 -45 Z"
          fill="#f6d376"
        />
      </g>

      {/* Ground Leaves & Foliage Base */}
      <ellipse cx="180" cy="328" rx="90" ry="8" fill="rgba(60, 90, 72, 0.18)" />

      {/* Left Base Dainty Flower Grass */}
      <g transform="translate(85, 320)">
        <path d="M 15 0 L 15 -35" stroke="#476251" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 0 0 L -5 -25" stroke="#476251" strokeWidth="2" strokeLinecap="round" />
        <path d="M 25 0 L 30 -22" stroke="#476251" strokeWidth="2" strokeLinecap="round" />
        <path d="M 10 0 C 5 -12, -8 -15, -12 -12" stroke="#476251" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 18 0 C 25 -12, 38 -15, 42 -12" stroke="#476251" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="15" cy="-38" r="7" fill="#f6d376" />
        <circle cx="-5" cy="-27" r="5" fill="#fbf8ec" />
        <circle cx="30" cy="-24" r="5.5" fill="#fbf8ec" />
      </g>


      {/* --- THE CHARMING LOVEBIRD --- */}

      {/* Bird Fan Tail Feathers (Multi-layered fan) */}
      <g id="bird-tail">
        {/* Deep Wine Back Feather */}
        <path
          d="M 185 270 C 220 275, 270 240, 260 180 C 245 180, 220 200, 200 240 Z"
          fill="#842234"
        />
        {/* Crimson Center Feather */}
        <path
          d="M 190 270 C 235 270, 285 210, 280 170 C 265 170, 235 190, 205 245 Z"
          fill="#b73449"
        />
        {/* Coral Orange Middle Feather */}
        <path
          d="M 195 272 C 250 265, 305 200, 300 170 C 285 170, 250 200, 215 250 Z"
          fill="#e86146"
        />
        {/* Peach Front Fan Feather */}
        <path
          d="M 200 275 C 260 265, 310 215, 305 195 C 285 200, 255 225, 220 260 Z"
          fill="#f69062"
        />
      </g>

      {/* Bird Body */}
      <g id="bird-body">
        {/* Round Chubby Body */}
        <path
          d="M 105 240 C 95 295, 150 325, 195 295 C 225 275, 220 230, 200 200 C 180 170, 140 160, 115 185 C 100 200, 105 225, 105 240 Z"
          fill="#e99577"
        />

        {/* Belly Warm Highlight */}
        <path
          d="M 110 250 C 110 290, 150 315, 185 295 C 160 290, 130 275, 120 245 Z"
          fill="#f5a88c"
          opacity="0.8"
        />

        {/* Folded Wing (Wine / Burgundy) */}
        <path
          d="M 140 245 C 135 285, 175 300, 190 270 C 200 245, 185 220, 160 215 C 145 215, 140 230, 140 245 Z"
          fill="#94263c"
        />

        {/* Tiny Cheek Blush */}
        <circle cx="115" cy="235" r="10" fill="#ee7f8a" opacity="0.4" />

        {/* Expressive Bird Eye */}
        <circle cx="132" cy="210" r="14" fill="#ffffff" />
        <circle cx="130" cy="210" r="9" fill="#314e3b" />
        <circle cx="127" cy="207" r="3.5" fill="#ffffff" />

        {/* Cute Yellow Beak Holding Leaf */}
        <path
          d="M 108 206 L 90 212 L 108 218 Z"
          fill="#f6d376"
          stroke="#476251"
          strokeWidth="0.8"
        />

        {/* Tiny Botanical Leaf held in Beak */}
        <path
          d="M 92 210 C 80 200, 75 180, 85 170 C 95 180, 95 198, 92 210 Z"
          fill="#476251"
        />
        <path
          d="M 92 210 C 102 200, 105 185, 98 175 C 90 185, 90 198, 92 210 Z"
          fill="#5a7b66"
        />
      </g>

      {/* Bird Little Golden Feet */}
      <g id="bird-feet">
        {/* Left Foot */}
        <path d="M 145 305 L 140 324 L 132 328 M 140 324 L 142 328 M 140 324 L 148 328" stroke="#e89d2d" strokeWidth="3" strokeLinecap="round" />
        {/* Right Foot */}
        <path d="M 165 302 L 168 324 L 160 328 M 168 324 L 170 328 M 168 324 L 176 328" stroke="#e89d2d" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
};
