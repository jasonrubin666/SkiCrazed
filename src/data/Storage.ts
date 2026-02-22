const STORAGE_PREFIX = 'skicrazed_';

export interface SaveData {
  currentSlope: number;
  slopePerformance: number[]; // percentage for each completed slope
  bestPerformance: number[];
}

export interface CustomSlope {
  name: string;
  obstacles: { type: string; x: number; y: number }[];
}

function getKey(key: string): string {
  return STORAGE_PREFIX + key;
}

export function saveProgress(data: SaveData): void {
  try {
    localStorage.setItem(getKey('progress'), JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function loadProgress(): SaveData | null {
  try {
    const raw = localStorage.getItem(getKey('progress'));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCustomSlopes(slopes: CustomSlope[]): void {
  try {
    localStorage.setItem(getKey('custom_slopes'), JSON.stringify(slopes));
  } catch {
    // silent fail
  }
}

export function loadCustomSlopes(): CustomSlope[] {
  try {
    const raw = localStorage.getItem(getKey('custom_slopes'));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function exportCustomSlopes(slopes: CustomSlope[]): string {
  return JSON.stringify(slopes, null, 2);
}

export function importCustomSlopes(json: string): CustomSlope[] | null {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}
