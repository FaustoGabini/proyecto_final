'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/resultados?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleQuickSearch = (searchQuery) => {
        setQuery(searchQuery);
        router.push(`/resultados?q=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <form onSubmit={handleSubmit} className='w-full max-w-4xl mx-auto'>
            <div className='bg-background rounded-2xl shadow-xl border-2 border-primary/10 p-2'>
                <div className='flex gap-2'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                        <Input
                            type='text'
                            placeholder='Ej: departamentos con vista al río en Rosario'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className='pl-12 h-14 text-base rounded-xl border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary'
                        />
                    </div>

                    <Button
                        type='submit'
                        size='lg'
                        className='h-14 px-8 rounded-xl font-semibold bg-primary hover:bg-primary/90'
                    >
                        <Search className='h-5 w-5 md:mr-2' />
                        <span className='hidden md:inline'>Buscar</span>
                    </Button>
                </div>
            </div>

            <div className='mt-6 flex flex-wrap gap-2 justify-center'>
                <button
                    type='button'
                    onClick={() => handleQuickSearch('PH en Palermo')}
                    className='text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors'
                >
                    PH en Palermo
                </button>
                <button
                    type='button'
                    onClick={() =>
                        handleQuickSearch('Dpto en Mardel con vista al mar')
                    }
                    className='text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors'
                >
                    Dpto en Mardel con vista al mar
                </button>
                <button
                    type='button'
                    onClick={() =>
                        handleQuickSearch(
                            'Casa con jardin y pileta en Santa Fe'
                        )
                    }
                    className='text-sm px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors'
                >
                    Casa con jardin y pileta en Santa Fe
                </button>
            </div>
        </form>
    );
}
