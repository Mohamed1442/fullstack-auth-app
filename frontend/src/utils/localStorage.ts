import { ELOCALSTORAGEKEYS } from "@constants/keys";

export function getLocalStorageItem(key: ELOCALSTORAGEKEYS): string | null {
  try {
    const _item = localStorage.getItem(key);
    if (_item !== null) {
      try {
        const parsedItem = JSON.parse(_item);
        return parsedItem;
      } catch (parseError) {
        return _item;
      }
    }
    return null;
  } catch (storageError) {
    localStorage.removeItem(key);
    console.error(
      `Error accessing local storage for key '${key}':`,
      storageError
    );
    return null;
  }
}

export const setLocalStorage = (
  key: ELOCALSTORAGEKEYS,
  value: string | number | boolean | object
): void => {
  if (typeof window !== "undefined") {
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : value.toString();
    localStorage.setItem(key, stringValue);
  }
};

export const removeLocalStorage = (key: ELOCALSTORAGEKEYS): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
