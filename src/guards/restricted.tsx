import { Button } from "@/components/ui/button";
import "../App.css";

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
    //return <Navigate to="/" replace />;
    return (
      <div>
        <h1>Access Denied</h1>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go to Home
        </Button>
      </div>
    );
  }
  return children;
}
