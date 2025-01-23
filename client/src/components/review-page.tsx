import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronLeft, Star, Volume2, Loader2 } from 'lucide-react';

interface WaveformProps {
  audioUrl: string | null;
  isPlaying: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ audioUrl, isPlaying }) => {
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaElementSource(audio);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      analyserRef.current.fftSize = 256;

      const updateWaveform = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(dataArray);
        setWaveformData(Array.from(dataArray));
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };

      if (isPlaying) {
        updateWaveform();
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl, isPlaying]);

  return (
    <div className="h-32 bg-[#1E1E1E] rounded-lg relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center h-16 gap-[2px]">
          {waveformData.map((value, index) => (
            <div
              key={index}
              className="w-[2px] bg-white"
              style={{
                height: `${((value - 128) / 128) * 100}%`,
                opacity: isPlaying ? 0.8 : 0.3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function Gen() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Text input is required");
      return;
    }

    setIsLoading(true);
    setAudioUrl(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Something went wrong");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated_audio.wav';
      a.click();
      
      setAudioUrl(url);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <ChevronLeft className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Voice Cloning</h1>
        </div>
        <Star className="w-6 h-6" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to clone the voice..."
              rows={5}
              className="w-full bg-[#1E1E1E] text-white rounded-lg p-4 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                px-6 py-3 rounded-full font-medium flex items-center gap-2
                ${isLoading 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Voice'
              )}
            </button>
          </div>
        </form>

        {audioUrl && (
          <div className="w-full mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-center">Generated Audio</h3>
            
            {/* Waveform */}
            <div className="w-full">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>00:00</span>
                <span>00:02</span>
                <span>00:04</span>
                <span>00:06</span>
              </div>
              <Waveform audioUrl={audioUrl} isPlaying={isPlaying} />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8">
              <button 
                onClick={togglePlayback}
                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <button className="p-4 rounded-full hover:bg-gray-800 transition-colors">
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gen;