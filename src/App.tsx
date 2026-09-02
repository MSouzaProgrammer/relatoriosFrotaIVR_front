import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function App() {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1">
        <Header />

        <main>
          {/* conteúdo das páginas */}
        </main>
      </div>

    </div>
  );
}

export default App;