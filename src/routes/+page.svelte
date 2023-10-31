<script lang="ts">
    import PostInput from "$lib/Components/Home/PostInput.svelte";
    import { currentUser } from "$lib/Pocketbase";
    import { onMount } from "svelte";

    onMount(() => {
        console.log($currentUser)
    })
</script>

<svelte:head>
    <title>
        Stitch | Home
    </title>
</svelte:head>

<main class="flex items-start justify-center w-screen h-screen">
    <PostInput user={$currentUser} />
</main>