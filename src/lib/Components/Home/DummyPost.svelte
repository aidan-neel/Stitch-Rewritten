<script>
    import { default_avatar } from "$lib/User";
    import Icon from "@iconify/svelte";
        export let additionalClasses = "";
        // Fixed dummy data
    const user = {
        username: "John Doe",
        handle: "johndoe123",
    };

    const PostData = {
        id: "12345",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        comments: [],
        likes: 42,
        time: "3 hours ago"
    };
</script>

<div class="px-5 {additionalClasses} fadeUp  hover:cursor-pointer sm:ml-0 flex items-start justify-start h-full flex-row relative border-b border-black/20 dark:border-white/10">
    <p class="dark:text-white/30 hidden sm:flex text-black/50 absolute top-0 right-6 md:right-5">
        {PostData.time}
    </p>
    <div class="flex flex-col w-11 gap-3 h-full flex-shrink-0">
        <!-- Dummy user image -->
        <img src={default_avatar} class="h-9 w-9 sm:w-11 sm:h-11 hover:cursor-pointer object-cover rounded-full border border-black/20 dark:border-white/10">
    </div>
    <div class="sm:pl-3 pl-0 flex items-start w-full justify-start flex-col">
        <div class="items-start w-full justify-between sm:pr-16 sm:pr-0 flex flex-row sm:flex-col">
            <aside class="items-start justify-center flex flex-col">
                <span class="hover:underline font-medium dark:text-white text-black text-left">
                    User not found
                </span>    
                <span class="dark:text-white/40 text-sm sm:text-base sm:ml-0 sm:mt-0 text-black/70 font-normal">@unknown</span>    
            </aside>    
        </div>
        <p class='mt-1 w-[75%] md:w-full dark:text-white text-black text-left whitespace-pre-wrap break-words'>
            This post was not found.
        </p>
        <div class="w-full flex items-center justify-start mt-2 gap-10 ml-2">
            <button class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                <Icon icon='iconamoon:heart' class="w-full flex-shrink-0 h-full active:scale-[1.2] duration-100 text-black/80 dark:text-white/50" />
                <span class="mx-1 font-medium text-white/50">42</span>
            </button>
            <button class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                <Icon icon="ph:chat-circle-dots" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100   text-black/80 dark:text-white/50" />
                <span class="mx-1 font-medium text-white/50">12</span>
            </button>
            <button class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                <Icon icon="ph:repeat" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100     text-black/80 dark:text-white/50" />
                <span class="mx-1 font-medium text-white/50">5</span>
            </button>
            <button class="h-[1.6rem] w-[1.6rem] flex flex-row items-center justify-center">
                <Icon icon="iconamoon:send" class="w-full h-full flex-shrink-0 active:scale-[1.2] duration-100     text-black/80 dark:text-white/50" />
                <span class="mx-1 font-medium text-white/50">3</span>
            </button>
        </div>
    </div>
</div>

<style>
    .icon-placeholder {
        display: inline-block;
        width: 1.6rem;
        height: 1.6rem;
        background-color: grey; /* Placeholder for icons */
    }
</style>