import UserLayout from "../../layouts/UserLayout";

export default function History() {
  return (
    <UserLayout>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-4 text-3xl font-extrabold">History Checkout</h1>
        <div className="rounded border bg-white p-4 text-slate-600">
          Belum ada riwayat transaksi.
        </div>
      </div>
    </UserLayout>
  );
}
