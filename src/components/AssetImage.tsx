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
    import.meta as unknown as {
      env?: { DEV?: boolean; VITE_ASSET_DEBUG?: string; BASE_URL?: string };
    }
  ).env;
  const isDevOrDebug = Boolean(metaEnv?.DEV || metaEnv?.VITE_ASSET_DEBUG === 'true');
  const rawBase =
    metaEnv?.BASE_URL ||
    (typeof process !== 'undefined' && process.env ? process.env.VITE_BASE_PATH : '') ||
    '/';
  const baseUrl = rawBase.replace(/\/$/, '');
  const resolvedSrc = `${baseUrl}${spec.publicPath}`;

  const resolvedAlt = alt || spec.altTextGuidance;

  const bgClasses =
    variant === 'hero' || variant === 'dark'
      ? 'bg-[#111820] text-[#F7F6F1] border-[#172536]'
      : 'bg-[#172536] text-white border-[#D8DFE8]';

  return (
    <div
      className={`relative overflow-hidden border ${bgClasses} ${className}`}
      style={{
        aspectRatio: `${spec.width} / ${spec.height}`,
      }}
      data-asset-filename={spec.filename}
      data-asset-dimensions={`${spec.width}x${spec.height}`}
    >
      {/* Actual image tag referencing /images/<filename> */}
      {!imageError && (
        <img
          src={resolvedSrc}
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

      {/* Intentional architectural placeholder rendered while image is loading */}
      {!imageLoaded && (
        <div
          className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 select-none bg-gradient-to-br from-[#111820] via-[#172536] to-[#111820]"
          aria-label={resolvedAlt}
          role="img"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
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
              stroke="#FFC400"
              strokeWidth="3"
              strokeDasharray="8 8"
            />
            <circle cx="440" cy="290" r="6" fill="#FFC400" />
            <circle cx="195" cy="365" r="4" fill="currentColor" />
            <circle cx="695" cy="175" r="4" fill="currentColor" />
          </svg>

          <div
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#FFC400]/15 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#FFC400]">
              <ImageIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Yellow Go Taxi</span>
            </span>
            {isDevOrDebug && (
              <span className="font-mono-tabular text-[11px] text-slate-300">
                {spec.width}×{spec.height} · {spec.aspectRatio}
              </span>
            )}
          </div>

          <div className="relative z-10 mt-auto pt-6">
            {isDevOrDebug ? (
              <div className="space-y-1">
                <p className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-white">
                  /images/{spec.filename}
                </p>
                <p className="text-xs line-clamp-2 text-slate-300">
                  {spec.altTextGuidance}
                </p>
              </div>
            ) : (
              <p className="text-xs font-medium text-slate-300">{resolvedAlt}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
