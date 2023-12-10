<script lang="ts">
    import { page } from "$app/stores";
    import Icon from "@iconify/svelte";

    const error = $page.error;
    console.log(error);
</script>

<div class="border-l border-l-white/10 h-screen w-[28rem] xl:flex hidden px-8 items-start justify-center pt-6">
    <div class="w-full rounded-full bg-main p-3 border border-white/10 px-5 flex flex-row items-center justify-center gap-2">
        <Icon icon="iconamoon:search" class="h-4 w-4 text-white/60"></Icon>
        <input type="text" placeholder="Search" class="bg-transparent text-white/60 placeholder:text-white/40 outline-none border-none w-full" />
    </div>
</div>

<div class="flex flex-col gap-2 items-center justify-center w-screen md:w-[92vw] lg:w-[58.5rem] xl:w-[47.5rem] h-screen pb-24">
    <h1 class="text-3xl font-bold">
        Error
    </h1>
    <p class="text-white text-lg">
        {error.message}
    </p>
</div>