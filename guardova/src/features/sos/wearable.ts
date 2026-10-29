// src/features/sos/wearable.ts — events coming from the wearable
// Today the only source is the demo simulator (Home wearable face, My Device
// "Simulate wearable button press"). The BLE layer will call `emitWearableEvent`
// with the same event when the real button is pressed, so the SOS flow does not
// care where a press came from.

export type WearableEvent = { type: 'sos-press'; at: number };

type Listener = (event: WearableEvent) => void;
const listeners = new Set<Listener>();

export function subscribeWearable(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitWearableEvent(event: WearableEvent) {
  listeners.forEach((listener) => listener(event));
}

/** Demo-only: behave exactly like a press of the wearable's SOS button. */
export function simulateWearablePress() {
  emitWearableEvent({ type: 'sos-press', at: Date.now() });
}
