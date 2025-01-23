import React, { useState } from "react";

const App = () => {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("");
  const [context, setContext] = useState("");
  const [maxTokens, setMaxTokens] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const handleGenerateVoice = async () => {
    setLoading(true);
    setError("");
    setAudioUrl("");

    try {
      const response = await fetch("http://localhost:5000/generatevoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          tone,
          context,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate audio");
      }

      const blob = await response.blob();
      // Create a URL for the audio file and set it in the state
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-primary mb-6">Voice Generator</h1>

      <div className="w-full max-w-md shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary bg-background mb-1">
            Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
            rows={4}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tone (Optional)
          </label>
          <input
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="Enter tone"
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Context (Optional)
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Enter context"
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Tokens
          </label>
          <input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <button
          onClick={handleGenerateVoice}
          className={`w-full py-2 px-4 rounded-md font-medium text-white ${
            loading ? "bg-gray-400" : "bg-primary hover:bg-primary-dark"
          }`}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Voice"}
        </button>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {audioUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-primary mb-2">Generated Audio</h2>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <a
              href={audioUrl}
              download="audio.wav"
              className="block mt-4 text-primary underline"
            >
              Download Audio
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
