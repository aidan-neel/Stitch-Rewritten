<script lang="ts">
    import Post from "$lib/Components/Home/Post.svelte";
    import PostInput from "$lib/Components/Home/PostInput.svelte";
    import Loading from "$lib/Components/Menus/Loading.svelte";
    import { currentUser, pb } from "$lib/Pocketbase";
    import Icon from "@iconify/svelte";
    import { onDestroy, onMount } from "svelte";

    let posts = []
    let currentNumber = 1;
    let loading = true;

    let menu = true;

    async function fetchPosts() {
        loading = true;
        try {
            const records = await pb.collection('posts').getList(currentNumber, currentNumber + 15, {
                sort: '-created_at',
                expand: 'user'
            })

            const itemsToPush = [];
            for (let i = 0; i < records.items.length; i++) {
                itemsToPush.push(records.items[i])
            }

            itemsToPush.forEach((item) => {
                posts = [...posts, item]
            })
        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
        }
    }

    onMount(async() => {
        await fetchPosts();
        pb.collection('posts').subscribe('*', async ({action, record}) => {
            if (action === 'create') {
                posts = [record, ...posts]
             }
            if (action === 'delete') {
                posts = posts.filter((post) => {
                    return post.id !== record.id
                })
            }
        })
    })

    onDestroy(() => {
        posts = [];
        pb.collection('posts').unsubscribe('*');
    })

    $: doneLoading = posts.length > 0
</script>

<svelte:head>
    <title>
        Stitch
    </title>
</svelte:head>

<style>
    .posts-container {
        display: grid;
        justify-items: center; /* Centers children horizontally */
        align-items: start;    /* Aligns children to the top */
        max-height: 80vh;
        overflow-y: auto;
    }

    .hide-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>

{#if loading === true}
    <Loading />
{/if}

<div class="border-l border-l-white/10 h-screen w-[17.5%] pl-8 flex items-start justify-center pt-6">
    <div class="w-full rounded-full bg-main p-3 border border-white/10 px-5 flex flex-row items-center justify-center gap-2">
        <Icon icon="iconamoon:search" class="h-4 w-4 text-white/60"></Icon>
        <input type="text" placeholder="Search" class="bg-transparent text-white/60 placeholder:text-white/40 outline-none border-none w-full" />
    </div>
</div>

<div class="flex flex-col h-full items-center justify-start">
    <div class="w-full overflow-y-auto fadeUp fadeUpFast gap-6 grid overflow-x-hidden hide-scrollbar items-center justify-center">
        <PostInput user={$currentUser} />
        {#each posts as post}
            <Post PostData={post} additionalClasses="pb-6" />
        {/each}
    </div>
</div>