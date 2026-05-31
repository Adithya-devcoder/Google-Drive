import FileCard from './FileCard';

export default function FileGrid({ files, loading, onDelete, showToast }) {
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
    return (
      <div className="flex flex-col items-center justify-center py-32">
        {/* Empty folder illustration */}
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
          <path d="M93 95l4 4 10-10" stroke="#9AA0A6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="text-lg font-medium text-drive-text mb-2">My Drive is empty</h3>
        <p className="text-sm text-drive-text-secondary">
          Upload your first file!
        </p>
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
          onDelete={onDelete}
          showToast={showToast}
        />
      ))}
    </div>
  );
}
