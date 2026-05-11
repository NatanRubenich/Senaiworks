import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, HelpCircle, Edit3, Rocket, LogIn } from 'lucide-react';
import { useAuth } from '../../controllers/AuthContext';

const LoginPage = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    legalName: '',
    accountType: 'Pessoa Física',
  });
  const questions = [
    'Qual é o nome do meio do seu primo mais velho?',
    'Qual foi o primeiro concerto que você foi?',
    'Qual o nome da rua em que você cresceu?',
    'Qual foi o nome do seu primeiro animal de estimação?',
    'Qual o modelo do seu primeiro carro?',
    'Em que cidade seus pais se conheceram?',
  ];
  const [errorLogin, setErrorLogin] = useState('');
  const [errorReg, setErrorReg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const submitLogin = async (e) => {
    e.preventDefault();
    setErrorLogin('');
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorLogin(err.response?.data?.error || 'Falha ao entrar.');
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setErrorReg('');
    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorReg('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await register({
        email: registerForm.email,
        password: registerForm.password,
        securityQuestion: registerForm.securityQuestion,
        securityAnswer: registerForm.securityAnswer,
        legalName: registerForm.legalName,
        accountType: registerForm.accountType,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorReg(err.response?.data?.error || 'Falha ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 bg-surface z-40">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="font-headline text-2xl font-bold flex gap-1 tracking-tight items-center">
            <span className="text-primary-container">SENAI</span>
            <span className="text-slate-500">WORKS</span>
            <span className="text-secondary-container">Store</span>
          </Link>
          <Link
            to="/"
            className="text-primary-container font-bold border-b-2 border-secondary-container pb-1 hover:text-secondary-container transition-colors text-sm"
          >
            ← Voltar à loja
          </Link>
        </div>
      </header>

      <main className="min-h-screen pt-28 pb-12 flex items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch"
        >
          {/* Login */}
          <section className="md:col-span-5 flex flex-col">
            <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-sm h-full flex flex-col border border-outline-variant/10">
              <div className="mb-10">
                <span className="text-secondary-container font-headline font-bold text-sm tracking-widest uppercase mb-2 block">
                  Bem-vindo de volta
                </span>
                <h1 className="text-4xl font-headline font-bold text-primary-container tracking-tight">Entrar</h1>
              </div>
              <form onSubmit={submitLogin} className="space-y-6 flex-grow">
                <FormField
                  icon={<Mail size={18} />}
                  label="E-mail"
                  type="email"
                  value={loginForm.email}
                  onChange={(v) => setLoginForm({ ...loginForm, email: v })}
                  placeholder="seu@email.com"
                  ringColor="primary"
                />
                <FormField
                  icon={<Lock size={18} />}
                  label="Senha"
                  type="password"
                  value={loginForm.password}
                  onChange={(v) => setLoginForm({ ...loginForm, password: v })}
                  placeholder="••••••••"
                  ringColor="primary"
                />
                {errorLogin && (
                  <div className="text-error text-sm bg-error/10 px-4 py-3 rounded-lg">{errorLogin}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg flex items-center justify-center gap-2"
                >
                  {loading ? 'Entrando...' : 'Entrar na Conta'}
                  <LogIn size={18} />
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-outline-variant/10">
                <p className="text-xs text-on-surface-variant text-center">
                  Use suas credenciais SenaiWorks para acessar a loja.
                </p>
              </div>
            </div>
          </section>

          {/* Register */}
          <section className="md:col-span-7 relative">
            <div className="absolute -right-12 -top-12 -bottom-12 w-2/3 bg-surface-container-low rounded-xl z-0 hidden lg:block" />
            <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-sm border border-outline-variant/10 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                  <span className="text-primary-container font-headline font-bold text-sm tracking-widest uppercase mb-2 block">
                    Novo por aqui?
                  </span>
                  <h2 className="text-4xl font-headline font-bold text-on-surface tracking-tight">Criar Perfil</h2>
                </div>
                <div className="hidden md:block">
                  <Rocket size={48} className="text-secondary-container/20" />
                </div>
              </div>
              <form onSubmit={submitRegister} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div className="md:col-span-2">
                  <FormField
                    icon={<Mail size={18} />}
                    label="E-mail SENAI/SESI"
                    type="email"
                    value={registerForm.email}
                    onChange={(v) => setRegisterForm({ ...registerForm, email: v })}
                    placeholder="seu@edu.sc.senai.br"
                    ringColor="secondary"
                  />
                </div>
                <FormField
                  icon={<Lock size={18} />}
                  label="Senha"
                  type="password"
                  value={registerForm.password}
                  onChange={(v) => setRegisterForm({ ...registerForm, password: v })}
                  placeholder="••••••••"
                  ringColor="secondary"
                />
                <FormField
                  icon={<ShieldCheck size={18} />}
                  label="Confirmar Senha"
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(v) => setRegisterForm({ ...registerForm, confirmPassword: v })}
                  placeholder="••••••••"
                  ringColor="secondary"
                />
                <div className="md:col-span-2">
                  <FormField
                    icon={<Edit3 size={18} />}
                    label="Nome Completo"
                    type="text"
                    value={registerForm.legalName}
                    onChange={(v) => setRegisterForm({ ...registerForm, legalName: v })}
                    placeholder="Seu nome legal"
                    ringColor="secondary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Pergunta de Segurança</label>
                  <div className="relative group">
                    <HelpCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary-container" />
                    <select
                      required
                      value={registerForm.securityQuestion}
                      onChange={(e) => setRegisterForm({ ...registerForm, securityQuestion: e.target.value })}
                      className="w-full bg-surface-container-high border-none rounded-lg py-4 pl-12 pr-10 focus:ring-2 focus:ring-secondary-container focus:bg-surface-container-lowest transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Selecione uma opção
                      </option>
                      {questions.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <FormField
                  icon={<Edit3 size={18} />}
                  label="Resposta de Segurança"
                  type="text"
                  value={registerForm.securityAnswer}
                  onChange={(v) => setRegisterForm({ ...registerForm, securityAnswer: v })}
                  placeholder="Sua resposta secreta"
                  ringColor="secondary"
                />
                {errorReg && (
                  <div className="md:col-span-2 text-error text-sm bg-error/10 px-4 py-3 rounded-lg">{errorReg}</div>
                )}
                <div className="md:col-span-2 py-2">
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                    Ao clicar em "Finalizar Cadastro", você concorda com os termos da plataforma educacional SenaiWorks.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-surface-container-highest text-primary-container py-4 rounded-lg font-extrabold text-lg flex items-center justify-center gap-2 hover:bg-secondary-container hover:text-white transition-all active:scale-95"
                  >
                    {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                    <Rocket size={18} />
                  </button>
                </div>
              </form>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

const FormField = ({ icon, label, type, value, onChange, placeholder, ringColor }) => {
  const ring = ringColor === 'secondary' ? 'focus:ring-secondary-container' : 'focus:ring-primary-container';
  const groupColor = ringColor === 'secondary' ? 'group-focus-within:text-secondary-container' : 'group-focus-within:text-primary-container';
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-on-surface-variant ml-1">{label}</label>
      <div className="relative group">
        <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-colors ${groupColor}`}>
          {icon}
        </span>
        <input
          required
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-surface-container-high border-none rounded-lg py-4 pl-12 pr-4 ${ring} focus:ring-2 focus:bg-surface-container-lowest transition-all placeholder:text-outline/50 outline-none`}
        />
      </div>
    </div>
  );
};

export default LoginPage;
