"use client";

// Root fallback: replaces the whole layout when the root itself throws, so it
// must render its own <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#0b0b0c",
          color: "#ede7d6",
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "2rem",
          margin: 0,
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Something broke</h1>
        <p style={{ opacity: 0.6 }}>{error?.digest ? `Ref: ${error.digest}` : "A critical error occurred."}</p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            background: "#c8102e",
            color: "#fff",
            border: 0,
            padding: "0.5rem 1.25rem",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
