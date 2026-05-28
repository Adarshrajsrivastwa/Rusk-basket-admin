import orderSound from "../assets/OrderRing.mp3";

let audioInstance = null;
let lastPlayedAt = 0;
const PLAY_COOLDOWN_MS = 8000;

export function isVendorNewOrderSoundPlaying() {
  return Boolean(audioInstance && !audioInstance.paused);
}

export function stopVendorNewOrderSound() {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance.currentTime = 0;
    audioInstance = null;
  }
}

export function playVendorNewOrderSound() {
  const now = Date.now();
  if (now - lastPlayedAt < PLAY_COOLDOWN_MS) return;
  lastPlayedAt = now;

  stopVendorNewOrderSound();
  const audio = new Audio(orderSound);
  audio.loop = true;
  audioInstance = audio;
  audio.play().catch(() => {});
}

export const VENDOR_NEW_ORDER_NOTIFICATION_TYPE = "order_created";
