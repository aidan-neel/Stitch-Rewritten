<script lang="ts">
    export let additionalClass = "";
</script>

<p class="{additionalClass} fadeUp fadeUpFast text-black/60 dark:text-white/50 text-lg font-medium">
    <slot></slot>
</p>