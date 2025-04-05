<script lang="ts">
    import { onMount } from 'svelte';
    import { getCourses } from '$lib/utils/course';
    import type { Course, CourseGroup } from '$lib/utils/types';
    
    let courses: Array<Course | CourseGroup> = [];
    let loading = true;
    
    onMount(async () => {
        try {
            const result = await getCourses();
            courses = result.courses;
            loading = false;
        } catch (error) {
            console.error('Error loading courses:', error);
            loading = false;
        }
    });
</script>

<svelte:head>
    <title>الدروس - نخلة جي أس</title>
    <meta name="description" content="استعرض جميع دروس جافاسكريبت في منصة نخلة" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center">دروس جافاسكريبت</h1>
    
    {#if loading}
        <div class="flex justify-center items-center h-64">
            <div class="loading loading-spinner loading-lg"></div>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each courses as courseItem}
                {#if 'courses' in courseItem}
                    <!-- This is a course group -->
                    <div class="card bg-base-100 shadow-xl">
                        <div class="card-body">
                            <h2 class="card-title text-xl mb-2">{courseItem.label}</h2>
                            <div class="divider my-2"></div>
                            <ul class="space-y-2">
                                {#each courseItem.courses as course}
                                    <li>
                                        <a href="/{course.slug}" class="link link-hover flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                            {course.title}
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                {:else}
                    <!-- This is a standalone course -->
                    <div class="card bg-base-100 shadow-xl">
                        <div class="card-body">
                            <h2 class="card-title">{courseItem.title}</h2>
                            <p class="text-sm">{courseItem.snippet}</p>
                            <div class="card-actions justify-end mt-4">
                                <a href="/{courseItem.slug}" class="btn btn-primary btn-sm">
                                    ابدأ الدرس
                                </a>
                            </div>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>