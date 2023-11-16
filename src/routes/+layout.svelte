<script lang="ts">
    import '../style.css'
    import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
    import { supabase as supastore, session as sesstore } from '$lib/stores';

	export let data

	let { supabase, session } = data
	$: ({ supabase, session } = data)

    $supastore = supabase;
    $sesstore = session;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => data.subscription.unsubscribe()
	})
</script>

<svelte:head>
    <title>Soundoff!</title>

    <style>
        body, :root {
            display: block;
            width: 100%;
            height: 100%;
            margin: 0px;
        }
    </style>
</svelte:head>

<slot/>