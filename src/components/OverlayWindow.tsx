import { useEffect, useRef } from 'react';
import { getCurrentWindow, LogicalPosition } from '@tauri-apps/api/window';
import { useSettings } from '../hooks/useSettings';
import { ParticleSystem } from './ParticleSystem';

export function OverlayWindow() {
  const { settings, loading, saveSettings } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<any>(null);

  useEffect(() => {
    const initWindow = async () => {
      try {
        const win = getCurrentWindow();
        windowRef.current = win;
        await win.setShadow(false);
      } catch (error) {
        console.error('Failed to get window:', error);
      }
    };
    initWindow();
  }, []);

  useEffect(() => {
    if (!windowRef.current || !settings) return;

    windowRef.current.setPosition(
      new LogicalPosition(settings.window.x, settings.window.y)
    ).catch((error: unknown) => {
      console.error('Failed to set window position:', error);
    });
  }, [settings]);

  // Save position when drag ends - only if actually dragged
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!windowRef.current || !settings) return;

    const handleDragStart = () => {
      isDraggingRef.current = true;
    };

    const handleDragEnd = async () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        try {
          const physicalPos = await windowRef.current.outerPosition();
          const scaleFactor = await windowRef.current.scaleFactor();

          // Convert PhysicalPosition to LogicalPosition
          const logicalX = physicalPos.x / scaleFactor;
          const logicalY = physicalPos.y / scaleFactor;

          const x = logicalX;
          const y = logicalY;

          const updatedSettings = {
            ...settings,
            window: {
              ...settings.window,
              x,
              y,
            },
          };
          await saveSettings(updatedSettings);
        } catch (error) {
          console.error('Failed to save window position:', error);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleDragStart);
      container.addEventListener('mouseup', handleDragEnd);
      return () => {
        container.removeEventListener('mousedown', handleDragStart);
        container.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [settings, saveSettings]);

  if (loading || !settings) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-tauri-drag-region
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'transparent',
        cursor: 'grab',
      }}
    >
      {/* Peach tree - backup layer (lấp khe hở khi ngọn đung đưa) */}
      <img
        src="/tree.png"
        alt="Peach tree backup"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
        }}
      />
      {/* Peach tree - gốc 40% cố định */}
      <img
        src="/tree.png"
        alt="Peach tree base"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          clipPath: 'inset(55% 0 0 0)',
          WebkitClipPath: 'inset(55% 0 0 0)',
        }}
      />
      {/* Peach tree - ngọn 60% đung đưa */}
      <img
        src="/tree.png"
        alt="Peach tree top"
        className="tree-sway-effect"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          clipPath: 'inset(0 0 45% 0)',
          WebkitClipPath: 'inset(0 0 45% 0)',
        }}
      />

      {/* Particle system */}
      <ParticleSystem
        width={settings.window.width}
        height={settings.window.height}
        petalCount={settings.animation.petal_count}
        windStrength={settings.animation.wind_strength}
        enabled={settings.animation.enabled}
      />
    </div>
  );
}
