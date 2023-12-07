<script lang="ts">
    export let placeholder: string = 'Placeholder';
    export let label: string = 'Label';
    export let type: string = 'text';
    export let value: string = '';

    // Content is the <slot> component(the description of the input, and what it does.)
</script>

<div class="flex items-start justify-start w-full text-left flex-col">
    <label for={placeholder} class="text-white font-medium">{label}</label>
    <textarea bind:value={value} placeholder={placeholder} class="w-full focus:border-white/20 font-light focus:outline-none placeholder:text-white/60 p-1.5 h-20 max-h-48 min-h-20 rounded-md border bg-main border-white/10 mt-1 shadow-sm shadow-white/[0.04]" />
    <p class="w-full text-left text-sm text-white/60 mt-1">
        <slot /> <!-- Description of the input --> 
    </p>
</div>