import { useEffect, useState } from "react";

import { loadAsync } from "expo-font";

export type FontSource = string | number;

export type UseFontsOptions = {
  map: string | { [fontFamily: string]: FontSource };
};

export type UseFontsReturn = {
  loaded: boolean;
  error: any | null;
};

/**
 * Load a map of custom fonts to use in textual elements.
 * The map keys are used as font names, and can be used with `fontFamily: <name>;`.
 * It returns a boolean describing if all fonts are loaded.
 *
 * Note, the fonts are not "reloaded" when you dynamically change the font map.
 *
 * @see https://docs.expo.io/versions/latest/sdk/font/
 * @example const [loaded, error] = useFonts(...);
 */
export function useFonts({ map }: UseFontsOptions): UseFontsReturn {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAsync(map)
      .then(() => setLoaded(true))
      .catch(setError);
  }, []);

  return { loaded, error };
}
