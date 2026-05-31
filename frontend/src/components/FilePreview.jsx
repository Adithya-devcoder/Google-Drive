import { useEffect } from 'react';
import { getPreviewUrl, downloadFile } from '../api';

export default function FilePreview({ file, onClose }) {
  const previewUrl = getPreviewUrl(file.filename);
  const isImage = file.mimetype?.startsWith('image/');
  const isVideo = file.mimetype?.startsWith('video/');
  const isAudio = file.mimetype?.startsWith('audio/');
  const isPdf = file.mimetype === 'application/pdf';

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleDownload = () => {
    downloadFile(file.filename);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className="relative z-10 flex flex-col max-w-5xl w-full max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between bg-[#202124] rounded-t-xl px-5 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-white text-sm font-medium truncate">
              {file.originalname}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Download button */}
            <button
              onClick={handleDownload}
              className="w-9 h-9 rounded-full flex items-center justify-center
                         hover:bg-white/10 transition-colors cursor-pointer"
              title="Download"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
            </button>
            {/* Close button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center
                         hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="bg-[#303134] rounded-b-xl flex items-center justify-center overflow-auto min-h-[300px] max-h-[75vh]">
          {isImage && (
            <img
              src={previewUrl}
              alt={file.originalname}
              className="max-w-full max-h-[75vh] object-contain p-4"
            />
          )}

          {isVideo && (
            <video
              src={previewUrl}
              controls
              autoPlay
              className="max-w-full max-h-[75vh] p-4"
            >
              Your browser does not support the video tag.
            </video>
          )}

          {isAudio && (
            <div className="flex flex-col items-center gap-6 py-16 px-8">
              <div className="w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#F9AB00">
                  <path d="M12 3v9.28a4.39 4.39 0 00-1.5-.28C8.01 12 6 13.79 6 16s2.01 4 4.5 4S15 18.21 15 16V6h4V3h-7z" />
                </svg>
              </div>
              <p className="text-white/80 text-sm">{file.originalname}</p>
              <audio src={previewUrl} controls autoPlay className="w-full max-w-md" />
            </div>
          )}

          {isPdf && (
            <iframe
              src={previewUrl}
              title={file.originalname}
              className="w-full h-[75vh] border-none"
            />
          )}

          {!isImage && !isVideo && !isAudio && !isPdf && (
            <div className="flex flex-col items-center gap-5 py-16 px-8">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#9AA0A6">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
              </div>
              <p className="text-white text-sm font-medium">{file.originalname}</p>
              <p className="text-white/50 text-xs">
                No preview available for this file type
              </p>
              <button
                onClick={handleDownload}
                className="mt-2 px-6 py-2.5 bg-drive-blue text-white text-sm font-medium
                           rounded-full hover:bg-drive-blue-hover transition-colors cursor-pointer"
              >
                Download file
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
