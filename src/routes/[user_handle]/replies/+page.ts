import { error } from '@sveltejs/kit';

export const load = async({ params }) => {
    try {
        const handle = params.user_handle.replace('@', '');
        console.log(handle)
        return { handle };
    } catch (err) {
        console.error("Error fetching user data:", err);
        // Handle the error appropriately
        // For example, return an error state or a default state
        throw error(erro);
        return { error: true };
    }
};
