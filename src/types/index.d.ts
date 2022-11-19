/* eslint-disable no-var */
export const thisIsAModule = true; // <-- definitely in a module

declare global {
    var _io: any; // 👈️ disables type checking for property
}
  
export {};