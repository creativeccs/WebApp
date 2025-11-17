import { createContext } from "react";

export type Theme = "dark" | "light" | "system";

export interface AppConfig {
  /** Current theme */
  theme: Theme;
  /** NOTE: No single relay URL is stored anymore. The app uses a relay pool (presetRelays) for all network operations. */
}

export interface AppContextType {
  /** Current application configuration */
  config: AppConfig;
  /** Update configuration using a callback that receives current config and returns new config */
  updateConfig: (updater: (currentConfig: AppConfig) => AppConfig) => void;
  /** Optional list of preset relays to display in the RelaySelector */
  presetRelays?: { name: string; url: string }[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
