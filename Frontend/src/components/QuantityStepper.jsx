export default function QuantityStepper({
  value,
  setValue,
  min = 1,
  max = 50,
  step = 1,
  allowFloat = false,
}) {
  const clamp = (n) => Math.min(max, Math.max(min, n));
  const dec = () => setValue((prev) => clamp(Number((prev - step).toFixed(2))));
  const inc = () => setValue((prev) => clamp(Number((prev + step).toFixed(2))));

  return (
    <div className="inline-flex items-center rounded border">
      <button type="button" onClick={dec} className="px-3 py-1.5">−</button>
      <input
        className="w-20 border-x px-2 py-1.5 text-center outline-none"
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          const num = allowFloat ? Number(raw) : parseInt(raw || "0", 10);
          if (Number.isNaN(num)) return;
          setValue(clamp(num));
        }}
      />
      <button type="button" onClick={inc} className="px-3 py-1.5">+</button>
    </div>
  );
}
