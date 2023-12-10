import { pb } from '$lib/Pocketbase.js';

export const load = async({ params }) => {
    try {
        const post_id = params.post_id
        pb.autoCancellation(false);
        const post_data = await pb.collection('posts').getOne(post_id, {
            'expand': 'user, likes'
        });
        pb.autoCancellation(true);
        console.log(post_data);
        return { post_id, post_data };
    } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle the error appropriately
        // For example, return an error state or a default state
        return { error: true }; 
    }
};
