<script lang="ts">
	import { goto } from "$app/navigation";
	import Loading from "$lib/Components/Menus/Loading.svelte";
	import Input from "$lib/Components/Profile/Input.svelte";
	import NavSettingsButton from "$lib/Components/Profile/NavSettingsButton.svelte";
	import Textarea from "$lib/Components/Profile/Textarea.svelte";
	import { Media } from "$lib/Modules/FileManager";
	import type { CustomizableProfileData } from "$lib/Modules/SettingsManager";
	import { SaveProfileChanges } from "$lib/Modules/SettingsManager";
	import { currentUser, pb } from "$lib/Pocketbase";
	import { toast } from "$lib/Toast";
	import Icon from "@iconify/svelte";
	import { onDestroy, onMount } from "svelte";

    let original_handle = $currentUser?.handle;
    let original_displayName = $currentUser?.username;
    let original_bio = $currentUser?.bio || 'No bio yet';
    let original_job_title = $currentUser?.job_title;
    let original_website = $currentUser?.website;

    let handle = original_handle;
    let displayName = original_displayName;
    let bio = original_bio;
    let job_title = original_job_title;
    let website = original_website;

    console.log(handle, displayName, bio, job_title, website)

    let file;
    let file2;

    let visual_url;
    let url;
    let banner;

    async function fetchData() {
        if($currentUser) {
            const user = await pb.collection('users').getList(1, 2, {
                filter: `handle = "${original_handle}"`,
                expand: 'avatar, banner'
            });

            const MediaHandler = new Media(user.items[0]);
            url = await MediaHandler.fetch_avatar();
            banner = await MediaHandler.fetch_banner();
        }
    }

    onMount(() => {
        if(!$currentUser) goto('/login');
        fetchData();
    })

    let savingChanges = false;

    async function save_changes() {
        savingChanges = true;
        console.log(file2)
        const data: CustomizableProfileData = {
            handle: handle,
            username: displayName,
            bio: bio,
            title: job_title,
            website: website,
            banner: {
                url: banner,
                file: file
            },
            avatar: {
                url: url,
                file: file2
            }
        }

        const response = await SaveProfileChanges(data, $currentUser);

        toast(response.message)
        savingChanges = false;
    }

    let bannerFileInput;
    let avatarFileInput; 

    async function onUploadBanner() {
        if(bannerFileInput) {
            // convert to url
            if(bannerFileInput.files[0]) {
                const file_ = bannerFileInput.files[0];
                file = file_;
                const url = URL.createObjectURL(file);
                banner = url;
            }
        }
    }

    async function onUploadAvatar() {
        if(avatarFileInput) {
            // convert to url
            if(avatarFileInput.files[0]) {
                const file_ = avatarFileInput.files[0];
                file2 = file_;
                const url_ = URL.createObjectURL(file2);
                url = url_;
                console.log(url);
            }
        }
    }

    onDestroy(() => {
        if (banner) {
            URL.revokeObjectURL(banner);
        }
    });
</script>

<style>
    .hide-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
</style>

{#if !original_bio || !original_displayName || !original_handle}
    <Loading />
{/if}

<svelte:head>
    <title>Stitch &middot; Edit Profile</title>
</svelte:head>

<main class="w-screen fadeUp overflow-x-hidden scrollbar-hide flex items-start flex-col xl:pr-96 2xl:pr-[48rem] xl:pl-20 justify-start h-screen overflow-y-auto pt-20 px-4 relative">
    <div class="flex flex-col items-start justify-start text-left w-full border-b border-b-white/10 pb-6">
        <h1 class="text-white font-semibold text-2xl w-full">
            Settings
        </h1>
        <p class='text-white/70 font-light w-full'>
            Manage your account preferences and settings.
        </p>
    </div>
    <nav class="w-full flex items-start justify-start mt-4 gap-2">
        <NavSettingsButton href="/profile/edit">
            Profile
        </NavSettingsButton>
    </nav>
    <header class="w-full items-start justify-start text-left mt-8 pb-6 border-b border-b-white/10">
        <h1 class="text-xl font-medium w-full">
            Profile
        </h1>
        <p class="text-white/70 font-light w-full">
            This is how others will see you on Stitch.
        </p>
    </header>
    <form class="mt-6 w-full flex flex-col gap-7 relative">
        <input on:change={onUploadBanner} accept="image/*" bind:this={bannerFileInput} type="file" class="hidden" id="banner" />
        <button on:click={() => {bannerFileInput.click()}} class="group xl:w-[40rem] h-40 rounded-lg relative  ">
            <img src={banner === '' ? 'https://t4.ftcdn.net/jpg/04/46/12/99/360_F_446129994_BkYBemzrEiTyf6wQ9bOfKwxUBxwzTH7H.jpg' : banner} alt="BannerUrl" class="h-full border border-white/20 w-full object-cover rounded-lg border border-white/10">
            <div class="h-full w-full bg-main bg-opacity-0 group-hover:bg-opacity-40 group absolute top-0 rounded-lg duration-100 flex items-center justify-center">
                <Icon icon="ic:round-dashboard-customize" class="w-10 h-10 text-white/80 opacity-0 group-hover:opacity-100 duration-300" />
            </div>
        </button>
        {#if url === undefined}
            <Loading />
        {/if}
        <input on:change={onUploadAvatar} accept="image/*" bind:this={avatarFileInput} type="file" class="hidden" id="banner" />
        <button on:click={() => {avatarFileInput.click()}} class="group w-24 h-24 top-28 left-4 absolute">
            <img src={url} alt="AvatarUrl" class="w-full h-full shadow-lg shadow-black rounded-full object-cover">
            <div class="h-full w-full bg-main bg-opacity-0 group-hover:bg-opacity-40 group absolute top-0 rounded-full duration-100 flex items-center justify-center">
                <Icon icon="ic:round-dashboard-customize" class="w-10 h-10 text-white/80 opacity-0 group-hover:opacity-100 duration-300" />
                    </div>
                </button>
        <div class="mt-4"></div>
        <Input type="text" label="Handle (@)" bind:value={handle} placeholder={original_handle}>
            This is your public account identifier. It can be your real name or a pseudonym. You can change this every 30 days.
        </Input>
        <Input type="text" label="Display Name" bind:value={displayName} placeholder={original_displayName}>
            This is your public display name. It can be your real name or a pseudonym. You can change this at any time.
        </Input>
        <Textarea label="Bio" bind:value={bio} placeholder={original_bio}>
            This is your public bio. It can be a short description of yourself, your interests, or your business. You can change this at any time.
        </Textarea>
        <Input type="text" label="Title" bind:value={job_title} placeholder={original_job_title}>
            This is your title. It shows up under your name on your profile. You can change this at any time.
        </Input>
    </form>
    <button on:click={save_changes} disabled={savingChanges} class="bg-white mb-64 flex flex-row gap-1 {savingChanges ? 'hover:cursor-not-allowed text-black/50' : ''} text-black font-medium p-2 mt-8 px-4 rounded-md">
        {#if savingChanges}
            <Icon icon="akar-icons:circle" class="w-5 h-5 animate-spin" />
        {/if}
        Save Changes
    </button>
</main>