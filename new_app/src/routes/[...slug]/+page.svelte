<script lang="ts">
    import type { PageData } from './$types';
    import Playground from '$lib/components/playground/Playground.svelte';
    
    export let data: PageData;
    
    const { course, lable, lableSlug, nextCourse, prevCourse } = data;
</script>

<svelte:head>
    <title>{course.title}</title>
    <meta name="description" content={course.snippet} />
    <meta name="keywords" content={`${course.title}, ${course.snippet}`} />
    <meta property="og:title" content={course.title} />
    <meta property="og:description" content={course.snippet} />
    <meta property="og:url" content={`https://nakhlahjs.com/${course.slug}`} />
</svelte:head>

<main class="flex flex-col md:flex-row h-screen">
    <!-- Left side - Code playground -->
    <div class="w-full md:w-1/2 bg-base-200 p-4">
        <div class="bg-base-100 rounded-lg h-full">
            <Playground />
        </div>
    </div>
    
    <!-- Right side - Markdown content -->
    <div class="w-full md:w-1/2 overflow-y-auto p-4">
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
            <div class="flex justify-between mt-8">
                {#if prevCourse}
                <a href="/{prevCourse}" class="btn btn-primary">
                    Previous
                </a>
                {:else}
                <div></div>
                {/if}
                
                {#if nextCourse}
                <a href="/{nextCourse}" class="btn btn-primary">
                    Next
                </a>
                {/if}
            </div>
        </article>
    </div>
</main>