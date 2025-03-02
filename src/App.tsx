import React, { useState } from 'react';
import { Search, Check, X, Loader2 } from 'lucide-react';
import { useWhitelistCheck, isValidEthereumAddress } from './checker';
import LoadingScreen from './components/LoadingScreen';
import TextRandomizer from './components/TextRandomizer';

function App() {
  const [address, setAddress] = useState<string>('');
  const [searchedAddress, setSearchedAddress] = useState<string>('');
  const { isWhitelisted, isLoading, error } = useWhitelistCheck(searchedAddress);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedAddress(address);
  };

  const getStatusMessage = () => {
    if (!searchedAddress) return null;
    if (error) return error;
    if (isWhitelisted) return '🥳 congrats prime, you are eligible';
    return '😞 Sorry Prime, you are Not on the list';
  };

  const isValidAddress = isValidEthereumAddress(address);

  if (!isLoaded) {
    return <LoadingScreen onComplete={() => setIsLoaded(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#072722] text-[#96fce4] flex flex-col items-center">
      <header className="w-full py-6 flex justify-center border-b border-[#96fce4]/20">
        <div className="container px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="https://i.ibb.co/DfmvNCnR/PrimeHL.png" 
              alt="PrimitiveHL Logo" 
              className="h-12 mr-3"
            />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              <TextRandomizer 
                originalText="PrimitiveHL" 
                duration={3000}
              />
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <a 
              href="https://x.com/PrimitiveHL" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[#96fce4] rounded-md hover:bg-[#96fce4]/10 transition-colors text-[#96fce4] font-medium flicker-text"
            >
              Follow
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex items-center justify-center">
        <div className="max-w-2xl w-full px-4 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#96fce4] flicker-text">Whitelist Checker</h2>
          </div>
          
          <div className="bg-[#072722] border border-[#96fce4]/30 rounded-lg p-8 shadow-lg">
            <div className="mb-6">
              <label htmlFor="address" className="block text-[#96fce4] mb-2 text-lg">
                Enter your HyperEvm address
              </label>
              <div className="relative">
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-[#072722] border border-[#96fce4] rounded-lg py-4 px-4 text-[#96fce4] focus:outline-none focus:ring-2 focus:ring-[#96fce4]/50 focus:border-transparent placeholder-[#96fce4]/40"
                />
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={!isValidAddress || (address === searchedAddress && isLoading)}
              className="w-full bg-[#96fce4] hover:bg-[#96fce4]/80 text-[#072722] font-bold py-4 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Check Eligibility
            </button>

            {searchedAddress && !isLoading && (
              <div className="mt-6 border border-[#96fce4]/20 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="text-sm opacity-80 break-all">{searchedAddress}</div>
                </div>
                
                {getStatusMessage() && (
                  <p className={`text-lg font-medium ${isWhitelisted ? 'text-[#96fce4]' : 'text-red-500'}`}>
                    {getStatusMessage()}
                  </p>
                )}
              </div>
            )}
            
            {searchedAddress && isLoading && (
              <div className="mt-6 border border-[#96fce4]/20 rounded-lg p-4">
                <div className="flex items-center text-[#96fce4]/80">
                  <Loader2 size={20} className="animate-spin mr-2" />
                  <span>Checking whitelist status...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full py-6 border-t border-[#96fce4]/20">
        <div className="container px-4 mx-auto text-center">
          <p className="text-sm text-[#96fce4]/60">
            © {new Date().getFullYear()} PrimitiveHL. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;