"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { productsStore } from "@/lib/admin/repository";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { Modal } from "./Modal";
import { adminError, adminInput, adminLabel } from "./styles";

type Mode = "add" | "subtract" | "set";

const modes: { value: Mode; label: string }[] = [
  { value: "add", label: "Tambah" },
  { value: "subtract", label: "Kurangi" },
  { value: "set", label: "Atur jumlah" },
];

export function StockModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("add");
  const [amount, setAmount] = useState("");

  const value = amount === "" ? NaN : Number(amount);
  const valid = Number.isInteger(value) && value >= 0;
  const result =
    !valid ? null : mode === "add" ? product.stock + value : mode === "subtract" ? product.stock - value : value;
  const error =
    amount !== "" && !valid
      ? "Isi dengan bilangan bulat 0 atau lebih"
      : result !== null && result < 0
        ? "Stok tidak boleh kurang dari 0"
        : "";
  const canSave = result !== null && result >= 0;

  function save() {
    if (result === null || result < 0) return;
    productsStore.update(product.id, { stock: result });
    onSaved(`Stok ${product.name} sekarang ${result} pcs`);
    onClose();
  }

  return (
    <Modal title="Atur stok" description={`${product.name} · stok saat ini ${product.stock} pcs`} onClose={onClose}>
      <div className="mt-[18px] flex gap-[8px]">
        {modes.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={mode === item.value}
            onClick={() => setMode(item.value)}
            className={cn(
              "flex-1 rounded-full border px-[10px] py-[9px] text-[12px]",
              mode === item.value
                ? "border-chocolate bg-chocolate text-white"
                : "border-[#ead9cf] bg-white text-muted",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label className={adminLabel}>
        {mode === "set" ? "Jumlah stok baru (pcs)" : "Jumlah (pcs)"}
        <input
          type="number"
          inputMode="numeric"
          min={0}
          autoFocus
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0"
          className={adminInput}
        />
        {error && <span className={adminError}>{error}</span>}
      </label>

      <p className="mt-[14px] text-[12px] text-muted">
        Stok setelah disimpan:{" "}
        <b className="text-chocolate">{result !== null && result >= 0 ? `${result} pcs` : "–"}</b>
      </p>

      <Button full className="mt-[18px]" disabled={!canSave} onClick={save}>
        Simpan Stok
      </Button>
    </Modal>
  );
}
