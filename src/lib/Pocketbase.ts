import Pocketbase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new Pocketbase('https://stitch-api.aidan-neel.com');
export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
    console.log('authStore.onChange', auth);
    currentUser.set(pb.authStore.model);
})