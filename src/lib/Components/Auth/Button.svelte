<script lang="ts">
    export let additionalClass = "";
    export let callback = () => {};
</script>

<button on:click={callback} class='{additionalClass} w-full p-2.5  hover:bg-white/90 duration-100 border font-medium text-black bg-white rounded-lg'>
    <slot></slot>
</button>