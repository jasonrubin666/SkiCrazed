import { Game } from './game/Game';

// Force reload when a new service worker takes over
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const loading = document.getElementById('loading');

  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Remove loading screen
  if (loading) {
    loading.style.display = 'none';
  }

  // Prevent default gestures on iOS
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('gesturechange', (e) => e.preventDefault());
  document.addEventListener('gestureend', (e) => e.preventDefault());

  // Prevent pull-to-refresh on mobile
  document.body.style.overscrollBehavior = 'none';

  // Request fullscreen on mobile when possible
  const requestFullscreen = () => {
    if (document.fullscreenEnabled && !document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {
        // Fullscreen not available, that's fine
      });
    }
  };

  // Try fullscreen on first tap (mobile)
  document.addEventListener('touchstart', requestFullscreen, { once: true });

  // Lock screen orientation to landscape if supported
  const lockOrientation = () => {
    try {
      (screen.orientation as any)?.lock?.('landscape').catch(() => {
        // Orientation lock not available
      });
    } catch {
      // Not supported
    }
  };
  lockOrientation();

  // Start the game
  const game = new Game(canvas);
  game.start();
});
