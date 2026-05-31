import UploadButton from './UploadButton';

const navItems = [
  {
    label: 'My Drive',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 2H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2zm0 18H5V4h14v16z" />
        <path d="M12 6l-4 7h8z" opacity="0.5" />
      </svg>
    ),
    active: true,
  },
  {
    label: 'Recent',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    ),
  },
  {
    label: 'Starred',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
  },
  {
    label: 'Trash',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
      </svg>
    ),
  },
];

export default function Sidebar({ onUpload }) {
  return (
    <aside
      id="sidebar"
      className="w-64 min-h-screen bg-drive-sidebar border-r border-drive-border
                 flex flex-col py-4 px-3 select-none shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-5">
        <svg width="40" height="40" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.6 66.85L3.3 72.1a5.47 5.47 0 004.7 8.2h74.3a5.47 5.47 0 004.7-8.2l-3.3-5.25z" fill="#0066DA" />
          <path d="M43.65 0L17.1 46.4l-10.5 18.2 26.55.25L59.7 18.45z" fill="#00AC47" />
          <path d="M43.65 0L70.2 46.4l10.5 18.2-26.55.25L27.6 18.45z" fill="#EA4335" />
          <path d="M33.15 64.85L43.65 46.4 27.6 18.45l-10.5 28.2z" fill="#00832D" />
          <path d="M54.15 64.85L43.65 46.4l16.05-27.95 10.5 28.2z" fill="#2684FC" />
          <path d="M43.65 46.4l-10.5 18.45h21z" fill="#FFBA00" />
        </svg>
        <span className="text-[22px] font-normal text-drive-text-secondary tracking-tight">
          Drive
        </span>
      </div>

      {/* Upload button */}
      <div className="px-1 mb-4">
        <UploadButton onUpload={onUpload} />
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            className={`nav-item flex items-center gap-4 w-full px-5 py-2 rounded-full
                        text-sm font-medium cursor-pointer mb-0.5
                        ${item.active
                          ? 'active bg-[#e8f0fe] text-drive-blue'
                          : 'text-drive-text-secondary hover:bg-[#e8eaed]'
                        }`}
          >
            <span className={item.active ? 'text-drive-blue' : 'text-drive-text-secondary'}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Storage indicator */}
      <div className="px-4 pt-4 border-t border-drive-border">
        <div className="flex items-center gap-2 mb-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
            <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" />
          </svg>
          <span className="text-xs text-drive-text-secondary font-medium">Storage</span>
        </div>
        <div className="w-full bg-[#e0e0e0] rounded-full h-1.5 mb-1.5">
          <div className="bg-drive-blue h-1.5 rounded-full" style={{ width: '12%' }} />
        </div>
        <p className="text-xs text-drive-text-secondary">1.8 GB of 15 GB used</p>
      </div>
    </aside>
  );
}
