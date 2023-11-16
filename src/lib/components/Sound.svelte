<script lang="ts">
    import { refresh, session, supabase } from "$lib/stores";
    import type { Sound } from "$lib/types";
    import { PlayFill } from "svelte-bootstrap-icons";

    export let sound: Sound;

    let audioPlayer: HTMLAudioElement;

    $: if(sound) {
        setInterval(() => {
            $supabase.storage.from('audio')
            .createSignedUrl(`${$session?.user.id}/${sound.id}`, 60*10)
            .then(({ data, error }) => {
                if(error) return;
                audioPlayer.src = data?.signedUrl;
            })
        }, 1000 * 60 * 10);
    }

    async function playSound() {
        audioPlayer.play();
    }

    let deleting = false;
    let hide = false;

    async function deleteSound() {
        hide = true;
        await $supabase.storage.from('audio')
            .remove([`${$session?.user.id}/${sound.id}`]);
        await $supabase.from('clips')
            .delete()
            .eq('id', sound.id);
        $refresh = true;
    }

    async function deleteButton() {
        if(!deleting) {
            deleting = true;
            setTimeout(() => {
                deleting = false;
            }, 5000);
        }
        else await deleteSound();
    }
</script>

{#if !hide}
<sound>
    <audio bind:this={audioPlayer}></audio>
    <button on:click={playSound}><PlayFill width={64} height={64}/></button>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a href="#" class="{deleting ? 'deleting' : ''}" on:click={deleteButton}><h4>{deleting ? `Delete ${sound.name}` : sound.name}</h4></a>
</sound>
{/if}

<style>
    sound {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 150px;
        margin: auto;
    }

    button {
        width: 100px;
        height: 100px;
    }

    audio {
        display: none;
    }

    a {
        color: aqua;
    }

    h4 {
        text-align: center;
    }

    .deleting {
        color: red;
    }
</style>