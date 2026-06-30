/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Trophy, Shuffle, Gamepad2 } from 'lucide-react';

const COLORS = [
  '#ff7eb3', // vibrant pink
  '#ffb86c', // vibrant orange
  '#f1fa8c', // vibrant yellow
  '#50fa7b', // vibrant green
  '#8be9fd', // vibrant blue
  '#bd93f9', // vibrant purple
];

const COLOR_NAMES: Record<string, string> = {
  '#ff7eb3': 'Hot Pink',
  '#ffb86c': 'Neon Orange',
  '#f1fa8c': 'Laser Yellow',
  '#50fa7b': 'Toxic Green',
  '#8be9fd': 'Cyber Cyan',
  '#bd93f9': 'Plasma Violet',
};

const PREFIXES = ['Neon', 'Cyber', 'Volt', 'Glow', 'Turbo', 'Shadow', 'Solar', 'Hydra', 'Mega', 'Hyper', 'Laser', 'Quantum', 'Glitch', 'Aero'];
const SUFFIXES = ['Cobra', 'Viper', 'Serpent', 'Hunter', 'Racer', 'Striker', 'Ghost', 'Blaze', 'Crawl', 'Phantom', 'Drake', 'Stalker', 'Tracker'];

const generateRandomName = () => {
  const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const s = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${p}${s}-${num}`;
};

export function UI() {
  const { gameState, playerId, joinGame } = useGameStore();

  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('neon_snake_nickname') || 'Srivani';
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem('neon_snake_color') || COLORS[0];
  });

  const player = playerId && gameState ? gameState.players[playerId] : null;
  const isAlive = player?.state === 'alive';
  const isDead = player?.state === 'dead';

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  const handleJoin = () => {
    const trimmed = nickname.trim().slice(0, 15) || 'GlowRider';
    localStorage.setItem('neon_snake_nickname', trimmed);
    localStorage.setItem('neon_snake_color', selectedColor);
    joinGame(trimmed, selectedColor);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 select-none">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto relative">
        <div className="flex flex-col gap-1 z-10">
          <h1 className="text-4xl font-black text-white tracking-tighter" style={{ textShadow: `0 0 15px ${selectedColor}` }}>
            NEON.SNAKE
          </h1>
          {isAlive && (
            <div className="text-lg font-mono text-white/80 font-bold flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: selectedColor }} />
              Length: <span className="text-white font-black">{Math.floor(player.score)}</span>
            </div>
          )}
        </div>
        
        {/* Controls Hint */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1 flex gap-2 opacity-90 pointer-events-none hidden md:flex">
          <div className="flex items-center gap-2 text-xs font-mono text-white bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            <span className="font-bold bg-white/10 px-1.5 py-0.5 rounded text-white border border-white/10">A</span>
            <span className="font-bold bg-white/10 px-1.5 py-0.5 rounded text-white border border-white/10">D</span>
            <span className="text-white/60 uppercase tracking-wider text-[10px]">Turn Left/Right</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-white bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            <span className="font-bold bg-white/10 px-2.5 py-0.5 rounded text-white border border-white/10 text-[10px]">SPACE</span>
            <span className="text-white/60 uppercase tracking-wider text-[10px]">Boost Speed</span>
          </div>
        </div>

        <button
          onClick={handleOpenNewTab}
          className="flex items-center gap-2 px-4 py-2.5 bg-black/60 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-full text-white text-sm font-bold transition-all z-10 shadow-lg cursor-pointer"
        >
          <ExternalLink size={16} />
          <span>New Tab</span>
        </button>
      </div>

      {/* Leaderboard */}
      {gameState && gameState.leaderboard.length > 0 && (
        <div className="absolute top-20 right-4 w-64 bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-white/10 pointer-events-auto shadow-2xl">
          <div className="flex items-center gap-2 mb-3 text-white/90 font-black text-sm tracking-wider">
            <Trophy size={16} className="text-yellow-400" />
            <h2>LEADERBOARD</h2>
          </div>
          <div className="flex flex-col gap-2">
            {gameState.leaderboard.map((entry, i) => {
              const isCurrent = entry.id === playerId;
              return (
                <div key={entry.id} className={`flex justify-between items-center text-sm px-2 py-1 rounded-lg ${isCurrent ? 'bg-white/10 border border-white/10' : ''}`}>
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-white/40 font-mono w-4">{i + 1}.</span>
                    <span style={{ color: entry.color, textShadow: isCurrent ? `0 0 8px ${entry.color}` : 'none' }} className="font-bold truncate max-w-[120px]">
                      {entry.name}
                    </span>
                  </div>
                  <span className="font-mono font-black text-white/90">{entry.score}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Menus */}
      <AnimatePresence>
        {(!player || isDead) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/75 backdrop-blur-sm z-30"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-zinc-950/90 p-8 rounded-3xl border shadow-2xl max-w-md w-full flex flex-col gap-6 relative overflow-hidden"
              style={{
                borderColor: `${selectedColor}40`,
                boxShadow: `0 0 40px ${selectedColor}15, inset 0 0 20px ${selectedColor}05`,
              }}
            >
              {/* Outer decorative neon lines */}
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: selectedColor, boxShadow: `0 0 15px ${selectedColor}` }} />

              {isDead ? (
                <div className="text-center">
                  <span className="text-xs font-mono font-black tracking-widest text-red-500 uppercase px-2.5 py-1 bg-red-950/30 border border-red-500/20 rounded-full">
                    ELIMINATED
                  </span>
                  <h2 className="text-4xl font-black text-white mt-3 tracking-tighter" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}>
                    YOU DIED
                  </h2>
                  <p className="text-white/50 text-sm mt-1.5">
                    Final Length: <span className="text-red-400 font-bold">{Math.floor(player?.score || 0)}</span>
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <span className="p-2 bg-white/5 rounded-full border border-white/10" style={{ color: selectedColor, filter: `drop-shadow(0 0 5px ${selectedColor})` }}>
                      <Gamepad2 size={24} />
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight">JOIN ARENA</h2>
                  <p className="text-white/40 text-xs mt-1">Ready your light trail and claim the neon grid.</p>
                </div>
              )}

              {/* Form Input: Nickname */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-xs font-mono font-black tracking-widest text-white/50 uppercase">
                  ENTER NICKNAME
                </label>
                <div className="flex gap-2 relative">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value.slice(0, 15))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleJoin();
                    }}
                    placeholder="Enter nickname..."
                    className="flex-1 bg-black/50 text-white font-bold px-4 py-3 rounded-2xl border transition-all duration-300 focus:outline-none placeholder-white/20 text-sm"
                    style={{
                      borderColor: `${selectedColor}40`,
                      boxShadow: `0 0 10px ${selectedColor}10`,
                    }}
                  />
                  <button
                    onClick={() => setNickname(generateRandomName())}
                    className="px-3.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-2xl border border-white/10 transition-colors flex items-center justify-center cursor-pointer"
                    title="Randomize name"
                  >
                    <Shuffle size={16} />
                  </button>
                </div>
              </div>

              {/* Color Selector */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-black tracking-widest text-white/50 uppercase">
                    CHOOSE NEON GLOW
                  </label>
                  <span className="text-[10px] font-mono font-bold uppercase" style={{ color: selectedColor }}>
                    {COLOR_NAMES[selectedColor] || 'Custom'}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-2 bg-black/40 p-2.5 rounded-2xl border border-white/5">
                  {COLORS.map((col) => {
                    const isSelected = selectedColor === col;
                    return (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`relative aspect-square rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'scale-110 border-2 border-white'
                            : 'hover:scale-105 border border-white/10 opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: col,
                          boxShadow: isSelected
                            ? `0 0 15px ${col}, inset 0 0 5px rgba(255,255,255,0.8)`
                            : `0 0 5px ${col}40`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Animated Mini Snake Preview */}
              <div className="h-14 w-full flex items-center justify-center relative overflow-hidden bg-black/30 rounded-2xl border border-white/5 p-2">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <span className="text-[9px] font-mono tracking-widest uppercase font-black">TRAIL PREVIEW</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[...Array(6)].map((_, idx) => {
                    const size = idx === 0 ? '12px' : idx === 1 ? '10px' : '8px';
                    return (
                      <motion.div
                        key={idx}
                        className="rounded-full"
                        style={{
                          width: size,
                          height: size,
                          backgroundColor: selectedColor,
                          boxShadow: `0 0 10px ${selectedColor}`,
                        }}
                        animate={{
                          y: [0, -4, 4, 0],
                        }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          delay: idx * 0.12,
                          ease: "easeInOut",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Play / Respawn Trigger Button */}
              <button
                onClick={handleJoin}
                className="w-full py-4 text-black font-black text-sm tracking-widest rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 cursor-pointer uppercase"
                style={{
                  backgroundColor: selectedColor,
                  boxShadow: `0 0 25px ${selectedColor}60, 0 4px 12px rgba(0,0,0,0.5)`,
                }}
              >
                {isDead ? 'RESPAWN INSTANTLY' : 'ENTER ARENA'}
              </button>

              {/* Controls guide inside join screen for accessibility */}
              <div className="text-center text-[10px] font-mono text-white/30 border-t border-white/5 pt-4 flex flex-col gap-1">
                <div>STEER: <span className="text-white/60">A / D</span> OR <span className="text-white/60">← / → KEYS</span></div>
                <div>BOOST SPEED: <span className="text-white/60">SPACEBAR</span></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
