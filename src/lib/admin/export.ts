import { formatMediumDate } from "@/lib/format";
import { formatIDR } from "@/lib/utils";
import type { Order } from "@/types/admin";
import type { ProductPerformance, SeriesPoint, Summary } from "./analytics";
import { orderStatusLabel } from "./status";

export type LedgerRow = {
  date: Date;
  description: string;
  category: string;
  type: "income" | "expense";
  amount: number;
};

export type FinanceReport = {
  periodLabel: string;
  summary: Summary;
  series: SeriesPoint[];
  products: ProductPerformance[];
  ledger: LedgerRow[];
};

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const stamp = () => new Date().toISOString().slice(0, 10);

async function loadExcel() {
  const mod = await import("exceljs");
  const ExcelJS = (mod as { default?: typeof mod }).default ?? mod;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "GAICREAM";
  workbook.created = new Date();
  return workbook;
}

export async function exportOrdersToExcel(orders: Order[], periodLabel: string) {
  const workbook = await loadExcel();
  const sheet = workbook.addWorksheet("Pesanan");
  sheet.columns = [
    { header: "No. Pesanan", key: "number", width: 18 },
    { header: "Tanggal", key: "date", width: 18 },
    { header: "Pelanggan", key: "customer", width: 24 },
    { header: "WhatsApp", key: "phone", width: 18 },
    { header: "Pesanan", key: "items", width: 40 },
    { header: "Penerimaan", key: "delivery", width: 16 },
    { header: "Status", key: "status", width: 14 },
    { header: "Total (Rp)", key: "total", width: 16 },
  ];
  sheet.getRow(1).font = { bold: true };
  orders.forEach((order) =>
    sheet.addRow({
      number: order.orderNumber,
      date: new Date(order.createdAt),
      customer: order.customerName,
      phone: order.whatsapp,
      items: order.items.map((i) => `${i.name} x ${i.quantity}`).join(", "),
      delivery: order.deliveryMethod === "delivery" ? "Delivery" : "Ambil di lokasi",
      status: orderStatusLabel[order.status],
      total: order.total,
    }),
  );
  sheet.getColumn("date").numFmt = "dd/mm/yyyy hh:mm";
  sheet.getColumn("total").numFmt = "#,##0";
  sheet.addRow([]);
  sheet.addRow([`Periode: ${periodLabel}`]);

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(new Blob([buffer], { type: XLSX_MIME }), `pesanan-gaicream-${stamp()}.xlsx`);
}

export async function exportFinanceToExcel(report: FinanceReport) {
  const { summary } = report;
  const workbook = await loadExcel();

  const overview = workbook.addWorksheet("Ringkasan");
  overview.columns = [
    { header: "Keterangan", key: "label", width: 32 },
    { header: "Jumlah (Rp)", key: "value", width: 20 },
  ];
  overview.getRow(1).font = { bold: true };
  overview.addRows([
    { label: "Omzet penjualan", value: summary.revenue },
    { label: "Pemasukan lain", value: summary.otherIncome },
    { label: "Modal barang terjual", value: summary.cogs },
    { label: "Pengeluaran", value: summary.expenses },
    { label: "Keuntungan bersih", value: summary.profit },
  ]);
  overview.getColumn("value").numFmt = "#,##0";
  overview.addRow([]);
  overview.addRow([`Periode: ${report.periodLabel}`]);

  const flow = workbook.addWorksheet("Arus Kas");
  flow.columns = [
    { header: "Periode", key: "label", width: 16 },
    { header: "Omzet", key: "revenue", width: 16 },
    { header: "Modal", key: "cogs", width: 16 },
    { header: "Pengeluaran", key: "expenses", width: 16 },
    { header: "Keuntungan", key: "profit", width: 16 },
  ];
  flow.getRow(1).font = { bold: true };
  report.series.forEach((point) => flow.addRow(point));
  ["revenue", "cogs", "expenses", "profit"].forEach((key) => {
    flow.getColumn(key).numFmt = "#,##0";
  });

  const products = workbook.addWorksheet("Produk");
  products.columns = [
    { header: "Produk", key: "name", width: 26 },
    { header: "Terjual (pcs)", key: "units", width: 16 },
    { header: "Omzet", key: "revenue", width: 16 },
    { header: "Keuntungan", key: "profit", width: 16 },
  ];
  products.getRow(1).font = { bold: true };
  report.products.forEach((item) => products.addRow(item));
  products.getColumn("revenue").numFmt = "#,##0";
  products.getColumn("profit").numFmt = "#,##0";

  const ledger = workbook.addWorksheet("Transaksi");
  ledger.columns = [
    { header: "Tanggal", key: "date", width: 14 },
    { header: "Keterangan", key: "description", width: 40 },
    { header: "Kategori", key: "category", width: 18 },
    { header: "Jenis", key: "type", width: 14 },
    { header: "Jumlah (Rp)", key: "amount", width: 16 },
  ];
  ledger.getRow(1).font = { bold: true };
  report.ledger.forEach((row) =>
    ledger.addRow({
      ...row,
      type: row.type === "income" ? "Pemasukan" : "Pengeluaran",
    }),
  );
  ledger.getColumn("date").numFmt = "dd/mm/yyyy";
  ledger.getColumn("amount").numFmt = "#,##0";

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(new Blob([buffer], { type: XLSX_MIME }), `laporan-keuangan-gaicream-${stamp()}.xlsx`);
}

export async function exportFinanceToPdf(report: FinanceReport) {
  const { summary } = report;
  const { default: JsPdf } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new JsPdf({ unit: "pt", format: "a4" });
  const margin = 40;
  const head = { fillColor: [113, 63, 50] as [number, number, number] };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Laporan Keuangan GAICREAM", margin, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Periode: ${report.periodLabel}`, margin, 68);

  autoTable(doc, {
    startY: 84,
    head: [["Ringkasan", "Jumlah"]],
    body: [
      ["Omzet penjualan", formatIDR(summary.revenue)],
      ["Pemasukan lain", formatIDR(summary.otherIncome)],
      ["Modal barang terjual", formatIDR(summary.cogs)],
      ["Pengeluaran", formatIDR(summary.expenses)],
      ["Keuntungan bersih", formatIDR(summary.profit)],
    ],
    headStyles: head,
    styles: { fontSize: 10 },
    columnStyles: { 1: { halign: "right" } },
    margin: { left: margin, right: margin },
  });

  const nextY = () =>
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24;

  if (report.products.length > 0) {
    autoTable(doc, {
      startY: nextY(),
      head: [["Produk", "Terjual (pcs)", "Omzet", "Keuntungan"]],
      body: report.products.map((item) => [
        item.name,
        String(item.units),
        formatIDR(item.revenue),
        formatIDR(item.profit),
      ]),
      headStyles: head,
      styles: { fontSize: 9 },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } },
      margin: { left: margin, right: margin },
    });
  }

  autoTable(doc, {
    startY: nextY(),
    head: [["Tanggal", "Keterangan", "Kategori", "Jenis", "Jumlah"]],
    body:
      report.ledger.length > 0
        ? report.ledger.map((row) => [
            formatMediumDate(row.date),
            row.description,
            row.category,
            row.type === "income" ? "Pemasukan" : "Pengeluaran",
            formatIDR(row.amount),
          ])
        : [["", "Belum ada transaksi pada periode ini", "", "", ""]],
    headStyles: head,
    styles: { fontSize: 9 },
    columnStyles: { 4: { halign: "right" } },
    margin: { left: margin, right: margin },
  });

  doc.save(`laporan-keuangan-gaicream-${stamp()}.pdf`);
}
