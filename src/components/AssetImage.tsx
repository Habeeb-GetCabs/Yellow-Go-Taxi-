import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { getAssetSpec } from '../data/assetManifest';

export interface AssetImageProps {
  filename: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  variant?: 'default' | 'hero' | 'dark';
}

export const AssetImage: React.FC<AssetImageProps> = ({
  filename,
  alt,
  priority = false,
  className = '',
  variant = 'default',
}) => {
  const spec = getAssetSpec(filename);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const metaEnv = (
    import.meta as unknown as { env?: { DEV?: boolean; VITE_ASSET_DEBUG?: string } }
  ).env;
  const isDevOrDebug = Boolean(metaEnv?.DEV || metaEnv?.VITE_ASSET_DEBUG === 'true');

  const resolvedAlt = alt || spec.altTextGuidance;

  const bgClasses =
    variant === 'hero' || variant === 'dark'
      ? 'bg-[#141E28] text-[#F5F3EE] border-[#263342]'
      : 'bg-[#F4EFE0] text-[#101820] border-[#E5DEC9]';

  return (
    <div
      className={`relative overflow-hidden border ${bgClasses} ${className}`}
      style={{
        aspectRatio: `${spec.width} / ${spec.height}`,
      }}
      data-asset-filename={spec.filename}
      data-asset-dimensions={`${spec.width}x${spec.height}`}
    >
      {/* Actual image tag referencing /images/<filename> so uploading the file works immediately */}
      {!imageError && (
        <img
          src={spec.publicPath}
          alt={resolvedAlt}
          width={spec.width}
          height={spec.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      {/* Intentional architectural placeholder rendered while image is not yet uploaded */}
      {!imageLoaded && (
        <div
          className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 select-none"
          aria-label={resolvedAlt}
          role="img"
        >
          {/* Subtle CSS/SVG topographic & route contour geometry (Not a photo) */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id={`grid-${spec.filename.replace(/[^a-z0-9]/gi, '')}`}
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                />
              </pattern>
            </defs>
            <rect
              width="800"
              height="600"
              fill={`url(#grid-${spec.filename.replace(/[^a-z0-9]/gi, '')})`}
            />
            <path
              d="M-50 480 C 160 440, 240 260, 440 290 C 610 315, 690 140, 860 110"
              fill="none"
              stroke="#F5C518"
              strokeWidth="3"
              strokeDasharray="8 8"
            />
            <circle cx="440" cy="290" r="6" fill="#F5C518" />
            <circle cx="195" cy="365" r="4" fill="currentColor" />
            <circle cx="695" cy="175" r="4" fill="currentColor" />
          </svg>

          {/* Subtle golden ambient corner accent */}
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#F5C518]/15 blur-2xl"
            aria-hidden="true"
          />

          {/* Top row: intentional placeholder indicator */}
          <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 font-medium ${
                variant === 'hero' || variant === 'dark'
                  ? 'text-[#F5C518]'
                  : 'text-[#5C5338]'
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Asset Slot Reserved</span>
            </span>
            {isDevOrDebug && (
              <span
                className={`font-mono-tabular text-[11px] ${
                  variant === 'hero' || variant === 'dark'
                    ? 'text-slate-300'
                    : 'text-[#6E654B]'
                }`}
              >
                {spec.width}×{spec.height} · {spec.aspectRatio}
              </span>
            )}
          </div>

          {/* Center / Bottom metadata */}
          <div className="relative z-10 mt-auto pt-6">
            {isDevOrDebug ? (
              <div
                className={`rounded-lg border px-3 py-2 backdrop-blur-xs ${
                  variant === 'hero' || variant === 'dark'
                    ? 'border-white/15 bg-black/45 text-white'
                    : 'border-[#D8CFAF] bg-white/85 text-[#101820]'
                }`}
              >
                <p className="font-mono-tabular text-xs font-semibold tracking-tight break-all">
                  /images/{spec.filename}
                </p>
                <p
                  className={`mt-0.5 text-[11px] line-clamp-1 ${
                    variant === 'hero' || variant === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {spec.recommendedSubject}
                </p>
              </div>
            ) : (
              <div className="h-1 w-12 rounded-full bg-[#F5C518]" aria-hidden="true" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
