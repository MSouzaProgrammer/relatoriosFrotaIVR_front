import { useState } from "react";
import {
  Truck,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
} from "lucide-react";

import api from "../services/api";

interface LoginResponse {
  token: string;
  name: string;
  access: string;
}

function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin() {
    try {
      setErro("");
      setCarregando(true);

      const resposta = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password: senha,
        }),
      });

      sessionStorage.setItem("token", resposta.token);

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setErro("E-mail ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  }

  function pressionouEnter(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      fazerLogin();
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B1120] flex items-center justify-center px-4">

      {/* GRID DE FUNDO */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.06]
          bg-[linear-gradient(to_right,#94A3B8_1px,transparent_1px),linear-gradient(to_bottom,#94A3B8_1px,transparent_1px)]
          bg-size-[40px_40px]
        "
      />

      {/* LUZ AZUL SUPERIOR */}
      <div
        className="
          absolute
          -top-40
          left-1/2
          -translate-x-1/2
          w-175
          h-100
          bg-blue-600/20
          rounded-full
          blur-[120px]
        "
      />

      {/* LUZ AZUL ESQUERDA */}
      <div
        className="
          absolute
          top-1/3
          -left-40
          w-100
          h-100
          bg-blue-500/10
          rounded-full
          blur-[100px]
        "
      />

      {/* LUZ AZUL DIREITA */}
      <div
        className="
          absolute
          bottom-0
          -right-40
          w-112.5
          h-112.5
          bg-blue-700/10
          rounded-full
          blur-[110px]
        "
      />

      {/* CÍRCULOS DECORATIVOS */}
      <div
        className="
          absolute
          top-24
          left-20
          w-20
          h-20
          border
          border-blue-400/10
          rounded-full
        "
      />

      <div
        className="
          absolute
          top-32
          left-28
          w-3
          h-3
          bg-blue-500/30
          rounded-full
        "
      />

      <div
        className="
          absolute
          bottom-24
          right-24
          w-24
          h-24
          border
          border-slate-400/10
          rounded-2xl
          rotate-12
        "
      />

      <div
        className="
          absolute
          bottom-32
          right-32
          w-2
          h-2
          bg-blue-400/30
          rounded-full
        "
      />

      {/* CONTEÚDO */}
      <div className="relative z-10 w-full max-w-107.5">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-7">

          <div className="relative">

            <div
              className="
                absolute
                inset-0
                bg-blue-600/30
                blur-xl
                rounded-2xl
              "
            />

            <div
              className="
                relative
                w-16
                h-16
                rounded-2xl
                bg-blue-600
                flex
                items-center
                justify-center
                shadow-2xl
                shadow-blue-900/40
                border
                border-blue-400/20
              "
            >
              <Truck
                size={32}
                strokeWidth={2.5}
                className="text-white"
              />
            </div>

          </div>

          <h1 className="text-[28px] font-bold text-white mt-5">
            Controle de Frota
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Gestão de despesas
          </p>

        </div>

        {/* CARD */}
        <div
          className="
            relative
            bg-[#F8FAFC]
            border
            border-white/10
            rounded-2xl
            shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            px-8
            py-9
          "
        >

          {/* BRILHO */}
          <div
            className="
              absolute
              inset-x-8
              -top-px
              h-px
              bg-linear-to-r
              from-transparent
              via-blue-400/50
              to-transparent
            "
          />

          {/* CABEÇALHO */}
          <div className="mb-7">

            <h2 className="text-[24px] font-bold text-slate-900">
              Bem-vindo de volta
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Entre com seus dados para acessar o sistema.
            </p>

          </div>

          {/* ERRO */}
          {erro && (
            <div
              className="
                mb-5
                px-3
                py-2.5
                rounded-lg
                bg-red-50
                border
                border-red-200
                text-red-600
                text-sm
              "
            >
              {erro}
            </div>
          )}

          {/* E-MAIL */}
          <div className="flex flex-col">

            <label
              className="
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              E-mail
            </label>

            <div className="relative">

              <Mail
                size={18}
                strokeWidth={2.2}
                className="
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={pressionouEnter}
                placeholder="seu@email.com"
                autoComplete="email"
                className="
                  w-full
                  h-12
                  pl-11
                  pr-3
                  bg-white
                  border
                  border-slate-300
                  rounded-xl
                  text-sm
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

            </div>

          </div>

          {/* SENHA */}
          <div className="flex flex-col mt-5">

            <label
              className="
                text-sm
                font-semibold
                text-slate-700
                mb-2
              "
            >
              Senha
            </label>

            <div className="relative">

              <LockKeyhole
                size={18}
                strokeWidth={2.2}
                className="
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                onKeyDown={pressionouEnter}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                className="
                  w-full
                  h-12
                  pl-11
                  pr-11
                  bg-white
                  border
                  border-slate-300
                  rounded-xl
                  text-sm
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="
                  absolute
                  right-3.5
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  hover:text-slate-600
                  cursor-pointer
                  transition
                "
              >
                {mostrarSenha ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* OPÇÕES */}
          <div className="flex items-center justify-between mt-4 gap-3">

            <label
              className="
                flex
                items-center
                gap-2
                text-sm
                text-slate-600
                cursor-pointer
              "
            >
              <input
                type="checkbox"
                className="
                  w-4
                  h-4
                  accent-blue-600
                  cursor-pointer
                "
              />

              <span>
                Lembrar de mim
              </span>

            </label>

            <button
              type="button"
              className="
                text-sm
                font-medium
                text-blue-600
                hover:text-blue-700
                cursor-pointer
                whitespace-nowrap
              "
            >
              Esqueci minha senha
            </button>

          </div>

          {/* BOTÃO */}
          <button
            type="button"
            onClick={fazerLogin}
            disabled={carregando}
            className="
              w-full
              h-12
              mt-7
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              active:bg-blue-800
              disabled:bg-blue-400
              disabled:cursor-not-allowed
              text-white
              text-sm
              font-semibold
              shadow-lg
              shadow-blue-600/20
              transition-all
              cursor-pointer
            "
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

        </div>

        {/* RODAPÉ */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Controle de Frota © 2026
        </p>

      </div>

    </div>
  );
}

export default Login;