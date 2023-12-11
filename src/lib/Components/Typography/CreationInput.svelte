<script lang="ts">
	import { onMount } from "svelte";

    export let content;
    export let value;
    export let small = false;
    export let additionalClasses = '';

    let div: HTMLDivElement;

    const update = () => {
        const html = div.textContent.replace(/@(\w+)/g, '<span class="text-sky-600">@$1</span>');
        div.innerHTML = html;

        // Call setCursorToEnd after updating innerHTML
        setCursorToEnd(div);
    };

    function setCursorToEnd(element: HTMLElement) {
        const range = document.createRange();
        const selection = window.getSelection();

        range.selectNodeContents(element);
        range.collapse(false); // Collapse to end

        selection.removeAllRanges();
        selection.addRange(range);
    }

    function handleInput() {
        update();
    }

    onMount(() => {
        update();
    }); 
</script>

<div on:click|stopPropagation bind:this={div} bind:innerText={value} on:input={handleInput} contenteditable="true" class="whitespace-pre-wrap {additionalClasses} break-words text-left z-30 w-[80%] focus:outline-none dark:text-white/80 text-black/80"></div>
{#if content === ''}
    <button on:click={() => {div.focus()}} class="absolute top-6 select-none hover:cursor-text z-30 text-black/60 dark:text-white/40">
        <slot></slot>
    </button>
{/if}
