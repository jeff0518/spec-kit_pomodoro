import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const { safeRead, safeWrite } = await import('../src/utils/localStorage');

describe('localStorage utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('safeWrite', () => {
    it('should write a valid object to localStorage', () => {
      const data = { a: 1, b: 'test' };
      const key = 'test-key';
      const result = safeWrite(key, data);
      expect(result).toBe(true);
      expect(localStorage.getItem(key)).toBe(JSON.stringify(data));
    });

    it('should return false if JSON.stringify fails', () => {
      const circularObj = { a: {} };
      circularObj.a = circularObj;
      const result = safeWrite('circular-key', circularObj);
      expect(result).toBe(false);
    });
  });

  describe('safeRead', () => {
    it('should read a valid object from localStorage', () => {
      const data = { a: 1, b: 'test' };
      const key = 'test-key';
      localStorage.setItem(key, JSON.stringify(data));
      
      const validator = (d: unknown): d is typeof data => {
        return typeof d === 'object' && d !== null && 'a' in d && 'b' in d;
      };

      const result = safeRead(key, validator);
      expect(result).toEqual(data);
    });

    it('should return null if key does not exist', () => {
      const validator = (d: unknown): d is unknown => true;
      const result = safeRead('non-existent-key', validator);
      expect(result).toBeNull();
    });
  });
});
