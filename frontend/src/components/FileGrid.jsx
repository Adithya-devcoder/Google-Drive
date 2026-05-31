import FileCard from './FileCard';

const emptyMessages = {
  'my-drive': { title: 'My Drive is empty', sub: 'Upload your first file!' },
  recent: { title: 'No recent files', sub: 'Files you open will show up here.' },
  starred: { title: 'No starred files', sub: 'Add stars to things you want to easily find later.' },
  trash: { title: 'Trash is empty', sub: 'Items in trash will be automatically deleted after 30 days.' },
};

export default function FileGrid({ files, loading, onFileChanged, showToast, currentView, onPreview }) {
  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-10 h-10 border-3 border-drive-blue border-t-transparent rounded-full spinner mb-4" />
        <p className="text-sm text-drive-text-secondary">Loading your files…</p>
      </div>
    );
  }

  /* ── Empty state ── */
  if (files.length === 0) {
    const msg = emptyMessages[currentView] || emptyMessages['my-drive'];
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <svg
          width="200"
          height="160"
          viewBox="0 0 200 160"
          fill="none"
          className="mb-6 opacity-60"
        >
          <rect x="30" y="40" width="140" height="100" rx="8" fill="#F1F3F4" stroke="#DADCE0" strokeWidth="2" />
          <path d="M30 48c0-4.4 3.6-8 8-8h40l10 16h74c4.4 0 8 3.6 8 8" stroke="#DADCE0" strokeWidth="2" fill="#F8F9FA" />
          <circle cx="100" cy="95" r="20" fill="#E8EAED" />
          {currentView === 'trash' ? (
            <path d="M107 88v10h-14V88h14m-2-4H95l-1 1h-4v2h20v-2h-4l-1-1zm4 2H91v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V86z" fill="#9AA0A6" />
          ) : currentView === 'starred' ? (
            <path d="M100 102.27l6.18 3.73-1.64-7.03L110 94.24l-7.19-.61L100 87l-2.81 6.63L90 94.24l5.46 4.73L93.82 106z" fill="#9AA0A6" />
          ) : (
            <path d="M93 95l4 4 10-10" stroke="#9AA0A6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
        <h3 className="text-lg font-medium text-drive-text mb-2">{msg.title}</h3>
        <p className="text-sm text-drive-text-secondary">{msg.sub}</p>
      </div>
    );
  }

  /* ── File grid ── */
  return (
    <div
      id="file-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onFileChanged={onFileChanged}
          showToast={showToast}
          currentView={currentView}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
