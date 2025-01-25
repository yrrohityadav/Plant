import React, { useState } from 'react';
import { Plane as Plant } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzePlantDisease } from './services/api';
import { PlantAnalysis } from './types';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (base64Image: string) => {
    setSelectedImage(base64Image);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await analyzePlantDisease(base64Image);
      if (response.status === 'success') {
        setAnalysis(response.result);
      } else {
        setError(response.message || 'An error occurred during analysis');
      }
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Plant className="mx-auto h-12 w-12 text-green-600" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Plant Disease Detection</h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload a photo of your plant to identify diseases and get treatment recommendations
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <ImageUploader onImageSelect={handleImageSelect} />

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {selectedImage && !error && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Selected Image</h3>
                <div className="mt-2">
                  <img
                    src={`data:image/jpeg;base64,${selectedImage}`}
                    alt="Selected plant"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            {(selectedImage || isLoading) && (
              <div className="mt-8">
                <AnalysisResult analysis={analysis} isLoading={isLoading} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;