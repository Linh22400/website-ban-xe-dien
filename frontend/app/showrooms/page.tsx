import Link from "next/link";
import { getShowrooms } from "@/lib/order-api";

export const metadata = {
    title: "Hệ Thống Showroom | Xe Điện Đức Duy",
    description: "Danh sách showroom và chi nhánh tại Cà Mau để xem xe, lái thử và tư vấn trực tiếp.",
};

export const revalidate = 300;

export default async function ShowroomsPage() {
    const showrooms = await getShowrooms();

    const mapsHref = (address: string, city: string, lat?: number, lng?: number) => {
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        }
        const q = encodeURIComponent([address, city].filter(Boolean).join(", "));
        return `https://www.google.com/maps/search/?api=1&query=${q}`;
    };

    const byCity = new Map<string, typeof showrooms>();
    for (const s of showrooms) {
        const city = (s.City || "Khác").trim() || "Khác";
        const list = byCity.get(city) || [];
        list.push(s);
        byCity.set(city, list);
    }

    const cities = Array.from(byCity.keys()).sort((a, b) => a.localeCompare(b, "vi"));

    return (
        <main className="min-h-screen pb-12 px-6 bg-background">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-14">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Hệ Thống Showroom
                    </h1>
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                        Tìm showroom gần bạn để xem xe thực tế, lái thử và nhận tư vấn trực tiếp.
                    </p>
                </div>

                {showrooms.length === 0 ? (
                    <div className="bg-card p-10 rounded-2xl border border-border text-center text-muted-foreground">
                        Chưa có dữ liệu showroom.
                    </div>
                ) : (
                    <div className="space-y-12">
                        {cities.map((city) => (
                            <section key={city} className="space-y-6">
                                <div className="flex items-baseline justify-between gap-4">
                                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                        {city}
                                    </h2>
                                    <div className="text-sm text-muted-foreground">
                                        {byCity.get(city)?.length || 0} showroom
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {(byCity.get(city) || []).map((s) => (
                                        <div key={s.id} className="bg-card p-6 rounded-2xl border border-border">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="text-lg font-bold text-foreground">{s.Name}</div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {s.Address}{s.District ? `, ${s.District}` : ""}
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                                                    Showroom
                                                </span>
                                            </div>

                                            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                                {s.WorkingHours?.monday && (
                                                    <div>
                                                        <span className="font-semibold text-foreground">Giờ mở cửa:</span> {s.WorkingHours.monday}
                                                    </div>
                                                )}
                                                {s.Phone && (
                                                    <div>
                                                        <span className="font-semibold text-foreground">Hotline:</span> {s.Phone}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                                {s.Phone && (
                                                    <a
                                                        href={`tel:${s.Phone}`}
                                                        className="px-4 py-2 rounded-full bg-secondary text-foreground font-semibold border border-border hover:border-primary transition-colors"
                                                    >
                                                        Gọi ngay
                                                    </a>
                                                )}
                                                <a
                                                    href={mapsHref(s.Address, s.City, s.Latitude, s.Longitude)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-4 py-2 rounded-full bg-secondary text-foreground font-semibold border border-border hover:border-primary transition-colors"
                                                >
                                                    Chỉ đường
                                                </a>
                                                <Link
                                                    href="/contact"
                                                    className="px-4 py-2 rounded-full bg-card text-foreground font-semibold border border-border hover:border-primary transition-colors"
                                                >
                                                    Liên hệ
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
