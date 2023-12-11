<script lang="ts">
    import { goto } from "$app/navigation";
    import { Media } from "$lib/Modules/FileManager";
    import { timeAgo } from "$lib/Modules/utils";
    import { currentUser, pb } from "$lib/Pocketbase";
    import { user as UserClass } from "$lib/User";
    import Icon from "@iconify/svelte";
    import { onDestroy, onMount } from "svelte";
    import CommentCreationMenu from "../Menus/CommentCreationMenu.svelte";

    export let PostData;
    export let additionalClasses = '';
    export let isPagePost = false; 
    export let postIsReply = false;
    export let originalPostData = null;

    const originalPostDatas = PostData.expand?.original_post;
    const originalPostDataUser = originalPostDatas?.expand?.user;

    const user = PostData.expand.user;
    let postLikes: any[] = PostData.likes;
    let url;
    let urls;
    let userLikesPost = false;
    let userLikesReplyPost = false;
    let commentsOpen = false;

    PostData.formatted = false;

    let visualLikes = PostData.likes.length;
    let repliesAmount = PostData.comments.length;

    function findUrls(text) {
        var pattern = /\bhttps?:\/\/[^\s()<>]+[^\s()<>]+/;
        var match = pattern.exec(text);
        return match ? match[0] : null;
    }

    function formatContent(content) {
        if (PostData.formatted === false) {
            var urlPattern = /\bhttps?:\/\/[^\s()<>]+[^\s()<>]+/g;
            content = content.replace(urlPattern, function(url) {
                return '<a href="' + url + '" class="text-sky-600 hover:underline">' + url + '</a>';
            });
            content = content.replace(/@(\w+)/g, '<a href="/@$1" class="text-sky-600 hover:underline">@$1</a>');
            PostData.content = content;
            PostData.formatted = true;
            return content;
        }
    }

    async function likePost() {
        if (!$currentUser) {
            goto('/login');
            return;
        }
        if (userLikesReplyPost) {
            visualLikes -= 1;
            userLikesReplyPost = false;
            await UserClass.posts.unlike(PostData.id);
        } else {
            visualLikes += 1;
            userLikesReplyPost = true;
            await UserClass.posts.like(PostData.id);
        }
    }

    async function likeOriginalPost() {
        if (!$currentUser) {
            goto('/login');
            return;
        }
        if (userLikesPost) {
            visualLikes -= 1;
            userLikesPost = false;
            await UserClass.posts.unlike(originalPostDatas.id);
        } else {
            visualLikes += 1;
            userLikesPost = true;
            await UserClass.posts.like(originalPostDatas.id);
        }
    }

    async function fetchData(userData) {
        if(userData) {
            try {
                const MediaHandler = new Media(userData);
                url = await MediaHandler.fetch_avatar();
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function checkUserLikesPost() {
        if (!currentUser) return;

        const data = await pb.collection('posts').getOne(PostData.id, {
            expand: 'likes',
        });
        data.likes.forEach((like) => {
            if (like.user === $currentUser?.id) {
                userLikesReplyPost = true;
            }
        });

        if(originalPostDatas) {
            const data2 = await pb.collection('posts').getOne(originalPostDatas.id, {
                expand: 'likes',
            });
            data2.likes.forEach((like) => {
                if (like.user === $currentUser?.id) {
                    userLikesPost = true;
                }
            });
        }
    }

    onDestroy(() => {
        postLikes = [];
        url = '';
        urls = '';
        userLikesPost = false;
        userLikesReplyPost = false;
        commentsOpen = false;
        visualLikes = 0;
        repliesAmount = 0;
        pb.autoCancellation(true);
    });

    onMount(async () => {
        pb.autoCancellation(false);
        const userData = await pb.collection('users').getOne(user.id, {
            expand: 'avatar',
        });
        if(userData) {
            await fetchData(userData);
        }
        await checkUserLikesPost();
        formatContent(PostData.content);
        urls = findUrls(PostData.content);
        pb.autoCancellation(true);
    });

    $: formatContent(PostData.content);
    $: urls = findUrls(PostData.content);
    $: time = timeAgo(PostData.created_at);
</script>
{#if commentsOpen}
    <CommentCreationMenu closeFunction={() => {
        commentsOpen = false;
    }} open={commentsOpen} originalPostData={PostData} />
{/if}

{#if isPagePost}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="px-5 fadeUp sm:ml-0 flex items-start justify-start h-full flex-col relative border-b border-black/20 dark:border-white/10 {additionalClasses}">
        <p class="dark:text-white/30 flex text-black/50 absolute top-0 right-6 md:right-5">
            {time}
        </p>
        <!-- svelte-ignore a11y-missing-attribute -->
        <div class="flex flex-col w-11 gap-3 h-full flex-shrink-0">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <div class="flex flex-row items-center justify-center relative">
            <!-- svelte-ignore a11y-missing-attribute -->
                <img on:click|stopPropagation={() => {
                    goto(`/@${user.handle}`)
                }} src={url} class="h-9 w-9 sm:w-11 sm:h-11 flex-shrink-0 hover:cursor-pointer object-cover rounded-full border border-black/20 dark:border-white/10">
                <a href={`/@${user.handle}`} class="hover:underline absolute left-14 font-medium dark:text-white text-black text-left">
                    {user.username}
                </a>    
            </div>
        </div>
        <p class='mt-2 w-[75%] md:w-full dark:text-white text-black text-left whitespace-pre-wrap break-words'>
            {@html PostData.content}
        </p>
        <div class="flex flex-row gap-4 mt-2">
            {#if userLikesPost}
                <button on:click|stopPropagation={likePost} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                    <Icon icon='iconamoon:heart-fill' class="w-full flex-shrink-0 h-full active:scale-[1.2] duration-100 text-red-600" />
                </button>
            {:else}
                <button on:click|stopPropagation={likePost} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                    <Icon icon='iconamoon:heart' class="w-full flex-shrink-0 h-full active:scale-[1.2] duration-100 text-black/80 dark:text-white/80" />
                </button>
            {/if}
            <button on:click|stopPropagation={() => {
                if(!currentUser) {
                    goto('/login');
                    return;
                } else {
                    commentsOpen = true;
                }
            }} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                <Icon icon="ph:chat-circle-dots" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100   text-black/80 dark:text-white/80" />
            </button>
        </div>
        <div class="flex flex-row items-center justify-center gap-2 font-light mt-2 dark:text-white/40 text-black/70">
            <p>
                {visualLikes} like{visualLikes < 1 ? 's' : ''}
            </p>
            <div class="h-[0.2rem] w-[0.2rem] bg-white/40 rounded-full"></div>
            <p>
                {repliesAmount} replies
            </p>
        </div>
    </div>
{:else if postIsReply === true && originalPostDatas !== null || undefined} 
        <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click|stopPropagation={() => {goto(`/@${originalPostDataUser.handle}/${PostData.id}`)}} class="px-5 fadeUp hover:cursor-pointer sm:ml-0 flex items-start justify-start h-full flex-row relative {additionalClasses}">
        <p class="dark:text-white/30 hidden sm:flex text-black/50 absolute top-0 right-6 md:right-5">
            {time}
        </p>
        <div class="flex flex-col w-11 gap-3 h-full flex-shrink-0 items-center justify-start">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <img on:click|stopPropagation={() => {
                goto(`/@${originalPostDataUser.handle}`)
            }} src={url} class="h-9 w-9 sm:w-11 sm:h-11  hover:cursor-pointer object-cover rounded-full border border-black/20 dark:border-white/10">
            <div class="h-[59%] w-0.5 mt-[3.2rem] bg-zinc-700 rounded-full absolute right"></div>
        </div>
        <div class="sm:pl-3 pl-0 flex items-start w-full justify-start flex-col">
            <div class="items-start w-full justify-between sm:pr-16 sm:pr-0 flex flex-row sm:flex-col">
                <aside class="items-start justify-center flex flex-col">
                    <a href={`/@${originalPostDataUser.handle}`} class="hover:underline font-medium dark:text-white text-black text-left">
                        {originalPostDataUser.username}
                    </a>    
                </aside>    
                <span class="sm:hidden flex text-white/30">
                    {time}
                </span>
            </div>
            <p class='mt-1 w-[75%] md:w-full dark:text-white text-black text-left whitespace-pre-wrap break-words'>
                {@html originalPostDatas.content}
            </p>
            <div class="w-full flex items-center justify-start mt-2 gap-4">
                {#if userLikesPost}
                    <button on:click|stopPropagation={likeOriginalPost} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                        <Icon icon='iconamoon:heart-fill' class="w-full flex-shrink-0 h-full active:scale-[1.2] duration-100 text-red-600" />
                    </button>
                {:else}
                    <button on:click|stopPropagation={likeOriginalPost} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                        <Icon icon='iconamoon:heart' class="w-full flex-shrink-0 h-full active:scale-[1.2] duration-100 text-black/80 dark:text-white/80" />
                    </button>
                {/if}
                <button on:click|stopPropagation={() => {
                    if(!currentUser) {
                        goto('/login');
                        return;
                    } else {
                        commentsOpen = true;
                    }
                }} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                    <Icon icon="ph:chat-circle-dots" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100   text-black/80 dark:text-white/80" />
                </button>
                <!-- Later implementation 
                    <button on:click|stopPropagation={() => {
                    if(!currentUser) {
                        goto('/login');
                        return;
                    }
                }} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                    <Icon icon="ph:repeat" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100     text-black/80 dark:text-white/80" />
                </button>
                <button on:click|stopPropagation={() => {
                    if(!currentUser) {
                        goto('/login');
                        return;
                    }
                }} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                    <Icon icon="iconamoon:send" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100     text-black/80 dark:text-white/80" />
                </button>
                -->
            </div>
            <div class="flex flex-row items-center justify-center gap-2 font-light mt-2 dark:text-white/40 text-black/70">
                <p>
                    {visualLikes} like{visualLikes < 1 ? 's' : ''}
                </p>
                <div class="h-[0.2rem] w-[0.2rem] bg-white/40 rounded-full"></div>
                <p>
                    {repliesAmount} replies
                </p>
            </div>
        </div>
    </div>
    <div class="px-5 fadeUp sm:ml-0 flex items-start justify-start h-full flex-col relative border-b border-black/20 dark:border-white/10 {additionalClasses}">
        <p class="dark:text-white/30 flex text-black/50 absolute top-0 right-6 md:right-5">
            {time}
        </p>
        <!-- svelte-ignore a11y-missing-attribute -->
        <div class="flex flex-col w-11 gap-3 h-full flex-shrink-0">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <div class="flex flex-row items-center justify-center relative">
            <!-- svelte-ignore a11y-missing-attribute -->
                <img on:click|stopPropagation={() => {
                    goto(`/@${user.handle}`)
                }} src={url} class="h-9 w-9 sm:w-11 sm:h-11 flex-shrink-0 hover:cursor-pointer object-cover rounded-full border border-black/20 dark:border-white/10">
                <a href={`/@${user.handle}`} class="hover:underline absolute left-14 font-medium dark:text-white text-black text-left">
                    {user.username}
                </a>    
            </div>
        </div>
        <p class='mt-2 w-[75%] md:w-full dark:text-white text-black text-left whitespace-pre-wrap break-words'>
            {@html PostData.content}
        </p>
        <div class="flex flex-row gap-4 mt-2">
            {#if userLikesPost}
                <button on:click|stopPropagation={likePost} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                    <Icon icon='iconamoon:heart-fill' class="w-full flex-shrink-0 h-full active:scale-[1.2] duration-100 text-red-600" />
                </button>
            {:else}
                <button on:click|stopPropagation={likePost} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                    <Icon icon='iconamoon:heart' class="w-full flex-shrink-0 h-full active:scale-[1.2] duration-100 text-black/80 dark:text-white/80" />
                </button>
            {/if}
            <button on:click|stopPropagation={() => {
                if(!currentUser) {
                    goto('/login');
                    return;
                } else {
                    commentsOpen = true;
                }
            }} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                <Icon icon="ph:chat-circle-dots" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100   text-black/80 dark:text-white/80" />
            </button>
        </div>
        <div class="flex flex-row items-center justify-center gap-2 font-light mt-2 dark:text-white/40 text-black/70">
            <p>
                {visualLikes} like{visualLikes < 1 ? 's' : ''}
            </p>
            <div class="h-[0.2rem] w-[0.2rem] bg-white/40 rounded-full"></div>
            <p>
                {repliesAmount} replies
            </p>
        </div>
    </div>
{:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click|stopPropagation={() => {goto(`/@${user.handle}/${PostData.id}`)}} class="px-5 fadeUp hover:cursor-pointer sm:ml-0 flex items-start justify-start h-full flex-row relative border-b border-black/20 dark:border-white/10 {additionalClasses}">
        <p class="dark:text-white/30 hidden sm:flex text-black/50 absolute top-0 right-6 md:right-5">
            {time}
        </p>
        <div class="flex flex-col w-11 gap-3 h-full flex-shrink-0">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <img on:click|stopPropagation={() => {
                goto(`/@${user.handle}`)
            }} src={url} class="h-9 w-9 sm:w-11 sm:h-11  hover:cursor-pointer object-cover rounded-full border border-black/20 dark:border-white/10">
        </div>
        <div class="sm:pl-3 pl-0 flex items-start w-full justify-start flex-col">
            <div class="items-start w-full justify-between sm:pr-16 sm:pr-0 flex flex-row sm:flex-col">
                <aside class="items-start justify-center flex flex-col">
                    <a href={`/@${user.handle}`} class="hover:underline font-medium dark:text-white text-black text-left">
                        {user.username}
                    </a>    
                </aside>    
                <span class="sm:hidden flex text-white/30">
                    {time}
                </span>
            </div>
            <p class='mt-1 w-[75%] md:w-full dark:text-white text-black text-left whitespace-pre-wrap break-words'>
                {@html PostData.content}
            </p>
            <div class="w-full flex items-center justify-start mt-2 gap-4">
                {#if userLikesPost}
                    <button on:click|stopPropagation={likePost} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                        <Icon icon='iconamoon:heart-fill' class="w-full flex-shrink-0 h-full active:scale-[1.2] duration-100 text-red-600" />
                    </button>
                {:else}
                    <button on:click|stopPropagation={likePost} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                        <Icon icon='iconamoon:heart' class="w-full flex-shrink-0 h-full active:scale-[1.2] duration-100 text-black/80 dark:text-white/80" />
                    </button>
                {/if}
                <button on:click|stopPropagation={() => {
                    if(!currentUser) {
                        goto('/login');
                        return;
                    } else {
                        commentsOpen = true;
                    }
                }} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                    <Icon icon="ph:chat-circle-dots" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100   text-black/80 dark:text-white/80" />
                </button>
                <!-- Later implementation 
                    <button on:click|stopPropagation={() => {
                    if(!currentUser) {
                        goto('/login');
                        return;
                    }
                }} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                    <Icon icon="ph:repeat" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100     text-black/80 dark:text-white/80" />
                </button>
                <button on:click|stopPropagation={() => {
                    if(!currentUser) {
                        goto('/login');
                        return;
                    }
                }} class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                    <Icon icon="iconamoon:send" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100     text-black/80 dark:text-white/80" />
                </button>
                -->
            </div>
            <div class="flex flex-row items-center justify-center gap-2 font-light mt-2 dark:text-white/40 text-black/70">
                <p>
                    {visualLikes} like{visualLikes < 1 ? 's' : ''}
                </p>
                <div class="h-[0.2rem] w-[0.2rem] bg-white/40 rounded-full"></div>
                <p>
                    {repliesAmount} replies
                </p>
            </div>
        </div>
    </div>
{/if}