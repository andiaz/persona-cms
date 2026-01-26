// components/Layout.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { href: '/', label: 'Personas' },
    { href: '/journey-maps', label: 'Journey Maps' },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return currentPath === '/' || currentPath === '/add-persona' || currentPath === '/view-persona';
    }
    if (href === '/journey-maps') {
      return currentPath === '/journey-maps' || currentPath === '/journey-map';
    }
    return currentPath.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo / App Name */}
            <Link href="/" className="text-lg font-semibold text-slate-900">
              Persona CMS
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
      <main>{children}</main>
    </div>
  );
}
