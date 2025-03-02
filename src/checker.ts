/**
 * Whitelist checker utility
 * Manages and verifies Ethereum addresses against the whitelist
 */

import { useEffect, useState } from 'react';

// Function to read addresses from eligible.txt and eligible2.txt
export const getEligibleAddresses = async (): Promise<string[]> => {
  try {
    // Initialize combined addresses array
    let allAddresses: string[] = [];
    
    // Try to fetch from eligible.txt
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/eligible.txt?t=${timestamp}`);
      
      if (response.ok) {
        const content = await response.text();
        console.log('Successfully loaded eligible.txt, content length:', content.length);
        
        const addresses = content
          .split('\n')
          .map(address => address.trim().toLowerCase())
          .filter(address => address.length > 0 && address.startsWith('0x'));
        
        allAddresses = [...allAddresses, ...addresses];
        console.log('Addresses from eligible.txt:', addresses.length);
      }
    } catch (e) {
      console.log('Failed to load from eligible.txt:', e);
    }
    
    // Try to fetch from eligible2.txt
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/eligible2.txt?t=${timestamp}`);
      
      if (response.ok) {
        const content = await response.text();
        console.log('Successfully loaded eligible2.txt, content length:', content.length);
        
        const addresses = content
          .split('\n')
          .map(address => address.trim().toLowerCase())
          .filter(address => address.length > 0 && address.startsWith('0x'));
        
        allAddresses = [...allAddresses, ...addresses];
        console.log('Addresses from eligible2.txt:', addresses.length);
      }
    } catch (e) {
      console.log('Failed to load from eligible2.txt:', e);
    }
    
    if (allAddresses.length === 0) {
      console.error('Failed to fetch eligible addresses from any file');
      throw new Error('Failed to fetch eligible addresses');
    }
    
    console.log('Total eligible addresses:', allAddresses.length);
    console.log('Sample addresses:', allAddresses.slice(0, 3));
    
    return allAddresses;
  } catch (error) {
    console.error('Error reading eligible addresses:', error);
    return [];
  }
};

// Hook to check if an address is whitelisted
export const useWhitelistCheck = (address: string) => {
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkWhitelist = async () => {
      try {
        if (!address) {
          setIsWhitelisted(null);
          setIsLoading(false);
          return;
        }
        
        setIsLoading(true);
        
        // Normalize the address
        const normalizedAddress = address.trim().toLowerCase();
        
        // Validate Ethereum address format
        if (!/^0x[a-f0-9]{40}$/i.test(normalizedAddress)) {
          setError('Invalid Ethereum address format');
          setIsWhitelisted(false);
          setIsLoading(false);
          return;
        }
        
        // Get the list of eligible addresses
        const eligibleAddresses = await getEligibleAddresses();
        console.log('Number of eligible addresses:', eligibleAddresses.length);
        
        // Add a small delay to simulate checking (better UX)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if the address is in the whitelist
        const isInWhitelist = eligibleAddresses.includes(normalizedAddress);
        console.log('Address check result for', normalizedAddress, ':', isInWhitelist);
        
        setIsWhitelisted(isInWhitelist);
        setError(null);
      } catch (err) {
        console.error('Error checking whitelist:', err);
        setError('Failed to check whitelist status');
        setIsWhitelisted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkWhitelist();
  }, [address]);

  return { isWhitelisted, isLoading, error };
};

// Validate Ethereum address format
export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-f0-9]{40}$/i.test(address.trim());
};