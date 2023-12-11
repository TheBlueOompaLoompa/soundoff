<script lang="ts">
    import type { Sound as SoundData } from "$lib/types";

    import Upload from "$lib/components/Upload.svelte";
    import Sound from "$lib/components/Sound.svelte";
    import { refresh } from "$lib/stores";

    export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let email = '';
    let password = '';

    function logIn() {
        supabase.auth.signInWithPassword({
            email,
            password
        });
    }

    let emailed = false;

    function signUp() {
        supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.host
            }
        })
        emailed = true;
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
        {#if !emailed}
        <auth>
            <center>
                <input type="email" placeholder="email" bind:value={email}>
                <input type="password" placeholder="password" bind:value={password}>
                <button on:click={logIn}>log in</button>
                <button on:click={signUp}>sign up</button>
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
        <button on:click={logout} style="z-index: 1;">Logout</button>
        <Upload/>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        margin-bottom: 1rem;
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