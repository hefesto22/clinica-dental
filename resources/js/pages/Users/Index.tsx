import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useEffect, useState } from 'react';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role?: Role;
}

interface PageProps extends InertiaPageProps {
  users: {
    data: User[];
  };
  roles: Role[];
  flash?: {
    success?: string;
  };
  filters?: {
    search?: string;
  };
}

export default function Index() {
  const { users, roles, flash, filters } = usePage<PageProps>().props;
  const [search, setSearch] = useState(filters?.search || '');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(route('users.index'), { search }, { preserveState: true, replace: true });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Usuarios', href: '/users' }]}>
      <Head title="Usuarios" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {flash?.success && (
          <div className="bg-green-100 border border-green-300 text-green-800 rounded p-4">
            {flash.success}
          </div>
        )}

        {/* Filtro y botón */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o rol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          />

          <button
            onClick={() => router.get('/users/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all"
          >
            ➕ Agregar Usuario
          </button>
        </div>

        {/* Tabla */}
        <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Rol</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.data.length > 0 ? (
                users.data.map((user, index) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role?.name}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="text-blue-600 hover:underline">Editar</button>
                      <button className="text-red-600 hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
