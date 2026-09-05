import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Geral/Geral";
import Abastecimento from "./pages/Abastecimento/Abastecimento";
import Manutencao from "./pages/Manutencao/Manutencao";
import Relatorios from "./pages/Media/Media";
import Configuracoes from "./pages/Configuracoes/Configuracoes";

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/abastecimentos" element={<Abastecimento />} />
            <Route path="/manutencao" element={<Manutencao />} />
            <Route path="/relatorio" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
