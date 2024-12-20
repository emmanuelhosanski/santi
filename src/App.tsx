import React, { useState, useCallback } from 'react';
import { Wand2, Upload, X } from 'lucide-react';
import type { FaceSwapRequest } from './types';
import { performFaceSwap } from './services/faceSwap';
import { handleAPIError } from './utils/errors';
import { fileToDataUrl } from './utils/image';
import { API_CONFIG } from './config';

// Christmas-themed images
const CHRISTMAS_IMAGES = [
  'https://1250948203.rsc.cdn77.org/images/fff0778c-d7b8-4eee-b466-f956734aef66.jpg',
  'https://1250948203.rsc.cdn77.org/images/3211686b-e333-4e04-93f4-80a42d7a4e73.jpg',
  'https://1250948203.rsc.cdn77.org/images/3ddc42af-94e8-437b-967c-fe254ee070dc.jpg',
  'https://1250948203.rsc.cdn77.org/images/daa08e22-80a4-4f8e-81c2-a46758da00dd.jpg',
  'https://1250948203.rsc.cdn77.org/images/a394f17b-18fa-4894-be40-bd8552211024.jpg',
  'https://1250948203.rsc.cdn77.org/images/402df4f7-9919-4985-a142-906f90282290.jpg',
  'https://1250948203.rsc.cdn77.org/images/6ffcd1ca-b65c-40d3-a94f-91a3fa7748f8.jpg',
  'https://1250948203.rsc.cdn77.org/images/9e8958b2-93c7-4845-867b-eb2751960e93.jpg',
  'https://1250948203.rsc.cdn77.org/images/16bde630-50fc-4a66-9c92-173c3ebecd9b.jpg',
  'https://1250948203.rsc.cdn77.org/images/34e01fe9-77ba-4ded-94d6-2328b611566e.jpg',
  'https://1250948203.rsc.cdn77.org/images/8db3427d-92e7-402e-8494-e7f698931f0e.jpg',
  'https://1250948203.rsc.cdn77.org/images/0d4d32a6-3397-41ac-b799-6fade5d4d7b8.jpg'
];

const CHRISTMAS_EMOJIS = ['🎄', '🎅', '❄️', '⛄', '🎁'];

function App() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files?.[0]) {
      await handleUserImageSelect(files[0]);
    }
  }, []);

  const handleUserImageSelect = useCallback(async (file: File) => {
    try {
      setLoading(true);
      const dataUrl = await fileToDataUrl(file);
      setUserImage(dataUrl);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUserImageSelect(file);
  }, [handleUserImageSelect]);

  const handleSwap = useCallback(async () => {
    if (!userImage || !selectedTarget) return;

    setLoading(true);
    setError(null);

    try {
      const request: FaceSwapRequest = {
        source_img: userImage,
        target_img: selectedTarget,
        input_faces_index: 0,
        source_faces_index: 0,
        face_restore: API_CONFIG.FACE_RESTORE_MODEL,
        base64: true
      };

      const blob = await performFaceSwap(request);
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  }, [userImage, selectedTarget]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-600 mb-3">
            Santify
            <span className="ml-2 animate-bounce inline-block">🎅</span>
          </h1>
          <p className="text-lg text-gray-600">Transform yourself into a festive character!</p>
        </header>

        {/* Centered dropzone with modern design */}
        <div className="max-w-md mx-auto mb-12">
          <div
            className={`
              relative rounded-xl transition-all duration-300
              ${userImage ? 'bg-white shadow-lg' : 'border-2 border-dashed border-gray-300'}
              ${isDragging ? 'border-red-500 bg-red-50' : ''}
              overflow-hidden aspect-square
            `}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {userImage ? (
              <>
                <img
                  src={userImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setUserImage(null)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center h-full cursor-pointer p-6">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-gray-500 text-center">
                  Drop your photo here or click to upload
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </label>
            )}
          </div>
        </div>

        {/* Horizontal scrollable Christmas images */}
        <div className="mb-12">
          <p className="text-center text-gray-600 mb-4">Choose your Christmas character</p>
          <div className="relative">
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex space-x-4 px-4">
                {CHRISTMAS_IMAGES.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTarget(image)}
                    className={`
                      flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden transition-all duration-300
                      ${selectedTarget === image ? 'ring-4 ring-red-500 scale-105' : 'hover:ring-2 ring-red-300'}
                    `}
                  >
                    <img
                      src={image}
                      alt={`Christmas character ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA button */}
        <div className="text-center">
          <button
            onClick={handleSwap}
            disabled={!userImage || !selectedTarget || loading}
            className="
              group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500
              hover:from-red-700 hover:to-red-600 text-white rounded-full
              font-semibold shadow-lg hover:shadow-xl transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                {CHRISTMAS_EMOJIS.map((emoji, index) => (
                  <span
                    key={index}
                    className="animate-bounce"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            ) : (
              <span className="flex items-center space-x-2">
                <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Santify yourself!</span>
              </span>
            )}
          </button>
        </div>

        {/* Result section */}
        {result && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Your Festive Transformation! ✨
            </h2>
            <img
              src={result}
              alt="Face swap result"
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
            <div className="flex justify-between items-center">
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;