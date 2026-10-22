import React from 'react';
import { ChevronRight } from 'lucide-react';
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
        className={`flex flex-wrap items-center gap-1.5 text-xs font-medium ${
          lightText ? 'text-slate-300' : 'text-[#526174]'
        }`}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 shrink-0 ${
                    lightText ? 'text-slate-500' : 'text-slate-400'
                  }`}
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className={`font-bold ${
                    lightText ? 'text-[#FFC400]' : 'text-[#111820]'
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
                  className={`transition-colors underline-offset-4 hover:underline ${
                    lightText ? 'text-slate-300 hover:text-[#FFC400]' : 'text-[#526174] hover:text-[#111820]'
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
