<script lang="ts">
	import type { PageData } from './$types';
	import Playground from '$lib/components/playground/Playground.svelte';

	export let data: PageData;

	const { course, lable, lableSlug, nextCourse, prevCourse, initialCode } = data;
</script>

<svelte:head>
	<title>{course.title}</title>
	<meta name="description" content={course.snippet} />
	<meta name="keywords" content={`${course.title}, ${course.snippet}`} />
	<meta property="og:title" content={course.title} />
	<meta property="og:description" content={course.snippet} />
	<meta property="og:url" content={`https://nakhlahjs.com/${course.slug}`} />
</svelte:head>

<main class="flex h-screen flex-col md:flex-row">
	<div class="w-full overflow-y-auto p-4 md:w-1/2">
		<article class="prose prose-lg max-w-none">
			<h1>{course.title}</h1>

			{#if lable}
				<div class="badge badge-primary mb-4">{lable}</div>
			{/if}

			<!-- Render markdown content -->
			<div class="markdown-content">
				{@html course.content}
			</div>

			<!-- Navigation buttons -->
			<div class="mt-8 flex justify-between">
				{#if prevCourse}
					<a href="/{prevCourse}" class="btn btn-primary"> السابق </a>
				{:else}
					<div></div>
				{/if}

				{#if nextCourse}
					<a href="/{nextCourse}" class="btn btn-primary"> التالي </a>
				{/if}
			</div>
		</article>
	</div>
	<div class="bg-base-200 w-full p-4 md:w-1/2">
		<div class="bg-base-100 h-full rounded-lg">
			<Playground {initialCode} slug={course.slug} />
		</div>
	</div>
</main>
