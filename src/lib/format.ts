const longDate = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const mediumDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const shortDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});
const dateTime = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const monthYear = new Intl.DateTimeFormat("id-ID", {
  month: "short",
  year: "numeric",
});

export const formatLongDate = (date: Date) => longDate.format(date);
export const formatMediumDate = (date: Date) => mediumDate.format(date);
export const formatShortDate = (date: Date) => shortDate.format(date);
export const formatMonthYear = (date: Date) => monthYear.format(date);
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/** 12.5 -> "+12,5%"; null -> "–" (tidak ada pembanding) */
export function formatChange(value: number | null) {
  if (value === null) return "–";
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  return `${sign}${Math.abs(rounded).toFixed(1).replace(".", ",")}%`;
}

export function formatPercent(value: number) {
  return `${(Math.round(value * 10) / 10).toFixed(1).replace(".", ",")}%`;
}

/** "2026-10-01" -> "Kamis, 1 Oktober 2026" (tanpa pergeseran zona waktu) */
export function formatLongDateString(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return longDate.format(new Date(year, month - 1, day));
}
