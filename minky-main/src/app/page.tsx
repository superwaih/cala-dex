import Navbar from "@/components/shared/Navbar";
import Presale from "@/components/shared/Presale";
import TokenBalance from "@/components/shared/token-balance";
import WalletConnect from "@/components/shared/WalletConnect";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex  min-h-screen p-4 flex-col items-center  justify-between">
      {/* <Navbar /> */}
    
        <Presale />
      
     
    </main>
  );
}
