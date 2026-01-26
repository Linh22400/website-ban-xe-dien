"use client";

import { usePathname } from "next/navigation";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <main className={`${isAdmin ? '' : 'pt-[130px] lg:pt-[170px]'} min-h-screen`}>
            {children}
        </main>
    );
}
