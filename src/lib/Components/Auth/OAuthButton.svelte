<script lang="ts">
	import Icon from "@iconify/svelte";

    export let icon = "";
    export let callback = () => {};
    export let additionalClass = "";
</script>

<button class="{additionalClass} w-full fadeUp p-2.5 hover:bg-white/10 duration-50 h-12 rounded-2xl border border-white/20" on:click={callback}>
    <Icon icon={icon} class="h-full w-full" />  
</button>