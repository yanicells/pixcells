import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

function DownloadButton({ imageUrl } : { imageUrl: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <a 
      href={imageUrl} 
      download="my_downloaded_image.jpg"
      onClick={handleDownload}
    >
      <motion.button 
        className="relative rounded-full bg-white/10 p-2.5 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-110 active:scale-95 overflow-hidden"
        whileTap={{ scale: 0.85 }}
      >
        {/* Download progress ring effect */}
        {isDownloading && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-400/50"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
        
        {/* Success checkmark animation */}
        {isDownloading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <motion.svg
              className="w-5 h-5 text-green-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.polyline
                points="20 6 9 17 4 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              />
            </motion.svg>
          </motion.div>
        )}

        {/* Download arrow icon */}
        <motion.div
          animate={isDownloading ? {
            y: [0, 4, 0],
            opacity: [1, 0, 0]
          } : {
            y: 0,
            opacity: 1
          }}
          transition={{ duration: 0.4 }}
        >
          <Download 
            className={`w-5 h-5 transition-colors duration-300 ${
              isDownloading 
                ? 'stroke-green-400' 
                : 'stroke-white/70'
            }`}
          />
        </motion.div>

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    </a>
  );
}

export default DownloadButton;