import { useState } from "react";
import { AppButton } from "./AppButton";
import { FilterSelect } from "./FilterSelect";
import { UserOnly } from "./UserOnly";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService";
import type { Product } from "../services/productService";

export { getProducts };

export interface ProductForm {
    title: string;
    description: string;
    category: string;
    price: string;
}

export const emptyProductForm: ProductForm = {
    title: "",
    description: "",
    category: "",
    price: "",
};

export function productToForm(p: Product): ProductForm {
    return {
        title: p.title,
        description: p.description ?? "",
        category: p.category,
        price: String(p.price),
    };
}

function validateProductForm(form: ProductForm): Partial<Record<keyof ProductForm, string>> {
    const e: Partial<Record<keyof ProductForm, string>> = {};
    if (!form.title.trim()) e.title = "Titlul este obligatoriu.";
    if (!form.category) e.category = "Selectează categoria.";
    if (!form.price.trim()) e.price = "Prețul este obligatoriu.";
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0)
        e.price = "Introdu un preț valid.";
    return e;
}

function ProductFormFields({
    form,
    errors,
    loading,
    apiError,
    submitLabel,
    onSubmit,
    onChange,
    onClose,
}: {
    form: ProductForm;
    errors: Partial<Record<keyof ProductForm, string>>;
    loading: boolean;
    apiError: string | null;
    submitLabel: string;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (field: keyof ProductForm, value: string) => void;
    onClose: () => void;
}) {
    return (
        <form className="sitterModalForm" onSubmit={onSubmit} noValidate>
            <div className="sitterModalRow">
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Titlu produs *</label>
                    <input
                        className={`sitterModalInput${errors.title ? " sitterInputError" : ""}`}
                        placeholder="ex. Hrană uscată 2kg"
                        value={form.title}
                        onChange={(e) => onChange("title", e.target.value)}
                    />
                    {errors.title && <span className="sitterFieldError">{errors.title}</span>}
                </div>
                <div className="sitterModalField">
                    <label className="sitterModalLabel">Categorie *</label>
                    <FilterSelect
                        className={errors.category ? "fs-error" : ""}
                        value={form.category}
                        onChange={(e) => onChange("category", e.target.value)}
                    >
                        <option value="">Selectează categoria</option>
                        <option value="Hrană">Hrană</option>
                        <option value="Jucării">Jucării</option>
                        <option value="Accesorii">Accesorii</option>
                        <option value="Îngrijire">Îngrijire</option>
                        <option value="Igienă">Igienă</option>
                        <option value="Altul">Altul</option>
                    </FilterSelect>
                    {errors.category && <span className="sitterFieldError">{errors.category}</span>}
                </div>
            </div>

            <div className="sitterModalRow">
                <div className="sitterModalField" style={{ flex: 1 }}>
                    <label className="sitterModalLabel">Preț (MDL) *</label>
                    <input
                        type="number"
                        min="1"
                        className={`sitterModalInput${errors.price ? " sitterInputError" : ""}`}
                        placeholder="ex. 150"
                        value={form.price}
                        onChange={(e) => onChange("price", e.target.value)}
                    />
                    {errors.price && <span className="sitterFieldError">{errors.price}</span>}
                </div>
            </div>

            <div className="sitterModalField">
                <label className="sitterModalLabel">Descriere</label>
                <textarea
                    className="sitterModalTextarea"
                    placeholder="Descrie produsul: detalii, utilizare, specificații..."
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    rows={3}
                />
            </div>

            {apiError && <p className="sitterFieldError" style={{ textAlign: "center" }}>{apiError}</p>}

            <div className="sitterModalActions">
                <AppButton type="button" variant="ghost" onClick={onClose} disabled={loading}>
                    Anulează
                </AppButton>
                <AppButton type="submit" variant="primary" disabled={loading}>
                    {loading ? "Se salvează..." : submitLabel}
                </AppButton>
            </div>
        </form>
    );
}

