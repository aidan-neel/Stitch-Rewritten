import { writable } from "svelte/store";

export const minimizedNav = writable(false);
export const postCreation = writable(false);
export const postCreationContent = writable("");
export const darkMode = writable(true);