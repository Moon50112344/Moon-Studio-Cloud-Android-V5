/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AndroidVMInfo } from '../server/vmService';
import {
  PlayIcon,
  PowerIcon,
  MaximizeIcon,
  MinimizeIcon,
  SpinnerIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from './Icons';

interface DeviceScreenProps {
  vm: AndroidVMInfo | null;
  onSendInput: (input: {
    type: 'touch' | 'touch_down' | 'touch_move' | 'touch_up' | 'swipe' | 'key' | 'text' | 'longpress' | 'pinch_in' | 'pinch_out' | 'two_finger_scroll' | 'two_finger_tap' | 'three_finger_swipe_down' | 'three_finger_swipe_up' | 'three_finger_tap' | 'quick_settings' | 'notification_shade';
    x?: number;
    y?: number;
    viewWidth?: number;
    viewHeight?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    durationMs?: number;
    action?: string;
    text?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
  }) => Promise<any>;
  onStartVM: (id: string) => Promise<any>;
}

type FingerMode = '1-finger' | '2-finger' | '3-finger';

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  label: string;
  color: string;
}

export const DeviceScreen: React.FC<DeviceScreenProps> = ({ vm, onSendInput, onStartVM }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [frameSrc, setFrameSrc] = useState<string>('');
  const [fps, setFps] = useState<number>(0);
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  // Multi-finger mode
  const [fingerMode, setFingerMode] = useState<FingerMode>('1-finger');
  const [activeTouches, setActiveTouches] = useState<TouchPoint[]>([]);

  // Continuous dragging / Joystick tracking state
  const isPointerDownRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastMoveSentTimeRef = useRef<number>(0);
  const touchDistanceStartRef = useRef<number | null>(null);

  // Active streaming loop with zero lag
  useEffect(() => {
    if (!vm || vm.status === 'stopped') {
      setFrameSrc('');
      setFps(0);
      return;
    }

    let isMounted = true;
    let frameCount = 0;
    let lastFpsTime = Date.now();
    let timeoutId: NodeJS.Timeout | null = null;

    const fetchNextFrame = () => {
      if (!isMounted) return;

      const startTime = Date.now();
      const nextImg = new Image();
      const targetUrl = `/api/vms/${vm.id}/screen?t=${Date.now()}`;

      nextImg.onload = () => {
        if (!isMounted) return;
        setFrameSrc(targetUrl);
        frameCount++;

        const now = Date.now();
        setLatencyMs(now - startTime);

        if (now - lastFpsTime >= 1000) {
          setFps(frameCount);
          frameCount = 0;
          lastFpsTime = now;
        }

        // Rapid next frame fetching (sub-50ms)
        timeoutId = setTimeout(fetchNextFrame, 45);
      };

      nextImg.onerror = () => {
        if (!isMounted) return;
        timeoutId = setTimeout(fetchNextFrame, 200);
      };

      nextImg.src = targetUrl;
    };

    fetchNextFrame();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [vm?.id, vm?.status]);

  // Display multiple visual touch points
  const spawnVisualRipples = (baseX: number, baseY: number, mode: FingerMode) => {
    const list: TouchPoint[] = [];
    if (mode === '1-finger') {
      list.push({ id: 1, x: baseX, y: baseY, label: 'Ngón 1', color: '#2f8bff' });
    } else if (mode === '2-finger') {
      list.push({ id: 1, x: Math.max(15, baseX - 40), y: baseY, label: 'Ngón 1', color: '#06b6d4' });
      list.push({ id: 2, x: baseX + 40, y: baseY, label: 'Ngón 2', color: '#38bdf8' });
    } else if (mode === '3-finger') {
      list.push({ id: 1, x: Math.max(15, baseX - 65), y: baseY, label: 'Ngón 1', color: '#10b981' });
      list.push({ id: 2, x: baseX, y: baseY, label: 'Ngón 2', color: '#34d399' });
      list.push({ id: 3, x: baseX + 65, y: baseY, label: 'Ngón 3', color: '#6ee7b7' });
    }
    setActiveTouches(list);
    setTimeout(() => {
      setActiveTouches([]);
    }, 500);
  };

  // Continuous Pointer Down (Real game joystick / button holding)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imageRef.current || !vm || vm.status !== 'running') return;

    const rect = imageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    isPointerDownRef.current = true;
    dragStartRef.current = {
      x: clickX,
      y: clickY,
      time: Date.now(),
    };

    spawnVisualRipples(clickX, clickY, fingerMode);

    // Send immediate hardware touch_down to keep button held down in QEMU
    onSendInput({
      type: 'touch_down',
      x: clickX,
      y: clickY,
      viewWidth: rect.width,
      viewHeight: rect.height,
    });
  };

  // Continuous Pointer Move (Dragging joystick / analog direction)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !imageRef.current) return;
    e.preventDefault();

    const now = Date.now();
    // Throttle to 30ms (~33Hz) for ultra-smooth responsiveness without flooding
    if (now - lastMoveSentTimeRef.current < 30) return;
    lastMoveSentTimeRef.current = now;

    const rect = imageRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    onSendInput({
      type: 'touch_move',
      x: curX,
      y: curY,
      viewWidth: rect.width,
      viewHeight: rect.height,
    });
  };

  // Pointer Up / Release
  const handlePointerUp = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    e.preventDefault();

    if (!imageRef.current || !dragStartRef.current) {
      await onSendInput({ type: 'touch_up' });
      return;
    }

    const rect = imageRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const startX = dragStartRef.current.x;
    const startY = dragStartRef.current.y;
    const duration = Date.now() - dragStartRef.current.time;
    dragStartRef.current = null;

    // Send hardware touch release
    await onSendInput({ type: 'touch_up' });

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (fingerMode === '1-finger') {
      if (duration >= 600 && absDeltaX < 20 && absDeltaY < 20) {
        // Explicit long press
        await onSendInput({
          type: 'longpress',
          x: endX,
          y: endY,
          durationMs: 1000,
          viewWidth: rect.width,
          viewHeight: rect.height,
        });
      } else if (absDeltaX < 15 && absDeltaY < 15) {
        // Quick tap
        await onSendInput({
          type: 'touch',
          x: endX,
          y: endY,
          viewWidth: rect.width,
          viewHeight: rect.height,
        });
      }
    } else if (fingerMode === '2-finger') {
      if (absDeltaY > 30 && absDeltaY > absDeltaX) {
        const dir = deltaY < 0 ? 'up' : 'down';
        await onSendInput({
          type: 'two_finger_scroll',
          direction: dir,
          viewWidth: rect.width,
          viewHeight: rect.height,
        });
      } else if (absDeltaX > 30) {
        const dir = deltaX < 0 ? 'left' : 'right';
        await onSendInput({
          type: 'two_finger_scroll',
          direction: dir,
          viewWidth: rect.width,
          viewHeight: rect.height,
        });
      } else {
        await onSendInput({
          type: 'two_finger_tap',
          x: endX,
          y: endY,
          viewWidth: rect.width,
          viewHeight: rect.height,
        });
      }
    } else if (fingerMode === '3-finger') {
      if (deltaY > 35) {
        await onSendInput({
          type: 'three_finger_swipe_down',
          viewWidth: rect.width,
          viewHeight: rect.height,
        });
      } else if (deltaY < -35) {
        await onSendInput({
          type: 'three_finger_swipe_up',
          viewWidth: rect.width,
          viewHeight: rect.height,
        });
      } else {
        await onSendInput({
          type: 'three_finger_tap',
          x: endX,
          y: endY,
          viewWidth: rect.width,
          viewHeight: rect.height,
        });
      }
    }
  };

  // Mouse wheel: maps to 2-finger scroll
  const handleWheel = async (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) < 15) return;
    const dir = e.deltaY > 0 ? 'down' : 'up';
    await onSendInput({
      type: 'two_finger_scroll',
      direction: dir,
    });
  };

  // Real Multi-Touch events for touchscreens / tablets
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const count = e.touches.length;

    const list: TouchPoint[] = [];
    for (let i = 0; i < count; i++) {
      const t = e.touches[i];
      list.push({
        id: i + 1,
        x: t.clientX - rect.left,
        y: t.clientY - rect.top,
        label: `Ngón ${i + 1}`,
        color: i === 0 ? '#2f8bff' : i === 1 ? '#06b6d4' : '#10b981',
      });
    }
    setActiveTouches(list);

    if (count === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceStartRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchEnd = async (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();

    if (touchDistanceStartRef.current && e.changedTouches.length >= 1) {
      const initialDist = touchDistanceStartRef.current;
      touchDistanceStartRef.current = null;

      if (initialDist > 80) {
        await onSendInput({
          type: 'pinch_in',
          viewWidth: rect.width,
          viewHeight: rect.height,
        });
      }
    }
  };

  // Gesture Quick Trigger Handlers
  const handleQuickGesture = async (type: any, extra?: any) => {
    if (!vm || vm.status === 'stopped') return;
    await onSendInput({ type, ...extra });
  };

  const handleStart = async () => {
    if (!vm) return;
    try {
      setIsStarting(true);
      await onStartVM(vm.id);
    } finally {
      setIsStarting(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!vm) {
    return (
      <div className="flex-1 min-h-[460px] flex flex-col items-center justify-center p-8 text-center bg-[#0d1424] rounded-xl border border-[#1b263b]">
        <div className="w-16 h-16 rounded-2xl bg-[#131d33] border border-[#233152] flex items-center justify-center mb-4 text-[#2f8bff]">
          <PlayIcon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Chưa chọn máy ảo Android</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Chọn một máy ảo từ danh sách hoặc bấm Khởi động để bắt đầu truyền phát màn hình.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-[#0d1424] rounded-xl border border-[#1b263b] overflow-hidden shadow-2xl select-none ${
        isFullscreen ? 'p-0 w-full h-full' : ''
      }`}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}
    >
      {/* Top Stream Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#090e1a] border-b border-[#1b263b] text-xs">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-slate-200">{vm.name}</span>
          <span className="text-slate-500">•</span>
          {vm.status === 'running' ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE STREAM (QEMU Bare-Metal)
            </span>
          ) : vm.status === 'booting' ? (
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <SpinnerIcon className="w-3 h-3 animate-spin" />
              {vm.statusMessage || 'BOOTING OS'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              STOPPED
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          {vm.status !== 'stopped' && (
            <>
              <span className="font-mono text-[11px] bg-[#111a2e] px-2 py-0.5 rounded border border-[#1e2a47]">
                {fps} FPS
              </span>
              <span className="font-mono text-[11px] bg-[#111a2e] px-2 py-0.5 rounded border border-[#1e2a47]">
                {latencyMs}ms
              </span>
              <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
                800×600 Native
              </span>
            </>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1 hover:text-white rounded hover:bg-[#1a2642] transition-colors cursor-pointer"
            title="Toàn màn hình"
          >
            {isFullscreen ? <MinimizeIcon className="w-4 h-4" /> : <MaximizeIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Multi-Finger Interaction Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-[#0c1322] border-b border-[#1b263b] text-xs gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium mr-1">
            Chế độ:
          </span>
          <button
            onClick={() => setFingerMode('1-finger')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              fingerMode === '1-finger'
                ? 'bg-[#2f8bff] text-white shadow-xs'
                : 'bg-[#141f36] text-slate-300 hover:bg-[#1c2c4d]'
            }`}
          >
            <span>👆 1 Ngón</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">(Chạm / Kéo / Nhấn giữ)</span>
          </button>
          <button
            onClick={() => setFingerMode('2-finger')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              fingerMode === '2-finger'
                ? 'bg-[#06b6d4] text-white shadow-xs'
                : 'bg-[#141f36] text-slate-300 hover:bg-[#1c2c4d]'
            }`}
          >
            <span>✌️ 2 Ngón</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">(Thu phóng / Cuộn)</span>
          </button>
          <button
            onClick={() => setFingerMode('3-finger')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              fingerMode === '3-finger'
                ? 'bg-[#10b981] text-white shadow-xs'
                : 'bg-[#141f36] text-slate-300 hover:bg-[#1c2c4d]'
            }`}
          >
            <span>🖐️ 3 Ngón</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">(Chụp màn hình / Đa nhiệm)</span>
          </button>
        </div>

        {/* Quick Gesture Action Pills for Selected Mode */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {fingerMode === '1-finger' && (
            <>
              <button
                onClick={() => handleQuickGesture('touch', { x: 400, y: 300 })}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-slate-300 hover:text-white text-[11px] transition-colors cursor-pointer"
                title="Chạm vào giữa màn hình"
              >
                Chạm giữa
              </button>
              <button
                onClick={() => handleQuickGesture('longpress', { x: 400, y: 300, durationMs: 1000 })}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-amber-300 hover:text-amber-200 text-[11px] transition-colors cursor-pointer"
                title="Nhấn giữ 1 giây"
              >
                Nhấn giữ 1s
              </button>
              <button
                onClick={() => handleQuickGesture('notification_shade')}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-slate-300 hover:text-white text-[11px] transition-colors cursor-pointer"
                title="Kéo thanh thông báo từ trên xuống"
              >
                Kéo Thông báo
              </button>
            </>
          )}

          {fingerMode === '2-finger' && (
            <>
              <button
                onClick={() => handleQuickGesture('pinch_out')}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-cyan-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                title="Phóng to 2 ngón"
              >
                <ZoomInIcon className="w-3 h-3" />
                <span>Phóng to</span>
              </button>
              <button
                onClick={() => handleQuickGesture('pinch_in')}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-cyan-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                title="Thu nhỏ 2 ngón"
              >
                <ZoomOutIcon className="w-3 h-3" />
                <span>Thu nhỏ</span>
              </button>
              <button
                onClick={() => handleQuickGesture('two_finger_scroll', { direction: 'down' })}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-slate-300 hover:text-white text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                title="Cuộn trang xuống"
              >
                <ChevronDownIcon className="w-3 h-3" />
                <span>Cuộn xuống</span>
              </button>
              <button
                onClick={() => handleQuickGesture('two_finger_scroll', { direction: 'up' })}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-slate-300 hover:text-white text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                title="Cuộn trang lên"
              >
                <ChevronUpIcon className="w-3 h-3" />
                <span>Cuộn lên</span>
              </button>
              <button
                onClick={() => handleQuickGesture('quick_settings')}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-cyan-300 text-[11px] transition-colors cursor-pointer"
                title="Kéo 2 ngón mở Cài đặt nhanh"
              >
                Cài đặt nhanh
              </button>
            </>
          )}

          {fingerMode === '3-finger' && (
            <>
              <button
                onClick={() => handleQuickGesture('three_finger_swipe_down')}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-emerald-300 text-[11px] transition-colors cursor-pointer"
                title="Chụp màn hình 3 ngón"
              >
                Chụp màn hình (3 ngón)
              </button>
              <button
                onClick={() => handleQuickGesture('three_finger_swipe_up')}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-emerald-300 text-[11px] transition-colors cursor-pointer"
                title="Đa nhiệm 3 ngón"
              >
                Đa nhiệm (Recents)
              </button>
              <button
                onClick={() => handleQuickGesture('three_finger_tap')}
                className="px-2 py-0.5 rounded bg-[#17233d] hover:bg-[#203154] text-slate-300 hover:text-white text-[11px] transition-colors cursor-pointer"
                title="Chạm 3 ngón"
              >
                Chạm 3 ngón
              </button>
            </>
          )}
        </div>
      </div>

      {/* Interactive Display Viewport with ContextMenu / Copy Blocking */}
      <div
        className="relative flex-1 min-h-[460px] bg-black flex items-center justify-center select-none overflow-hidden cursor-crosshair"
        onWheel={handleWheel}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}
        style={{
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          userSelect: 'none',
        }}
      >
        {/* Real Live Frame Image */}
        {frameSrc && vm.status !== 'stopped' ? (
          <div
            className="relative w-full h-full flex items-center justify-center select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}
            style={{
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              userSelect: 'none',
            }}
          >
            <img
              ref={imageRef}
              src={frameSrc}
              alt="Live Android Screen"
              className="max-w-full max-h-[580px] w-auto h-auto object-contain pointer-events-auto shadow-2xl select-none"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
                touchAction: 'none',
              }}
            />

            {/* Visual Multi-Touch Feedback Ripples */}
            {activeTouches.map(touch => (
              <div
                key={touch.id}
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: touch.x, top: touch.y }}
              >
                <div
                  className="w-10 h-10 rounded-full border-2 animate-ping"
                  style={{ borderColor: touch.color, backgroundColor: `${touch.color}33` }}
                />
                <span
                  className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white bg-black/75 shadow-xs"
                  style={{ color: touch.color }}
                >
                  {touch.label}
                </span>
              </div>
            ))}
          </div>
        ) : !frameSrc && vm.status !== 'stopped' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-[#070b14]">
            <SpinnerIcon className="w-9 h-9 text-[#2f8bff] animate-spin mb-3" />
            <h4 className="text-sm font-semibold text-slate-200">Đang khởi tạo màn hình phần cứng</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {vm.statusMessage || 'Đang kết nối VESA framebuffer từ QEMU...'}
            </p>
          </div>
        ) : null}

        {/* Stopped State Overlay */}
        {vm.status === 'stopped' && (
          <div className="absolute inset-0 bg-[#070b14]/95 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#0d1424] border border-[#1b263b] flex items-center justify-center mb-4 text-slate-500 shadow-inner">
              <PowerIcon className="w-8 h-8" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1">Máy ảo Android đang tắt</h4>
            <p className="text-xs text-slate-400 max-w-xs mb-5">
              Bấm nút bên dưới để khởi động lại máy ảo và truyền phát màn hình trực tiếp.
            </p>
            <button
              onClick={handleStart}
              disabled={isStarting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2f8bff] hover:bg-[#2575dc] text-white font-medium text-xs shadow-lg shadow-[#2f8bff]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isStarting ? (
                <>
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                  <span>Đang khởi động...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4 fill-current" />
                  <span>Bật nguồn Android VM</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Stream Hint Footer */}
        <div className="absolute bottom-2 left-2 pointer-events-none bg-black/60 backdrop-blur-xs text-[10px] text-slate-400 px-2 py-0.5 rounded border border-white/5 flex items-center gap-2">
          <span>
            {fingerMode === '1-finger' && '👆 Giữ chuột & kéo để di chuyển joystick / nút game • Nhấn giữ 0.6s để mở menu'}
            {fingerMode === '2-finger' && '✌️ Kéo để cuộn • Lăn chuột để cuộn nhanh • Bấm nút để phóng to/thu nhỏ'}
            {fingerMode === '3-finger' && '🖐️ Vuốt xuống để chụp màn hình • Vuốt lên để mở danh sách đa nhiệm'}
          </span>
        </div>
      </div>
    </div>
  );
};
