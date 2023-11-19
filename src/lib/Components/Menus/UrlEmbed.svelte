<script>
	
    export let url;

    const url_ = url.slice(0, -1);

    if(url_.startsWith('https://open.spotify.com')) {
        url = url_.replace('https://open.spotify.com/', 'https://open.spotify.com/embed/');
    }
</script>

{#if url_.startsWith('https://open.spotify.com')}
    <div class="bg-main border border-white/20 w-full rounded-xl mt-3 mb-2.5">
        <iframe style="border-radius: 0.5rem;" src={url + 'utm_source=generator&theme=0'} width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    </div>
{/if}