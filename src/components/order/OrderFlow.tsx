"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { placeOrderAction } from "@/app/actions/orders";
import type { OpenPo } from "@/lib/data/po";
import { formatLongDateString } from "@/lib/format";
import { deliveryLabels, orderTotals, type OrderLine } from "@/lib/order";
import { cn, formatIDR } from "@/lib/utils";
import { orderFormSchema, type OrderFormValues } from "@/lib/validation/order";
import type { Product } from "@/types/product";
import { OrderSuccess, type CompletedOrder } from "./OrderSuccess";
import { OrderSummary } from "./OrderSummary";
import { QuantityStepper } from "./QuantityStepper";

const FORM_ID = "order-form";

const labelClass = "mt-[16px] flex flex-col gap-[7px] text-[11px] font-bold";
const inputClass =
  "rounded-[2px] border border-[#e7e5e4] bg-[#ffffff] p-[12px] text-[12px] font-normal outline-none focus:border-chocolate";
const errorClass = "text-[11px] font-medium text-[#b3412f]";

function FormBlock({
  number,
  title,
  description,
  last = false,
  children,
}: {
  number: number;
  title: string;
  description: string;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[42px_1fr] gap-[15px] pb-[30px] pt-[10px] max-[520px]:grid-cols-[32px_1fr]",
        last ? "" : "mb-[25px] border-b border-[#eeeceb]",
      )}
    >
      <span className="grid h-[32px] w-[32px] place-items-center rounded-full bg-chocolate text-[12px] font-medium text-white">
        {number}
      </span>
      <div>
        <h3 className="my-[4px] text-[18px]">{title}</h3>
        <p className="text-[12px] text-muted">{description}</p>
        {children}
      </div>
    </div>
  );
}

