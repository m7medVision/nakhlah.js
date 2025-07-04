import { error } from '@sveltejs/kit';
import { getCourse, findNextCourse, findPrevCourse, getJson } from '$lib/utils/course';
import { getPreCode } from '$lib/utils/precode';
import { renderMarkdown } from '$lib/utils/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const slug = params.slug;
        const course = await getCourse(slug);
        const nextCourse = findNextCourse(slug);
        const prevCourse = findPrevCourse(slug);
        
        // Pre-load the code example for this course
        const initialCode = await getPreCode(slug);
        
        // Process markdown content to HTML
        course.content = await renderMarkdown(course.content);
        
        let lable: string | undefined;
        let lableSlug: string | undefined;
        
        if (slug.includes('/')) {
            try {
                const [labelSlugValue, labelValue] = await getJson(slug.split('/')[0]);
                lableSlug = labelSlugValue;
                lable = labelValue;
            } catch (e) {
                // Handle case where _data.json doesn't exist
                console.error('Error getting label:', e);
            }
        }
        
        return {
            course,
            lable,
            lableSlug,
            nextCourse,
            prevCourse,
            initialCode
        };
    } catch (e) {
        console.error('Error loading course:', e);
        throw error(404, 'Course not found');
    }
};