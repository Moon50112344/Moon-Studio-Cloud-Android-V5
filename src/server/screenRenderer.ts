/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AndroidScreenState {
  currentApp: 'home' | 'calculator' | 'settings' | 'browser' | 'files' | 'recents' | 'booting';
  screenOn: boolean;
  volume: number;
  volumeVisibleUntil: number;
  calcDisplay: string;
  calcHistory: string;
  browserUrl: string;
  installedApps: string[];
  downloadFiles: { name: string; size: number; date: string }[];
  touchRipple: { x: number; y: number; time: number } | null;
  bootProgress: number; // 0 to 100
  vmName: string;
  osVersion: string;
  ramMb: number;
  cpuCores: number;
  uptimeSeconds: number;
}

export function createDefaultState(vmName: string, ramMb: number = 2048, cpuCores: number = 2): AndroidScreenState {
  return {
    currentApp: 'home',
    screenOn: true,
    volume: 75,
    volumeVisibleUntil: 0,
    calcDisplay: '0',
    calcHistory: '',
    browserUrl: 'https://moonstudio.us.ci',
    installedApps: [
      'com.android.calculator2',
      'com.android.chrome',
      'com.android.settings',
      'com.android.gallery3d',
      'com.android.documentsui',
      'com.android.terminal',
    ],
    downloadFiles: [],
    touchRipple: null,
    bootProgress: 100,
    vmName,
    osVersion: 'Android 7.1.2 (Nougat)',
    ramMb,
    cpuCores,
    uptimeSeconds: 0,
  };
}

