import "../App.css";
import { Navigate } from "react-router";

type RestrictedRouteProps = {
  loading?: boolean;
  isAuthenticated?: boolean;
  children: React.ReactNode;
};

export default function Restricted({
  loading,
  isAuthenticated,
  children,
}: RestrictedRouteProps) {
  if (loading) {
    return <div>Loading...</div>;
  } else if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
