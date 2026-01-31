// components/Layout.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { href: '/', label: 'Personas' },
    { href: '/journey-maps', label: 'Journey Maps' },
    { href: '/impact-maps', label: 'Impact Maps' },
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
              Persona Lab
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
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
            </nav>
          </div>
        </div>
      </header>

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
