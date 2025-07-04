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

<div> {/* This div replaces the old container. Padding is now handled by +layout.svelte */}
    <h1 class="text-3xl md:text-4xl font-bold mb-8 text-center">دروس جافاسكريبت</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each courses as courseItem}
            {#if 'courses' in courseItem}
                <!-- This is a course group -->
                <div class="card bg-base-100 shadow-xl card-bordered hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
                    <div class="card-body flex flex-col flex-grow">
                        <h2 class="card-title text-xl mb-2">{courseItem.label}</h2>
                        <div class="divider my-2"></div>
                        <ul class="space-y-2 flex-grow">
                            {#each courseItem.courses as course}
                                <li class="flex items-center">
                                    <a href="/{course.slug}" class="link link-hover text-base-content hover:text-primary flex items-center py-1">
                                        <!-- Using a simpler dot or a DaisyUI-compatible icon if available -->
                                        <span class="inline-block w-2 h-2 bg-primary rounded-full ml-2 rtl:mr-2 rtl:ml-0"></span>
                                        {course.title}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                         <div class="card-actions justify-start mt-4">
                            <span class="badge badge-outline">مجموعة دروس</span>
                        </div>
                    </div>
                </div>
            {:else}
                <!-- This is a standalone course -->
                <div class="card bg-base-100 shadow-xl card-bordered hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
                    <div class="card-body flex flex-col flex-grow">
                        <h2 class="card-title">{courseItem.title}</h2>
                        <p class="text-sm flex-grow">{courseItem.snippet}</p>
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
</div>