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
    let userLikesPost;
    let commentsOpen = false;
    
    let visualLikes = PostData.likes_amount;
    
    async function likePost() {
        try {
            if ($currentUser !== null || undefined) {
                if (!userLikesPost) {
                    visualLikes += 1;
                    userLikesPost = true;
                    const post = await UserClass.posts.like(PostData.id);
                    console.log(post);
                } else {
                    visualLikes -= 1;
                    userLikesPost = false;
                    const post = await UserClass.posts.unlike(PostData.id);
                    console.log(post);
                }
            } else {
                goto('/login');
            }
        } catch (error) {
            console.error(error);
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

    async function userLikes() {
        if ($currentUser) {
            const likes = await pb.collection('Likes').getList(1, 50, {
                filter: `user = '${$currentUser.id}' && post = '${PostData.id}'`
            });

            return likes.items.length > 0;
        } else {
            return false;
        }
    }


    onMount(async() => {
        await fetchData();
        userLikesPost = await userLikes();
    })

    $: time = timeAgo(PostData.created_at);
</script>

{#if commentsOpen}
    <CommentCreationMenu closeFunction={() => {
        commentsOpen = false;
    }} open={commentsOpen} originalPostData={PostData} />
{/if}   

<div class="w-[47.5rem] flex items-start justify-start h-full flex-row relative border-b border-black/20 dark:border-white/10 pb-6">
    <p class="dark:text-white/30 text-black/50 absolute top-0 right-0">
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
        <span class="dark:text-white/40 text-black/70 font-normal">@{user.handle}</span>
        <p class='mt-1 w-[44rem] dark:text-white text-black text-left whitespace-pre-wrap break-words'>
            {@html PostData.content.replace(/@(\w+)/g, '<a href="/@$1" class="text-sky-600 hover:underline">@$1</a>')}
        </p>
        <div class="w-full flex items-center justify-start mt-2 gap-3">
            <button on:click={likePost} class="h-[1.6rem] w-[1.6rem]">
                <Icon icon={userLikesPost ? 'iconamoon:heart-fill' : 'iconamoon:heart'} class="w-full h-full active:scale-[1.2] duration-100     {userLikesPost ? 'text-red-600' : 'text-black/80 dark:text-white/80'}" />
            </button>
            <button on:click={() => {
                commentsOpen = true;
            }} class="h-[1.6rem] w-[1.6rem]">
                <Icon icon="iconamoon:comment-dots-light" class="w-full h-full active:scale-[1.2] duration-100   text-black/80 dark:text-white/80" />
            </button>
            <button class="h-[1.6rem] w-[1.6rem]">
                <Icon icon="iconamoon:playlist-repeat-list" class="w-full h-full active:scale-[1.2] duration-100     text-black/80 dark:text-white/80" />
            </button>
            <button class="h-[1.6rem] w-[1.6rem]">
                <Icon icon="iconamoon:send" class="w-full h-full active:scale-[1.2] duration-100     text-black/80 dark:text-white/80" />
            </button>
        </div>
        <div class="flex flex-row gap-6 mt-2 dark:text-white/40 text-black/70">
            <p>
                {visualLikes} like{visualLikes > 1 ? 's' : ''}
            </p>
            <p>
                {PostData.replies_amount} replies{PostData.replies_amount > 1 ? 's' : ''}
            </p>
            <p>
                {PostData.reposts_amount} reposts{PostData.reposts_amount > 1 ? 's' : ''}
            </p>
        </div>
    </div>
</div>
