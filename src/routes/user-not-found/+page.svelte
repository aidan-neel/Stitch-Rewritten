<script lang='ts'>
	import SearchBar from "$lib/Components/Menus/SearchBar.svelte";
	import { default_avatar } from "$lib/User";

    // Static dummy data
    const user_data = {
        username: "User Not Found",
        handle: "unknown",
        job_title: "No Job Title",
        bio: "No bio yet",
        followers: [],
        following: []
    };

    const url = default_avatar; // Placeholder image URL
    const banner = 'https://www.halftheskyasia.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbk1HIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--0725fc0328bc750a0fcc18a18ffde9bcca5b8dff/img-placeholder.jpg'; // Placeholder banner URL
    const user_posts = []; // Empty array for user posts

    // This function is no longer needed as we are using static data
    // async function fetchData() { /* ... */ }
</script>

<style>
    .pfp {
        height: 7.5rem;
        width: 7.5rem;
    }

    .hide-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>

<div class="fixed top-0">
    <!-- Static content can be added here if needed -->
</div>

<svelte:head>
    <title>
        Stitch &middot; {user_data.handle}
    </title>
</svelte:head>

<SearchBar />
<div class="flex fadeUp xl:w-[47.5rem] w-full overflow-x-hidden overflow-y-auto hide-scrollbar flex-col h-full items-center justify-start relative">
    <div class="border-b border-b-white/10 h-1/6 flex-shrink-0 flex items-center justify-center w-full relative">
        <img src={banner} alt="Profile Banner" class="w-full h-full object-cover">
    </div>
    <div class="w-full flex items-start justify-start mt-4 flex-col">
        <section class="flex flex-row items-start justify-between w-full">
            <section class="flex items-start justify-start flex-col pl-4 sm:pl-8">
                <img src={url} class="h-[8rem] w-[8rem] border-[5px] border-main rounded-full object-cover">
                <h1 class="font-bold text-2xl">
                    {user_data.username}
                </h1>
                <p class="text-white/50 text-left flex flex-col md:flex-row md:gap-1">
                    @{user_data.handle},
                    <span>{user_data.job_title}</span>
                </p>
                <p class="mt-1 w-2/3 whitespace-pre-wrap text-left break-words">
                    {user_data.bio}
                </p>

                <div class="flex flex-row items-center justify-center gap-4 text-white/50 mt-2">
                    <p>
                        <span class="text-white font-semibold">0</span> Followers
                    </p>
                    <p>
                        <span class="text-white font-semibold">0</span> Following
                    </p>
                </div>
            </section>
            <aside class="mr-6 mt-3">
                <!-- Static button content -->
                <button class="bg-white text-black border border-white/20 p-1.5 px-5 rounded-full font-medium hover:bg-opacity-[0.8] duration-50">
                    Follow
                </button>
            </aside>
        </section>

        <div class="w-full border-b border-b-white/10 mt-8 flex flex-row items-center justify-center">
            <button class="font-semibold text-white pb-4 border-b border-b-white w-full">
                Posts
            </button>
            <button class="text-white/50 pb-4 w-full">
                Replies
            </button>
            <button class="text-white/50 pb-4 w-full">
                Quotes
            </button>
        </div>
    </div>

    <div class="flex flex-col pt-4 gap-4 mb-16 md:mb-0">
        <!-- Static content for no posts -->
        <p class="mt-12 font-medium">
            This user has no posts.
        </p>
    </div>
</div>
