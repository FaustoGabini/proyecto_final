'use client';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Nueva función que analiza la descripción con OpenAI
  const analizarDescripcion = async (descripcion) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/openai/analizar`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ descripcion }),
});


      const data = await response.json();

      if (!data.endpoint) {
        throw new Error(data.error || 'No se pudo generar el endpoint');
      }

      console.log('✅ Endpoint generado:', data.endpoint);

      // Redirige a la página de resultados con el endpoint generado
      router.push(`/resultados?endpoint=${encodeURIComponent(data.endpoint)}`);

    } catch (err) {
      console.error('❌ Error al analizar:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejador del formulario principal
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      analizarDescripcion(query.trim());
    }
  };

  // Manejador de las búsquedas rápidas
  const handleQuickSearch = (searchQuery) => {
    setQuery(searchQuery);
    analizarDescripcion(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="bg-background rounded-2xl shadow-xl border-2 border-primary/10 p-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ej: departamentos con vista al río en Rosario"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-14 text-base rounded-xl border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="h-14 px-8 rounded-xl font-semibold bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <span>Analizando...</span>
            ) : (
              <>
                <Search className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Buscar</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-center mt-2">
          holis {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        <button
          type="button"
          onClick={() => handleQuickSearch('PH en Palermo')}
          className="text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          PH en Palermo
        </button>
        <button
          type="button"
          onClick={() =>
            handleQuickSearch('Dpto en Mardel con vista al mar')
          }
          className="text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          Dpto en Mardel con vista al mar
        </button>
        <button
          type="button"
          onClick={() =>
            handleQuickSearch('Casa con jardin y pileta en Santa Fe')
          }
          className="text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          Casa con jardin y pileta en Santa Fe
        </button>
      </div>
    </form>
  );
}
