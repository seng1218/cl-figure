"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import CMS_DEFAULTS from '@/lib/cms-defaults';

/** Deep merge stored CMS over defaults, preserving nested arrays in default structure */
function mergeWithDefaults(defaults, stored) {
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const def = defaults[key];
    const src = stored?.[key];
    if (src === undefined) continue;
    if (Array.isArray(def)) {
      result[key] = Array.isArray(src) ? src : def;
    } else if (def !== null && typeof def === 'object') {
      result[key] = { ...def, ...src };
      for (const subKey of Object.keys(def)) {
        if (Array.isArray(def[subKey]) && !Array.isArray(result[key][subKey])) {
          result[key][subKey] = def[subKey];
        }
      }
    } else {
      result[key] = src;
    }
  }
  // Carry over any extra keys from stored
  for (const key of Object.keys(stored || {})) {
    if (!(key in result)) result[key] = stored[key];
  }
  return result;
}

const CMSContext = createContext(CMS_DEFAULTS);

export function CMSProvider({ children }) {
  const [cms, setCms] = useState(CMS_DEFAULTS);

  useEffect(() => {
    const fetchCMS = () => {
      fetch('/api/cms/', { cache: 'no-store' })
        .then(r => r.json())
        .then(data => setCms(mergeWithDefaults(CMS_DEFAULTS, data)))
        .catch(() => {});
    };

    fetchCMS();
    const interval = setInterval(fetchCMS, 30000);
    return () => clearInterval(interval);
  }, []);

  return <CMSContext.Provider value={cms}>{children}</CMSContext.Provider>;
}

export const useCMS = () => useContext(CMSContext);
