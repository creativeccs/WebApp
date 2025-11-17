// NOTE: This file should normally not be modified unless you are adding a new provider.
// To add new routes, edit the AppRouter.tsx file.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createHead, UnheadProvider } from '@unhead/react/client';
import { InferSeoMetaPlugin } from '@unhead/addons';
import { Suspense } from 'react';
import NostrProvider from '@/components/NostrProvider';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NostrLoginProvider } from '@nostrify/react/login';
import { AppProvider } from '@/components/AppProvider';
import { NWCProvider } from '@/contexts/NWCContext';
import { AppConfig } from '@/contexts/AppContext';
import { I18nProvider } from '@/components/I18nProvider';
import NavigationLayout from '@/components/NavigationLayout';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';

const head = createHead({
  plugins: [
    InferSeoMetaPlugin(),
  ],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: Infinity,
      retry: 1, // Retry only once on failure
    },
  },
});

const defaultConfig: AppConfig = {
  theme: "light",
};

// Parse backup relays from environment variable
const RelayUrls = (import.meta.env.VITE_RELAYS || "wss://nos.lol,wss://nostr-1.nbo.angani.co,wss://nostr-pub.wellorder.net,wss://relay.angor.io,wss://relay.damus.io,wss://relay.nostr.band,wss://relay.primal.net,wss://relay.snort.social")
  .split(',')
  .map((url: string) => url.trim());

// Build relay pool from backup relays
const presetRelays = RelayUrls.map((url: string) => {
  // Extract relay name from URL
  const hostname = url.replace('wss://', '').replace('ws://', '');
  const name = hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1);
  return { url, name };
});

export function App() {
  return (
    <UnheadProvider head={head}>
      <I18nProvider>
        <AppProvider storageKey="nostr:app-config" defaultConfig={defaultConfig} presetRelays={presetRelays}>
          <QueryClientProvider client={queryClient}>
            <NostrLoginProvider storageKey='nostr:login'>
              <NostrProvider>
                <NWCProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Suspense>
                      <BrowserRouter>
                        <NavigationLayout>
                          <AppRouter />
                        </NavigationLayout>
                      </BrowserRouter>
                    </Suspense>
                  </TooltipProvider>
                </NWCProvider>
              </NostrProvider>
            </NostrLoginProvider>
          </QueryClientProvider>
        </AppProvider>
      </I18nProvider>
    </UnheadProvider>
  );
}

export default App;
