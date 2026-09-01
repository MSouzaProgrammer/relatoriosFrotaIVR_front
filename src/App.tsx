import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {

  const [sidebarAberta, setSidebarAberta] = useState(false);

  return (
    <div>

      {/* Botão */}
      <button
        onClick={() => setSidebarAberta(!sidebarAberta)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-500 text-white"
      >
        {sidebarAberta ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      {sidebarAberta && <Sidebar />}

    </div>
  );
}

export default App;