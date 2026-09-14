import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

import Dashboard from "./pages/Geral/Geral";
import Abastecimento from "./pages/Abastecimento/Abastecimento";
import Manutencao from "./pages/Manutencao/Manutencao";
import Relatorios from "./pages/Media/Media";
import Veiculos from "./pages/Veiculos/Veiculos"
import Configuracoes from "./pages/Configuracoes/Configuracoes";
import Motoristas from "./pages/Motoristas/Motoristas"
import Login from "./pages/Login";

function Layout() {
  return (
    <div className="min-h-screen w-full bg-[#F1F5F9]">
      <Sidebar />

      <div className="min-h-screen md:ml-48 lg:ml-52 xl:ml-60 2xl:ml-72">
        <Header />

        <main className="w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/abastecimentos" element={<Abastecimento />} />

            <Route path="/manutencao" element={<Manutencao />} />

            <Route path="/relatorio" element={<Relatorios />} />

            <Route path="veiculos" element={<Veiculos />} />

            <Route path="motoristas" element={<Motoristas />} />

            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route path="*" element={<Layout />} />
      </Route>
    </Routes>
  );
}

export default App;
