<script lang='ts'>
	import Loading from '$lib/Components/Menus/Loading.svelte';
	import Button from '$lib/Components/Profile/Button.svelte';
	import VerifiedCheckmark from '$lib/Components/Tooltips/VerifiedCheckmark.svelte';
	import { currentUser, pb } from '$lib/Pocketbase';
	import { postCreation, postCreationContent } from '$lib/Stores.js';
	import { onMount } from 'svelte';

    export let data;

    let url;
    let loading;
    let user_data = null;
    $: user_handle = data.handle; // Assuming 'handle' is the route parameter
    $: currentUserOwnsProfile = user_data && $currentUser?.id === user_data.id;

    async function fetchData() {
        if(user_handle) {
            try {
                loading = true;
                const user = await pb.collection('users').getList(1, 3, {
                    filter: `handle = "${user_handle}"`
                });

                const data = user.items[0];
                const record = data.avatar;

                user_data = data;

                url = pb.files.getUrl(data, record, {'thumb': '32x32'});
                if(url === '') {
                    url = 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user_handle;
                }
            } catch (error) {
                console.error(error);
            } finally {
                loading = false;
            }
        }
    }

    async function mentionUser() {
        if (loading === false && user_data !== null && currentUserOwnsProfile === false) {
            console.log(user_data.handle);
            postCreationContent.set(`@${user_data.handle} `);
            console.log($postCreationContent);
            postCreation.set(true);
        }
    }

    $: if (user_handle) {
        loading = true;
        fetchData();
        loading = false;
    }

    onMount(() => {
        fetchData();
    })
</script>

<style>
    .pfp {
        height: 7.5rem;
        width: 7.5rem;
    }
</style>

{#if loading === false && user_data !== null}
    <main class="flex items-start flex-row z-20 justify-center pt-12 w-screen h-screen">
        <div class="w-[47.5rem] flex flex-col fadeUp border-b border-b-white/10 pb-7 ">
            <div class="flex flex-row items-start justify-between">
                <div class="flex flex-col items-start justify-start mt-5">
                    <h1 class='text-2xl font-bold flex flex-row fadeUp items-center justify-center'>
                        {user_data.username} <VerifiedCheckmark user={user_data} />
                    </h1>
                    <p class="text-white/60 fadeUp font-mono">
                        @{user_data.handle}
                    </p>
                    <p class="mt-4 fadeUp">
                        {user_data.bio}
                    </p>
                    <div class="flex flex-row mt-4 fadeUp gap-4 text-white/60 font-mono ">
                        <p>
                            {user_data.followers?.length !== undefined ? user_data.followers.length : 0} followers
                        </p>
                        <p>
                            {user_data.followers?.length !== undefined ? user_data.followers.length : 0} following
                        </p>
                    </div>
                </div>
                <img src={url} class="pfp object-cover fadeUp rounded-full mt-6">
            </div>
            {#if currentUserOwnsProfile}
                <Button type="secondary" additionalClass="mt-5 fadeUp">
                    Edit Profile
                </Button>
            {:else}
                <div class="w-full gap-4 flex items-start justify-center flex-row">
                    <Button type="primary" additionalClass="mt-5 fadeUp">
                        Follow
                    </Button>
                    <Button callback={mentionUser} type="secondary" additionalClass="mt-5 fadeUp">
                        Mention
                    </Button>
                </div>
            {/if}
        </div>
    </main>
{:else}
    <Loading />
{/if}