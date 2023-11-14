<script lang="ts">
    import { currentUser, pb } from "$lib/Pocketbase";

	import { goto } from "$app/navigation";
	import Input from "$lib/Components/Auth/Input.svelte";
	import OAuthButton from "$lib/Components/Auth/OAuthButton.svelte";
	import Loading from "$lib/Components/Menus/Loading.svelte";
	import Toast from "$lib/Components/Menus/Toast.svelte";
	import SubTitle from "$lib/Components/Typography/SubTitle.svelte";
	import Title from "$lib/Components/Typography/Title.svelte";
	import { toast } from "$lib/Toast";
	import Icon from "@iconify/svelte";

    let username: string = '';
    let password: string = '';
    let loading: boolean = false;

    async function Login() {
        loading = true;
        try {
            const authData = await pb.collection('users').authWithPassword(username, password);
            loading = false;
        } catch (err) {
            toast(err.data.message + '-:error')
            loading = false
        }
    }

    $: {
        if($currentUser) {
            goto('/');
        }
    }
</script>

{#if loading}
    <Loading />
{/if}

<div class='flex items-center fixed top-0 left-0 h-screen w-screen justify-start flex-row-reverse'>
    <div class="dark:bg-white/80 bg-black fadeIn flex-col gap-4 h-full w-3/6 flex items-center justify-center">
        <p class="text-xl fadeUp fadeUpFast dark:text-black text-main-white items-center justify-center flex flex-row gap-2">
            <Icon icon="iconamoon:search" class="h-8 w-8 " /> Follow your interests.
        </p>
        <p class="text-xl fadeUp fadeUpFast dark:text-black text-main-white items-center justify-center flex flex-row gap-2">
            <Icon icon="ph:user" class="h-8 w-8 " /> Know what's happening.
        </p>
        <p class="text-xl fadeUp fadeUpFast dark:text-black text-main-white items-center justify-center flex flex-row gap-2">
            <Icon icon="ant-design:message" class="h-8 w-8 " /> Join the conversation.
        </p>
    </div>
    
    <div class="h-full fadeUp fadeUpFast flex-col w-full flex items-center justify-center">
        <form class="flex items-center w-[24rem] mt-96 justify-center flex-col duration-200">
            <Title>
                Log In
            </Title>    
            <SubTitle additionalClass="mt-3 w-full">
                Log in to your account on Stitch.
            </SubTitle>
            <Input bind:value={username} type="text" placeholder="Enter your username" additionalClass="mt-6" />
            <Input bind:value={password} type="password" placeholder="Enter your password" additionalClass="mt-4" />
            <button on:click={Login} class='mt-4 fadeUp fadeUpFast w-full p-2.5 dark:hover:border-white/80 hover:border-black/80 hover:bg-black dark:hover:bg-white duration-100 border font-medium text-white border-black bg-black/80 dark:border-white  dark:text-black dark:bg-white/80 rounded-xl'>
                Login
            </button>
            <div class="relative fadeUp fadeUpFast bg-black/30 dark:bg-white/20 w-full h-0.5 mt-6 rounded-full items-center justify-center flex">
                <p class="absolute bg-main-white dark:bg-main p-2 text-black/60 font-medium dark:text-white/30">
                    <a href="/forgot-password">Forgot password?</a>
                </p>
            </div>
            <div class="flex flex-row w-full gap-4 mt-6">
                <OAuthButton icon="mdi:google" callback={() => {}} additionalClass="disabled" />
                <OAuthButton icon="mdi:twitter" callback={() => {}} additionalClass="disabled" />
                <OAuthButton icon="mdi:github" callback={() => {}} additionalClass="disabled" />
            </div>
            <a href="/register" class="fadeUp fadeUpFast absolute bottom-6 text-black/50 font-medium dark:text-white/30 mt-2">
                Don't have an account? Register here.
            </a>
        </form>
        <div class="h-96 mt-6">
            <Toast />
        </div>
    </div>
</div>