import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGrabSnack } from "../context/GrabSnackContext";

function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const { login }      = useGrabSnack();
  const navigate       = useNavigate();

  useEffect(() => {
    const token    = searchParams.get("token");
    const email    = searchParams.get("email") || "";
    const fullName = searchParams.get("name")  || email.split("@")[0];
    const userId   = searchParams.get("userId");
    const id       = userId ? Number(userId) : undefined;

    if (token) {
      login({ id, token, email, fullName });
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#fff", fontSize: "1.2rem" }}>
      Signing you in...
    </div>
  );
}

export default OAuthSuccess;
