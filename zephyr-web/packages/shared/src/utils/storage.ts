/** localStorage 封装 */
export const storage = {
  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue ?? null);
    } catch {
      return defaultValue ?? null;
    }
  },
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string): void {
    localStorage.removeItem(key);
  },
  clear(): void {
    localStorage.clear();
  },
};

/** sessionStorage 封装 */
export const sessionStorage = {
  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue ?? null);
    } catch {
      return defaultValue ?? null;
    }
  },
  set(key: string, value: any): void {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string): void {
    window.sessionStorage.removeItem(key);
  },
  clear(): void {
    window.sessionStorage.clear();
  },
};
