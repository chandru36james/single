import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "staff" | "viewer")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();
  const [showRetry, setShowRetry] = React.useState(false);

  React.useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setTimeout(() => setShowRetry(true), 10000);
    } else {
      setShowRetry(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        {showRetry && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-neutral-500 text-sm mb-4">Taking longer than expected...</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
