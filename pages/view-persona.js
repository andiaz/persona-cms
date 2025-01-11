import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PersonaLayout from '../components/PersonaLayout';
import Link from 'next/link';
import html2canvas from 'html2canvas';

export default function ViewPersona() {
  const [persona, setPersona] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const personas = JSON.parse(sessionStorage.getItem('personas') || '[]');
      const foundPersona = personas.find((p) => p.id === parseInt(id));
      if (foundPersona) {
        setPersona(foundPersona);
      }
    }
  }, [id]);

  const exportAsPNG = async () => {
    const element = document.getElementById('persona-layout');
    const canvas = await html2canvas(element);
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = `persona-${persona?.name || 'export'}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Personas
          </Link>
          <button
            onClick={exportAsPNG}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export as PNG
          </button>
        </div>

        <div id="persona-layout">
          <PersonaLayout persona={persona} />
        </div>
      </div>
    </div>
  );
}
