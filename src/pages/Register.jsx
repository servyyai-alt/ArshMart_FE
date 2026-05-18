import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Package } from "lucide-react";
import SEO from "../components/SEO.jsx";
import Button from "../components/Button.jsx";
import { register, clearError } from "../redux/slices/authSlice.js";
import toast from "react-hot-toast";
import SandhaiKart_logo from "../assets/images/SandhaiKart_logo.jpeg";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    dispatch(
      register({ name: form.name, email: form.email, password: form.password }),
    );
  };

  return (
    <>
      <SEO title="Create Account – Sandhaikart" noindex />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="glass-card p-8">
            <div className="flex-1 flex justify-center">
              <Link to="/" className="rounded-full flex justify-center mb-5">
                <img
                  src={SandhaiKart_logo}
                  alt="Sandhaikart Logo"
                  className="w-[40%] md:w-[15%] lg:w-[30%] mt-1 object-contain rounded-full"
                />
              </Link>
            </div>

            <h1 className="text-xl font-display font-bold text-white text-center mb-1">
              Create account
            </h1>
            <p className="text-slate-500 text-sm text-center mb-8">
              Join Sandhaikart today
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field pr-11"
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full justify-center py-3.5 mt-2"
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
