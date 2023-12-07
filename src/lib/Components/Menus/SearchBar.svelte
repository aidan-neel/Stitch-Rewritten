<script lang="ts">
    import Icon from "@iconify/svelte";
</script>

<div class="border-l border-l-white/10 h-screen w-[17.5%] xl:flex hidden pl-8 items-start justify-center pt-6">
    <div class="w-full rounded-full bg-main p-3 border border-white/10 px-5 flex flex-row items-center justify-center gap-2">
        <Icon icon="iconamoon:search" class="h-4 w-4 text-white/60"></Icon>
        <input type="text" placeholder="Search" class="bg-transparent text-white/60 placeholder:text-white/40 outline-none border-none w-full" />
    </div>
</div>
