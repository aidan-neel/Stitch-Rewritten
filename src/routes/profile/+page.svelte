<script lang="ts">
	import { goto } from "$app/navigation";
	import Loading from "$lib/Components/Menus/Loading.svelte";
	import { onMount } from "svelte";

    onMount(() => {
        goto('/profile/edit')
    })
</script>

<svelte:head>
    <title>Stitch &middot; Profile</title>
</svelte:head>

<Loading />