import { getUser } from "$lib/api/auth"
import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth.store';

export const ssr = false;

export const load = async () => {
    if (get(auth.accessToken)) {
        try {
            const user = await getUser();
            auth.setUser(user);
        } catch {
            // supress errors
        }
    }
}