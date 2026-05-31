import { useState, useRef, useEffect } from 'react';
import { downloadFile, deleteFile } from '../api';

/* ──────────────────────────────────────────────
   File-type icon helper
   ────────────────────────────────────────────── */
function getFileIcon(mimetype, filename) {
  const ext = filename?.split('.').pop()?.toLowerCase();

  // PDF
  if (mimetype === 'application/pdf' || ext === 'pdf') {
    return (
      <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#EA4335">
          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1V8H9v1.5zM14 11h1V8.5h-1V11z" />
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z" />
        </svg>
      </div>
    );
  }

  // Images
  if (mimetype?.startsWith('image/')) {
    return (
      <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#EA4335">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </div>
    );
  }

  // Videos
  if (mimetype?.startsWith('video/')) {
    return (
      <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#EA4335">
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
        </svg>
      </div>
    );
  }

  // Audio
  if (mimetype?.startsWith('audio/')) {
    return (
      <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#F9AB00">
          <path d="M12 3v9.28a4.39 4.39 0 00-1.5-.28C8.01 12 6 13.79 6 16s2.01 4 4.5 4S15 18.21 15 16V6h4V3h-7z" />
        </svg>
      </div>
    );
  }

  // Word documents
  if (
    mimetype?.includes('word') ||
    mimetype?.includes('document') ||
    ext === 'doc' ||
    ext === 'docx'
  ) {
    return (
      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#4285F4">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      </div>
    );
  }

  // Spreadsheets
  if (
    mimetype?.includes('sheet') ||
    mimetype?.includes('excel') ||
    ext === 'xls' ||
    ext === 'xlsx' ||
    ext === 'csv'
  ) {
    return (
      <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#0F9D58">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v3H5V5h14zm-7 14H5v-9h7v9zm2 0v-9h5v9h-5z" />
        </svg>
      </div>
    );
  }

  // Presentations
  if (
    mimetype?.includes('presentation') ||
    mimetype?.includes('powerpoint') ||
    ext === 'ppt' ||
    ext === 'pptx'
  ) {
    return (
      <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#F9AB00">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2V7h-4v2h2z" />
        </svg>
      </div>
    );
  }

  // Archives
  if (
    mimetype?.includes('zip') ||
    mimetype?.includes('rar') ||
    mimetype?.includes('tar') ||
    mimetype?.includes('gzip') ||
    ext === 'zip' ||
    ext === 'rar' ||
    ext === '7z'
  ) {
    return (
      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#5F6368">
          <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 6h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2v-2h-2V8h2v2h2v2z" />
        </svg>
      </div>
    );
  }

  // Code files
  if (
    mimetype?.includes('javascript') ||
    mimetype?.includes('json') ||
    mimetype?.includes('html') ||
    mimetype?.includes('css') ||
    mimetype?.includes('xml') ||
    ext === 'js' ||
    ext === 'jsx' ||
    ext === 'ts' ||
    ext === 'tsx' ||
    ext === 'py' ||
    ext === 'java' ||
    ext === 'cpp' ||
    ext === 'c' ||
    ext === 'go' ||
    ext === 'rs'
  ) {
    return (
      <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#7B1FA2">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
        </svg>
      </div>
    );
  }

  // Text files
  if (mimetype?.includes('text/') || ext === 'txt' || ext === 'md') {
    return (
      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#4285F4">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      </div>
    );
  }

  // Default file icon
  return (
    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#5F6368">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Format file size
   ────────────────────────────────────────────── */
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/* ──────────────────────────────────────────────
   Format date
   ────────────────────────────────────────────── */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/* ──────────────────────────────────────────────
   FileCard Component
   ────────────────────────────────────────────── */
export default function FileCard({ file, onDelete, showToast }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleDownload = () => {
    downloadFile(file.filename);
    setMenuOpen(false);
    showToast(`Downloading "${file.originalname}"`, 'success');
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    setIsDeleting(true);
    try {
      await deleteFile(file.id);
      showToast(`"${file.originalname}" moved to trash`, 'success');
      onDelete(file.id);
    } catch {
      showToast('Failed to delete file', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      id={`file-card-${file.id}`}
      className={`file-card relative bg-white rounded-xl border border-drive-border
                  p-4 cursor-pointer select-none
                  ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Top row: icon + menu */}
      <div className="flex items-start justify-between mb-3">
        {getFileIcon(file.mimetype, file.originalname)}

        {/* Three-dot menu */}
        <div className="relative" ref={menuRef}>
          <button
            id={`menu-btn-${file.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="menu-btn w-8 h-8 rounded-full flex items-center justify-center
                       hover:bg-drive-card-hover transition-colors"
            aria-label="File options"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              className="absolute right-0 top-9 w-48 bg-white rounded-lg shadow-lg
                         border border-drive-border py-1 z-50
                         animate-in fade-in-0 zoom-in-95 duration-150"
            >
              <button
                id={`download-btn-${file.id}`}
                onClick={handleDownload}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-drive-text
                           hover:bg-drive-card-hover transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
                Download
              </button>
              <button
                id={`delete-btn-${file.id}`}
                onClick={handleDelete}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-drive-error
                           hover:bg-red-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#d93025">
                  <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                </svg>
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File name */}
      <h3
        className="text-sm font-medium text-drive-text truncate mb-1"
        title={file.originalname}
      >
        {file.originalname}
      </h3>

      {/* Meta row */}
      <div className="flex items-center gap-2 text-xs text-drive-text-secondary">
        <span>{formatSize(file.size)}</span>
        <span>·</span>
        <span>{formatDate(file.createdAt)}</span>
      </div>
    </div>
  );
}
