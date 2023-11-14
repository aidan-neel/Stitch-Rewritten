<script lang="ts">
	import Icon from "@iconify/svelte";

    export let icon = "";
    export let callback = () => {};
    export let additionalClass = "";
</script>

<button class="{additionalClass} w-full fadeUp dark:text-white text-black/80 fadeUpFast p-2.5 dark:hover:bg-white/10 duration-50 h-12 rounded-2xl border border-black/20 hover:bg-black/10 dark:border-white/20" on:click={callback}>
    <Icon icon={icon} class="h-full w-full" />  
</button>