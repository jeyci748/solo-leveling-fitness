import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

// La app guarda todo en el teléfono (localStorage), así que solo se carga en el navegador.
const FitProApp = lazy(() => import("@/fitpro/App"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FitPro ARISE · Entrena como un cazador" },
      { name: "description", content: "Rutinas, misiones diarias, rachas y registro de peso ideal al estilo Solo Leveling, para hombre y mujer." },
      { property: "og:title", content: "FitPro ARISE · Entrena como un cazador" },
      { property: "og:description", content: "Rutinas, misiones diarias, rachas y registro de peso ideal al estilo Solo Leveling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Loading() {
  return (
    <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#1b1e24", color: "#f5c89e", fontFamily: "'Chakra Petch', sans-serif", letterSpacing: ".3em" }}>
      [ SISTEMA CARGANDO ]
    </div>
  );
}

function Index() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <div id="root" style={{ height: "100dvh" }}>
      {ready ? (
        <Suspense fallback={<Loading />}>
          <FitProApp />
        </Suspense>
      ) : (
        <Loading />
      )}
    </div>
  );
}
