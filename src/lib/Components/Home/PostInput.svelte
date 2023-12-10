<script lang="ts">
	import { goto } from "$app/navigation";
	import { Media } from "$lib/Modules/FileManager";
	import { currentUser, pb } from "$lib/Pocketbase";
	import { postCreation } from "$lib/stores";
	import { fly } from "svelte/transition";

    export let user;

    let url;

    async function fetchData() {
        if(user && $currentUser) {
            pb.autoCancellation(false);
            const record_ = await pb.collection("users").getOne($currentUser.id, {
                expand: 'avatar'
            })
            const mediaHandler = new Media(record_);
            url = await mediaHandler.fetch_avatar();     
            pb.autoCancellation(true);       
        }
    }

    $: {
        if(url === undefined) {
            fetchData();
        }
    }
</script>

{#if user && $currentUser}
    <div transition:fly="{{y: 20, duration: 400}}"  class="w-full px-5 mt-6 flex items-center justify-start h-20 border-b border-b-black/20 dark:border-b-white/10">
        <img src={url} class="h-11 w-11 rounded-full object-cover">
        <div class="flex flex-row items-center justify-between ml-4 w-full">
            <div class="flex flex-col items-start justify-start w-full">
                <button on:click={() => {
                    postCreation.set(true);
                }} class="hover:cursor-text dark:text-white/40 text-black/50 font-medium w-full text-left">
                    What's new?
                </button>
            </div>
            <button on:click={() => {
                postCreation.set(true);
            }} class="text-white font-mono mr-2">
                Post
            </button>
        </div>
    </div>
{:else}
    <div transition:fly="{{y: 20, duration: 400}}"  class="w-full px-5 mt-8 flex items-center justify-start h-20 border-b border-b-black/20 dark:border-b-white/10">
        <img src={'https://i.pinimg.com/474x/ec/e2/b0/ece2b0f541d47e4078aef33ffd22777e.jpg'} class="h-11 w-11 rounded-full object-cover">
        <div class="flex flex-row items-center justify-between ml-4 w-full">
            <div class="flex flex-col items-start justify-start w-full">
                <button on:click={() => {
                    goto('/login');
                }} class="hover:cursor-text dark:text-white/40 text-black/50 font-medium w-full text-left">
                    What's new?
                </button>
            </div>
            <button on:click={() => {
                goto('/login');
            }} class="text-white font-mono mr-2">
                Post
            </button>
        </div>
    </div>
{/if}