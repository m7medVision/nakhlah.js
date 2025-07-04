<script lang="ts">
	import type { PageData } from './$types';
	import Playground from '$lib/components/playground/Playground.svelte';

	export let data: PageData;

	const { course, lable, nextCourse, prevCourse, initialCode } = data;
</script>

<svelte:head>
	<title>{course.title} - نخلة جي أس</title>
	<meta name="description" content={course.snippet} />
	<meta name="keywords" content={`${course.title}, ${course.snippet}`} />
	<meta property="og:title" content={course.title} />
	<meta property="og:description" content={course.snippet} />
	<meta property="og:url" content={`https://nakhlahjs.com/${course.slug}`} />
</svelte:head>

<div class="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8">
	<div class="w-full md:w-3/5 lg:w-2/3 md:order-1 order-2 flex flex-col">
		<article class="prose prose-lg max-w-none bg-base-100 p-4 sm:p-6 rounded-box shadow">
			<h1 class="text-3xl md:text-4xl font-bold !mb-4">{course.title}</h1>

			{#if lable}
				<div class="badge badge-primary my-4">{lable}</div>
			{/if}

			<div class="markdown-content">
				{@html course.content}
			</div>

			<div class="mt-8 flex justify-between">
				{#if prevCourse}
					<a href="/{prevCourse}" class="btn btn-outline btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        السابق
                    </a>
				{:else}
					<div></div>
				{/if}

				{#if nextCourse}
					<a href="/{nextCourse}" class="btn btn-primary">
                        التالي
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                    </a>
				{/if}
			</div>
		</article>
	</div>

	<div class="md:order-2 order-1 md:sticky md:top-24 h-auto md:h-[calc(100vh-7rem)] w-1/2">
		<div class="bg-base-200 p-2 sm:p-3 rounded-box shadow h-full">
			<div class="bg-base-100 h-full rounded-lg">
				<Playground {initialCode} />
			</div>
		</div>
	</div>
</div>
