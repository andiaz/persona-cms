// components/Layout.js
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { exportAllData, importData, getStorageInfo } from '../lib/storage';

export default function Layout({ children }) {
  const router = useRouter();
  const currentPath = router.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataMenuOpen, setDataMenuOpen] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const dataMenuRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close data menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dataMenuRef.current && !dataMenuRef.current.contains(event.target)) {
        setDataMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load storage info when data menu opens
  useEffect(() => {
    if (dataMenuOpen) {
      setStorageInfo(getStorageInfo());
    }
  }, [dataMenuOpen]);

  const handleExport = () => {
    const blob = exportAllData();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `persona-lab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDataMenuOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setShowImportConfirm(true);
      setDataMenuOpen(false);
    }
    event.target.value = '';
  };

  const handleImportConfirm = (merge) => {
    if (!importFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const result = importData(data, { merge });
        const total = result.personas + result.journeyMaps + result.impactMaps + result.boards + result.sitemaps;
        alert(`Successfully imported ${total} items:\n- ${result.personas} personas\n- ${result.journeyMaps} journey maps\n- ${result.impactMaps} impact maps\n- ${result.boards} boards\n- ${result.sitemaps} site maps`);
        window.location.reload();
      } catch (error) {
        alert('Failed to import: ' + error.message);
      }
    };
    reader.readAsText(importFile);
    setShowImportConfirm(false);
    setImportFile(null);
  };

  const navItems = [
    { href: '/', label: 'Personas' },
    { href: '/journey-maps', label: 'Journey Maps' },
    { href: '/impact-maps', label: 'Impact Maps' },
    { href: '/boards', label: 'Sprint Board' },
    { href: '/sitemaps', label: 'Site Maps' },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return currentPath === '/' || currentPath === '/add-persona' || currentPath === '/view-persona';
    }
    if (href === '/journey-maps') {
      return currentPath === '/journey-maps' || currentPath === '/journey-map';
    }
    if (href === '/impact-maps') {
      return currentPath === '/impact-maps' || currentPath === '/impact-map';
    }
    if (href === '/boards') {
      return currentPath === '/boards' || currentPath === '/board';
    }
    if (href === '/sitemaps') {
      return currentPath === '/sitemaps' || currentPath === '/sitemap';
    }
    return currentPath.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo / App Name */}
            <Link href="/" className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">P</span>
              <span>Persona Lab</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="w-px h-6 bg-white/20 mx-2" />

              {/* Help Link */}
              <Link
                href="/help"
                className={`p-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPath === '/help'
                    ? 'bg-white/20 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Help & Documentation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>

              {/* Data Dropdown */}
              <div className="relative" ref={dataMenuRef}>
                <button
                  onClick={() => setDataMenuOpen(!dataMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    dataMenuOpen
                      ? 'bg-white/20 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  Data
                  <svg className={`w-4 h-4 transition-transform ${dataMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dataMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                    {/* Storage Info */}
                    {storageInfo && (
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="text-xs font-medium text-slate-500 mb-1">Storage</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
                          <span>{storageInfo.personas} personas</span>
                          <span>{storageInfo.journeyMaps} journey maps</span>
                          <span>{storageInfo.impactMaps} impact maps</span>
                          <span>{storageInfo.boards} boards</span>
                          <span>{storageInfo.sitemaps} site maps</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleExport}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Export All Data
                    </button>

                    <button
                      onClick={handleImportClick}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Import Data
                    </button>
                  </div>
                )}
              </div>

              {/* Hidden file input for import */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json"
                className="hidden"
              />
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-white/10 px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-white/20 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="border-t border-white/10 my-2" />

            {/* Help Link */}
            <Link
              href="/help"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                currentPath === '/help'
                  ? 'bg-white/20 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Help & Documentation
            </Link>

            {/* Data Options */}
            <button
              onClick={() => {
                handleExport();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Export All Data
            </button>
            <button
              onClick={() => {
                handleImportClick();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Import Data
            </button>
          </nav>
        )}
      </header>

      {/* Import Confirmation Modal */}
      {showImportConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Import Data</h2>
            <p className="text-sm text-slate-600 mb-4">
              How would you like to import the data?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleImportConfirm(true)}
                className="w-full px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="font-medium text-slate-900">Merge with existing</div>
                <div className="text-sm text-slate-500">Add new items, keep existing data</div>
              </button>
              <button
                onClick={() => handleImportConfirm(false)}
                className="w-full px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="font-medium text-slate-900">Replace all</div>
                <div className="text-sm text-slate-500">Delete existing data, import only from file</div>
              </button>
            </div>
            <button
              onClick={() => {
                setShowImportConfirm(false);
                setImportFile(null);
              }}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <p className="text-xs text-slate-400">
              Made by{' '}
              <a
                href="https://andreasjohanssonux.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-700 underline"
              >
                Andreas Johansson
              </a>
            </p>
            <span className="hidden sm:inline text-slate-300">|</span>
            <p className="text-xs text-slate-400">
              Avatars by{' '}
              <a
                href="https://dicebear.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-700 underline"
              >
                DiceBear
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
