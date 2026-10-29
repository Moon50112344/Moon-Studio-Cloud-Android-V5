/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const PlayIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className} {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const SquareIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

export const CircleIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export const PowerIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 2v10" />
    <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

export const VolumeUpIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export const VolumeDownIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

export const KeyboardIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export const PackageIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" x2="12" y1="22" y2="12" />
  </svg>
);

export const FileUpIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M12 12v6" />
    <path d="m15 15-3-3-3 3" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

export const MaximizeIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" x2="14" y1="3" y2="10" />
    <line x1="3" x2="10" y1="21" y2="14" />
  </svg>
);

export const MinimizeIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" x2="21" y1="10" y2="3" />
    <line x1="3" x2="10" y1="21" y2="14" />
  </svg>
);

export const TerminalIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </svg>
);

export const CpuIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect width="16" height="16" x="4" y="4" rx="2" />
    <rect width="6" height="6" x="9" y="9" rx="1" />
    <path d="M15 2v2M9 2v2M20 15h2M20 9h2M9 20v2M15 20v2M2 9h2M2 15h2" />
  </svg>
);

export const HardDriveIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="22" x2="2" y1="12" y2="12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    <line x1="6" x2="6.01" y1="16" y2="16" />
    <line x1="10" x2="10.01" y1="16" y2="16" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M5 12h14M12 5v14" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ className = 'w-4 h-4 animate-spin', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const ZoomInIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
    <line x1="11" x2="11" y1="8" y2="14" />
    <line x1="8" x2="14" y1="11" y2="11" />
  </svg>
);

export const ZoomOutIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
    <line x1="8" x2="14" y1="11" y2="11" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export const SmartphoneIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const AppWindowIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M10 4v4M2 8h20M6 4v4" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export const OneFingerIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 2a2 2 0 0 1 2 2v8a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2Z" />
    <path d="M10 10.5V8a2 2 0 0 0-4 0v5a7 7 0 0 0 7 7h1a7 7 0 0 0 7-7v-3a2 2 0 0 0-4 0v.5" />
  </svg>
);

export const TwoFingerIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M9 2a1.5 1.5 0 0 1 1.5 1.5V11a1.5 1.5 0 0 1-3 0V3.5A1.5 1.5 0 0 1 9 2Z" />
    <path d="M14 4a1.5 1.5 0 0 1 1.5 1.5V11a1.5 1.5 0 0 1-3 0V5.5A1.5 1.5 0 0 1 14 4Z" />
    <path d="M7.5 11V9a1.5 1.5 0 0 0-3 0v4a7 7 0 0 0 7 7h1a7 7 0 0 0 7-7v-2a1.5 1.5 0 0 0-3 0v1" />
  </svg>
);

export const ThreeFingerIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M7 4a1.2 1.2 0 0 1 1.2 1.2V11a1.2 1.2 0 0 1-2.4 0V5.2A1.2 1.2 0 0 1 7 4Z" />
    <path d="M12 2a1.2 1.2 0 0 1 1.2 1.2V11a1.2 1.2 0 0 1-2.4 0V3.2A1.2 1.2 0 0 1 12 2Z" />
    <path d="M17 4a1.2 1.2 0 0 1 1.2 1.2V11a1.2 1.2 0 0 1-2.4 0V5.2A1.2 1.2 0 0 1 17 4Z" />
    <path d="M5.8 11V9.5a1.2 1.2 0 0 0-2.4 0v3.5a7 7 0 0 0 7 7h1.5a7 7 0 0 0 7-7V11" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export const LayersIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 12.5-9.17 4.16a2 2 0 0 1-1.66 0L2 12.5" />
    <path d="m22 17.5-9.17 4.16a2 2 0 0 1-1.66 0L2 17.5" />
  </svg>
);

export const ResetTouchIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);


