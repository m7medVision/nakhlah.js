<script lang="ts">
	import type { PageData } from './$types';
	import type { Course, CourseGroup } from '$lib/utils/types';

	export let data: PageData;

	const { courses } = data;
</script>

<svelte:head>
	<title>الدروس - نخلة جي أس</title>
	<meta name="description" content="استعرض جميع دروس جافاسكريبت في منصة نخلة" />
</svelte:head>

<div>
	<h1 class="mb-8 text-center text-3xl font-bold md:text-4xl">دروس جافاسكريبت</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each courses as courseItem}
			{#if 'courses' in courseItem}
				<!-- This is a course group -->
				<div
					class="card bg-base-100 card-bordered flex h-full flex-col shadow-xl transition-shadow duration-300 hover:shadow-2xl"
				>
					<div class="card-body flex flex-grow flex-col">
						<h2 class="card-title mb-2 text-xl">{courseItem.label}</h2>
						<div class="divider my-2"></div>
						<ul class="flex-grow space-y-2">
							{#each courseItem.courses as course}
								<li class="flex items-center">
									<a
										href="/{course.slug}"
										class="link link-hover text-base-content hover:text-primary flex items-center py-1"
									>
										<!-- Using a simpler dot or a DaisyUI-compatible icon if available -->
										<span
											class="bg-primary ml-2 inline-block h-2 w-2 rounded-full rtl:ml-2"
										></span>
										{course.title}
									</a>
								</li>
							{/each}
						</ul>
						<div class="card-actions mt-4 justify-start">
							<span class="badge badge-outline">مجموعة دروس</span>
						</div>
					</div>
				</div>
			{:else}
				<!-- This is a standalone course -->
				<div
					class="card bg-base-100 card-bordered flex h-full flex-col shadow-xl transition-shadow duration-300 hover:shadow-2xl"
				>
					<div class="card-body flex flex-grow flex-col">
						<h2 class="card-title">{courseItem.title}</h2>
						<p class="flex-grow text-sm">{courseItem.snippet}</p>
						<div class="card-actions mt-4 justify-end">
							<a href="/{courseItem.slug}" class="btn btn-primary btn-sm"> ابدأ الدرس </a>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

