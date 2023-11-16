<script>
    import { goto } from "$app/navigation";
    import Button from "$lib/Components/Auth/Button.svelte";
    import Input from "$lib/Components/Auth/Input.svelte";
    import Loading from "$lib/Components/Menus/Loading.svelte";
    import SubTitle from "$lib/Components/Typography/SubTitle.svelte";
    import Title from "$lib/Components/Typography/Title.svelte";
    import { imageUrlToFormData } from "$lib/Modules/utils";
    import { pb } from "$lib/Pocketbase";
    import { toast } from "$lib/Toast";
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    
    let textChoices = ['Follow your interests.', 'Know what\'s happening.', 'Join the conversation.', 'Understand the world.', 'Learn about new things.', 'Find inspiration.', 'Express yourself.'];
    let text = 'Explore new things.';
    let key = 0;

    let current_page = 0;

    onMount(() => {
        current_page = 1;
    })

    setInterval(() => {
        key++;
        if(key === textChoices.length) {
            key = 0;
        }
        text = textChoices[key];
    }, 3500);

    let loading = false;
    let email = '';
    let password = '';
    let saved_email;

    const emailTaken = async() => {
        console.log(email)

        const data = await pb.collection('users').getList(1, 3, {
            filter: `user_email = "${email}"`
        })  

        console.log(data.totalItems > 0)
        console.log(data)

        if(data.totalItems > 0) {
            return true;
        } else {
            return false;
        }
    }

    const complete_page_1 = async() => {
        let emailIsTaken = await emailTaken();
        
        if(emailIsTaken) {
            alert('Email is already taken');
            return;
        }

        if(email === '') {
            alert('Email is required');
            return;
        }

        saved_email = email;
        email = '';

        current_page = 0;
        setTimeout(() => {
            current_page = 2;
        }, 600);
    }

    async function Login() {
        await pb.collection('users').authWithPassword(saved_email.split('@')[0], password);
    }

    async function register() {
        if(saved_email && password !== '') {
            loading = true;
            current_page = 0;
            const AVATAR_URL = `https://api.dicebear.com/7.x/shapes/svg?seed=${saved_email.split('@')[0]}`
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
                username: saved_email.split('@')[0],
                password: password,
                email: saved_email,
                passwordConfirm: password,
                handle: saved_email.split('@')[0].toLowerCase(),
                bio: 'No bio yet',
            }

            const users = await pb.collection('users').getFirstListItem(`handle="${saved_email.split('@')[0]}"`).then((res) => {
                return res;
            }).catch((err) => {
                console.log(err);
                return err;
            });

            if (users.totalItems > 0) {
                alert('Username already taken');
                return;
            } else {
                try {
                    const createdUser = await pb.collection('users').create(data)
                    loading = false;
                    current_page = 2;
                } catch (err) {
                    toast(err.data.message + '-:error')
                    loading = false
                }
                await Login();
                goto('/');
                loading = false;
            }
        }
    }
</script>

<svelte:head>
    <title>
        Stitch | Register
    </title>
    <meta name="author" content="Aidan Neel">
    <meta name="keywords" content="Aidan Neel Stitch Social Media Twitter Threads Tweet Post Echo Site Website Posts Register Sign Up">
    <meta name='description' content="Register for stitch here. Stitch is a social media platform that allows you to create threads and posts.">
</svelte:head>

{#if loading}
    <Loading />
{/if}

<p class="text-white text-2xl absolute top-10 left-10 text-left font-semibold flex items-center justify-center gap-2">
    Stitch <span class="text-base font-mono font-normal text-white/70">Beta</span>
</p>

<a href="/login" class="absolute top-10 right-10 flex p-3 px-4 text-lg font-medium hover:bg-white/10 rounded-lg">
    Login
</a>

<main class="h-screen w-screen flex flex-row items-center justify-start">
    <div class="w-2/5 h-screen border-r bg-black/30 border-r-white/10 flex items-center justify-center">
        <p class="font-semibold absolute text-[6rem] opacity-10 select-none">
            Stitch.
        </p>
        {#key key}
            <p transition:fly="{{y: 20, duration: 400}}" class="text-white/90 absolute font-mono text-lg duration-200">
                {text}
            </p>
        {/key}
    </div>
    <div class="w-full flex items-center justify-center flex-col">
        {#if current_page == 1}
            <div transition:fly="{{y: 30, duration: 600}}" class="w-[29.5rem] flex items-center justify-center flex-col">
                <Title>
                    Create an account
                </Title>
                <SubTitle additionalClass="my-2.5">
                    Enter your email below to create your account
                </SubTitle>
        
                <Input bind:value={email} type="email" placeholder="name@example.com" additionalClass="mt-3" />
                <Button callback={complete_page_1} additionalClass="mt-3 flex items-center justify-center text-center">
                    Sign Up with Email
                </Button>

                <div class="mt-10 w-full flex border-t border-t-white/20 items-center justify-center relative">
                    <p class="absolute font-mono text-white/60 bg-main px-3">
                        OR CONTINUE WITH
                    </p>
                </div>

                <button class="mt-10 flex items-center justify-center w-full hover:bg-white hover:bg-opacity-[0.015] rounded-lg border border-white/20 p-2.5 font-medium ">
                    <Icon icon="fa6-brands:google" class="h-4 w-4 text-white mr-2"></Icon>Google
                </button> 

                <p class="w-2/3 mt-6 text-white/60">
                    By clicking continue, you agree to our <a href="/terms" class="underline">Terms of Service</a> and <a href="/policy" class="underline">Privacy Policy</a>
                </p>
            </div>
        {:else if current_page == 2}
            <div transition:fly="{{y: 30, duration: 600}}" class="w-[29.5rem] flex items-center justify-center flex-col">
                <Title>
                    Create a password
                </Title>
                <SubTitle additionalClass="my-2.5">
                    Enter your password below to create your account
                </SubTitle>
        
                <Input bind:value={password} type="password" placeholder="examplepassword123" additionalClass="mt-3" />
                <Button callback={register} additionalClass="mt-3 flex items-center justify-center text-center">
                    Complete Sign Up
                </Button>

                <div class="mt-10 w-full flex border-t border-t-white/20 items-center justify-center relative">
                    <p class="absolute font-mono text-white/60 bg-main px-3">
                        OR CONTINUE WITH
                    </p>
                </div>

                <button class="mt-10 flex items-center justify-center w-full hover:bg-white hover:bg-opacity-[0.015] rounded-lg border border-white/20 p-2.5 font-medium ">
                    <Icon icon="fa6-brands:google" class="h-4 w-4 text-white mr-2"></Icon>Google
                </button> 

                <p class="w-2/3 mt-6 text-white/60">
                    By clicking continue, you agree to our <a href="/terms" class="underline">Terms of Service</a> and <a href="/policy" class="underline">Privacy Policy</a>
                </p>
            </div>
        {/if}
    </div>
</main>