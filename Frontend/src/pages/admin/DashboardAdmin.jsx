import UserLayout from "../../layouts/UserLayout";

export default function DashboardAdmin() {
  return (
    <UserLayout>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-4 text-3xl font-extrabold">Admin Dashboard</h1>
        <div className="rounded border bg-white p-4">
          Area admin — kelola produk & jasa (buat halaman CRUD terpisah nanti).
        </div>
      </div>
    </UserLayout>
  );
}
