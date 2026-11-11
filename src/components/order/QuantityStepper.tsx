export function QuantityStepper({
  value,
  min = 1,
  max,
  label,
  onChange,
}: {
  value: number;
  min?: number;
  max: number;
  label: string;
  onChange: (next: number) => void;
}) {
  const button = "h-[40px] w-[40px] text-[20px] disabled:opacity-40";

  return (
    <div className="flex w-[140px] items-center justify-between rounded-full border border-[#ead9cf]">
      <button
        type="button"
        aria-label={`Kurangi ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={button}
      >
        −
      </button>
      <b aria-live="polite">{value}</b>
      <button
        type="button"
        aria-label={`Tambah ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={button}
      >
        +
      </button>
    </div>
  );
}
