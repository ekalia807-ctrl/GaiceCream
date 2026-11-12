export function TrustStrip({ flavorCount }: { flavorCount: number }) {
  const items = [
    { title: "Freshly Made", text: "Dibuat setiap hari" },
    { title: `${flavorCount} Flavors`, text: "Pilihan rasa favorit" },
    { title: "Premium Ingredients", text: "Bahan berkualitas" },
    { title: "Made With Love", text: "Untuk momen manismu" },
  ];

  return (
    <section className="grid grid-cols-2 gap-y-[18px] border-b border-line bg-white px-[max(6vw,20px)] py-[26px] text-center min-[801px]:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="flex flex-col">
          <b className="text-[11px] font-medium uppercase tracking-[.18em]">{item.title}</b>
          <span className="mt-[4px] text-[12px] text-muted">{item.text}</span>
        </div>
      ))}
    </section>
  );
}
