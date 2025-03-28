import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // usa `lucide-react` (viene con el starter kit)

interface Role {
    id: number;
    name: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: Role;
}

interface PageProps extends InertiaPageProps {
    roles: Role[];
    errors: Record<string, string>;
    auth: {
        user: AuthUser;
    };
}

export default function CreateUser() {
    const { roles, errors, auth } = usePage<PageProps>().props;

    const [showPassword, setShowPassword] = useState(false);

    // Filtrar roles si el usuario autenticado no es admin
    const filteredRoles = auth.user.role.name === 'admin'
        ? roles
        : roles.filter((role) => role.name !== 'admin' && role.name !== 'cliente');

    const clienteRoleId = roles.find((r) => r.name === 'cliente')?.id ?? '';

    const { data, setData, post, processing } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: clienteRoleId, // cliente por defecto
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Usuarios', href: '/users' }, { title: 'Crear', href: '#' }]}>
            <Head title="Crear Usuario" />

            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold">Crear nuevo usuario</h1>

                <form onSubmit={handleSubmit} className="max-w-lg space-y-6 bg-white p-6 rounded-xl border shadow">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="name" className="block font-medium text-sm text-gray-700">Nombre</label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                        />
                        {errors.name && <div className="text-sm text-red-600 mt-1">{errors.name}</div>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block font-medium text-sm text-gray-700">Correo</label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                        />
                        {errors.email && <div className="text-sm text-red-600 mt-1">{errors.email}</div>}
                    </div>

                    {/* Password con ícono */}
                    <div>
                        <label htmlFor="password" className="block font-medium text-sm text-gray-700">Contraseña</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full rounded border border-gray-300 shadow-sm pr-10 focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <div className="text-sm text-red-600 mt-1">{errors.password}</div>}
                    </div>


                    {/* Rol */}
                    <div>
                        <label htmlFor="role_id" className="block font-medium text-sm text-gray-700">Rol</label>
                        <select
                            id="role_id"
                            value={data.role_id}
                            onChange={(e) => setData('role_id', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                        >
                            {filteredRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && <div className="text-sm text-red-600 mt-1">{errors.role_id}</div>}
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => router.get('/users')}
                            className="text-sm text-gray-500 hover:underline"
                        >
                            ← Volver
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                        >
                            Crear Usuario
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
