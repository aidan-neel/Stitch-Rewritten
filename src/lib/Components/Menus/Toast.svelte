<script lang="ts">
    import { notifications } from "$lib/Toast";
    import 'animate.css';
    import { fly } from 'svelte/transition';
    
</script>

{#if $notifications}
    <div class="flex-col gap-4 flex items-center justify-center z-[99]">
        {#each $notifications as notification}
            <div transition:fly="{{y: 40, duration: 400}}" role="alert" class="{notification.split('-:')[1] == 'error' ? 'animate__animated animate__headShake bg-red-500/60 border-red-700 text-white' : 'bg-main border-white/20'}  px-4 p-2 rounded-xl border">
                {notification.split('-:')[0]} 
            </div>
        {/each}
    </div>
{/if}