<script lang="ts">
    import type { Sound as SoundData } from "$lib/types";

    import Upload from "$lib/components/Upload.svelte";
    import Sound from "$lib/components/Sound.svelte";
    import { refresh } from "$lib/stores";

    export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let magiced = false;

    let email = '';

    function magic() {
        supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.host
            }
        });

        magiced = true;
    }

    async function logout() {
        await supabase.auth.signOut();
    }

    let sounds: SoundData[] = []
    
    $: if(session && $refresh) {
        $refresh = false;
        supabase.from('clips')
            .select('id,name').then(({data, error}) => {
                if(error) return;

                sounds = data;
            });
    }
</script>



<main>
    <h1>Soundoff!</h1>
    {#if !session}
        {#if !magiced}
        <auth>
            <center>
                <input type="email" placeholder="email" bind:value={email}>
                <button on:click={magic}>magic</button>
            </center>
        </auth>
        {:else}
            <h2>Check your email!</h2>
        {/if}
    {:else}
        <sounds>
        {#each sounds as sound}
            <Sound {sound}/>
        {/each}
        </sounds>
        <button on:click={logout}>Logout</button>
        <Upload/>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }

    sounds {
        display: grid;
        max-width: 100%;
        width: 100%;
        height: 100%;
        grid-template-columns: repeat( auto-fit, minmax(150px, 1fr) );
        grid-auto-flow: row;
        gap: 1rem;
    }

    auth {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    auth * {
        max-width: 400px;
        display: flex;
        flex-direction: column;
    }

    auth * * {
        margin: .5rem;
        height: 1rem;
    }
</style>