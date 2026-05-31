import { useRef } from 'react';

export default function UploadButton({ onUpload }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  return (
    <>
      <button
        id="upload-new-btn"
        onClick={handleClick}
        className="flex items-center gap-3 w-full px-6 py-3.5 rounded-2xl
                   bg-white shadow-md hover:shadow-lg border border-drive-border
                   text-drive-text font-medium text-sm
                   transition-all duration-200 cursor-pointer
                   hover:bg-drive-card-hover active:scale-[0.98]"
      >
        {/* Plus icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#1a73e8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span>New</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        className="hidden"
        aria-label="Upload file"
      />
    </>
  );
}
