import { useState } from 'react';

export default function AccountModal({ user, onSave, onClose }) {
  const [name, setName] = useState(user.name || 'User');
  const [email, setEmail] = useState(user.email || 'user@example.com');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ name, email });
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
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-drive-border">
          <h2 className="text-lg font-medium text-drive-text">Manage your Account</h2>
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
        <div className="px-6 py-5">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-drive-blue flex items-center justify-center
                            text-white text-3xl font-medium mb-3">
              {name.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs text-drive-text-secondary">Click to change photo</p>
          </div>

          {/* Name field */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-drive-text-secondary mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-drive-border text-sm text-drive-text
                         outline-none focus:border-drive-blue focus:ring-1 focus:ring-drive-blue
                         transition-all"
            />
          </div>

          {/* Email field */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-drive-text-secondary mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-drive-border text-sm text-drive-text
                         outline-none focus:border-drive-blue focus:ring-1 focus:ring-drive-blue
                         transition-all"
            />
          </div>

          {/* Storage section */}
          <div className="bg-[#f8f9fa] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-drive-text">Storage</span>
              <span className="text-xs text-drive-text-secondary">1.8 GB of 15 GB</span>
            </div>
            <div className="w-full bg-[#e0e0e0] rounded-full h-2 mb-2">
              <div className="bg-drive-blue h-2 rounded-full" style={{ width: '12%' }} />
            </div>
            <div className="flex gap-4 text-xs text-drive-text-secondary">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-drive-blue" /> Drive
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-drive-success" /> Gmail
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-drive-warning" /> Photos
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-drive-border bg-[#f8f9fa]">
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
            {saved ? '✓ Saved' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
