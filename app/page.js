"use client";
import Scene from '../components/Scene';

export default function Page() {
  return (
    <div className="w-full h-screen">
      <Scene />
      <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs">
        Scroll to zoom • Drag to orbit • Pinch to zoom (mobile)
      </div>
    </div>
  );
}
