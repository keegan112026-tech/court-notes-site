import AdminLoginClient from '@/app/admin/login/AdminLoginClient';

export default function AdminLoginPage({
    searchParams,
}: {
    searchParams?: { next?: string };
}) {
    const nextPath = searchParams?.next || '/admin';
    return <AdminLoginClient nextPath={nextPath} />;
}
