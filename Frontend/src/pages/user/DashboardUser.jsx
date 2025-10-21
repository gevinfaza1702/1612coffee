import { useState } from "react";
import QuantityStepper from "../../components/QuantityStepper";
import ProductCard from "../../components/ProductCard";
import UserNavbar from "../../components/UserNavbar";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

// gambar produk
import robustaImg from "../../assets/images/robusta.webp";
import naturalImg from "../../assets/images/arabika-natural.webp";
import fullwashImg from "../../assets/images/arabika-fullwash.webp";
import honeyImg from "../../assets/images/arabika-honey.webp";
import eksperImg from "../../assets/images/arabika-eksperimental.webp";

const PRODUCTS = [
  { slug: "robusta", name: "Robusta", beanType: "robusta", price: 65000, image: robustaImg },
  { slug: "arabika-natural", name: "Arabika Natural", beanType: "arabika", price: 85000, image: naturalImg },
  { slug: "arabika-fullwash", name: "Arabika Fullwash", beanType: "arabika", price: 90000, image: fullwashImg },
  { slug: "arabika-honey", name: "Arabika Honey", beanType: "arabika", price: 95000, image: honeyImg },
  { slug: "arabika-eksperimental", name: "Arabika Eksperimental", beanType: "arabika", price: 120000, image: eksperImg },
];

export default function DashboardUser() {
  const [bean, setBean] = useState("robusta");
  const [weight, setWeight] = useState(1);
  const [profile, setProfile] = useState("Lite");
  const { addItem } = useCart();

  const pricePerKg = 35000;
  const jasaTotal = Math.round(weight * pricePerKg);

  const addRoastery = () => {
    addItem({
      key: `svc:${bean}:${profile}:${weight}`,
      type: "service",
      name: `Jasa Roastery (${bean}, ${profile}, ${weight} kg)`,
      price: jasaTotal,
      qty: 1,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf5] text-[var(--coffee)]">
      <UserNavbar />

      <main className="flex-1 mx-auto max-w-6xl px-6 py-10 space-y-8">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          {/* === Jasa Roastery === */}
          <section className="rounded-lg border bg-white p-5">
            <h2 className="mb-4 text-xl font-semibold">Jasa Roastery</h2>

            <div className="mb-4 flex gap-3">
              {["robusta", "arabika"].map((b) => (
                <button
                  key={b}
                  onClick={() => setBean(b)}
                  className={`rounded-full px-5 py-2 border ${
                    bean === b
                      ? "bg-[var(--coffee)] text-white border-[var(--coffee)]"
                      : "bg-white"
                  }`}
                >
                  {b[0].toUpperCase() + b.slice(1)}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <div className="mb-1 text-sm text-slate-600">Berat (kg)</div>
              <QuantityStepper value={weight} setValue={setWeight} min={1} max={50} step={0.5} allowFloat />
              <div className="mt-1 text-xs text-slate-500">
                Minimal 1 kg, maksimal 50 kg.
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-1 text-sm text-slate-600">Profil Sangrai</div>
              <select
                className="rounded border p-2"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
              >
                {["Lite", "Medium", "Dark"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="mb-4 font-semibold">
              Total: Rp {jasaTotal.toLocaleString("id-ID")} (Rp 35.000/kg)
            </div>

            <button
              onClick={addRoastery}
              className="rounded bg-[var(--coffee)] px-4 py-2 text-white hover:bg-[#5c3217] transition"
            >
              Simpan ke Keranjang
            </button>
          </section>

          {/* === Produk Kopi === */}
          <section className="rounded-lg border bg-white p-5">
            <h2 className="mb-4 text-xl font-semibold">Produk 1612</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
