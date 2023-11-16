<script lang="ts">
    export let additionalClass = "";
</script>

<p class="{additionalClass} text-black/60 dark:text-white/50 text-lg">
    <slot></slot>
</p>