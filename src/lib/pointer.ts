// true only for a real mouse or trackpad; phones fire emulated mouse events on tap that never "leave"
export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
