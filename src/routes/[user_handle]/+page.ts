
export const load = async({ params }) => {
    try {
        const handle = params.user_handle.replace('@', '');
        return { handle };
    } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle the error appropriately
        // For example, return an error state or a default state
        return { error: true };
    }
};
