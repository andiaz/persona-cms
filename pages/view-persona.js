import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import { getPersonaById } from '../lib/storage';
import {
  CardLayout,
  MinimalLayout,
  FullProfileLayout,
  PrintLayout,
  LAYOUT_OPTIONS,
} from '../components/layouts';

const LayoutComponents = {
  card: CardLayout,
  full: FullProfileLayout,
  minimal: MinimalLayout,
  print: PrintLayout,
};

export default function ViewPersona() {
  const [persona, setPersona] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState('card');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const foundPersona = getPersonaById(parseInt(id));
      if (foundPersona) {
        setPersona(foundPersona);
      }
    }
  }, [id]);

  const exportAsPNG = async () => {
    const element = document.getElementById('persona-layout');
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality export
    });
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = `persona-${persona?.name || 'export'}-${selectedLayout}.png`;
    link.click();
  };

  const exportAsPDF = () => {
    // Switch to print layout for best results
    const previousLayout = selectedLayout;
    setSelectedLayout('print');

    // Small delay to let the layout render, then print
    setTimeout(() => {
      window.print();
      // Restore previous layout after print dialog
      setTimeout(() => setSelectedLayout(previousLayout), 100);
    }, 100);
  };

  const SelectedLayoutComponent = LayoutComponents[selectedLayout];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header - hidden when printing */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 no-print">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Personas
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={exportAsPNG}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Export PNG
            </button>
            <button
              onClick={exportAsPDF}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              title="Opens print dialog - select 'Save as PDF' as destination"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Layout Selector - hidden when printing */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 no-print">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Layout:</span>
            {LAYOUT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedLayout(option.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedLayout === option.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={option.description}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {/* Persona Layout */}
        <div id="persona-layout" className="bg-white rounded-lg shadow-sm">
          {persona ? (
            <SelectedLayoutComponent persona={persona} />
          ) : (
            <div className="p-8 text-center text-gray-500">Loading persona...</div>
          )}
        </div>
      </div>
    </div>
  );
}