export function renderAndroidSVG(state: AndroidScreenState): string {
  const width = 1024;
  const height = 768;

  if (!state.screenOn) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#000000"/>
    </svg>`;
  }

  if (state.currentApp === 'booting') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#000000"/>
      <text x="512" y="380" font-family="-apple-system, Roboto, sans-serif" font-size="52" font-weight="300" fill="#ffffff" text-anchor="middle" letter-spacing="12">android</text>
      <rect x="362" y="440" width="300" height="4" rx="2" fill="#222222"/>
      <rect x="362" y="440" width="${Math.max(10, Math.min(300, (state.bootProgress / 100) * 300))}" height="4" rx="2" fill="#2f8bff"/>
      <text x="512" y="475" font-family="monospace" font-size="12" fill="#666666" text-anchor="middle">Starting Android Framework &amp; ART Runtime (${state.bootProgress}%)...</text>
    </svg>`;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  let appContent = '';

  if (state.currentApp === 'home') {
    appContent = `
      <!-- Wallpaper Gradient -->
      <defs>
        <radialGradient id="wp" cx="70%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#1a365d"/>
          <stop offset="40%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
      </defs>
      <rect y="32" width="${width}" height="${height - 72}" fill="url(#wp)"/>

      <!-- Clock Widget -->
      <text x="512" y="150" font-family="-apple-system, Roboto, sans-serif" font-size="64" font-weight="200" fill="#ffffff" text-anchor="middle">${timeStr}</text>
      <text x="512" y="185" font-family="-apple-system, Roboto, sans-serif" font-size="14" font-weight="400" fill="#94a3b8" text-anchor="middle">${dateStr} • Moon Studio Cloud</text>

      <!-- Google / Moon Search Pill -->
      <g transform="translate(262, 215)">
        <rect width="500" height="46" rx="23" fill="#ffffff" opacity="0.95" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"/>
        <text x="24" y="28" font-family="-apple-system, sans-serif" font-size="16" font-weight="bold" fill="#4285F4">G</text>
        <text x="50" y="28" font-family="-apple-system, sans-serif" font-size="14" fill="#64748b">Search apps, files or web...</text>
      </g>

      <!-- App Grid (Interactive) -->
      <!-- Row 1: Calculator (x: 232, y: 310) -->
      <g transform="translate(232, 310)" cursor="pointer">
        <rect width="80" height="80" rx="20" fill="#0284c7"/>
        <text x="40" y="52" font-family="monospace" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">±%</text>
        <text x="40" y="105" font-family="-apple-system, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">Calculator</text>
      </g>

      <!-- Row 1: Chrome / Browser (x: 372, y: 310) -->
      <g transform="translate(372, 310)" cursor="pointer">
        <rect width="80" height="80" rx="20" fill="#ea580c"/>
        <circle cx="40" cy="40" r="26" fill="#ffffff" opacity="0.9"/>
        <circle cx="40" cy="40" r="14" fill="#ea580c"/>
        <text x="40" y="105" font-family="-apple-system, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">Browser</text>
      </g>

      <!-- Row 1: Settings (x: 512, y: 310) -->
      <g transform="translate(512, 310)" cursor="pointer">
        <rect width="80" height="80" rx="20" fill="#475569"/>
        <text x="40" y="52" font-family="monospace" font-size="36" fill="#ffffff" text-anchor="middle">⚙</text>
        <text x="40" y="105" font-family="-apple-system, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">Settings</text>
      </g>

      <!-- Row 1: Files / Downloads (x: 652, y: 310) -->
      <g transform="translate(652, 310)" cursor="pointer">
        <rect width="80" height="80" rx="20" fill="#16a34a"/>
        <path d="M22 28 L38 28 L46 36 L58 36 C61 36 62 38 62 41 L62 55 C62 58 61 60 58 60 L22 60 C19 60 18 58 18 55 L18 33 C18 30 19 28 22 28 Z" fill="#ffffff"/>
        <text x="40" y="105" font-family="-apple-system, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">Files</text>
      </g>

      <!-- Row 2: Gallery & Custom APKs -->
      <g transform="translate(232, 450)" cursor="pointer">
        <rect width="80" height="80" rx="20" fill="#7c3aed"/>
        <circle cx="34" cy="36" r="6" fill="#ffffff"/>
        <polygon points="24,56 38,42 48,50 60,34 68,56" fill="#ffffff"/>
        <text x="40" y="105" font-family="-apple-system, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">Gallery</text>
      </g>

      ${state.installedApps.filter(p => !['com.android.calculator2', 'com.android.chrome', 'com.android.settings', 'com.android.gallery3d', 'com.android.documentsui', 'com.android.terminal'].includes(p)).map((pkg, idx) => {
        const x = 372 + (idx * 140);
        const label = pkg.split('.').pop() || 'App';
        return `
          <g transform="translate(${x}, 450)" cursor="pointer">
            <rect width="80" height="80" rx="20" fill="#2563eb"/>
            <text x="40" y="48" font-family="monospace" font-size="24" fill="#ffffff" text-anchor="middle">APK</text>
            <text x="40" y="105" font-family="-apple-system, sans-serif" font-size="11" fill="#ffffff" text-anchor="middle">${label}</text>
          </g>
        `;
      }).join('')}

      <!-- Bottom App Dock -->
      <rect x="200" y="605" width="624" height="85" rx="24" fill="#0f172a" opacity="0.6"/>
      <g transform="translate(240, 615)" cursor="pointer">
        <rect width="64" height="64" rx="16" fill="#22c55e"/>
        <text x="32" y="42" font-size="28" fill="#ffffff" text-anchor="middle">📞</text>
      </g>
      <g transform="translate(390, 615)" cursor="pointer">
        <rect width="64" height="64" rx="16" fill="#0284c7"/>
        <text x="32" y="42" font-size="28" fill="#ffffff" text-anchor="middle">💬</text>
      </g>
      <g transform="translate(540, 615)" cursor="pointer">
        <circle cx="32" cy="32" r="30" fill="#334155"/>
        <circle cx="24" cy="24" r="4" fill="#ffffff"/>
        <circle cx="32" cy="24" r="4" fill="#ffffff"/>
        <circle cx="40" cy="24" r="4" fill="#ffffff"/>
        <circle cx="24" cy="32" r="4" fill="#ffffff"/>
        <circle cx="32" cy="32" r="4" fill="#ffffff"/>
        <circle cx="40" cy="32" r="4" fill="#ffffff"/>
        <circle cx="24" cy="40" r="4" fill="#ffffff"/>
        <circle cx="32" cy="40" r="4" fill="#ffffff"/>
        <circle cx="40" cy="40" r="4" fill="#ffffff"/>
      </g>
      <g transform="translate(690, 615)" cursor="pointer">
        <rect width="64" height="64" rx="16" fill="#ea580c"/>
        <text x="32" y="42" font-size="28" fill="#ffffff" text-anchor="middle">🌐</text>
      </g>
    `;
  } else if (state.currentApp === 'calculator') {
    appContent = `
      <rect y="32" width="${width}" height="${height - 72}" fill="#1e293b"/>
      <!-- Header -->
      <rect y="32" width="${width}" height="50" fill="#0f172a"/>
      <text x="40" y="63" font-family="-apple-system, sans-serif" font-size="18" font-weight="600" fill="#ffffff">Android Calculator</text>

      <!-- Calc Display Screen -->
      <rect x="262" y="100" width="500" height="110" rx="12" fill="#090d16" stroke="#334155"/>
      <text x="740" y="140" font-family="monospace" font-size="16" fill="#94a3b8" text-anchor="end">${state.calcHistory}</text>
      <text x="740" y="190" font-family="monospace" font-size="44" font-weight="bold" fill="#38bdf8" text-anchor="end">${state.calcDisplay}</text>

      <!-- Keypad -->
      <g transform="translate(262, 230)">
        <!-- Row 1: C, ( ), %, / -->
        <rect x="0" y="0" width="110" height="75" rx="10" fill="#e11d48"/><text x="55" y="48" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle">C</text>
        <rect x="130" y="0" width="110" height="75" rx="10" fill="#334155"/><text x="185" y="48" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle">( )</text>
        <rect x="260" y="0" width="110" height="75" rx="10" fill="#334155"/><text x="315" y="48" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle">%</text>
        <rect x="390" y="0" width="110" height="75" rx="10" fill="#0284c7"/><text x="445" y="48" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">÷</text>

        <!-- Row 2: 7, 8, 9, * -->
        <rect x="0" y="90" width="110" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="55" y="138" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">7</text>
        <rect x="130" y="90" width="110" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="185" y="138" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">8</text>
        <rect x="260" y="90" width="110" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="315" y="138" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">9</text>
        <rect x="390" y="90" width="110" height="75" rx="10" fill="#0284c7"/><text x="445" y="138" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">×</text>

        <!-- Row 3: 4, 5, 6, - -->
        <rect x="0" y="180" width="110" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="55" y="228" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">4</text>
        <rect x="130" y="180" width="110" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="185" y="228" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">5</text>
        <rect x="260" y="180" width="110" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="315" y="228" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">6</text>
        <rect x="390" y="180" width="110" height="75" rx="10" fill="#0284c7"/><text x="445" y="228" font-size="28" font-weight="bold" fill="#fff" text-anchor="middle">−</text>

        <!-- Row 4: 1, 2, 3, + -->
        <rect x="0" y="270" width="110" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="55" y="318" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">1</text>
        <rect x="130" y="270" width="110" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="185" y="318" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">2</text>
        <rect x="260" y="270" width="110" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="315" y="318" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">3</text>
        <rect x="390" y="270" width="110" height="75" rx="10" fill="#0284c7"/><text x="445" y="318" font-size="28" font-weight="bold" fill="#fff" text-anchor="middle">+</text>

        <!-- Row 5: 0, ., = -->
        <rect x="0" y="360" width="240" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="120" y="408" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">0</text>
        <rect x="260" y="360" width="110" height="75" rx="10" fill="#1e293b" stroke="#334155"/><text x="315" y="408" font-size="26" font-weight="bold" fill="#fff" text-anchor="middle">.</text>
        <rect x="390" y="360" width="110" height="75" rx="10" fill="#22c55e"/><text x="445" y="408" font-size="28" font-weight="bold" fill="#fff" text-anchor="middle">=</text>
      </g>
    `;
  } else if (state.currentApp === 'settings') {
    appContent = `
      <rect y="32" width="${width}" height="${height - 72}" fill="#0f172a"/>
      <rect y="32" width="${width}" height="60" fill="#1e293b"/>
      <text x="40" y="69" font-family="-apple-system, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">Settings</text>

      <!-- Settings Cards -->
      <g transform="translate(40, 115)">
        <rect width="${width - 80}" height="70" rx="8" fill="#1e293b" stroke="#334155"/>
        <text x="24" y="32" font-size="16" font-weight="600" fill="#ffffff">Wireless &amp; Networks</text>
        <text x="24" y="52" font-size="13" fill="#94a3b8">Wi-Fi (Connected to MoonStudio-5G) • Bluetooth • Data usage</text>
      </g>

      <g transform="translate(40, 200)">
        <rect width="${width - 80}" height="70" rx="8" fill="#1e293b" stroke="#334155"/>
        <text x="24" y="32" font-size="16" font-weight="600" fill="#ffffff">Device Hardware</text>
        <text x="24" y="52" font-size="13" fill="#94a3b8">Display: 1024×768 60Hz • Storage: 2.0 GB used of 4.0 GB</text>
      </g>

      <g transform="translate(40, 285)">
        <rect width="${width - 80}" height="70" rx="8" fill="#1e293b" stroke="#334155"/>
        <text x="24" y="32" font-size="16" font-weight="600" fill="#ffffff">Memory &amp; Performance</text>
        <text x="24" y="52" font-size="13" fill="#94a3b8">${state.ramMb} MB Total RAM • ${state.cpuCores} vCPU Cores Active</text>
      </g>

      <g transform="translate(40, 370)">
        <rect width="${width - 80}" height="190" rx="8" fill="#1e293b" stroke="#334155"/>
        <text x="24" y="32" font-size="16" font-weight="600" fill="#38bdf8">About Emulated Device</text>
        <text x="24" y="60" font-size="13" fill="#cbd5e1">Device Name: <tspan fill="#ffffff" font-weight="bold">${state.vmName}</tspan></text>
        <text x="24" y="85" font-size="13" fill="#cbd5e1">Android Version: <tspan fill="#38bdf8">7.1.2 (Nougat)</tspan></text>
        <text x="24" y="110" font-size="13" fill="#cbd5e1">Android Security Patch: <tspan fill="#ffffff">October 5, 2026</tspan></text>
        <text x="24" y="135" font-size="13" fill="#cbd5e1">Kernel Version: <tspan fill="#ffffff">Linux 4.19.0-gvisor x86_64</tspan></text>
        <text x="24" y="160" font-size="13" fill="#cbd5e1">Build Number: <tspan fill="#ffffff">MOON_STUDIO_CLOUD_USERDEBUG_7.1.2</tspan></text>
      </g>
    `;
  } else if (state.currentApp === 'files') {
    appContent = `
      <rect y="32" width="${width}" height="${height - 72}" fill="#0f172a"/>
      <rect y="32" width="${width}" height="55" fill="#1e293b"/>
      <text x="40" y="66" font-family="-apple-system, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">Files — /sdcard/Download/</text>

      <g transform="translate(40, 110)">
        ${state.downloadFiles.length === 0 ? `
          <text x="472" y="180" font-size="16" fill="#64748b" text-anchor="middle">No files uploaded yet.</text>
          <text x="472" y="210" font-size="13" fill="#475569" text-anchor="middle">Use the "Push File" or "Install APK" buttons on the right panel to send files.</text>
        ` : state.downloadFiles.map((f, i) => `
          <g transform="translate(0, ${i * 65})">
            <rect width="${width - 80}" height="55" rx="8" fill="#1e293b" stroke="#334155"/>
            <text x="20" y="34" font-size="20">📄</text>
            <text x="56" y="28" font-size="14" font-weight="600" fill="#ffffff">${f.name}</text>
            <text x="56" y="46" font-size="12" fill="#94a3b8">${(f.size / 1024).toFixed(1)} KB • ${f.date}</text>
          </g>
        `).join('')}
      </g>
    `;
  } else if (state.currentApp === 'browser') {
    appContent = `
      <rect y="32" width="${width}" height="${height - 72}" fill="#ffffff"/>
      <!-- Browser Address Bar -->
      <rect y="32" width="${width}" height="55" fill="#f1f5f9" stroke="#cbd5e1"/>
      <rect x="40" y="42" width="${width - 80}" height="35" rx="17" fill="#ffffff" stroke="#94a3b8"/>
      <text x="60" y="64" font-size="13" fill="#334155">🔒 ${state.browserUrl}</text>

      <!-- Webview Content -->
      <rect x="0" y="87" width="${width}" height="${height - 127}" fill="#070b14"/>
      <text x="512" y="240" font-family="-apple-system, sans-serif" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle">Moon <tspan fill="#2f8bff">Studio</tspan></text>
      <text x="512" y="280" font-family="-apple-system, sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">Cloud Android Virtual Machine Browser</text>
      <text x="512" y="320" font-size="14" fill="#64748b" text-anchor="middle">Ultra-low latency web streaming &amp; full gesture control</text>
    `;
  }

  // Volume HUD if recently adjusted
  let volumeHUD = '';
  if (Date.now() < state.volumeVisibleUntil) {
    volumeHUD = `
      <g transform="translate(780, 50)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))">
        <rect width="210" height="48" rx="8" fill="#0f172a" stroke="#334155"/>
        <text x="16" y="30" font-size="18">🔊</text>
        <rect x="50" y="22" width="140" height="6" rx="3" fill="#334155"/>
        <rect x="50" y="22" width="${Math.round((state.volume / 100) * 140)}" height="6" rx="3" fill="#2f8bff"/>
      </g>
    `;
  }

  // Touch ripple if any
  let rippleSVG = '';
  if (state.touchRipple && (Date.now() - state.touchRipple.time < 500)) {
    rippleSVG = `<circle cx="${state.touchRipple.x}" cy="${state.touchRipple.y}" r="22" fill="#2f8bff" opacity="0.4"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <!-- Top Android Status Bar (y: 0 to 32) -->
    <rect width="${width}" height="32" fill="#000000"/>
    <text x="24" y="21" font-family="-apple-system, sans-serif" font-size="12" font-weight="500" fill="#ffffff">${timeStr}</text>
    <g transform="translate(${width - 150}, 10)">
      <!-- WiFi Icon -->
      <path d="M0,14 A12,12 0 0,1 18,14 M3,11 A8,8 0 0,1 15,11 M6,8 A4,4 0 0,1 12,8" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Cellular / LTE -->
      <text x="30" y="11" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">LTE</text>
      <!-- Battery Icon -->
      <rect x="68" y="2" width="22" height="11" rx="2" fill="none" stroke="#ffffff" stroke-width="1.5"/>
      <rect x="90" y="5" width="2" height="5" fill="#ffffff"/>
      <rect x="70" y="4" width="16" height="7" fill="#ffffff"/>
      <text x="96" y="11" font-family="sans-serif" font-size="10" fill="#ffffff">100%</text>
    </g>

    <!-- Main Content Area -->
    ${appContent}

    <!-- Bottom Android Navigation Bar (y: 728 to 768) -->
    <rect y="728" width="${width}" height="40" fill="#000000"/>
    <g transform="translate(362, 736)" cursor="pointer">
      <!-- Back Icon (Triangle) -->
      <polygon points="12,18 24,10 24,26" fill="#ffffff"/>
    </g>
    <g transform="translate(502, 736)" cursor="pointer">
      <!-- Home Icon (Circle) -->
      <circle cx="10" cy="18" r="8" fill="none" stroke="#ffffff" stroke-width="2"/>
    </g>
    <g transform="translate(642, 736)" cursor="pointer">
      <!-- Recents Icon (Square) -->
      <rect x="2" y="10" width="16" height="16" rx="2" fill="none" stroke="#ffffff" stroke-width="2"/>
    </g>

    ${volumeHUD}
    ${rippleSVG}
  </svg>`;
}
