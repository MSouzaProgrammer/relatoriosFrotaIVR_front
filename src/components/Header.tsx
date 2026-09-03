import { MapPin, Search, Bell, ChevronDown } from "lucide-react";

function Header() {
  return (
    <header className="h-18 w-full bg-white">

        <div className="flex items-center justify-between px-8 pt-3">

            {/* Campo de busca */}
            <div className="flex items-center pl-3 gap-2 bg-[#F1F5F9] border-[#F1F5F9] h-11 w-90 rounded-lg overflow-hidden hover:bg-[#e5ebf0]">
                <Search size={18} color="#374151" strokeWidth={3} />

                <input
                    type="text"
                    placeholder="Buscar placas, motoristas ou filiais..."
                    className="w-full h-full outline-none text-gray-500 placeholder-[#94A3B8] text-sm" />
            </div>

            {/* Filiais */}
            <div className="flex items-center gap-8 mr-5">
                <div className="flex items-center gap-1 bg-blue-100 p-1.5 pl-2.5 pr-2.5 rounded-md hover:bg-blue-200 cursor-pointer">

                    <MapPin size={13} className="text-blue-500" strokeWidth={3}/>

                    <span className="text-xs text-blue-500 font-bold">
                    7 Filiais Ativas
                    </span>
                    <ChevronDown className=" text-blue-500" size={15} />
                </div>
                <div className="hover:bg-gray-100 p-1.5 rounded-2xl cursor-pointer">
                    <Bell className="text-gray-800 " strokeWidth={1.5}/>
                </div>
                
                <div className="flex gap-2 hover:bg-gray-100 cursor-pointer pt-1.5 p-1.5 rounded-md">
                    <div className="w-9 h-9 rounded-full bg-black mt-1">
                    </div>
                    <span>
                        <p className="font-bold text-gray-700">Mateus Souza</p>
                        <p className="text-xs text-gray-500">Administrador</p>
                        
                    </span>
                    <ChevronDown className="mt-4" size={15} />
                </div>
            </div>
            
        </div>

    <div className="border-t border-slate-300 mt-2" />

    </header>
  );
}

export default Header;