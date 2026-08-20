import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AtSign, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import SEO from "../components/SEO.jsx";
import Button from "../components/Button.jsx";
import { clearError, login } from "../redux/slices/authSlice.js";
import Logo from "../components/Logo.jsx";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { user, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [form, setForm] = useState({ identifier: "", password: "" });

  useEffect(() => {
    if (user) {
      navigate("/" + redirect.replace(/^\//, ""), { state: location.state });
    }
  }, [user, navigate, redirect, location.state]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const isEmail = (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(String(value).trim().toLowerCase());
  const normalizePhone = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
    return digits;
  };
  const isPhone = (value) => /^[6-9]\d{9}$/.test(normalizePhone(value));

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldError("");

    const identifier = form.identifier.trim();
    if (!identifier) {
      setFieldError("Enter your email or mobile number");
      return;
    }

    if (!isEmail(identifier) && !isPhone(identifier)) {
      setFieldError("Enter a valid email or 10-digit mobile number");
      return;
    }

    dispatch(
      login({
        identifier: isPhone(identifier) ? normalizePhone(identifier) : identifier.toLowerCase(),
        password: form.password,
      })
    );
  };

  return (
    <>
      <SEO title="Sign In - Arsh Mart" noindex />
      <div className="min-h-screen flex items-center lg:mt-10 justify-center px-4 pt-16">
        <div className="w-full max-w-md animate-slide-up">
          <div className="glass-card p-8">
            <div className="flex-1 flex justify-center mb-5">
              <Logo className="scale-110" />
            </div>

            <h1 className="text-xl font-display font-bold text-[#2a365b] text-center mb-1">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm text-center mb-8">
              Sign in with your email or phone number
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email or Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <AtSign className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    className={`input-field pl-10 ${fieldError ? "border-red-500/60" : ""}`}
                    placeholder="you@example.com or 9876543210"
                    value={form.identifier}
                    onChange={(e) => {
                      setFieldError("");
                      let value = e.target.value;
                      const digitsOnly = value.replace(/\D/g, "");
                      if (/^\d+$/.test(value.trim()) || (value.startsWith("+") && /^\+?\d*$/.test(value))) {
                        value = digitsOnly.slice(0, 10);
                      }
                      setForm((prev) => ({ ...prev, identifier: value }));
                    }}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
                {fieldError && <p className="text-red-400 text-xs mt-1.5">{fieldError}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary-400 hover:text-primary-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field pr-11"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:text-slate-900"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full text-white justify-center py-3.5 mt-2"
              >
                Sign In
              </Button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
