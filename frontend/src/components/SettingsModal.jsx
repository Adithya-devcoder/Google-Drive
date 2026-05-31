import { useState } from 'react';

const settingsSections = [
  {
    title: 'General',
    items: [
      { key: 'notifications', label: 'Enable notifications', description: 'Get notified when files are shared with you', default: true },
      { key: 'autoSync', label: 'Auto sync files', description: 'Automatically sync files when connected to the internet', default: true },
      { key: 'offlineAccess', label: 'Offline access', description: 'Make recent files available offline', default: false },
    ],
  },
  {
    title: 'Display',
    items: [
      { key: 'showFileExt', label: 'Show file extensions', description: 'Display file extensions in file names', default: true },
      { key: 'compactView', label: 'Compact view', description: 'Show more files with smaller cards', default: false },
      { key: 'showHidden', label: 'Show hidden files', description: 'Display hidden and system files', default: false },
    ],
  },
  {
    title: 'Upload',
    items: [
      { key: 'convertUploads', label: 'Convert uploads', description: 'Convert uploaded files to Google Docs format', default: false },
      { key: 'confirmDelete', label: 'Confirm before delete', description: 'Show confirmation dialog before deleting files', default: true },
    ],
  },
];

export default function SettingsModal({ onClose, onSave }) {
  const [settings, setSettings] = useState(() => {
    const savedData = localStorage.getItem('drive_settings');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        // Fall back to default
      }
    }
    const initial = {};
    settingsSections.forEach((section) => {
      section.items.forEach((item) => {
        initial[item.key] = item.default;
      });
    });
    return initial;
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('drive_settings', JSON.stringify(settings));
    if (onSave) onSave(settings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-drive-border shrink-0">
          <h2 className="text-lg font-medium text-drive-text">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center
                       hover:bg-drive-card-hover transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {settingsSections.map((section, i) => (
            <div key={section.title} className={i > 0 ? 'mt-6' : ''}>
              <h3 className="text-xs font-semibold text-drive-text-secondary uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-3 px-3 rounded-xl
                               hover:bg-drive-card-hover transition-colors cursor-pointer"
                    onClick={() => toggle(item.key)}
                  >
                    <div className="pr-4">
                      <p className="text-sm font-medium text-drive-text">{item.label}</p>
                      <p className="text-xs text-drive-text-secondary mt-0.5">{item.description}</p>
                    </div>
                    {/* Toggle switch */}
                    <div
                      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200
                                  ${settings[item.key] ? 'bg-drive-blue' : 'bg-[#dadce0]'}`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md
                                    transition-transform duration-200
                                    ${settings[item.key] ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-drive-border bg-[#f8f9fa] shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-medium text-drive-text
                       hover:bg-[#e8eaed] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-full text-sm font-medium text-white
                       bg-drive-blue hover:bg-drive-blue-hover transition-colors cursor-pointer"
          >
            {saved ? '✓ Saved' : 'Save settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
