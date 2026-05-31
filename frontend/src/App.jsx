import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import FileGrid from './components/FileGrid';
import FilePreview from './components/FilePreview';
import { getFiles, uploadFile } from './api';

const viewTitles = {
  'my-drive': 'My Drive',
  recent: 'Recent',
  starred: 'Starred',
  trash: 'Trash',
};

export default function App() {
  /* ── State ── */
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [currentView, setCurrentView] = useState('my-drive');
  const [previewFile, setPreviewFile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

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
      const viewParam = currentView === 'my-drive' ? 'all' : currentView;
      const res = await getFiles(viewParam);
      setFiles(res.data);
    } catch {
      showToast('Failed to load files', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, currentView]);

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

  /* ── Close profile dropdown on outside click ── */
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileOpen]);

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

  /* ── View change handler ── */
  const handleViewChange = (view) => {
    setCurrentView(view);
    setSearchQuery('');
  };

  /* ── Render ── */
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onUpload={handleUpload}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

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

          {/* Profile avatar with dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              id="profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 rounded-full bg-drive-blue flex items-center justify-center
                         text-white text-sm font-medium shrink-0 cursor-pointer
                         hover:shadow-md transition-shadow ring-2 ring-transparent
                         hover:ring-drive-blue/30"
            >
              U
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-2xl
                              border border-drive-border z-50 overflow-hidden">
                {/* Profile header */}
                <div className="px-5 pt-5 pb-4 text-center border-b border-drive-border">
                  <div className="w-16 h-16 rounded-full bg-drive-blue flex items-center justify-center
                                  text-white text-2xl font-medium mx-auto mb-3">
                    U
                  </div>
                  <p className="text-sm font-medium text-drive-text">User</p>
                  <p className="text-xs text-drive-text-secondary mt-0.5">user@example.com</p>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <button className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-drive-text
                                     hover:bg-drive-card-hover transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                    Manage your Account
                  </button>
                  <button className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-drive-text
                                     hover:bg-drive-card-hover transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
                      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0014 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                    </svg>
                    Settings
                  </button>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-drive-border">
                  <p className="text-[11px] text-drive-text-secondary text-center">
                    Privacy Policy · Terms of Service
                  </p>
                </div>
              </div>
            )}
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
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : viewTitles[currentView]}
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
            onFileChanged={fetchFiles}
            showToast={showToast}
            currentView={currentView}
            onPreview={(file) => setPreviewFile(file)}
          />
        </main>
      </div>

      {/* File preview modal */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

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
