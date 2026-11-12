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
      <div className="bg-chocolate px-[16px] py-[8px] text-center text-[11px] tracking-[.04em] text-white">
        <b className="font-medium">{po.name} dibuka</b>
        {po.readyDate && <> · Ready {formatLongDateString(po.readyDate)}</>}
        {po.remaining !== null && <> · Sisa kuota {po.remaining} pcs</>}
      </div>
    );
  }

  return (
    <div className="bg-vanilla px-[16px] py-[8px] text-center text-[11px] tracking-[.04em] text-muted">
      PO sedang ditutup.{" "}
      {instagramUrl ? (
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-chocolate underline">
          Pantau Instagram
        </a>
      ) : (
        "Pantau Instagram"
      )}{" "}
      untuk info PO berikutnya.
    </div>
  );
}
