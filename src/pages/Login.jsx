import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  User,
  MapPin,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { COUNTRIES } from '../constants';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register: registerUser, forgotPassword } = useApp();

  const [mode, setMode] = useState('login'); // login | register | forgot
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    reset();
  }, [mode, reset]);

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    setTimeout(() => {
      try {
        if (mode === 'login') {
          const result = login({
            email: data.email,
            password: data.password,
            rememberMe,
          });
          if (result.success) {
            toast.success(t('auth.loginSuccess'));
            navigate(from, { replace: true });
          } else {
            toast.error(result.error === 'invalid' ? t('auth.invalidCredentials') : t('auth.emailNotFound'));
          }
        } else if (mode === 'register') {
          const result = registerUser({
            name: data.name,
            email: data.email,
            password: data.password,
            country: data.country,
            phone: data.phone,
            location: data.location,
          });
          if (result.success) {
            toast.success(t('auth.registerSuccess'));
            navigate(from, { replace: true });
          } else {
            toast.error(t('auth.emailExists'));
          }
        } else {
          const result = forgotPassword({ email: data.email });
          if (result.success) {
            toast.success(t('auth.forgotSuccess'));
            setMode('login');
          } else {
            toast.error(t('auth.emailNotFound'));
          }
        }
      } catch {
        toast.error(t('common.error'));
      } finally {
        setLoading(false);
      }
    }, 900);
  });

  const inputClass = (err) =>
    `w-full px-4 py-3 pl-11 rounded-xl bg-white dark:bg-gray-800 border text-sm transition-all focus:outline-none focus:ring-2 ${
      err
        ? 'border-red-400 focus:ring-red-400'
        : 'border-gray-200 dark:border-gray-700 focus:border-transparent focus:ring-primary-500'
    }`;

  const switchMode = (next) => {
    setMode(next);
    setShowPassword(false);
    setShowConfirm(false);
  };

  const title =
    mode === 'login'
      ? t('auth.loginTitle')
      : mode === 'register'
      ? t('auth.registerTitle')
      : t('auth.forgotTitle');

  const subtitle =
    mode === 'login'
      ? t('auth.loginSubtitle')
      : mode === 'register'
      ? t('auth.registerSubtitle')
      : t('auth.forgotSubtitle');

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-300/30 dark:bg-primary-700/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-300/30 dark:bg-accent-700/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent-200/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/10 dark:shadow-black/40 border border-white/50 dark:border-gray-700/50 p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ rotate: 45, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4"
            >
              <Globe className="w-7 h-7 text-white" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent text-center">
              {title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">{subtitle}</p>
          </div>

          {/* Mode Tabs */}
          {mode !== 'forgot' && (
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mode === m
                      ? 'bg-white dark:bg-gray-700 shadow text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {m === 'login' ? t('auth.login') : t('auth.register')}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              {...fadeUp}
              transition={{ duration: 0.3 }}
              onSubmit={onSubmit}
              className="space-y-4"
              noValidate
            >
              {mode === 'register' && (
                <>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('auth.fullName')}
                      className={inputClass(errors.name)}
                      {...register('name', {
                        required: t('auth.required'),
                        minLength: { value: 2, message: t('auth.required') },
                      })}
                      aria-label={t('auth.fullName')}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 -mt-2">{errors.name.message}</p>
                  )}
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      className={`${inputClass(false)} appearance-none cursor-pointer`}
                      defaultValue=""
                      {...register('country', { required: t('auth.required') })}
                      aria-label={t('auth.country')}
                    >
                      <option value="" disabled>
                        {t('auth.country')}
                      </option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.country && (
                    <p className="text-xs text-red-500 -mt-2">{errors.country.message}</p>
                  )}
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder={t('auth.email')}
                  className={inputClass(errors.email)}
                  {...register('email', {
                    required: t('auth.required'),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('auth.invalidEmail'),
                    },
                  })}
                  aria-label={t('auth.email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 -mt-2">{errors.email.message}</p>
              )}

              {mode === 'register' && (
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder={t('auth.phone')}
                    className={inputClass(false)}
                    {...register('phone')}
                    aria-label={t('auth.phone')}
                  />
                </div>
              )}

              {mode !== 'forgot' && (
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.password')}
                    className={`${inputClass(errors.password)} pr-11`}
                    {...register('password', {
                      required: t('auth.required'),
                      minLength: { value: 6, message: t('auth.weakPassword') },
                    })}
                    aria-label={t('auth.password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}
              {mode !== 'forgot' && errors.password && (
                <p className="text-xs text-red-500 -mt-2">{errors.password.message}</p>
              )}

              {mode === 'register' && (
                <>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder={t('auth.confirmPassword')}
                      className={`${inputClass(errors.confirmPassword)} pr-11`}
                      {...register('confirmPassword', {
                        required: t('auth.required'),
                        validate: (v) => v === password || t('auth.passwordMismatch'),
                      })}
                      aria-label={t('auth.confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 -mt-2">{errors.confirmPassword.message}</p>
                  )}
                </>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                      {t('auth.rememberMe')}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-sm shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : mode === 'login' ? (
                  t('auth.login')
                ) : mode === 'register' ? (
                  t('auth.register')
                ) : (
                  t('auth.sendReset')
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Bottom links */}
          <div className="mt-6 text-center">
            {mode === 'forgot' ? (
              <button
                onClick={() => switchMode('login')}
                className="inline-flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('auth.backToLogin')}
              </button>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
                <button
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="text-primary-500 hover:text-primary-600 font-semibold"
                >
                  {mode === 'login' ? t('auth.register') : t('auth.login')}
                </button>
              </p>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-4 text-gray-400 text-xs">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Secure
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              24/7 Support
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Best Prices
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link to="/" className="hover:text-primary-500 transition-colors">
            &larr; {t('common.back')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
