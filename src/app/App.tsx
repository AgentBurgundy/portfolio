import { Component, lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./layout/RootLayout";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";

const MmatxPage = lazy(() => import("../pages/MmatxPage"));

class PresentationBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) {
      return <main className="container-x py-20" role="alert">
        <h1 className="h-section">Let’s reopen the presentation.</h1>
        <p className="my-6 max-w-lg text-ink-muted">This tab may have an earlier version of the page. Reload to get the current notes.</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>Reload presentation</button>
      </main>;
    }
    return this.props.children;
  }
}

/** Old portfolio URLs that may still be linked from elsewhere. */
const legacyRedirects: Record<string, string> = {
  "/home": "/",
  "/about": "/#about",
  "/projects": "/#proof",
  "/services": "/#automate",
  "/experience": "/#about",
  "/contact": "/#contact",
  "/resume": "/#about",
  "/arcade": "/",
};

export default function App() {
  return (
    <Routes>
      <Route path="/mmatx" caseSensitive element={<PresentationBoundary><Suspense fallback={<div role="status" className="container-x py-20">Opening the Mountain Movers field notes…</div>}><MmatxPage /></Suspense></PresentationBoundary>} />
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        {Object.entries(legacyRedirects).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
