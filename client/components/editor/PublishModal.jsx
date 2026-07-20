import { useState } from "react";
import { X } from "lucide-react";
import { TAGS } from "@/components/constants";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

function InputField({ label, error, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h3
                style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-ink)",
                }}
            >
                {label}
            </h3>
            {children}
            {error && (
                <p
                    style={{
                        fontSize: 13,
                        color: "var(--color-error)",
                        marginTop: 6,
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}

function ModalFrame({ isOpen, onClose, title, footer, children, onSubmit }) {
    if (!isOpen) return null;

    const bodyAndFooter = (
        <>
            <div
                style={{
                    overflowY: "auto",
                    scrollbarGutter: "stable",
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                }}
            >
                {children}
            </div>
            {footer && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "16px 24px",
                        borderTop: "1px solid var(--color-border)",
                    }}
                >
                    {footer}
                </div>
            )}
        </>
    );

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: 16,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "var(--color-white)",
                    borderRadius: "var(--border-radius)",
                    width: "100%",
                    maxWidth: 520,
                    maxHeight: "92vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxShadow: "0 25px 70px rgba(0,0,0,0.12)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 24px",
                        borderBottom: "1px solid var(--color-border)",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: 18,
                            fontWeight: 600,
                            color: "var(--color-ink)",
                        }}
                    >
                        {title}
                    </h2>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            padding: 4,
                            margin: -4,
                            color: "var(--color-ink)",
                            cursor: "pointer",
                            display: "flex",
                            borderRadius: 6,
                            opacity: 0.5,
                        }}
                        onClick={onClose}
                        aria-label="إغلاق"
                    >
                        <X size={20} />
                    </button>
                </div>
                {onSubmit ? (
                    <form
                        onSubmit={onSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            flex: 1,
                        }}
                    >
                        {bodyAndFooter}
                    </form>
                ) : (
                    bodyAndFooter
                )}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const handlePublishSubmit = async (data) => {
    const errors = {};

    if (!data.coverImage) errors.coverImage = "صورة الغلاف مطلوبة";

    const content = data.content;
    const firstNode = content?.content?.[0];
    const secondNode = content?.content?.[1];

    const getText = (node) =>
        node?.content
            ?.map((c) => (c.type === "text" ? c.text : ""))
            .join("")
            .trim() || "";

    if (
        !firstNode ||
        firstNode.type !== "articleTitle" ||
        !getText(firstNode)
    ) {
        errors.articleTitle = "عنوان المقال مطلوب";
        alert(errors.articleTitle);
    }

    if (
        !secondNode ||
        secondNode.type !== "articleDescription" ||
        !getText(secondNode)
    ) {
        errors.articleDescription = "وصف المقال مطلوب";
        alert(errors.articleDescription);
    }

    if (!data.seoTitle) errors.seoTitle = "عنوان محركات البحث مطلوب";
    else if (data.seoTitle.length > 60 || data.seoTitle.length < 30)
        errors.seoTitle = "العنوان يجب أن يكون بين 30 إلى 60 حرفًا";

    if (!data.seoDescription) errors.seoDescription = "وصف SEO مطلوب";
    else if (
        data.seoDescription.length > 160 ||
        data.seoDescription.length < 100
    )
        errors.seoDescription = "الوصف يجب أن يكون بين 100 إلى 160 حرفًا";

    if (!data.tag) errors.tag = "الموضوع مطلوب";

    if (data.wordCount < 500) {
        errors.wordCount = "يجب أن يحتوي المقال على 500 كلمة على الأقل";
        alert(errors.wordCount);
    }

    if (Object.keys(errors).length > 0) return { success: false, errors };

    try {
        const res = await fetch("http://localhost:3000/api/article/create", {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ content: data.content, data: data }),
        });
        const json = await res.json();
        if (res.status !== 200) {
            return {
                success: false,
                errors: { apiError: json.error || "حدث خطأ أثناء نشر المقال" },
            };
        }
        return { success: true, slug: json.slug };
    } catch {
        return { success: false, errors: { apiError: "تعذر الاتصال بالخادم" } };
    }
};

