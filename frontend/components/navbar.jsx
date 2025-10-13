import {
    Brain,
    Home,
    Compass,
    Menu,
    Waves,
    Building2,
    MapPin,
    Mouse as House,
    ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container mx-auto px-4'>
                <div className='flex h-16 items-center justify-between'>
                    <Link href='/' className='flex items-center gap-2'>
                        <div className='flex items-center justify-center h-10 w-10 rounded-lg bg-primary'>
                            <Brain className='h-6 w-6 text-primary-foreground' />
                        </div>
                        <h1 className='text-xl font-bold text-foreground'>
                            InmoIA
                        </h1>
                    </Link>

                    <div className='hidden md:flex items-center gap-6'>
                        <Link
                            href='/'
                            className='flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                        >
                            <Home className='h-4 w-4' />
                            Inicio
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none'>
                                <Compass className='h-4 w-4' />
                                Explorar
                                <ChevronDown className='h-3 w-3' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align='center'
                                className='w-56'
                            >
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={{
                                            pathname: '/resultados',
                                            query: {
                                                q: 'frente al mar',
                                            },
                                        }}
                                        className='group'
                                    >
                                        <Waves className='h-5 w-5 text-primary' />
                                        <span>Frente al mar</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={{
                                            pathname: '/resultados',
                                            query: {
                                                q: 'modernos',
                                            },
                                        }}
                                        className='flex items-center gap-3 cursor-pointer'
                                    >
                                        <Building2 className='h-5 w-5 text-primary' />
                                        <span>Modernos</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={{
                                            pathname: '/resultados',
                                            query: { q: 'cerca de retiro' },
                                        }}
                                        className='flex items-center gap-3 cursor-pointer'
                                    >
                                        <MapPin className='h-5 w-5 text-primary' />
                                        <span>Cerca de Retiro</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={{
                                            pathname: '/resultados',
                                            query: { q: 'barrio privado' },
                                        }}
                                        className='flex items-center gap-3 cursor-pointer'
                                    >
                                        <House className='h-5 w-5 text-primary' />
                                        <span>Casa en Barrio Privado</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className='flex items-center gap-4'>
                        <Link href='/iniciar-sesion'>
                            <Button className='hidden sm:flex'>
                                Iniciar sesión
                            </Button>
                        </Link>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='md:hidden'
                        >
                            <Menu className='h-5 w-5' />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
