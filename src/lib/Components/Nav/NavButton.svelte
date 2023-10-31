<script lang="ts">
	import { page } from "$app/stores";
	import { currentUser, pb } from "$lib/Pocketbase";
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";

    export let href: string = "";
    export let callback = () => {};
    export let callbackActive = false;
    export let text: string;
    export let alt_icon: string;
    export let icon: string;
    export let minimized: boolean = false;
    export let user: boolean = false;

    let url;

    onMount(async() => {
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
    })
    
    $: pageName = $page.url.pathname;
</script>

<style>
    .button-styled {
        @apply flex flex-row text-white rounded-lg duration-100;
    }

    .button-minimized {
        @apply h-24 w-24;
    }
</style>

{#if callbackActive}
    <button on:click={callback} class='button-styled group duration-200 fadeUp {minimized ? 'items-center justify-center h-12 w-12' : 'p-3.5 items-center justify-start w-full'} hover:bg-white hover:bg-opacity-5'>
        <Icon class="h-6 w-6 group-hover:h-[1.6rem] group-hover:w-[1.6rem] duration-200 {minimized ? 'button-minimized' : ' mr-4'}" icon={pageName === href ? alt_icon : icon} />{minimized === false ? text : ''}
    </button>
{:else if !callbackActive && !user}
    <a href={href} class='button-styled group duration-200 fadeUp hover:bg-white {minimized ? 'items-center justify-center h-12 w-12' : 'p-3.5 items-center justify-start w-full'} hover:bg-opacity-5 {pageName === href ? 'font-semibold' : 'font-medium'}'>
        <Icon class="h-6 w-6 group-hover:h-[1.6rem] group-hover:w-[1.6rem] duration-200 {minimized ? 'button-minimized' : 'mr-4'}" icon={pageName === href ? alt_icon : icon} />{minimized === false ? text : ''}
    </a>
{:else if user && $currentUser}
    <a href={href} class='button-styled group duration-200 fadeUp hover:bg-white {minimized ? 'items-center justify-center h-12 w-12' : 'p-3.5 items-center justify-start w-full'} hover:bg-opacity-5 {pageName === href ? 'font-semibold' : 'font-medium'}'>
        <img src={url} class="h-6 w-6 group-hover:h-[1.6rem] group-hover:w-[1.6rem] duration-200 mr-4 rounded-full">{minimized === false ? 'Profile' : ''}
    </a>
{/if}