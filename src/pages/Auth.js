import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // ← твой новый контекст

const API = process.env.REACT_APP_API_URL || "https://egooptika.ru";

const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // ВХОД
        await login(form.email, form.password); // ← вызывает реальный JWT-запрос
        setSuccess(true);
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        // РЕГИСТРАЦИЯ — как на твоём сайте (WP отправит письмо со ссылкой)
        const res = await fetch(`${API}/wp-json/wp/v2/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.email, // WP сам сделает username из email
            email: form.email,
            password: form.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              "Ошибка регистрации. Возможно, email уже занят."
          );
        }

        setSuccess(true);
        setTimeout(() => navigate("/"), 3000); // после регистрации редирект на главную
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero — без изменений */}
      <section className="section-padding bg-gradient-to-br from-[#c41c20] via-[#e31e24] to-[#e31e24]/80 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3)_2px,transparent_0)] bg-[length:60px_60px]"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white [text-shadow:0_4px_8px_rgba(0,0,0,0.3)]">
            {isLogin ? "Вход" : "Регистрация"}
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            {isLogin
              ? "Войдите в свой аккаунт"
              : "Создайте аккаунт в Эгооптике"}
          </p>
        </div>
      </section>

      {/* Форма */}
      <section className="section-padding bg-gradient-to-br from-white to-blue-50 py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>

            {/* Переключатель */}
            <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-2 mb-8 shadow-inner border border-gray-300/50">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 rounded-xl font-bold transition-all duration-300 relative overflow-hidden group ${
                  isLogin
                    ? "bg-gradient-to-r from-[#e31e24] to-[#c41c20] text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-800 bg-transparent"
                }`}
              >
                {isLogin && (
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-xl"></div>
                )}
                <span className="relative z-10">Войти</span>
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 rounded-xl font-bold transition-all duration-300 relative overflow-hidden group ${
                  !isLogin
                    ? "bg-gradient-to-r from-[#e31e24] to-[#c41c20] text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-800 bg-transparent"
                }`}
              >
                {!isLogin && (
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-xl"></div>
                )}
                <span className="relative z-10">Регистрация</span>
              </button>
            </div>

            {success ? (
              <div className="text-center py-12 animate-scale-in">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#e31e24] to-[#c41c20] rounded-full text-white mb-6 shadow-2xl"
                >
                  <Check size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#c41c20] mb-4">
                  {isLogin ? "Вы вошли!" : "Регистрация завершена!"}
                </h3>
                <p className="text-gray-600 mb-8">
                  {isLogin
                    ? "Перенаправляем в личный кабинет..."
                    : "На почту отправлена ссылка для подтверждения. Перенаправляем на главную..."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="text-red-600 text-center font-medium bg-red-50 p-3 rounded-xl">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#e31e24] focus:outline-none focus:ring-2 focus:ring-[#e31e24]/20 transition-all duration-300 bg-white/80"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Пароль *
                  </label>
                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#e31e24] focus:outline-none focus:ring-2 focus:ring-[#e31e24]/20 transition-all duration-300 bg-white/80"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 bg-gradient-to-r from-[#e31e24] to-[#c41c20] text-white font-bold rounded-xl transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 group-hover:to-white/30 rounded-xl transition-all duration-300"></div>
                  <span className="relative z-10">
                    {loading
                      ? "Загрузка..."
                      : isLogin
                      ? "Войти"
                      : "Зарегистрироваться"}
                  </span>
                </button>

                {isLogin && (
                  <div className="text-center mt-4">
                    <Link
                      to="/forgot-password" // если есть страница восстановления
                      className="text-[#e31e24] hover:underline text-sm"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                )}

                {!isLogin && (
                  <p className="text-sm text-gray-500 text-center mt-4">
                    Регистрируясь, вы соглашаетесь с{" "}
                    <Link to="/privacy" className="text-[#e31e24] hover:underline">
                      Политикой конфиденциальности
                    </Link>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Преимущества — оставил как было, но можно убрать при желании */}
      <section className="section-padding bg-gradient-to-br from-white to-blue-50 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#c41c20] mb-12">
            Преимущества регистрации
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* твои карточки */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;