function safeRead<T>(key: string, validator: (data: unknown) => data is T): T | null {
  try {
    const jsonString = localStorage.getItem(key);
    if (!jsonString) {
      return null;
    }
    const data = JSON.parse(jsonString);
    return validator(data) ? data : null;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

function safeWrite(key: string, data: unknown): boolean {
  try {
    const jsonString = JSON.stringify(data);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
      console.error('LocalStorage quota exceeded.');
    }
    return false;
  }
}

export { safeRead, safeWrite };
