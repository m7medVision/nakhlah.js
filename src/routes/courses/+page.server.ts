import { error } from '@sveltejs/kit';
import { getCourses } from '$lib/utils/course';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const result = await getCourses();
        return {
            courses: result.courses
        };
    } catch (e) {
        console.error('Error loading courses:', e);
        throw error(500, 'Failed to load courses');
    }
};