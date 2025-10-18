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
      staleTime: 60000, // 1 minute
      gcTime: Infinity,
    },
  },
});

const defaultConfig: AppConfig = {
  theme: "light",
  relayUrl: "wss://relay.primal.net", // This is now just for UI display, actual connection uses relay pool
};

// Updated relay pool based on your specification
const presetRelays = [
  { url: 'wss://nostr-01.yakihonne.com', name: 'Yakihonne 1' },
  { url: 'wss://nostr-02.yakihonne.com', name: 'Yakihonne 2' },
  { url: 'wss://relay.damus.io', name: 'Damus' },
  { url: 'wss://relay.nostr.band', name: 'Nostr.Band' },
  { url: 'wss://relay.angor.io', name: 'Angor' },
  { url: 'wss://relay.primal.net', name: 'Primal' },
  { url: 'wss://nos.lol', name: 'nos.lol' },
];

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
