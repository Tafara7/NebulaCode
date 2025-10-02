import React, { useEffect } from "react";

const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  let bg = "#222";
  if (toast.type === "success") bg = "#28a745";
  if (toast.type === "info") bg = "#007bff";
  if (toast.type === "error") bg = "#c00";

  return (
    <div
      style={{
        position: "fixed",
        top: 30,
        right: 30,
        background: bg,
        color: "#fff",
        padding: "1rem 2rem",
        borderRadius: 8,
        zIndex: 9999,
        fontWeight: "bold",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        minWidth: 180,
        textAlign: "center",
        fontSize: "1.1rem",
        opacity: 0.97,
      }}
    >
      {toast.message}
    </div>
  );
};

export default Toast;