import React from 'react'

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="logo-icon">
        <svg
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
        >
          {/* Parcel Box Icon representing 'ops' (Online Packaging Store) */}
          <path
            d="M27 7L47 17V37L27 47L7 37V17L27 7Z"
            fill="#F0BC2E"
          />
          <path
            d="M27 7L47 17L27 27L7 17L27 7Z"
            fill="#FFD25E"
          />
          <path
            d="M27 27V47L47 37V17L27 27Z"
            fill="#DCA41B"
          />
          <path
            d="M27 27V47L7 37V17L27 27Z"
            fill="#F0BC2E"
          />
          {/* Box flaps/details */}
          <path
            d="M27 7L17 12L27 17L37 12L27 7Z"
            fill="#F0BC2E"
            opacity="0.5"
          />
        </svg>
      </div>
      <span
        className="text-3xl font-bold tracking-tight"
        style={{
          fontFamily: "'Amaranth', sans-serif",
          color: '#F0BC2E',
          lineHeight: 1,
        }}
      >
        ops
      </span>
    </div>
  )
}
