<script lang="ts">
	import { goto } from "$app/navigation";
	import { timeAgo } from "$lib/Modules/utils";
	import { currentUser, pb } from "$lib/Pocketbase";
	import { user as UserClass } from "$lib/User";
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";
	import CommentCreationMenu from "../Menus/CommentCreationMenu.svelte";
    export let PostData;


    const user = PostData.expand.user
    let postLikes: any[] = PostData.likes;
    let url;
    let userLikesPost = false;
    let commentsOpen = false;
    
    let visualLikes = PostData.likes.length
    let repliesAmount = PostData.comments.length;

    async function likePost() {
        if (!currentUser) {
            goto('/login');
            return;
        }

        if (userLikesPost) {
            visualLikes -= 1;
            userLikesPost = false;
            await UserClass.posts.unlike(PostData.id);
        } else {
            visualLikes += 1;
            userLikesPost = true;
            await UserClass.posts.like(PostData.id);
        }
    }

    async function fetchData() {
        if(user) {
            const record_ = await pb.collection("users").getOne(user.id).then((res) => {
                return res;
            }).catch((err) => {
                return err;
            }) 
            const record = record_.avatar;
            url = pb.files.getUrl(record_, record, {'thumb': '32x32'});
            if(url === '') {
                url = 'https://api.dicebear.com/7.x/shapes/svg?seed=' + user.handle;
            }
        }
    }

    async function checkUserLikesPost() {
        if (!currentUser) return;

        const data = await pb.collection('posts').getOne(PostData.id, {
            expand: 'likes',
        })
        
        data.likes.forEach((like) => {
            if (like.user === currentUser.id) {
                userLikesPost = true;
            }
        })


        console.log(userLikesPost);
        return userLikesPost
    }

    onMount(async () => {
        await fetchData();
        await checkUserLikesPost();
    });
    
    $: time = timeAgo(PostData.created_at);
</script>

{#if commentsOpen}
    <CommentCreationMenu closeFunction={() => {
        commentsOpen = false;
    }} open={commentsOpen} originalPostData={PostData} />
{/if}   

<div class="w-[47.5rem] flex items-start justify-start h-full flex-row relative border-b border-black/20 dark:border-white/10 pb-6">
    <p class="dark:text-white/30 font-mono text-black/50 absolute top-0 right-0">
        {time}
    </p>
    <div class="flex flex-col w-11 gap-3 h-full">
        <img on:click={() => {
            goto(`/${user.username}`)
        }} src={url} class="h-11 w-11  hover:cursor-pointer object-cover rounded-full border border-black/20 dark:border-white/10">
    </div>
    <div class="pl-3 flex items-start justify-start flex-col">
        <a href={`/${user.username}`} class="hover:underline font-medium dark:text-white text-black text-left">
            {user.username}<br>
        </a>    
        <span class="dark:text-white/40 text-black/70 font-normal text-sm font-mono">@{user.handle}</span>
        <p class='mt-1 w-[44rem] dark:text-white text-black text-left whitespace-pre-wrap break-words'>
            {@html PostData.content.replace(/@(\w+)/g, '<a href="/@$1" class="text-sky-600 hover:underline">@$1</a>')}
        </p>
        <div class="w-full flex items-center justify-start mt-2 gap-3">
            {#if userLikesPost}
                <button on:click={likePost} class="h-[1.6rem] w-[1.6rem]">
                    <Icon icon='iconamoon:heart-fill' class="w-full h-full active:scale-[1.2] duration-100 text-red-600" />
                </button>
            {:else}
                <button on:click={likePost} class="h-[1.6rem] w-[1.6rem]">
                    <Icon icon='iconamoon:heart' class="w-full h-full active:scale-[1.2] duration-100 text-black/80 dark:text-white/80" />
                </button>
            {/if}
            <button on:click={() => {
                commentsOpen = true;
            }} class="h-[1.6rem] w-[1.6rem]">
                <Icon icon="ph:chat-circle-dots" class="w-full h-full active:scale-[1.2] duration-100   text-black/80 dark:text-white/80" />
            </button>
            <button class="h-[1.6rem] w-[1.6rem]">
                <Icon icon="ph:repeat" class="w-full h-full active:scale-[1.2] duration-100     text-black/80 dark:text-white/80" />
            </button>
            <button class="h-[1.6rem] w-[1.6rem]">
                <Icon icon="iconamoon:send" class="w-full h-full active:scale-[1.2] duration-100     text-black/80 dark:text-white/80" />
            </button>
        </div>
        <div class="flex flex-row gap-6 mt-2 dark:text-white/40 font-mono text-sm text-black/70">
            <p>
                {visualLikes} like{visualLikes > 1 ? 's' : ''}
            </p>
            <p>
                {repliesAmount} replies{repliesAmount > 1 ? 's' : ''}
            </p>
        </div>
    </div>
</div>