export function OrderFlow({
  products,
  initialProductId,
  po,
  defaults,
  whatsappNumber,
}: {
  products: Product[];
  initialProductId?: string;
  po: OpenPo;
  defaults: { name: string; whatsapp: string };
  /** nomor WhatsApp toko, format internasional */
  whatsappNumber: string;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    initialProductId ? { [initialProductId]: 1 } : {},
  );
  const [itemsError, setItemsError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [completed, setCompleted] = useState<CompletedOrder | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: defaults.name,
      whatsapp: defaults.whatsapp,
      deliveryMethod: "pickup",
      address: "",
      notes: "",
    },
  });

  const deliveryMethod = watch("deliveryMethod");

  const lines: OrderLine[] = useMemo(
    () =>
      products
        .filter((product) => (quantities[product.id] ?? 0) > 0)
        .map((product) => ({ product, quantity: quantities[product.id] })),
    [products, quantities],
  );

  function toggleProduct(product: Product) {
    setItemsError("");
    setQuantities((previous) => {
      const next = { ...previous };
      if (next[product.id]) delete next[product.id];
      else next[product.id] = 1;
      return next;
    });
  }

  function setQuantity(productId: string, value: number) {
    setQuantities((previous) => ({ ...previous, [productId]: value }));
  }

  const onValid = async (values: OrderFormValues) => {
    if (lines.length === 0) {
      setItemsError("Pilih minimal satu rasa.");
      return;
    }
    const totalQuantity = orderTotals(lines).quantity;
    if (po.remaining !== null && totalQuantity > po.remaining) {
      setSubmitError(`Kuota PO tinggal ${po.remaining} pcs. Kurangi jumlah pesananmu.`);
      return;
    }
    setSubmitError("");
    try {
      const result = await placeOrderAction({
        items: lines.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
        })),
        customerName: values.customerName,
        whatsapp: values.whatsapp,
        deliveryMethod: values.deliveryMethod,
        address: values.address,
        notes: values.notes,
      });
      if (!result.ok) {
        setSubmitError(result.message);
        return;
      }
      setCompleted({
        orderNumber: result.orderNumber,
        lines,
        customerName: values.customerName,
        deliveryMethod: values.deliveryMethod,
        address: values.address,
        notes: values.notes,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Pesanan belum berhasil dikirim. Periksa koneksi lalu coba lagi.");
    }
  };

  const onInvalid = () => {
    if (lines.length === 0) setItemsError("Pilih minimal satu rasa.");
  };

  if (completed) {
    return (
      <OrderSuccess order={completed} whatsappNumber={whatsappNumber} readyDate={po.readyDate} />
    );
  }

  return (
    <div className="mx-auto mt-[45px] grid max-w-[1120px] grid-cols-[1fr_370px] gap-[30px] px-[24px] max-[800px]:grid-cols-1 max-[520px]:px-[14px]">
      <form
        id={FORM_ID}
        noValidate
        onSubmit={handleSubmit(onValid, onInvalid)}
        className="border border-line bg-white p-[28px] max-[520px]:px-[15px] max-[520px]:py-[20px]"
      >
        <div className="mb-[25px] rounded-[2px] bg-[#f7f5f2] px-[16px] py-[12px] text-[12px]">
          <b>{po.name}</b>
          {po.readyDate && <> · Ready {formatLongDateString(po.readyDate)}</>}
          {po.remaining !== null && <> · Sisa kuota {po.remaining} pcs</>}
          {po.note && <p className="mt-[4px] text-muted">{po.note}</p>}
        </div>

        <FormBlock
          number={1}
          title="Pilih rasa"
          description="Pilih satu rasa atau lebih untuk pesananmu."
        >
          <div className="mt-[17px] grid grid-cols-2 gap-[10px] max-[520px]:grid-cols-1">
            {products.map((product) => {
              const selected = (quantities[product.id] ?? 0) > 0;
              const soldOut = product.stock <= 0;
              return (
                <button
                  key={product.id}
                  type="button"
                  disabled={soldOut}
                  aria-pressed={selected}
                  onClick={() => toggleProduct(product)}
                  className={cn(
                    "relative flex min-h-[64px] items-center gap-[10px] rounded-[2px] bg-white p-[9px] text-left disabled:opacity-50",
                    selected
                      ? "border-2 border-chocolate bg-[#faf5f6]"
                      : "border border-[#e7e5e4]",
                  )}
                >
                  <Image
                    src={product.image}
                    alt=""
                    width={48}
                    height={48}
                    className="h-[48px] w-[48px] rounded-[2px] object-cover"
                  />
                  <span className="flex flex-col">
                    <b className="text-[12px]">{product.name}</b>
                    <small className="text-[10px] text-muted">
                      {soldOut ? "Stok habis" : formatIDR(product.price)}
                    </small>
                  </span>
                  {selected && (
                    <i className="absolute right-[8px] top-[8px] grid h-[18px] w-[18px] place-items-center rounded-full bg-chocolate text-white">
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                    </i>
                  )}
                </button>
              );
            })}
          </div>
          {itemsError && (
            <p role="alert" className={`${errorClass} mt-[10px]`}>
              {itemsError}
            </p>
          )}
        </FormBlock>

        <FormBlock
          number={2}
          title="Jumlah pesanan"
          description="Atur jumlah untuk setiap rasa yang dipilih."
        >
          {lines.length === 0 ? (
            <p className="mt-[17px] text-[12px] text-muted">Pilih rasa terlebih dahulu.</p>
          ) : (
            <ul className="mt-[17px] flex flex-col gap-[14px]">
              {lines.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-[12px] max-[520px]:flex-wrap"
                >
                  <span className="flex items-center gap-[10px]">
                    <Image
                      src={product.image}
                      alt=""
                      width={48}
                      height={48}
                      className="h-[48px] w-[48px] rounded-[2px] object-cover"
                    />
                    <span className="flex flex-col">
                      <b className="text-[12px]">{product.name}</b>
                      <small className="text-[10px] text-muted">
                        {formatIDR(product.price)} · stok {product.stock}
                      </small>
                    </span>
                  </span>
                  <QuantityStepper
                    value={quantity}
                    max={product.stock}
                    label={product.name}
                    onChange={(next) => setQuantity(product.id, next)}
                  />
                </li>
              ))}
            </ul>
          )}
        </FormBlock>

        <FormBlock
          number={3}
          title="Detail pelanggan"
          description="Isi data untuk konfirmasi pesananmu."
          last
        >
          <div className="grid grid-cols-2 gap-[14px] max-[520px]:grid-cols-1">
            <label className={labelClass}>
              Nama lengkap
              <input
                {...register("customerName")}
                autoComplete="name"
                placeholder="Nama kamu"
                aria-invalid={Boolean(errors.customerName)}
                className={inputClass}
              />
              {errors.customerName && (
                <span className={errorClass}>{errors.customerName.message}</span>
              )}
            </label>
            <label className={labelClass}>
              Nomor WhatsApp
              <input
                {...register("whatsapp")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0812 3456 7890"
                aria-invalid={Boolean(errors.whatsapp)}
                className={inputClass}
              />
              {errors.whatsapp && <span className={errorClass}>{errors.whatsapp.message}</span>}
            </label>
          </div>

          <div className={labelClass}>
            Metode penerimaan
            <div className="flex gap-[10px]">
              {(Object.keys(deliveryLabels) as Array<keyof typeof deliveryLabels>).map(
                (method) => {
                  const selected = deliveryMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setValue("deliveryMethod", method, { shouldValidate: true })
                      }
                      className={cn(
                        "relative min-h-[48px] flex-1 rounded-[2px] border p-[13px] text-[12px] font-medium",
                        selected
                          ? "border-chocolate bg-[#faf5f6]"
                          : "border-[#e7e5e4] bg-white",
                      )}
                    >
                      {deliveryLabels[method]}
                      {selected && (
                        <i className="absolute right-[8px] top-[8px] grid h-[18px] w-[18px] place-items-center rounded-full bg-chocolate text-white">
                          <Check size={12} strokeWidth={3} aria-hidden="true" />
                        </i>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {deliveryMethod === "delivery" && (
            <label className={labelClass}>
              Alamat lengkap
              <textarea
                {...register("address")}
                rows={3}
                placeholder="Nama jalan, nomor rumah, kecamatan"
                aria-invalid={Boolean(errors.address)}
                className={`${inputClass} resize-y`}
              />
              {errors.address && <span className={errorClass}>{errors.address.message}</span>}
            </label>
          )}

          <label className={labelClass}>
            Catatan (opsional)
            <textarea
              {...register("notes")}
              rows={2}
              placeholder="Contoh: tanpa kacang, diambil jam 4 sore"
              className={`${inputClass} resize-y`}
            />
            {errors.notes && <span className={errorClass}>{errors.notes.message}</span>}
          </label>

          {submitError && (
            <p role="alert" className={`${errorClass} mt-[16px]`}>
              {submitError}
            </p>
          )}
        </FormBlock>
      </form>

      <OrderSummary lines={lines} formId={FORM_ID} submitting={isSubmitting} />
    </div>
  );
}
