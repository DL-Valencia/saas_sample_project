import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, reset } from '../store/slices/authSlice';
import { LayoutDashboard, Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user) {
      const origin = location.state?.from?.pathname || '/';
      navigate(origin);
    }

    if (isError) {
      // Handle error (e.g., toast)
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full space-y-8 card p-8 border-slate-700/50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600/10 mb-6 border border-primary-500/20">
            <LayoutDashboard className="text-primary-500" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">Please sign in to your dashboard</p>
        </div>

        {isError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={onChange}
                  className="bg-slate-800 border-slate-700 text-white w-full rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChange}
                  className="bg-slate-800 border-slate-700 text-white w-full rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-3 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-primary-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            Sign In
          </button>
        </form>

        <div className="text-center text-sm text-slate-500 pt-4">
          <p>Demo accounts: admin@example.com / user@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
