import React from 'react'

const GenerateImageCard = ({ generatedImage, loading }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 min-h-64 sm:min-h-80 flex flex-col items-center justify-center overflow-hidden">
      {loading ? (
        <div className="relative w-full h-64 sm:h-80 flex flex-col items-center justify-center">
          {/* Shimmer/Skeleton effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_2s_infinite] rounded-xl" style={{ backgroundSize: '200% 100%' }} />
          {/* AI spinner */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-semibold text-base sm:text-lg">Generating</span>
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
            <span className="text-gray-400 text-xs sm:text-sm">AI is crafting your image...</span>
          </div>
        </div>
      ) : generatedImage ? (
        <img
          src={`data:image/png;base64,${generatedImage}`}
          alt="Generated"
          className="max-w-full max-h-64 sm:max-h-80 rounded-xl shadow-lg object-contain"
        />
      ) : (
        <div className="text-gray-400 text-center text-sm sm:text-base">No image generated yet.</div>
      )}
    </div>
  );
}

export default GenerateImageCard
