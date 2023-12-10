<script lang="ts">
    import { page } from "$app/stores";
    import DummyPost from "$lib/Components/Home/DummyPost.svelte";
    import Icon from "@iconify/svelte";

    const error = $page.error;
</script>

<div class="border-l border-l-white/10 h-screen w-[28rem] xl:flex hidden px-8 items-start justify-center pt-6">
    <div class="w-full rounded-full bg-main p-3 border border-white/10 px-5 flex flex-row items-center justify-center gap-2">
        <Icon icon="iconamoon:search" class="h-4 w-4 text-white/60"></Icon>
        <input type="text" placeholder="Search" class="bg-transparent text-white/60 placeholder:text-white/40 outline-none border-none w-full" />
    </div>
</div>

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