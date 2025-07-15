import { ref } from "vue";

export function useDevice() {
  const isMac = ref(false);
  const isWindows = ref(false);

  if (typeof navigator !== "undefined") {
    const platform = navigator.platform.toLowerCase();
    isMac.value = /mac/.test(platform);
    isWindows.value = /win/.test(platform);
  }

  return {
    isMac,
    isWindows,
  };
}
