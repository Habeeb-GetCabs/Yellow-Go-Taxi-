import React from 'react';
import type { BreadcrumbEntry } from './SeoHead';

export interface BreadcrumbsProps {
  items: BreadcrumbEntry[];
  onNavigate: (path: string) => void;
  lightText?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate,
  lightText = false,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol
        className={`flex flex-wrap items-center gap-2 text-xs ${
          lightText ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {idx > 0 && (
                <span aria-hidden="true" className="opacity-60">
                  /
                </span>
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className={`font-medium ${
                    lightText ? 'text-white' : 'text-[#101820]'
                  }`}
                >
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.path}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate(item.path);
                    }
                  }}
                  className={`underline-offset-4 hover:underline ${
                    lightText ? 'hover:text-[#F5C518]' : 'hover:text-[#101820]'
                  }`}
                >
                  {item.name}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
