export const setLocalStorage = (key: string, value: any): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Error saving data:", error);
    }
  }
};

// Get data
export const getLocalStorage = (key: string): any => {
  if (typeof window !== "undefined") {
    try {
      const data = localStorage.getItem(key);

      if (!data) return null;

      return JSON.parse(data);
    } catch (error) {
      console.log("Error getting data:", error);
      return null;
    }
  }

  return null;
};

// Remove data
export const removeLocalStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.log("Error removing data:", error);
    }
  }
};