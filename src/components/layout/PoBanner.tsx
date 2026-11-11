import { formatLongDateString } from "@/lib/format";
import type { OpenPo } from "@/lib/data/po";

export function PoBanner({
  po,
  instagramUrl,
}: {
  po: OpenPo | null;
  instagramUrl: string;
}) {
  if (po) {
    return (
      <div className="bg-chocolate px-[16px] py-[8px] text-center text-[12px] text-white">
        <b>{po.name} dibuka</b>
        {po.readyDate && <> · Ready {formatLongDateString(po.readyDate)}</>}
        {po.remaining !== null && <> · Sisa kuota {po.remaining} pcs</>}
      </div>
    );
  }

  return (
    <div className="bg-[#eeeae6] px-[16px] py-[8px] text-center text-[12px] text-[#6e625e]">
      PO sedang ditutup.{" "}
      {instagramUrl ? (
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline">
          Pantau Instagram
        </a>
      ) : (
        "Pantau Instagram"
      )}{" "}
      untuk info PO berikutnya.
    </div>
  );
}
