import { useState, useEffect, useContext } from "react";
import { Eye, EyeOff, Bookmark } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import InputField from "./InputField";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

const BrandBadge = () => (
    <div
        style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "var(--color-accent-light)",
            color: "var(--accent-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
        }}
    >
        <Bookmark size={20} fill="var(--color-accent)" stroke="var(--color-accent)" />
    </div>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const linkBtnStyle = {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--color-ink)",
};

const iconBtnStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    color: "var(--color-mid)",
    transition: "color 0.15s",
};

const COPY = {
    login: {
        title: "أهلاً بعودتك",
        switchText: "أدخل بيانات الدخول أو",
        switchLink: "أنشئ حسابًا",
        submit: "تسجيل الدخول",
        genericError: "فشل تسجيل الدخول",
        autoComplete: "current-password",
        minLength: 6,
    },
    signup: {
        title: "إنشاء حساب جديد",
        switchText: "لديك حساب بالفعل؟",
        switchLink: "تسجيل الدخول",
        submit: "إنشاء الحساب",
        genericError: "فشل إنشاء الحساب",
        autoComplete: "new-password",
        minLength: 8,
    },
};

const AuthForm = ({ mode, onSwitchMode, onSubmit, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const { setUser } = useContext(UserContext);
    const copy = COPY[mode];

    const validate = () => {
        const e = {};
        if (!email.trim()) e.email = "البريد الإلكتروني مطلوب";
        else if (!EMAIL_RE.test(email)) e.email = "البريد الإلكتروني غير صالح";

        if (!password) e.password = "كلمة المرور مطلوبة";
        else if (mode === "signup" && password.length > 20) e.password = "الحد الأقصى 20 حرفًا";
        else if (password.length < 8)
            e.password = mode === "signup" ? "الحد الأدنى 8 أحرف" : "كلمة المرور قصيرة جداً";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;
        setLoading(true);
        const result = await onSubmit(mode, email.trim(), password, setUser);
        setLoading(false);
        if (!result.success) {
            setApiError(result.error || copy.genericError);
            return;
        }
        onClose?.();
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2
                style={{
                    fontSize: 19,
                    fontWeight: 700,
                    color: "var(--color-ink)",
                    textAlign: "center",
                    marginBottom: 8,
                }}
            >
                {copy.title}
            </h2>
            <p style={{ fontSize: 13, color: "var(--color-ink)", textAlign: "center", marginBottom: 24 }}>
                {copy.switchText}{" "}
                <button type="button" onClick={onSwitchMode} style={linkBtnStyle}>
                    {copy.switchLink}
                </button>
            </p>

            {apiError && (
                <p
                    role="alert"
                    style={{
                        margin: "0 0 16px",
                        padding: "8px 12px",
                        fontSize: 13,
                        color: "var(--color-white)",
                        background: "var(--color-error)",
                        borderRadius: "var(--border-radius)",
                        textAlign: "center",
                    }}
                >
                    {apiError}
                </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <InputField
                    name="email"
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((p) => ({ ...p, email: "" }));
                    }}
                    autoFocus
                    required
                    autoComplete="email"
                    error={errors.email}
                />
                <InputField
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((p) => ({ ...p, password: "" }));
                    }}
                    required
                    minLength={copy.minLength}
                    autoComplete={copy.autoComplete}
                    error={errors.password}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPass((s) => !s)}
                            style={iconBtnStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-mid)")}
                        >
                            {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    }
                />
            </div>

            <div style={{ marginTop: 16 }}>
                <Button loading={loading} style={{ width: "100%" }}>
                    {copy.submit}
                </Button>
            </div>

            {mode === "login" && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <button
                        type="button"
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 13,
                            color: "var(--color-light-txt)",
                        }}
                    >
                        نسيت كلمة المرور؟
                    </button>
                </div>
            )}
        </form>
    );
};

async function handleUser(mode, email, password, setUser) {
    try {
        const endpoint = mode === "login" ? "login" : "register";
        const res = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) return { success: false, error: data.error };
        setUser(data);
        return { success: true, user: data.user };
    } catch {
        return { success: false, error: "تعذر الاتصال بالخادم" };
    }
}

export default function AuthModal({ open, onClose, defaultMode = "login", onSubmit = handleUser }) {
    const [mode, setMode] = useState(defaultMode);

    useEffect(() => {
        if (open) setMode(defaultMode);
    }, [open, defaultMode]);

    return (
        <Modal open={open} onClose={onClose}>
            <BrandBadge />
            <AuthForm
                mode={mode}
                onSwitchMode={() => setMode(mode === "login" ? "signup" : "login")}
                onSubmit={onSubmit}
                onClose={onClose}
            />
        </Modal>
    );
}