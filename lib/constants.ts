/**
 * Single source of truth for static asset paths.
 * DO NOT use "/icon" — Next serves the app icon at /icon.svg only.
 * If you add new icon/favicon references, use APP_ICON_PATH so we never 404.
 */
export const APP_ICON_PATH = "/icon.svg";
export const MANIFEST_PATH = "/manifest.json";
