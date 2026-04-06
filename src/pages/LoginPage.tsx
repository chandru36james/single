import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, googleProvider } from "../lib/firebase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [honeypot, setHoneypot] = useState(""); // Bot protection
  const [showAdvanced, setShowAdvanced] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  useEffect(() => {
    // Handle redirect result on mount
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Redirect Login Success:", result.user.email);
          toast.success("Google login successful!");
          navigate(from, { replace: true });
        }
      } catch (error: any) {
        console.error("Redirect Result Error:", error);
        if (error.code !== 'auth/web-storage-unsupported') {
          toast.error(`Redirect login failed: ${error.message}`);
        }
      }
    };
    handleRedirectResult();

    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent fail for bots

    if (lockoutTime > 0) {
      toast.error(`Too many attempts. Please wait ${lockoutTime} seconds.`);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login Error:", error);
      setAttempts((prev) => prev + 1);
      
      // Progressive delay / lockout
      if (attempts >= 4) {
        setLockoutTime(60); // 1 minute lockout
        toast.error("Too many failed attempts. Account locked for 60 seconds.");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      console.log("Initiating Google Login...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Login Success:", result.user.email);
      toast.success("Google login successful!");
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Google Login Error Details:", {
        code: error.code,
        message: error.message,
        customData: error.customData
      });
      
      if (error.code === 'auth/popup-blocked') {
        toast.error("Popup blocked. Please allow popups for this site or try a different browser.");
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error("Domain not authorized. Please ensure this URL is in your Firebase Console authorized domains.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Login cancelled. Please try again.");
      } else {
        toast.error(`Google login failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRedirectLogin = async () => {
    setLoading(true);
    try {
      console.log("Initiating Google Redirect Login...");
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("Google Redirect Login Error:", error);
      toast.error(`Redirect login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-outline-variant/10 p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Lock className="text-primary" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin Login</h1>
          <p className="text-neutral-500 mt-2">Secure access to The Obsidian Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Honeypot field - hidden from users */}
          <div className="hidden">
            <input 
              type="text" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
              tabIndex={-1} 
              autoComplete="off" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="admin@theobsidian.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {lockoutTime > 0 && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <ShieldAlert size={18} />
              <span>Locked for {lockoutTime}s due to multiple failures.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || lockoutTime > 0}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-bold hover:bg-neutral-50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="mt-6">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1 mx-auto transition-colors"
          >
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Advanced Login Options
          </button>
          
          {showAdvanced && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-neutral-100 space-y-3"
            >
              <p className="text-[10px] text-neutral-400 text-center mb-2 uppercase tracking-wider">
                If popups are blocked, use redirect:
              </p>
              <button
                onClick={handleGoogleRedirectLogin}
                disabled={loading}
                className="w-full py-2 text-xs bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-all flex items-center justify-center gap-2"
              >
                Sign in with Google (Redirect)
              </button>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-4">
                <p className="text-[10px] text-amber-800 leading-relaxed">
                  <strong>Troubleshooting:</strong><br />
                  1. Ensure <strong>Google</strong> is enabled in Firebase Console.<br />
                  2. Add this domain to <strong>Authorized Domains</strong>.<br />
                  3. If popups fail, use the <strong>Redirect</strong> button above.<br />
                  4. Check if <strong>Third-party cookies</strong> are blocked.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-neutral-400 mt-8">
          Authorized personnel only. All access attempts are logged.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
