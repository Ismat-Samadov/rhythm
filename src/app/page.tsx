'use client';

import { useGameEngine } from '@/hooks/useGameEngine';
import { useInputHandler } from '@/hooks/useInputHandler';
import { StartScreen } from '@/components/game/StartScreen';
import { GameHUD } from '@/components/game/GameHUD';
import { CountdownOverlay } from '@/components/game/CountdownOverlay';
import { PauseMenu } from '@/components/game/PauseMenu';
import { ResultScreen } from '@/components/game/ResultScreen';
import { MobileControls } from '@/components/game/MobileControls';

/**
 * Main game page — composes the engine hook, input handler, canvas, and all overlays.
 */
export default function RhythmGamePage() {
  const {
    canvasRef,
    uiState,
    musicEnabled,
    sfxEnabled,
    pressLane,
    releaseLane,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    goToMenu,
    toggleMusic,
    toggleSfx,
  } = useGameEngine();

  // Wire up keyboard input
  useInputHandler({
    status: uiState.status,
    pressLane,
    releaseLane,
    pauseGame,
    resumeGame,
  });

  const isActive = uiState.status === 'playing' || uiState.status === 'paused';
  const showMobile = isActive || uiState.status === 'countdown';

  return (
    <main className="flex flex-col h-full bg-void-900 overflow-hidden">
      {/* ── In-game HUD (only while playing / paused) ── */}
      {isActive && (
        <GameHUD
          uiState={uiState}
          onPause={pauseGame}
          musicEnabled={musicEnabled}
          sfxEnabled={sfxEnabled}
          onToggleMusic={toggleMusic}
          onToggleSfx={toggleSfx}
        />
      )}

      {/* ── Canvas game field ── */}
      <div className="relative flex-1 min-h-0">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Overlays rendered on top of the canvas */}

        {/* Start / main menu */}
        {uiState.status === 'idle' && (
          <StartScreen onStart={startGame} />
        )}

        {/* Countdown before game begins */}
        {uiState.status === 'countdown' && (
          <CountdownOverlay count={uiState.countdown} />
        )}

        {/* Pause menu */}
        {uiState.status === 'paused' && (
          <PauseMenu
            onResume={resumeGame}
            onRestart={restartGame}
            onMenu={goToMenu}
          />
        )}

        {/* Results / game over */}
        {uiState.status === 'gameover' && (
          <ResultScreen
            uiState={uiState}
            onPlayAgain={restartGame}
            onMenu={goToMenu}
          />
        )}
      </div>

      {/* ── Mobile lane buttons ── */}
      {showMobile && (
        <MobileControls onPress={pressLane} onRelease={releaseLane} />
      )}
    </main>
  );
}
