<script>
	import { goto } from "$app/navigation";
	import { pb } from "$lib/Pocketbase";
</script>
<button on:click={() => {
    pb.authStore.clear();
    goto('/');
}} class='mt-4 fadeUp fadeUpFast w-48 p-2.5 hover:border-white/80 hover:bg-white duration-100 border font-medium border-white  text-black bg-white/80 rounded-xl'>
    Sign Out
</button>