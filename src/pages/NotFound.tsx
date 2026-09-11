import { useNavigate } from "react-router";
import { Button } from "@/components/ui";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-blue-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>404</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">Page not found</h1>
        <p className="text-gray-500 mt-2 mb-6">The page you are looking for does not exist or has moved.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="secondary">← Go Back</Button>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
