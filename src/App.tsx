import React, { useState, useCallback } from 'react';
import { Wand2 } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ErrorMessage } from './components/ErrorMessage';
import { performFaceSwap } from './services/faceSwap';
import { handleAPIError } from './utils/errors';
import { fileToDataUrl } from './utils/image';
import { API_CONFIG } from './config';
import type { FaceSwapRequest } from './types';

// Christmas-themed images
const CHRISTMAS_IMAGES = [
  'https://1250948203.rsc.cdn77.org/images/fff0778c-d7b8-4eee-b466-f956734aef66.jpg',
  'https://1250948203.rsc.cdn77.org/images/3211686b-e333-4e04-93f4-80a42d7a4e73.jpg',
  'https://1250948203.rsc.cdn77.org/images/3ddc42af-94e8-437b-967c-fe254ee070dc.jpg',
  'https://1250948203.rsc.cdn77.org/images/daa08e22-80a4-4f8e-81c2-a46758da00dd.jpg'
];

const CHRISTMAS_EMOJIS = ['🎄', '🎅', '❄️', '⛄', '🎁'];

function App() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserImageSelect = useCallback(async (file: File) => {
    try {
      setLoading(true);
      const dataUrl = await fileToDataUrl(file);
      setUserImage(dataUrl);
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUserImageClear = useCallback(() => {
    setUserImage(null);
    setResult(null);
  }, []);

  const handleTargetSelect = useCallback((image: string) => {
    setSelectedTarget(image);
    setResult(null);
  }, []);

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
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userImage, selectedTarget]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50">
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Santify</h1>
          <p className="text-gray-600">Transform yourself into a festive character!</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <ImageUploader 
              onImageSelect={handleUserImageSelect}
              onImageClear={handleUserImageClear}
              label="Upload your photo"
              currentImage={userImage}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Choose a Christmas Character</h2>
            <div className="grid grid-cols-2 gap-4">
              {CHRISTMAS_IMAGES.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleTargetSelect(image)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-4 transition-all ${
                    selectedTarget === image ? 'border-red-500 scale-105' : 'border-transparent hover:border-red-300'
                  }`}
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

        <div className="text-center mt-8">
          <button
            onClick={handleSwap}
            disabled={!userImage || !selectedTarget || loading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div>
                {CHRISTMAS_EMOJIS.map((emoji, index) => (
                  <span key={index} style={{ animation: 'move 1s infinite' }}>{emoji}</span>
                ))}
              </div>
            ) : (
              <span>
                <Wand2 className="w-5 h-5" />
                Make the Magic Happen!
              </span>
            )}
          </button>
        </div>

        {result && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Your Festive Transformation!</h2>
            <img 
              src={result} 
              alt="Face swap result" 
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        )}

        {error && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
      </div>
    </div>
  );
}

export default App;