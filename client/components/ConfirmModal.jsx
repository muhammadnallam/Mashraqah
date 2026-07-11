const OVERLAY = "rgba(15,15,20,0.6)";

export default function ConfirmModal({
  icon: Icon,
  color,
  icoBackground,
  title,
  description,
  buttonText,
  onCancel,
  onConfirm,
  isOpen,
}) {
  if (!isOpen) return null;

  const baseButtonStyle = {
    padding: "8px 20px",
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
    borderRadius: "var(--border-radius)",
    minWidth: 110,
  };

  return (
      <div
          style={{
              position: "fixed",
              inset: 0,
              background: OVERLAY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
          }}
          onClick={onCancel}
      >
          <div
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
              style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--border-radius)",
                  padding: "32px 28px 24px",
                  width: 340,
                  maxWidth: "90vw",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
                  textAlign: "center",
              }}
          >
              {/* Icon circle */}
              <div
                  style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: icoBackground,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                  }}
              >
                  {Icon && <Icon size={26} color={color} strokeWidth={2.25} />}
              </div>

              {/* Title */}
              <h2
                  style={{
                      margin: "0 0 8px",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#1f2430",
                  }}
              >
                  {title}
              </h2>

              {/* Description */}
              <p
                  style={{
                      margin: "0 0 24px",
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#8a8f9a",
                      lineHeight: 1.6,
                  }}
              >
                  {description}
              </p>

              {/* Actions — deliberately kept LTR so Cancel stays left and the
            primary action stays right, matching the original layout. */}
              <div
                  dir="ltr"
                  style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "center",
                  }}
              >
                  <button
                      style={{
                          ...baseButtonStyle,
                          padding: "10px 18px",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "none",
                          background: "var(--color-bg)",
                          color: "var(--color-ink)",
                      }}
                      onClick={onCancel}
                  >
                      إلغاء
                  </button>
                  <button
                      type="button"
                      onClick={onConfirm}
                      style={{
                          ...baseButtonStyle,
                          background: color,
                          color: "#fff",
                      }}
                  >
                      {buttonText}
                  </button>
              </div>
          </div>
      </div>
  );
}
