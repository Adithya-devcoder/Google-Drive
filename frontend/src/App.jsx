import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import FileGrid from './components/FileGrid';
import { getFiles, uploadFile } from './api';

export default function App() {
  /* ── State ── */
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null); // 0-100 or null
  const [toasts, setToasts] = useState([]);

  /* ── Toast system ── */
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3500);
  }, []);

  /* ── Fetch files ── */
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFiles();
      setFiles(res.data);
    } catch {
      showToast('Failed to load files', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  /* ── Search filter ── */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFiles(files);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredFiles(files.filter((f) => f.originalname.toLowerCase().includes(q)));
    }
  }, [searchQuery, files]);

  /* ── Upload handler ── */
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadProgress(0);

    try {
      await uploadFile(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });
      showToast(`"${file.name}" uploaded successfully`, 'success');
      await fetchFiles();
    } catch {
      showToast('Upload failed. Please try again.', 'error');
    } finally {
      setUploadProgress(null);
    }
  };

  /* ── Delete handler ── */
  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  /* ── Render ── */
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar onUpload={handleUpload} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          id="top-bar"
          className="flex items-center gap-4 px-4 py-2 border-b border-drive-border bg-white shrink-0"
        >
          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              {/* Search icon */}
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-drive-text-secondary"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>

              <input
                id="search-input"
                type="text"
                placeholder="Search in Drive"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-[#f1f3f4]
                           text-sm text-drive-text placeholder-drive-text-secondary
                           border-none outline-none
                           focus:bg-white focus:shadow-md focus:ring-1 focus:ring-drive-border
                           transition-all duration-200"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             w-6 h-6 rounded-full flex items-center justify-center
                             hover:bg-[#e0e0e0] transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#5f6368">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Account avatar placeholder */}
          <div
            className="w-9 h-9 rounded-full bg-drive-blue flex items-center justify-center
                       text-white text-sm font-medium shrink-0 cursor-pointer"
          >
            U
          </div>
        </header>

        {/* Upload progress bar */}
        {uploadProgress !== null && (
          <div className="px-6 pt-3 shrink-0">
            <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-drive-blue border-t-transparent rounded-full spinner" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-drive-text">Uploading…</span>
                  <span className="text-xs text-drive-text-secondary">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#c8deff] rounded-full h-1.5">
                  <div
                    className="bg-drive-blue h-1.5 rounded-full transition-all duration-300 progress-bar-animated"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content area */}
        <main className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <h1 id="page-heading" className="text-lg font-medium text-drive-text">
              {searchQuery ? `Search results for "${searchQuery}"` : 'My Drive'}
            </h1>
            {!loading && files.length > 0 && (
              <span className="text-xs text-drive-text-secondary">
                {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
              </span>
            )}
          </div>

          <FileGrid
            files={filteredFiles}
            loading={loading}
            onDelete={handleDelete}
            showToast={showToast}
          />
        </main>
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg text-sm font-medium
                        ${toast.exiting ? 'toast-exit' : 'toast-enter'}
                        ${toast.type === 'error'
                          ? 'bg-drive-error text-white'
                          : 'bg-[#323232] text-white'
                        }`}
          >
            {toast.type === 'success' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
