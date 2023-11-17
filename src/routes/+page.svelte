<script lang="ts">
    import Post from "$lib/Components/Home/Post.svelte";
    import PostInput from "$lib/Components/Home/PostInput.svelte";
    import Loading from "$lib/Components/Menus/Loading.svelte";
    import { currentUser, pb } from "$lib/Pocketbase";
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

    $: {
        console.log(posts);
    }
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

{#if loading === true && posts.length < 0}
    <Loading />
{/if}

<main class="flex items-center justify-center w-screen h-screen">
    <div class="flex flex-col h-full w-screen items-center justify-start">
        <div class="w-full overflow-y-auto fadeUp fadeUpFast gap-6 grid overflow-x-hidden hide-scrollbar items-center justify-center lg:pl-64 2xl:pl-0 pl-0">
            <PostInput user={$currentUser} />
            {#if posts.length > 0 && loading === false}
                {#each posts as post}
                    <Post PostData={post} />
                {/each}
            {/if}
        </div>
    </div>
</main>