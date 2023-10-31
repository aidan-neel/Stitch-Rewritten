import Pocketbase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new Pocketbase('http://23.92.30.86:80');
export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
    console.log('authStore.onChange', auth);
    currentUser.set(pb.authStore.model);
})