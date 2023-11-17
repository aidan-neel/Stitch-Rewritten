<script>
	import { currentUser, pb } from "$lib/Pocketbase";
	import { toast } from "$lib/Toast";
	import { user as UserClass } from "$lib/User";
	import CreationInput from "../Typography/CreationInput.svelte";
	import MainMenu from "./MainMenu.svelte";

    let content = '';
    let url;

    export let originalPostData;
    export let closeFunction

    async function createComment() {
        if(content !== '' && content.length <= 400 && $currentUser) {
            try {
                UserClass.posts.createComment({
                    content: content,
                    user: $currentUser.id,
                    original_post: originalPostData.id,
                    original_post_id: originalPostData.id,
                    created_at: new Date().toISOString(),
                    image: null,
                })
                console.log(originalPostData)
                toast(`Successfully replied to post!`);
                closeFunction();
                content = '';
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function fetchData() {
        if($currentUser) {
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

    function sanitizeAndEscape(text) {
        // Replace special HTML characters with their corresponding HTML entities
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    $: {
        if(url === undefined) {
            fetchData();
        }

        sanitizeAndEscape(content);
    }

    $: validContent = content.length > 0 && content.length <= 400;
</script>

<MainMenu width={43} clickOutsideFunction={closeFunction} title={`Reply to ${originalPostData.expand?.user.username}`}>
    <div class="p-4 pl-6 mb-12 mt-2 flex flex-row">
        <img src={url} class="w-12 h-12 rounded-full">
        <div class="flex flex-col relative ml-3 w-full items-start justify-center text-left">
            <h1 class="font-semibold dark:text-white text-black">
                {originalPostData.expand?.user.username}
            </h1>
            <CreationInput content={content} bind:value={content}>
                Reply to {originalPostData.expand?.user.username}
            </CreationInput>
        </div>
        <button on:click={createComment} class="{validContent ? 'dark:text-white text-white font-mono' : 'text-white/30 hover:cursor-not-allowed'} font-mono duration-100 absolute bottom-6 right-6">
            {#if content.length >= 325}
                <span class="dark:text-white/40  text-black/60  mr-1 {content.length >= 400 ? 'text-red-500' : ''}">{content.length}/400</span>
            {/if}Reply
        </button>
    </div>
</MainMenu>