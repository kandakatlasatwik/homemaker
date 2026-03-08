import React from 'react'
import { useTheme } from '../../context/ThemeContext';
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'

const GenerateImageCard = ({ generatedImage, loading }) => {
  const theme = useTheme();
  return (
    <div className={`w-full max-w-lg mx-auto ${theme.bgCard} rounded-2xl ${theme.shadowCard} p-4 sm:p-6 min-h-64 sm:min-h-80 flex flex-col items-center justify-center overflow-hidden border ${theme.border} transition-colors duration-300`}>
      {loading ? (
        <div className="relative w-full h-64 sm:h-80 flex flex-col items-center justify-center">
          <div className={`absolute inset-0 ${theme.isDark ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800' : 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200'} animate-pulse rounded-xl`} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_2s_infinite] rounded-xl" style={{ backgroundSize: '200% 100%' }} />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <Grid size="70" speed="1.5" color={theme.isDark ? '#f59e0b' : '#000'} />
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-semibold text-base sm:text-lg">Generating</span>
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
            <span className={`${theme.textMuted} text-xs sm:text-sm`}>AI is crafting your image...</span>
          </div>
        </div>
      ) : generatedImage ? (
        <img
          src={`data:image/png;base64,${generatedImage}`}
          alt="Generated"
          className="max-w-full max-h-64 sm:max-h-80 rounded-xl shadow-lg object-contain"
        />
      ) : (
        <div className={`${theme.textMuted} text-center text-sm sm:text-base`}>No image generated yet.</div>
      )}
    </div>
  );
}

export default GenerateImageCard
