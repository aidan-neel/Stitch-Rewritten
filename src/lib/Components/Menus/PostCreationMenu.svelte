<script lang="ts">
    import { Media } from "$lib/Modules/FileManager";
    import { currentUser, pb } from "$lib/Pocketbase";
    import { toast } from "$lib/Toast";
    import { user as UserClass } from "$lib/User";
    import { postCreation, postCreationContent } from "$lib/stores";
    import { onMount } from "svelte";
    import CreationInput from "../Typography/CreationInput.svelte";
    import MainMenu from "./MainMenu.svelte";

    export let user;
    
    let content = $postCreationContent;
    let url;

    async function fetchData() {
        pb.autoCancellation(true);
        if(user && $currentUser) {
            const record_ = await pb.collection("users").getOne($currentUser.id, {
                expand: 'avatar'
            })
            const mediaHandler = new Media(record_);
            url = await mediaHandler.fetch_avatar();            
        }
    }

    async function createPost() {
        if(content !== '' && content.length <= 400 && user) {
            console.log(content);
            const post = UserClass.posts.create({
                content: content,
                user: user.id,
                image: null,
                created_at: new Date().toISOString(),
                likes_amount: 0,
                replies_amount: 0,
                reposts_amount: 0,
                content_type: 'post'
            })
            
            postCreation.set(false);
            content = '';
            toast('Successfully created post!');
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

    onMount(() => {
        fetchData();
    })

    $: {
        sanitizeAndEscape(content);
    }

    $: validContent = content !== '' && content.length <= 400;
</script>

{#if $postCreation && $currentUser && user}
    <MainMenu width={43} clickOutsideFunction={() => {
        postCreation.set(false);
        postCreationContent.set('');
    }} title="New Post">
        <div class="p-4 pl-6 mb-12 mt-2 flex flex-row">
            <img src={url} class="w-12 h-12 rounded-full object-cover flex-shrink-0">
            <div class="flex flex-col relative ml-3 w-full items-start justify-center text-left">
                <h1 class="font-semibold dark:text-white text-black">
                    {user.username}
                </h1>
                <CreationInput content={content} bind:value={content}>
                    What's new?
                </CreationInput>
            </div>
            <button on:click={createPost} class="{validContent ? 'dark:text-white text-white' : 'text-white/30 hover:cursor-not-allowed'} font-mono duration-100 absolute bottom-6 right-6">
                {#if content.length >= 325}
                    <span class="dark:text-white/40 font-mono text-black/60  mr-1 {content.length >= 400 ? 'text-red-500' : ''}">{content.length}/400</span>
                {/if}Post   
            </button>
        </div>
    </MainMenu>
{/if}