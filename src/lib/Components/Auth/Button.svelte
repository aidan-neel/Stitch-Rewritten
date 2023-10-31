<script lang="ts">
    export let additionalClass = "";
    export let callback = () => {};
</script>

<button class='{additionalClass} fadeUp w-full p-2.5 hover:border-white/80 hover:bg-white duration-100 border font-medium border-white  text-black bg-white/80 rounded-xl'>
    <slot></slot>
</button>