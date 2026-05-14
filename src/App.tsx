import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthInit } from "./hooks/useAuth";
import { Home } from "./pages/Home";
import { Library } from "./pages/Library";
import { LessonView } from "./pages/LessonView";
import { Checkout } from "./pages/Checkout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UploadLesson } from "./pages/admin/UploadLesson";
import { ManageLessons } from "./pages/admin/ManageLessons";

function AppRoutes() {
  useAuthInit();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/lesson/:id" element={<LessonView />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-lessons" element={<Dashboard />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="upload" element={<UploadLesson />} />
        <Route path="lessons" element={<ManageLessons />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
