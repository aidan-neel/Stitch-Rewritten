<script lang="ts">
	import { goto } from "$app/navigation";
	import Loading from "$lib/Components/Menus/Loading.svelte";
	import Input from "$lib/Components/Profile/Input.svelte";
	import NavSettingsButton from "$lib/Components/Profile/NavSettingsButton.svelte";
	import Textarea from "$lib/Components/Profile/Textarea.svelte";
	import type { CustomizableProfileData } from "$lib/Modules/SettingsManager";
	import { SaveProfileChanges } from "$lib/Modules/SettingsManager";
	import { currentUser } from "$lib/Pocketbase";
	import { toast } from "$lib/Toast";
	import { onMount } from "svelte";

    let original_handle = $currentUser?.handle;
    let original_displayName = $currentUser?.username;
    let original_bio = $currentUser?.bio;
    let original_job_title = $currentUser?.job_title;
    let original_website = $currentUser?.website;

    let handle = original_handle;
    let displayName = original_displayName;
    let bio = original_bio;
    let job_title = original_job_title;
    let website = original_website;

    onMount(() => {
        if(!$currentUser) goto('/login');

        console.log(job_title)
    })

    async function save_changes() {
        const data: CustomizableProfileData = {
            handle: handle,
            username: displayName,
            bio: bio,
            title: job_title,
            website: website
        }

        const response = await SaveProfileChanges(data, $currentUser);

        toast(response.message)
    }
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

<main class="w-screen fadeUp scrollbar-hide flex items-start flex-col justify-start h-screen overflow-y-auto pt-20 px-4 relative">
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
        <NavSettingsButton href="/profile/account">
            Account
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
    <form class="mt-6 w-full flex flex-col gap-7">
        <Input type="text" label="Handle (@)" value={handle} placeholder={original_handle}>
            This is your public account identifier. It can be your real name or a pseudonym. You can change this every 30 days.
        </Input>
        <Input type="text" label="Display Name" value={displayName} placeholder={original_displayName}>
            This is your public display name. It can be your real name or a pseudonym. You can change this at any time.
        </Input>
        <Textarea label="Bio" value={bio} placeholder={original_bio}>
            This is your public bio. It can be a short description of yourself, your interests, or your business. You can change this at any time.
        </Textarea>
        <Input type="text" label="Title" value={job_title} placeholder={original_job_title}>
            This is your title. It shows up under your name on your profile. You can change this at any time.
        </Input>
    </form>
    <button on:click={save_changes} class="bg-white mb-64 text-black font-medium p-2 mt-8 px-4 rounded-md">
        Save Changes
    </button>
</main>