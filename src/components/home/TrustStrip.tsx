export function TrustStrip({ flavorCount }: { flavorCount: number }) {
  const items = [
    { title: "Freshly Made", text: "Dibuat setiap hari" },
    { title: `${flavorCount} Flavors`, text: "Pilihan rasa favorit" },
    { title: "Premium Ingredients", text: "Bahan berkualitas" },
    { title: "Made With Love", text: "Untuk momen manismu" },
  ];

  return (
    <section className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center bg-white px-[max(6vw,55px)] py-[35px] text-center max-[800px]:grid-cols-2 max-[800px]:gap-[22px] max-[800px]:px-[15px] max-[800px]:py-[25px]">
      {items.map((item, index) => (
        <div key={item.title} className="contents">
          {index > 0 && (
            <i aria-hidden="true" className="h-[30px] w-px bg-[#ead9cf] max-[800px]:hidden" />
          )}
          <div className="flex flex-col">
            <b className="font-heading text-[14px] font-bold">{item.title}</b>
            <span className="mt-[3px] text-[11px] text-muted">{item.text}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
