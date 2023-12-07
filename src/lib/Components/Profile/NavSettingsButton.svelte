<script lang="ts">
    import { page } from "$app/stores";
    export let href: string;

    $: pageName = $page.url.pathname;
</script>

<a href={href} class="font-medium p-2 px-4 rounded-lg {pageName === href ? 'bg-white bg-opacity-[0.08] hover:bg-white hover:bg-opacity-[0.15]' : 'hover:underline'}">
    <slot />
</a>