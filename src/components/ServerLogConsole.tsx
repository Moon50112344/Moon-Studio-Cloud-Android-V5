/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { TerminalIcon, RefreshIcon, TrashIcon, CheckIcon, SpinnerIcon } from './Icons';

export interface ServerLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  source: 'SERVER' | 'QEMU' | 'ADB' | 'TOUCH';
  message: string;
}

interface ServerStatus {
  status: string;
  uptimeSeconds: number;
  port: number;
  qemuInstalled: boolean;
  adbInstalled: boolean;
  activeVms: number;
  totalVms: number;
}

interface ServerLogConsoleProps {
  onRestartVM?: () => void;
  activeVmId?: string;
}

export const ServerLogConsole: React.FC<ServerLogConsoleProps> = ({ onRestartVM, activeVmId }) => {
  const [logs, setLogs] = useState<ServerLogEntry[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(true);
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/server-logs');
      if (!res.ok) return;
      const data = await res.json();
      setServerStatus(data.server);
      setLogs(data.logs || []);
    } catch {}
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAutoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isAutoScroll]);

  const filteredLogs = filterSource === 'ALL'
    ? logs
    : logs.filter(l => l.source === filterSource);

  const formatUptime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col bg-[#0a0f1d] rounded-xl border border-[#1b263b] overflow-hidden shadow-xl mt-4">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#070b14] border-b border-[#1b263b] text-xs gap-2">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">Nhật ký Server & Máy ảo (Real-Time Terminal)</span>
          {serverStatus && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-medium font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PORT {serverStatus.port} • ONLINE ({formatUptime(serverStatus.uptimeSeconds)})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Source Filter */}
          <div className="flex items-center bg-[#0d1424] rounded-lg p-0.5 border border-[#1b263b] text-[10px]">
            {['ALL', 'SERVER', 'QEMU', 'ADB', 'TOUCH'].map(src => (
              <button
                key={src}
                onClick={() => setFilterSource(src)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  filterSource === src
                    ? 'bg-[#2f8bff] text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAutoScroll}
              onChange={(e) => setIsAutoScroll(e.target.checked)}
              className="rounded bg-[#0d1424] border-[#1b263b] text-[#2f8bff] focus:ring-0 w-3.5 h-3.5"
            />
            <span>Tự cuộn</span>
          </label>

          <button
            onClick={() => setLogs([])}
            className="p-1 hover:text-slate-200 text-slate-500 rounded hover:bg-[#141f36] transition-colors cursor-pointer"
            title="Xóa nhật ký hiển thị"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div
        ref={logContainerRef}
        className="h-44 overflow-y-auto font-mono text-[11px] p-3 space-y-1 bg-[#050811] text-slate-300 select-text"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 text-center py-8 italic">
            Chưa có dòng log nào. Đang lắng nghe tiến trình máy ảo QEMU và ADB...
          </div>
        ) : (
          filteredLogs.map(log => {
            let badgeBg = 'bg-slate-800 text-slate-300';
            if (log.source === 'SERVER') badgeBg = 'bg-blue-950 text-blue-400 border border-blue-900/50';
            else if (log.source === 'QEMU') badgeBg = 'bg-amber-950 text-amber-400 border border-amber-900/50';
            else if (log.source === 'ADB') badgeBg = 'bg-emerald-950 text-emerald-400 border border-emerald-900/50';
            else if (log.source === 'TOUCH') badgeBg = 'bg-purple-950 text-purple-400 border border-purple-900/50';

            let msgColor = 'text-slate-300';
            if (log.level === 'error') msgColor = 'text-rose-400 font-semibold';
            else if (log.level === 'warn') msgColor = 'text-amber-300';
            else if (log.level === 'success') msgColor = 'text-emerald-300';

            return (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${badgeBg}`}>
                  {log.source}
                </span>
                <span className={`break-all ${msgColor}`}>{log.message}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Sub-Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#070b14] border-t border-[#1b263b] text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${serverStatus?.qemuInstalled ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            QEMU x86: {serverStatus?.qemuInstalled ? 'Sẵn sàng' : 'Chưa cài'}
          </span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${serverStatus?.adbInstalled ? 'bg-emerald-400' : 'bg-rose-500'}`} />
            Android ADB: {serverStatus?.adbInstalled ? 'Sẵn sàng' : 'Chưa cài'}
          </span>
          <span className="text-slate-500">|</span>
          <span>Máy ảo đang chạy: {serverStatus?.activeVms || 0}/{serverStatus?.totalVms || 1}</span>
        </div>
        <div className="text-slate-500">
          Chỉ số thực từ QEMU hardware & kernel
        </div>
      </div>
    </div>
  );
};
