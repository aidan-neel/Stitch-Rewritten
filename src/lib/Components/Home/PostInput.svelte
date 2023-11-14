<script lang="ts">
	import { goto } from "$app/navigation";
	import { currentUser, pb } from "$lib/Pocketbase";
	import { postCreation } from "$lib/stores";

    export let user;

    let url;

    async function fetchData() {
        if(user && $currentUser) {
            const record_ = await pb.collection("users").getOne($currentUser.id).then((res) => {
                return res;
            }).catch((err) => {
                return err;
            }) 
            const record = record_.avatar;
            url = pb.files.getUrl(record_, record, {'thumb': '32x32'});
            if(url === '') {
                url = 'https://api.dicebear.com/7.x/shapes/svg?seed=' + $currentUser.handle;
            }
        }
    }

    $: {
        if(url === undefined) {
            fetchData();
        }
    }
</script>

{#if user && $currentUser}
    <div class="w-[47.5rem]  fadeUp fadeUpFast flex items-center justify-start h-20 border-b border-b-black/20 dark:border-b-white/10">
        <img src={url} class="h-11 w-11 rounded-full object-cover">
        <div class="flex flex-row items-center justify-between ml-4 w-full">
            <div class="flex flex-col items-start justify-start w-full">
                <button on:click={() => {
                    postCreation.set(true);
                }} class="hover:cursor-text dark:text-white/40 text-black/50 font-medium w-full text-left">
                    What's on your mind?
                </button>
            </div>
            <button on:click={() => {
                postCreation.set(true);
            }} class="dark:text-sky-500 text-sky-600 mr-2">
                Post
            </button>
        </div>
    </div>
{:else}
    <div class="w-[47.5rem] fadeUp fadeUpFast flex items-center justify-start h-20 border-b border-b-black/20 dark:border-b-white/20">
        <img src={'https://i.pinimg.com/474x/ec/e2/b0/ece2b0f541d47e4078aef33ffd22777e.jpg'} class="h-11 w-11 rounded-full object-cover">
        <div class="flex flex-row items-center justify-between ml-4 w-full">
            <div class="flex flex-col items-start justify-start w-full">
                <button on:click={() => {
                    goto('/login');
                }} class="hover:cursor-text dark:text-white/40 text-black/50 font-medium w-full text-left">
                    What's on your mind?
                </button>
            </div>
            <button on:click={() => {
                goto('/login');
            }} class="dark:text-sky-500 text-sky-600 mr-2">
                Post
            </button>
        </div>
    </div>
{/if}