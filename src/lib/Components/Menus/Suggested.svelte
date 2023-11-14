<script lang="ts">
	import { goto } from "$app/navigation";
	import { currentUser, pb } from "$lib/Pocketbase";
    
    export let user;

    let url;

    async function fetchData() {
        if(user && $currentUser) {
            const record_ = await pb.collection("users").getOne($currentUser.id).then((res) => {
                return res;
            }).catch((err) => {
                console.log(err);
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
    <div on:click={() => {
        goto('/@' + user.handle);
    }} class="hover:cursor-pointer flex flex-col w-96  items-center justify-between">
        <div class="flex flex-row w-full items-center justify-between">
            <div class='flex flex-row'>
                <img src={url} class="h-14 fadeUp fadeUpFast w-14 rounded-full object-cover">
                <div class="flex flex-col items-start text-left justify-center ml-4">
                    <h1 class="font-semibold fadeUp fadeUpFast">
                        {user.username}
                    </h1>
                    <p class="text-white/40 fadeUp fadeUpFast">
                        {user.handle}
                    </p>
                </div>
            </div>
            <a class="text-sm text-sky-500 fadeUp fadeUpFast">
                View Profile
            </a>
        </div>
        <div class="fadeUp fadeUpFast relative w-full flex items-center justify-start mt-3">
            <p class="text-left text-white/40 bg-main z-10 pr-3">
                Suggested for you
            </p>
            <div class="w-full h-0.5 bg-white/20 absolute rounded-full"></div>
        </div>
    </div>
{/if}