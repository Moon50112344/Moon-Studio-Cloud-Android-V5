/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  ArrowLeftIcon,
  CircleIcon,
  SquareIcon,
  PowerIcon,
  RefreshIcon,
  VolumeUpIcon,
  VolumeDownIcon,
  KeyboardIcon,
  SendIcon,
  PackageIcon,
  FileUpIcon,
  SpinnerIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  OneFingerIcon,
  TwoFingerIcon,
  ThreeFingerIcon,
  CameraIcon,
  LayersIcon,
  ResetTouchIcon,
} from './Icons';
import { AndroidVMInfo } from '../server/vmService';

interface ControlPanelProps {
  vm: AndroidVMInfo | null;
  onSendInput: (input: {
    type: 'touch' | 'swipe' | 'key' | 'text' | 'longpress' | 'pinch_in' | 'pinch_out' | 'two_finger_scroll' | 'two_finger_tap' | 'three_finger_swipe_down' | 'three_finger_swipe_up' | 'three_finger_tap' | 'quick_settings' | 'notification_shade' | 'reset_touch';
    action?: string;
    text?: string;
    keyCode?: number | string;
    direction?: 'up' | 'down' | 'left' | 'right';
    x?: number;
    y?: number;
    durationMs?: number;
  }) => Promise<any>;
  onRestartVM: (id: string) => Promise<any>;
  onStopVM: (id: string) => Promise<any>;
  onInstallApk: (id: string, file: File) => Promise<{ success: boolean; message: string }>;
  onPushFile: (id: string, file: File) => Promise<{ success: boolean; message: string }>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  vm,
  onSendInput,
  onRestartVM,
  onStopVM,
  onInstallApk,
  onPushFile,
}) => {
  const [textInput, setTextInput] = useState<string>('');
  const [isSendingKey, setIsSendingKey] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [isPushing, setIsPushing] = useState<boolean>(false);

  const apkInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerKeyAction = async (action: string) => {
    if (!vm || vm.status === 'stopped') return;
    try {
      setIsSendingKey(action);
      await onSendInput({ type: 'key', action });
    } finally {
      setIsSendingKey(null);
    }
  };

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !vm || vm.status === 'stopped') return;
    try {
      await onSendInput({ type: 'text', text: textInput });
      setTextInput('');
    } catch {}
  };

  const handleApkSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !vm) return;
    try {
      setIsInstalling(true);
      await onInstallApk(vm.id, file);
    } catch {} finally {
      setIsInstalling(false);
      if (apkInputRef.current) apkInputRef.current.value = '';
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !vm) return;
    try {
      setIsPushing(true);
      await onPushFile(vm.id, file);
    } catch {} finally {
      setIsPushing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isEnabled = vm?.status === 'running';

  return (
    <div className="flex flex-col gap-4 p-4 bg-[#0d1424] rounded-xl border border-[#1b263b] shadow-xl">
      {/* Navigation Bar (Back, Home, Recents) */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Điều hướng (Navigation Bar)
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => triggerKeyAction('back')}
            disabled={!isEnabled}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#121c33] hover:bg-[#1a284a] text-slate-200 hover:text-white border border-[#233355] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
            title="Quay lại (KEYCODE_BACK)"
          >
            <ArrowLeftIcon className="w-4 h-4 text-[#2f8bff]" />
            <span className="text-xs font-medium">Back</span>
          </button>

          <button
            onClick={() => triggerKeyAction('home')}
            disabled={!isEnabled}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#121c33] hover:bg-[#1a284a] text-slate-200 hover:text-white border border-[#233355] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
            title="Màn hình chính (KEYCODE_HOME)"
          >
            <CircleIcon className="w-4 h-4 text-[#2f8bff]" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => triggerKeyAction('recent')}
            disabled={!isEnabled}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#121c33] hover:bg-[#1a284a] text-slate-200 hover:text-white border border-[#233355] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
            title="Ứng dụng gần đây (KEYCODE_APP_SWITCH)"
          >
            <SquareIcon className="w-3.5 h-3.5 text-[#2f8bff]" />
            <span className="text-xs font-medium">Recents</span>
          </button>
        </div>
      </div>

      {/* Hardware Actions (Power, Restart, Volume Up, Volume Down) */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Phím phần cứng
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => triggerKeyAction('power')}
            disabled={!isEnabled}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#121c33] hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-[#233355] transition-all cursor-pointer disabled:opacity-40"
            title="Bật/Tắt màn hình"
          >
            <PowerIcon className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs">Power</span>
          </button>

          <button
            onClick={() => vm && onRestartVM(vm.id)}
            disabled={!isEnabled}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#121c33] hover:bg-amber-950/40 text-slate-300 hover:text-amber-400 border border-[#233355] transition-all cursor-pointer disabled:opacity-40"
            title="Khởi động lại QEMU"
          >
            <RefreshIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs">Restart</span>
          </button>

          <button
            onClick={() => triggerKeyAction('volume_up')}
            disabled={!isEnabled}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#121c33] hover:bg-[#1a284a] text-slate-300 hover:text-white border border-[#233355] transition-all cursor-pointer disabled:opacity-40"
            title="Tăng âm lượng"
          >
            <VolumeUpIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs">Vol +</span>
          </button>

          <button
            onClick={() => triggerKeyAction('volume_down')}
            disabled={!isEnabled}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#121c33] hover:bg-[#1a284a] text-slate-300 hover:text-white border border-[#233355] transition-all cursor-pointer disabled:opacity-40"
            title="Giảm âm lượng"
          >
            <VolumeDownIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs">Vol -</span>
          </button>
        </div>
      </div>

      {/* Multi-Finger Gestures & Touch Controls */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Cử chỉ đa ngón (Multi-Touch)</span>
          <button
            onClick={() => onSendInput({ type: 'reset_touch' })}
            disabled={!isEnabled}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 transition-colors cursor-pointer disabled:opacity-40"
            title="Hủy toàn bộ thao tác chạm đang bị dính / kẹt"
          >
            <ResetTouchIcon className="w-3 h-3 text-rose-400" />
            <span>Hủy chạm</span>
          </button>
        </div>

        {/* 1-Finger Actions */}
        <div className="mb-2">
          <div className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <OneFingerIcon className="w-3 h-3 text-[#2f8bff]" />
            <span>1 Ngón (Single Finger)</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onSendInput({ type: 'touch', x: 400, y: 300 })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-slate-300 hover:text-white text-[11px] transition-all cursor-pointer disabled:opacity-40"
              title="Chạm 1 ngón vào giữa màn hình"
            >
              Chạm giữa
            </button>
            <button
              onClick={() => onSendInput({ type: 'longpress', x: 400, y: 300, durationMs: 1000 })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-amber-300 hover:text-amber-200 text-[11px] transition-all cursor-pointer disabled:opacity-40"
              title="Nhấn giữ 1 giây"
            >
              Nhấn giữ 1s
            </button>
            <button
              onClick={() => onSendInput({ type: 'notification_shade' })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-slate-300 hover:text-white text-[11px] transition-all cursor-pointer disabled:opacity-40"
              title="Kéo thanh thông báo từ trên xuống"
            >
              Thanh thông báo
            </button>
          </div>
        </div>

        {/* 2-Finger Actions */}
        <div className="mb-2">
          <div className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <TwoFingerIcon className="w-3 h-3 text-cyan-400" />
            <span>2 Ngón (Dual Fingers)</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onSendInput({ type: 'pinch_out' })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-cyan-300 text-[11px] transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1"
              title="Phóng to 2 ngón"
            >
              <ZoomInIcon className="w-3 h-3" />
              <span>Phóng to</span>
            </button>
            <button
              onClick={() => onSendInput({ type: 'pinch_in' })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-cyan-300 text-[11px] transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1"
              title="Thu nhỏ 2 ngón"
            >
              <ZoomOutIcon className="w-3 h-3" />
              <span>Thu nhỏ</span>
            </button>
            <button
              onClick={() => onSendInput({ type: 'quick_settings' })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-cyan-300 text-[11px] transition-all cursor-pointer disabled:opacity-40"
              title="Cài đặt nhanh 2 ngón"
            >
              Cài đặt nhanh
            </button>
            <button
              onClick={() => onSendInput({ type: 'two_finger_scroll', direction: 'down' })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-slate-300 hover:text-white text-[11px] transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1"
              title="Cuộn trang xuống"
            >
              <ChevronDownIcon className="w-3 h-3" />
              <span>Cuộn xuống</span>
            </button>
            <button
              onClick={() => onSendInput({ type: 'two_finger_scroll', direction: 'up' })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-slate-300 hover:text-white text-[11px] transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1"
              title="Cuộn trang lên"
            >
              <ChevronUpIcon className="w-3 h-3" />
              <span>Cuộn lên</span>
            </button>
            <button
              onClick={() => onSendInput({ type: 'two_finger_tap', x: 400, y: 300 })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-slate-300 hover:text-white text-[11px] transition-all cursor-pointer disabled:opacity-40"
              title="Chạm 2 ngón"
            >
              Chạm kép
            </button>
          </div>
        </div>

        {/* 3-Finger Actions */}
        <div>
          <div className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <ThreeFingerIcon className="w-3 h-3 text-emerald-400" />
            <span>3 Ngón (Triple Fingers)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSendInput({ type: 'three_finger_swipe_down' })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-emerald-300 text-[11px] transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
              title="Chụp ảnh màn hình bằng vuốt 3 ngón"
            >
              <CameraIcon className="w-3.5 h-3.5" />
              <span>Chụp màn hình (3 ngón)</span>
            </button>
            <button
              onClick={() => onSendInput({ type: 'three_finger_swipe_up' })}
              disabled={!isEnabled}
              className="py-1.5 px-2 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-emerald-300 text-[11px] transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
              title="Mở danh sách đa nhiệm"
            >
              <LayersIcon className="w-3.5 h-3.5" />
              <span>Đa nhiệm (3 ngón)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Input Stream */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <KeyboardIcon className="w-3.5 h-3.5 text-[#2f8bff]" />
            Nhập văn bản bàn phím
          </span>
          <span className="text-[10px] text-slate-500 font-normal">ADB Text Injection</span>
        </div>
        <form onSubmit={handleSendText} className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={isEnabled ? "Nhập văn bản hoặc link URL..." : "Thiết bị chưa chạy"}
            disabled={!isEnabled}
            className="flex-1 bg-[#070b14] border border-[#1e2a47] rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#2f8bff] focus:ring-1 focus:ring-[#2f8bff] disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={!isEnabled || !textInput.trim()}
            className="px-3 py-1.5 rounded-lg bg-[#2f8bff] hover:bg-[#2575dc] text-white text-xs font-medium flex items-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-3.5 h-3.5" />
            <span>Gửi</span>
          </button>
        </form>
      </div>

      {/* APK & File Upload Actions */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Cài đặt APK & Bộ nhớ
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* APK Installer */}
          <input
            ref={apkInputRef}
            type="file"
            accept=".apk"
            className="hidden"
            onChange={handleApkSelected}
          />
          <button
            onClick={() => apkInputRef.current?.click()}
            disabled={!isEnabled || isInstalling}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-slate-200 hover:text-white transition-all cursor-pointer disabled:opacity-40 group"
          >
            {isInstalling ? (
              <SpinnerIcon className="w-4 h-4 animate-spin text-[#2f8bff]" />
            ) : (
              <PackageIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            )}
            <div className="text-left">
              <div className="text-xs font-medium">Cài đặt APK</div>
              <div className="text-[10px] text-slate-400">Gói Android .apk</div>
            </div>
          </button>

          {/* File Push */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelected}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!isEnabled || isPushing}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#10192e] hover:bg-[#16223e] border border-[#213052] text-slate-200 hover:text-white transition-all cursor-pointer disabled:opacity-40 group"
          >
            {isPushing ? (
              <SpinnerIcon className="w-4 h-4 animate-spin text-[#2f8bff]" />
            ) : (
              <FileUpIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            )}
            <div className="text-left">
              <div className="text-xs font-medium">Đẩy tập tin</div>
              <div className="text-[10px] text-slate-400">Vào /sdcard/Download/</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
