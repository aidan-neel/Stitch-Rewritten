<script lang="ts">
    import Icon from "@iconify/svelte";

    export let user;
</script>

{#if user.verified === true && user.owner === false}
    <Icon icon="material-symbols:verified-rounded" class="text-blue-500 text-[1.2rem] ml-1"></Icon>
{:else if user.verified === true && user.owner === true}
    <Icon icon="material-symbols:verified-rounded" class="text-[1.2rem] ml-1 text-yellow-500"></Icon>
{/if}
