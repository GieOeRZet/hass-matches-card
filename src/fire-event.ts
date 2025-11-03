export const fireEvent = (node: HTMLElement, type: string, detail = {}, options = {}) => {
  const event = new Event(type, {
    bubbles: true,
    cancelable: false,
    composed: true,
    ...options
  });
  (event as any).detail = detail;
  node.dispatchEvent(event);
  return event;
};
