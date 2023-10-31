<script lang="ts">
    import { currentUser } from "$lib/Pocketbase";
    import { minimizedNav } from "$lib/stores";
    import NavButton from "./NavButton.svelte";

    const minimized = $minimizedNav;
</script>

<style>

</style>

<nav class="h-screen fadeIn {minimized ? 'w-24' : ''} z-20 bg-[#121213] w-[16%] border-r flex-col justify-between border-r-white border-opacity-[0.075] flex items-start p-5 fixed left-0 top-0">
    <section class="flex flex-col {minimized ? 'items-center justify-center' : 'items-start justify-start'} gap-2 w-full mt-3">
        {#if minimized !== true}
            <h1 class="fadeUp text-3xl font-bold mb-7 ml-3">
                Stitch
            </h1>
        {:else}
            <h1 class="fadeUp flex items-center justify-center w-7 h-7 text-3xl font-bold mb-7">
                S
            </h1>
        {/if}
        <NavButton href="/" minimized={minimized} icon="teenyicons:home-outline" alt_icon="teenyicons:home-solid" text="Home" />
        <NavButton href="/search" minimized={minimized}  icon="iconamoon:search" alt_icon="iconamoon:search-bold" text="Search" />
        <NavButton callbackActive={true} callback={() => {}} minimized={minimized}  icon="teenyicons:plus-circle-outline" alt_icon="" text="Create" />
        {#if $currentUser}
            <NavButton user={true} href="/" minimized={minimized}  icon="teenyicons:home-outline" alt_icon="teenyicons:home-solid" text="Home" />
        {/if}
    </section>
    <section class="w-full {minimized ? 'items-center justify-center flex' : ''}">
        <NavButton callbackActive={true} callback={() => {}} icon="iconamoon:menu-burger-horizontal" alt_icon="" text="Menu" />
    </section>
</nav>