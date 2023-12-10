<script lang="ts">
    import { currentUser } from '$lib/Pocketbase';
    import { notifications } from '$lib/Toast';
    import 'animate.css';
    import { fly } from 'svelte/transition';
</script>

<!--
    {#if $notifications}
    <div class="flex-col gap-4 flex items-center justify-center z-[99]">
        {#each $notifications as notification}
            <div transition:fly="{{y: 40, duration: 400}}" role="alert" class="{notification.split('-:')[1] == 'error' ? 'animate__animated animate__headShake bg-red-500/60 border-red-700 text-white' : 'bg-main border-white/20'}  px-4 p-2 rounded-xl border">
                {notification.split('-:')[0]} 
            </div>
        {/each}
    </div>
{/if}
-->

{#if $notifications}
    <div class="absolute md:top-12 top-6 md:right-12 z-[99]">
        <div class="flex-col gap-4 flex items-center justify-center z-[99]">
            {#each $notifications as notification}
                <div transition:fly="{{x: 40, duration: 350}}" class="p-3 px-5 rounded-lg flex flex-row items-center justify-center border bg-main border-white/20">
                    <div class="flex flex-col items-start">
                        <p class="font-mono text-white/40 ">
                            STITCH // {$currentUser?.handle !== undefined ? `@${$currentUser.handle}` : 'Beta'}
                        </p>
                        <p class="font-mono text-white">
                            {notification}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}