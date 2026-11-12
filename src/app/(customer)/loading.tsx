// Tampil seketika saat pindah ke halaman yang datanya masih dimuat (pesan, riwayat, masuk, daftar)
export default function Loading() {
  return (
    <main className="min-h-[70vh] px-[max(6vw,20px)] py-[48px]" aria-busy="true" aria-label="Memuat halaman">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-[14px]">
        <div className="gai-skeleton h-[12px] w-[120px]" />
        <div className="gai-skeleton h-[34px] w-[70%]" />
        <div className="gai-skeleton h-[14px] w-[55%]" />
      </div>
      <div className="mx-auto mt-[40px] grid max-w-[900px] grid-cols-2 gap-[14px] min-[801px]:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="gai-skeleton aspect-[4/5]" />
        ))}
      </div>
    </main>
  );
}
