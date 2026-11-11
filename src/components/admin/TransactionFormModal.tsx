"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { newId, transactionsStore } from "@/lib/admin/repository";
import { toDateInput } from "@/lib/admin/period";
import { expenseCategories, incomeCategories } from "@/lib/admin/status";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/validation/admin";
import type { CashTransaction } from "@/types/admin";
import { Modal } from "./Modal";
import { adminError, adminInput, adminLabel } from "./styles";

export function TransactionFormModal({
  type,
  transaction,
  onClose,
  onSaved,
}: {
  type: "income" | "expense";
  transaction?: CashTransaction;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const categories = type === "income" ? incomeCategories : expenseCategories;
  const label = type === "income" ? "pemasukan" : "pengeluaran";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transaction
      ? {
          date: transaction.date,
          category: transaction.category,
          amount: transaction.amount,
          description: transaction.description,
        }
      : { date: toDateInput(new Date()), category: categories[0], description: "" },
  });

  const onSubmit = handleSubmit((values) => {
    if (transaction) {
      transactionsStore.update(transaction.id, values);
      onSaved(`${capitalizeFirst(label)} diperbarui`);
    } else {
      transactionsStore.add({
        id: newId(),
        type,
        ...values,
        createdAt: new Date().toISOString(),
      });
      onSaved(`${capitalizeFirst(label)} berhasil dicatat`);
    }
    onClose();
  });

  return (
    <Modal
      title={`${transaction ? "Edit" : "Tambah"} ${label}`}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} noValidate>
        <label className={adminLabel}>
          Tanggal
          <input
            {...register("date")}
            type="date"
            aria-invalid={Boolean(errors.date)}
            className={adminInput}
          />
          {errors.date && <span className={adminError}>{errors.date.message}</span>}
        </label>
        <label className={adminLabel}>
          Kategori
          <select {...register("category")} className={adminInput}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className={adminLabel}>
          Nominal (Rp)
          <input
            {...register("amount", { valueAsNumber: true })}
            type="number"
            inputMode="numeric"
            placeholder="0"
            aria-invalid={Boolean(errors.amount)}
            className={adminInput}
          />
          {errors.amount && <span className={adminError}>{errors.amount.message}</span>}
        </label>
        <label className={adminLabel}>
          Keterangan
          <textarea
            {...register("description")}
            rows={3}
            placeholder={type === "income" ? "Keterangan pemasukan" : "Keterangan pengeluaran"}
            aria-invalid={Boolean(errors.description)}
            className={`${adminInput} resize-y`}
          />
          {errors.description && <span className={adminError}>{errors.description.message}</span>}
        </label>
        <Button type="submit" full className="mt-[20px]">
          {type === "income" ? "Simpan Pemasukan" : "Simpan Pengeluaran"}
        </Button>
      </form>
    </Modal>
  );
}

function capitalizeFirst(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
