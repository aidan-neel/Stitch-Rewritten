<script lang="ts">
    import DummyPost from "$lib/Components/Home/DummyPost.svelte";
    import Post from "$lib/Components/Home/Post.svelte";
    import LoadingPost from "$lib/Components/Loaders/LoadingPost.svelte";
    import Loading from "$lib/Components/Menus/Loading.svelte";
    import SearchBar from "$lib/Components/Menus/SearchBar.svelte";
    import { pb } from "$lib/Pocketbase.js";
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";

    export let data;

    let post_data;
    let post_owner;
    let post_comments;
    let loading = false;
    let nopost = false;

    $: if (post_data !== undefined || null) {
        loading = true;
        fetchData();
        loading = false;
    }
    
    async function fetchData() {
        loading = true;
        try {
            post_data = await pb.collection('posts').getOne(data.post_id, {
                'expand': 'user, comments, comments.user, original_post, original_post.user'
            });
        } catch (error) {
            console.error(error);
            nopost = true;
        }
        loading = false;
        post_owner = post_data.expand?.user;
        post_comments = post_data.expand?.comments;
    }

    onMount(async() => {
        fetchData();
    })

    // const post_owner = post_data.expand?.user;
    // const post_comments = post_data.expand?.comments;

   if(post_comments !== undefined || null) {
        post_comments.forEach((comment) => {
            comment.user = comment.expand?.user;
        });
   }


    let isLoading = true;
    onMount(() => {
        if(data) {
            setTimeout(() => {
                isLoading = false;
            }, 200);
        }
    })


    let content = '';
</script>

<svelte:head>
    <title>{post_data ? `${post_owner?.handle} on Stitch: ${post_data.content}` : 'Loading...'}</title>
</svelte:head>

<style>
    .replies-container {
        max-height: 58.5rem; /* Adjust this value based on your layout */
        overflow-y: auto; /* Enables vertical scrolling */
        overflow-x: hidden;
    }

    
    .hide-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>

{#if loading}
    <Loading />
{/if}

<SearchBar />
{#if !loading && !nopost && post_data !== undefined || null}
    <main class="h-screen relative">
        <header class="flex flex-row fadeUp justify-start gap-4 pb-6 pt-6 border-b border-b-white/10">
            <button on:click={() => {
                window.history.back();
            }} class="rounded-full h-10 w-10 bg-white bg-opacity-[0.03] hover:bg-opacity-[0.06] duration-100 flex items-center justify-center ml-4">
                <Icon icon="akar-icons:arrow-left" class="w-5 h-5 text-white/50" />
            </button>
            <div class="flex flex-col items-start text-left">
                <h1 class="font-semibold">
                    {post_owner.username}
                </h1>
                <p class="text-white/60">
                    @{post_owner.handle}
                </p>
            </div>
        </header>
        <article class="pt-6 fadeUp">
            <!-- Create new "PagePost" component that looks different and more special -->
            {#if isLoading === true}
                {#each [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] as nm}
                <LoadingPost />
                {/each}
            {:else}
                {#if post_data.content_type === 'post'}
                    <Post isPagePost={true} PostData={post_data} additionalClasses="pb-6 w-screen md:w-[90vw] lg:w-[38.5rem] xl:w-[47.5rem]" />
                {:else if post_data.content_type === 'comment'}
                    <Post isPagePost={false} postIsReply={true} originalPostData={post_data.original_post} PostData={post_data} additionalClasses="pb-5 w-screen md:w-[90vw] lg:w-[38.5rem] xl:w-[47.5rem]" />
                {/if}
            {/if}
            
            <header class='w-full py-4 border-b border-white/10 pl-5 flex'>
                <h1 class="font-medium">
                    Replies
                </h1>
                <span class="ml-2 text-white/50">
                    {post_data.comments.length}
                </span>
            </header> 
            <div class="mt-6 gap-6 flex hide-scrollbar flex-col overflow-y-auto replies-container">
                {#if post_comments !== undefined || null}
                    {#each post_comments as comment}
                        <Post PostData={comment} additionalClasses="pb-6 w-screen md:w-[90vw] lg:w-[38.5rem] xl:w-[47.5rem]" />
                    {/each}
                {:else}
                    <h1 class="font-medium">
                        No replies yet.
                    </h1>
                {/if}
            </div>         
        </article>
    </main>
{:else if nopost && !loading}
    <div class="flex flex-col gap-2 items-center justify-start w-screen md:w-[92vw] lg:w-[58.5rem] xl:w-[47.5rem] h-screen pb-24">
        <header class="flex flex-row fadeUp w-full justify-start gap-4 pb-6 pt-6 border-b border-b-white/10">
            <button on:click={() => {
                window.history.back();
            }} class="rounded-full h-10 w-10 bg-white bg-opacity-[0.03] hover:bg-opacity-[0.06] duration-100 flex items-center justify-center ml-4">
                <Icon icon="akar-icons:arrow-left" class="w-5 h-5 text-white/50" />
            </button>
            <div class="flex flex-col items-start text-left">
                <h1 class="font-semibold">
                    User not found
                </h1>
                <p class="text-white/60">
                    @unknown
                </p>
            </div>
        </header>
        <article class="fadeUp mt-6">
            <DummyPost additionalClasses="pb-6 w-screen md:w-[92vw] lg:w-[58.5rem] xl:w-[47.5rem]" />
        </article>
    </div>
{/if}