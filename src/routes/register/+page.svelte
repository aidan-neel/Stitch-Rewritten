<script lang="ts">
    import { currentUser, pb } from "$lib/Pocketbase";

	import { goto } from "$app/navigation";
	import Input from "$lib/Components/Auth/Input.svelte";
	import OAuthButton from "$lib/Components/Auth/OAuthButton.svelte";
	import SubTitle from "$lib/Components/Typography/SubTitle.svelte";
	import Title from "$lib/Components/Typography/Title.svelte";
	import { imageUrlToFormData } from "$lib/Modules/utils";
	import Icon from "@iconify/svelte";

    let email: string = '';
    let username: string = '';
    let password: string = '';

    async function Login() {
        await pb.collection('users').authWithPassword(username, password);
    }

    $: {
        if($currentUser) {
            goto('/');
        }
    }

    async function Register() {
        const AVATAR_URL = `https://api.dicebear.com/7.x/shapes/svg?seed=${username}`
        console.log(AVATAR_URL)
        let formData;
        
        imageUrlToFormData(AVATAR_URL).then((res) => {
            if(res) {
                formData = res
            }
        }).catch((err) => {
            console.log(err);
            alert(err);
        })

        const data = {
            username: username,
            password: password,
            email: email,
            passwordConfirm: password,
            handle: username
        }

        const users = await pb.collection('users').getFirstListItem(`handle="${username}"`).then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
            return err;
        });

        if (users.totalItems > 0) {
            alert('Username already taken');
            return;
        } else {
            const createdUser = await pb.collection('users').create(data).then(async(res) => {
                return res;
            }).catch((err) => {
                console.log(err + ': Line 63');
                alert(err);
                return err;
            })
            await Login();
            goto('/');
        }
    }
</script>

<div class='flex items-center fixed top-0 left-0 h-screen w-screen justify-start flex-row'>
    <div class="bg-white/80 flex-col gap-4 h-full w-3/6 flex items-center justify-center">
        <p class="text-xl fadeUp text-black items-center justify-center flex flex-row gap-2">
            <Icon icon="iconamoon:search-duotone" class="h-8 w-8 " /> Follow your interests.
        </p>
        <p class="text-xl fadeUp text-black items-center justify-center flex flex-row gap-2">
            <Icon icon="ph:user-duotone" class="h-8 w-8 " /> Know what's happening.
        </p>
        <p class="text-xl fadeUp text-black items-center justify-center flex flex-row gap-2">
            <Icon icon="ant-design:message-twotone" class="h-8 w-8 " /> Join the conversation.
        </p>
    </div>
    
    <div class="h-full fadeUp w-full flex items-center justify-center">
        <form class="flex items-center w-[24rem] mb-32 justify-center flex-col">
            <Title>
                Register
            </Title>    
            <SubTitle additionalClass="mt-3 w-full">
                Register for an account to get started on Stitch.
            </SubTitle>
            <Input bind:value={username} type="text" placeholder="Enter your username" additionalClass="mt-6" />
            <Input bind:value={email} type="email" placeholder="Enter your email" additionalClass="mt-4" />
            <Input bind:value={password} type="password" placeholder="Enter your password" additionalClass="mt-4" />
            <button on:click={Register} class='mt-4 fadeUp w-full p-2.5 hover:border-white/80 hover:bg-white duration-100 border font-medium border-white  text-black bg-white/80 rounded-xl'>
                Register
            </button>
            <div class="relative fadeUp bg-white/20 w-full h-0.5 mt-6 rounded-lg items-center justify-center flex">
                <p class="absolute bg-[#121213] p-2 text-white/30">
                    <a href="/forgot-password">Forgot password?</a>
                </p>
            </div>
            <div class="flex flex-row w-full gap-4 mt-6">
                <OAuthButton icon="mdi:google" callback={() => {}} additionalClass="disabled" />
                <OAuthButton icon="mdi:twitter" callback={() => {}} additionalClass="disabled" />
                <OAuthButton icon="mdi:github" callback={() => {}} additionalClass="disabled" />
            </div>
            <a href="/login" class="fadeUp absolute bottom-6 text-white/30 mt-2">
                Already have an account? Login
            </a>
        </form>
    </div>
</div>