// ── Modal Adăugare ────────────────────────────────────────────────────────────
export function AddProductModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
    const [form, setForm] = useState<ProductForm>(emptyProductForm);
    const [errors, setErrors] = useState<Partial<Record<keyof ProductForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validateProductForm(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            const sellerId = Number(sessionStorage.getItem("pawmate_uid") ?? "0");
            await createProduct({
                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category,
                price: Number(form.price),
                sellerId,
            });
            onAdded();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof ProductForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Adaugă produs</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Închide">×</button>
                </div>
                <ProductFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Adaugă produs"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                />
            </div>
        </div>
    );
}

// ── Modal Editare ─────────────────────────────────────────────────────────────
export function EditProductModal({
    product,
    onClose,
    onUpdated,
}: {
    product: Product;
    onClose: () => void;
    onUpdated: () => void;
}) {
    const [form, setForm] = useState<ProductForm>(productToForm(product));
    const [errors, setErrors] = useState<Partial<Record<keyof ProductForm, string>>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validateProductForm(form);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            await updateProduct(product.id, {
                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category,
                price: Number(form.price),
            });
            onUpdated();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof ProductForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Editează produs</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Închide">×</button>
                </div>
                <ProductFormFields
                    form={form} errors={errors} loading={loading} apiError={apiError}
                    submitLabel="Salvează modificările"
                    onSubmit={handleSubmit} onChange={handleChange} onClose={onClose}
                />
            </div>
        </div>
    );
}

// ── Modal Confirmare Ștergere ──────────────────────────────────────────────────
export function DeleteProductModal({
    product,
    onClose,
    onDeleted,
}: {
    product: Product;
    onClose: () => void;
    onDeleted: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    async function handleDelete() {
        setLoading(true);
        setApiError(null);
        try {
            await deleteProduct(product.id);
            onDeleted();
            onClose();
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Eroare necunoscută.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="sitterModalOverlay" onClick={onClose}>
            <div className="sitterModalBox" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
                <div className="sitterModalHeader">
                    <h2 className="sitterModalTitle">Șterge produs</h2>
                    <button className="sitterModalClose" onClick={onClose} aria-label="Închide">×</button>
                </div>
                <div style={{ padding: "8px 0 16px", textAlign: "center", color: "var(--color-text)" }}>
                    Ești sigur că vrei să ștergi <strong>{product.title}</strong>? Această acțiune nu poate fi anulată.
                </div>
                {apiError && <p className="sitterFieldError" style={{ textAlign: "center" }}>{apiError}</p>}
                <div className="sitterModalActions">
                    <AppButton variant="ghost" onClick={onClose} disabled={loading}>
                        Anulează
                    </AppButton>
                    <AppButton
                        variant="primary"
                        onClick={handleDelete}
                        disabled={loading}
                        style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                    >
                        {loading ? "Se șterge..." : "Da, șterge"}
                    </AppButton>
                </div>
            </div>
        </div>
    );
}

// ── Card Produs ───────────────────────────────────────────────────────────────
export function ProductCard({
    product,
    onAddToCart,
    onEdit,
    onDelete,
}: {
    product: Product;
    onAddToCart: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}) {
    return (
        <article className="salesCard">
            <div className="salesCardTop">
                <h3 className="salesName">{product.title}</h3>
                <span className="salesBadge">{product.category}</span>
            </div>
            <p className="salesDesc">{product.description}</p>
            <div className="salesPrice">{product.price} MDL</div>
            <AppButton
                className="salesBtn"
                variant="primary"
                type="button"
                onClick={() => onAddToCart(product)}
            >
                Adaugă în coș
            </AppButton>
            <UserOnly>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <AppButton variant="ghost" size="sm" onClick={() => onEdit(product)}>
                        Editează
                    </AppButton>
                    <AppButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product)}
                        style={{ borderColor: "#e53e3e", color: "#e53e3e" }}
                    >
                        Șterge
                    </AppButton>
                </div>
            </UserOnly>
        </article>
    );
}
