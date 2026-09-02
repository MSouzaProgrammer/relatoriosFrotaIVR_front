function Header() {
  return (
    <header className="h-18 w-full bg-white">
       <div className="flex flex-col gap-4 max-w-72 w-full">
            <div className="flex items-center border pl-3 gap-2 bg-[#F1F5F9] border-[#F1F5F9] h-12 w-85 rounded-lg overflow-hidden ml-8 mt-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m15.75 15.75-3.262-3.262M14.25 8.25a6 6 0 1 1-12 0 6 6 0 0 1 12 0" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="text" placeholder="Buscar placas, motoristas ou filiais..." className="w-full h-full outline-none text-gray-500 placeholder-[#94A3B8] text-sm" />
            </div>
        
            <div className="py-3 bg-white border border-gray-500/30 rounded-md hidden">
                <h5 className="text-xs pb-2 text-gray-800/80 px-4">Search Result</h5>
                <p className="text-sm text-gray-500 py-1 hover:bg-gray-200/80 cursor-pointer px-4">India</p>
                <p className="text-sm text-gray-500 py-1 hover:bg-gray-200/80 cursor-pointer px-4">Indonesia</p>
                <p className="text-sm text-gray-500 py-1 hover:bg-gray-200/80 cursor-pointer px-4">Iran</p>
                <p className="text-sm text-gray-500 py-1 hover:bg-gray-200/80 cursor-pointer px-4">Israel</p>
            </div>
        </div>
        <div className="border-t border-slate-300 mt-3" />
    </header>

    
  );
}

export default Header;