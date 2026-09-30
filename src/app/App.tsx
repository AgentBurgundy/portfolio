import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./layout/RootLayout";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";

/** Old portfolio URLs that may still be linked from elsewhere. */
const legacyRedirects: Record<string, string> = {
  "/home": "/",
  "/about": "/#about",
  "/projects": "/#proof",
  "/experience": "/#about",
  "/contact": "/#contact",
  "/resume": "/#about",
  "/arcade": "/",
};

export default function App() {
  return (
    <Routes>
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
