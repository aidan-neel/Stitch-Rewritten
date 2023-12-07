<script lang="ts">
	import { goto } from "$app/navigation";
	import Loading from "$lib/Components/Menus/Loading.svelte";
	import NavSettingsButton from "$lib/Components/Profile/NavSettingsButton.svelte";
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

{#if !original_bio || !original_displayName || !original_handle}
    <Loading />
{/if}

<svelte:head>
    <title>Stitch &middot; Edit Profile</title>
</svelte:head>

<main class="w-screen fadeUp h-screen flex items-start flex-col justify-start pt-24 pl-4 relative">
    <div class="flex flex-col items-start justify-start text-left w-full border-b border-b-white/10 pb-6">
        <h1 class="text-white font-semibold text-2xl w-full">
            Settings
        </h1>
        <p class='text-white/80 font-light w-full'>
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
</main>