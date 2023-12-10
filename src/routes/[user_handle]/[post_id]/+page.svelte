<script lang="ts">
    import Post from "$lib/Components/Home/Post.svelte";
    import Loading from "$lib/Components/Menus/Loading.svelte";
    import SearchBar from "$lib/Components/Menus/SearchBar.svelte";
    import Icon from "@iconify/svelte";

    export let data;

    const post_id = data.post_id;
    let post_data = data.post_data;
    let post_owner = post_data.expand?.user;

    console.log(post_data)
</script>

{#if !post_data}
    <Loading />
{/if}

<svelte:head>
    <title>{post_data ? `${post_owner.handle} on Stitch: ${post_data.content}` : 'Loading...'}</title>
</svelte:head>

<SearchBar />
<main class="h-screen">
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
    <article class="mt-6 fadeUp">
        <Post PostData={post_data} additionalClasses="pb-6 w-screen md:w-[92vw] lg:w-[58.5rem] xl:w-[47.5rem]" />
        <header class='w-full py-4 border-b border-white/10 pl-5 flex'>
            <h1 class="font-medium">
                Replies
            </h1>
            <span class="ml-2 text-white/50">
                {post_data.comments.length}
            </span>
        </header>
    </article>
</main>