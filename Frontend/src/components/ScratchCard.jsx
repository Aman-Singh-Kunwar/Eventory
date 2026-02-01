import React, { useState, useEffect, useRef } from 'react';
import { Gift, Sparkles } from 'lucide-react';

const REWARDS = [
    { id: 1, text: "🍿 FREE Popcorn Bucket!", icon: "🍿" },
    { id: 2, text: "💸 ₹50 Cashback!", icon: "💸" },
    { id: 3, text: "🥤 FREE Small Softdrink (with popcorn)!", icon: "🥤" },
];

export default function ScratchCard() {
    const [scratched, setScratched] = useState(false);
    const [reward, setReward] = useState(null);
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);

    useEffect(() => {
        setReward(REWARDS[Math.floor(Math.random() * REWARDS.length)]);
    }, []);

    useEffect(() => {
        if (reward && !scratched) {
            initCanvas();
        }
    }, [reward, scratched]);

    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#4b5563');
        gradient.addColorStop(1, '#2d3748');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add sparkle effect
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText('✨ Scratch Me! ✨', canvas.width / 2, canvas.height / 2 + 7);
        ctx.shadowColor = 'transparent';
    };

    const scratch = (e) => {
        if (!isDrawing.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        checkScratched();
    };

    const checkScratched = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let transparentPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) transparentPixels++;
        }
        if (transparentPixels / (data.length / 4) > 0.4) {
            setScratched(true);
        }
    };

    return (
        <div className="flex flex-col items-center mt-8 p-6 rounded-2xl bg-linear-to-br from-indigo-900/50 to-purple-900/50 border border-white/15 shadow-2xl hover:shadow-[0_20px_60px_rgba(168,85,247,0.3)] relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 p-2 opacity-30 animate-pulse">
                <Sparkles className="w-14 h-14 text-yellow-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-400/20">
                  <Gift className="w-6 h-6 text-yellow-400" />
                </div>
                Your Special Reward!
            </h3>

            <div className="relative w-72 h-40 rounded-xl overflow-hidden border-2 border-dashed border-yellow-400/40 bg-linear-to-br from-yellow-50 to-amber-50 hover:border-yellow-400/60 transition-colors">
                {reward && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-white to-yellow-50 text-gray-900 p-4 text-center">
                        <span className="text-6xl mb-2 animate-bounce">{reward.icon}</span>
                        <p className="font-bold text-base leading-tight">{reward.text}</p>
                    </div>
                )}

                {!scratched && (
                    <canvas
                        ref={canvasRef}
                        width={288}
                        height={160}
                        className="absolute inset-0 cursor-crosshair touch-none hover:opacity-90 transition-opacity"
                        onMouseDown={() => (isDrawing.current = true)}
                        onMouseUp={() => (isDrawing.current = false)}
                        onMouseMove={scratch}
                        onTouchStart={() => (isDrawing.current = true)}
                        onTouchEnd={() => (isDrawing.current = false)}
                        onTouchMove={scratch}
                    />
                )}
            </div>

            {scratched && (
                <p className="text-yellow-300 mt-6 font-bold text-lg animate-bounce drop-shadow-lg">
                    🎉 Congratulations! You won! 🎉
                </p>
            )}

            {!scratched && (
                <p className="text-gray-400 mt-4 text-xs italic">
                    Scratch this card to reveal your prize!
                </p>
            )}
        </div>
    );
}
