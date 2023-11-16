<script lang="ts">
    import { supabase, session, refresh } from '$lib/stores';
    import Upload from 'svelte-bootstrap-icons/lib/Upload.svelte';

    let files: FileList | null;

    function fileAdded(event: Event) {
        files = (event.target as HTMLInputElement).files;

        if(files) console.log(files);
    }
    
    async function upload() {
        loading = true;
        const { data, error } = await $supabase.from('clips')
            .insert({ name })
            .select();

        if(!error && files) {
            console.log(files[0].type)
            const res = await $supabase.storage.from('audio')
                .upload(`${$session?.user.id}/${data[0].id}`, files[0], {
                    contentType: files[0].type
                });
            if (res.error) {
                await $supabase.from('clips')
                    .delete()
                    .eq('id', data[0].id);
            }
        }

        $refresh = true;
        showUploadModal = false;
        loading = false;
    }

    let loading = false;
    let name = '';

    let showUploadModal = false;

    $: if(showUploadModal) name = '';
</script>

{#if showUploadModal}
<modal>
    {#if !loading}
        <button on:click={() => showUploadModal = false}>Back</button>
        <input type="file" accept=".mp3, .ogg" on:change={fileAdded}>
        <input type="text" placeholder="name" bind:value={name}>
        {#if files && name.length > 3}
        <button on:click={upload}>Upload</button>
        {/if}
    {/if}
</modal>
{/if}

<button id="upload" on:click={() => showUploadModal = true}>
    <Upload width={24} height={24}></Upload>
</button>

<style>
    modal {
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        background-color: rgba(25, 36, 44, 0.4);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        z-index: 99999;
    }

    #upload {
        background-color: brown;
        position: fixed;
        left: 1rem;
        bottom: 1rem;
        width: 4rem;
        height: 4rem;
    }
</style>