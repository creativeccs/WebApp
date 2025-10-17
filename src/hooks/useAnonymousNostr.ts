import { useEffect, useState } from 'react';
import { generateSecretKey, getPublicKey } from 'nostr-tools';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

interface AnonymousAccount {
  publicKey: string;
  secretKey: string;
}

const STORAGE_KEY = 'anonymous_nostr_account';

/**
 * Hook to manage anonymous Nostr accounts for contact form submissions.
 * Creates and persists a throwaway account in localStorage for users to send encrypted messages.
 */
export function useAnonymousNostr() {
  const [account, setAccount] = useState<AnonymousAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load existing account from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AnonymousAccount;
        setAccount(parsed);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Failed to parse stored anonymous account:', error);
        // Continue to create new account
      }
    }

    // Create new anonymous account
    const secretKey = generateSecretKey();
    const publicKey = getPublicKey(secretKey);
    
    const newAccount: AnonymousAccount = {
      publicKey,
      secretKey: bytesToHex(secretKey),
    };

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAccount));
    setAccount(newAccount);
    setIsLoading(false);
  }, []);

  return {
    account,
    isLoading,
    publicKey: account?.publicKey,
    secretKey: account?.secretKey ? hexToBytes(account.secretKey) : null,
  };
}
