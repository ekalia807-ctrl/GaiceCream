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
  const button = "h-[44px] w-[44px] text-[20px] disabled:opacity-40";

  return (
    <div className="flex w-[140px] items-center justify-between rounded-[2px] border border-[#d6d3d1]">
      <button
        type="button"
        aria-label={`Kurangi ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={button}
      >
        −
      </button>
      <b aria-live="polite" className="font-medium">{value}</b>
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