export default function PublishModal({
    isOpen,
    onClose,
    coverImage,
    setCoverImage,
    coverError,
    setCoverError,
    content,
    wordCount,
}) {
    const [seoTitle, setSeoTitle] = useState("");
    const [seoTitleError, setSeoTitleError] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [seoDescriptionError, setSeoDescriptionError] = useState("");
    const [tag, setTag] = useState("");
    const [tagError, setTagError] = useState("");
    const [sendEmail, setSendEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const inputBase = {
        width: "100%",
        padding: "10px 14px",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        fontSize: 14,
        color: "var(--color-ink)",
        background: "var(--color-white)",
        outline: "none",
        boxSizing: "border-box",
    };

    const FILE_UPLOAD = {
        border: "2px dashed var(--color-border)",
        borderRadius: 8,
        padding: 40,
        textAlign: "center",
        cursor: "pointer",
        color: "var(--color-mid)",
        fontSize: 14,
        transition: "border-color 0.2s, background 0.2s",
        display: "block",
    };

    const FILE_PREVIEW = {
        width: "100%",
        aspectRatio: "191/100",
        objectFit: "cover",
        borderRadius: 8,
    };

    return (
        <ModalFrame
            isOpen={isOpen}
            onClose={onClose}
            title="نشر"
            footer={
                <>
                    <Button loading={loading} type="submit">
                        نشر المقال
                    </Button>
                    <Button onClick={onClose} variant="secondary">
                        إلغاء
                    </Button>
                </>
            }
            onSubmit={async (e) => {
                e.preventDefault();
                setCoverError("");
                setSeoTitleError("");
                setSeoDescriptionError("");
                setTagError("");
                setLoading(true);
                const result = await handlePublishSubmit({
                    coverImage,
                    seoTitle,
                    seoDescription,
                    tag,
                    sendEmail,
                    content,
                    wordCount,
                });
                setLoading(false);
                if (!result.success) {
                    if (result.errors.coverImage)
                        setCoverError(result.errors.coverImage);
                    if (result.errors.seoTitle)
                        setSeoTitleError(result.errors.seoTitle);
                    if (result.errors.seoDescription)
                        setSeoDescriptionError(result.errors.seoDescription);
                    if (result.errors.tag) setTagError(result.errors.tag);
                    if (result.errors.apiError) alert(result.errors.apiError);
                    return;
                }
                router.push(`/article/${result.slug}`);
                onClose();
            }}
        >
            <InputField label="صورة الغلاف" error={coverError}>
                <label style={FILE_UPLOAD}>
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 3 * 1024 * 1024) {
                                setCoverError("الحد الأقصى 3 ميغابايت");
                                return;
                            }
                            setCoverError("");
                            setCoverImage(file);
                        }}
                    />
                    {coverImage ? (
                        <img
                            src={URL.createObjectURL(coverImage)}
                            alt=""
                            style={FILE_PREVIEW}
                        />
                    ) : (
                        <span style={{ color: "var(--color-mid)" }}>
                            انقر لاختيار صورة (3MB, 1.91:1)
                        </span>
                    )}
                </label>
            </InputField>

            <InputField label="عنوان محركات البحث" error={seoTitleError}>
                <input
                    name="title"
                    type="text"
                    style={{
                        ...inputBase,
                        ...(seoTitleError
                            ? { border: "1px solid var(--color-error)" }
                            : {}),
                    }}
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="أدخل عنوان تحسين محركات البحث"
                />
            </InputField>

            <InputField label="وصف محركات البحث" error={seoDescriptionError}>
                <textarea
                    name="description"
                    style={{
                        ...inputBase,
                        resize: "vertical",
                        minHeight: 80,
                        fontFamily: "inherit",
                        lineHeight: 1.6,
                        ...(seoDescriptionError
                            ? { border: "1px solid var(--color-error)" }
                            : {}),
                    }}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="أدخل وصف تحسين محركات البحث"
                />
            </InputField>

            <InputField label="اختر الموضوع" error={tagError}>
                <select
                    name="tags"
                    style={{ ...inputBase, cursor: "pointer" }}
                    value={tag}
                    onChange={(e) => {
                        setTag(e.target.value);
                        setTagError("");
                    }}
                >
                    <option value="" disabled>
                        اختر موضوعًا
                    </option>
                    {TAGS.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </InputField>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 14,
                        color: "var(--color-ink)",
                        cursor: "pointer",
                    }}
                >
                    <input
                        name="sendEmail"
                        type="checkbox"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        style={{
                            width: 18,
                            height: 18,
                            accentColor: "var(--color-accent)",
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                    />
                    <span>
                        إرسال المقال عبر البريد الإلكتروني إلى جميع المشتركين
                    </span>
                </label>
            </div>
        </ModalFrame>
    );
}
