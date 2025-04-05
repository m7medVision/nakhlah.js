import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Course, CourseAttributes, CourseGroup } from './types';

// Cache for course data
let courseCache: { courses: (Course | CourseGroup)[], numberOfCourses: number } = { courses: [], numberOfCourses: 0 };
let flatSlugsCache: string[] = [];

// Get the course metadata from markdown file
export async function getCourse(slug: string): Promise<Course> {
    try {
        const filePath = path.join(process.cwd(), 'src', 'courses', `${slug}.md`);
        const text = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(text);
        const courseAttrs = data as CourseAttributes;
        
        const course: Course = {
            slug,
            title: courseAttrs.title,
            content: content,
            snippet: courseAttrs.snippet,
            order: courseAttrs.order,
        };
        
        return course;
    } catch (error) {
        console.error(`Error loading course ${slug}:`, error);
        throw new Error(`Course not found: ${slug}`);
    }
}

// Get data from a group's _data.json file
export async function getGroupJsonData(
    groupPath: string
): Promise<{ order: number; label: string; lableSlug: string } | undefined> {
    try {
        const dataJsonPath = path.join(process.cwd(), 'src', 'courses', groupPath, '_data.json');
        const data = await fs.readFile(dataJsonPath, 'utf-8');
        const jsonData = JSON.parse(data) as {
            order: number;
            label: string;
            lableSlug: string;
        };
        return { ...jsonData };
    } catch (error) {
        return undefined;
    }
}

// Get label information for a specific group
export async function getJson(
    slug: string
): Promise<[string, string]> {
    try {
        const filePath = path.join(process.cwd(), 'src', 'courses', `${slug}/_data.json`);
        const data = await fs.readFile(filePath, 'utf-8');
        const json: { label: string; lableSlug: string } = JSON.parse(data);
        return [json.lableSlug, json.label];
    } catch (error) {
        console.error(`Error loading JSON for ${slug}:`, error);
        throw new Error(`JSON not found for: ${slug}`);
    }
}

// Get all course data
export async function getCourses(): Promise<{ courses: (Course | CourseGroup)[] }> {
    if (courseCache.courses.length > 0) {
        return courseCache;
    }

    let coursesCount = 0;
    const rootDir = path.join(process.cwd(), 'src', 'courses');
    
    try {
        const files = await fs.readdir(rootDir, { withFileTypes: true });
        const groupPromises: Promise<CourseGroup>[] = [];
        const nonGroupPromises: Promise<Course>[] = [];

        // Process a group directory to get its courses
        const processGroup = async (groupSlug: string): Promise<CourseGroup> => {
            const groupDir = path.join(rootDir, groupSlug);
            const groupFiles = await fs.readdir(groupDir, { withFileTypes: true });
            const groupCoursePromises: Promise<Course>[] = [];

            for (const groupFile of groupFiles) {
                if (!groupFile.isDirectory() && groupFile.name.endsWith('.md')) {
                    const slug = groupFile.name.replace('.md', '');
                    const coursePromise = getCourse(path.join(groupSlug, slug));
                    groupCoursePromises.push(coursePromise);
                    coursesCount++;
                }
            }

            const groupData = await getGroupJsonData(groupSlug);
            const courses = await Promise.all(groupCoursePromises);

            return {
                courses,
                order: groupData?.order ?? 999,
                label: groupData?.label ?? "بدون عنوان",
                lableSlug: groupData?.lableSlug ?? "no-label",
            };
        };

        // Process each item in the courses directory
        for (const file of files) {
            if (file.isDirectory()) {
                groupPromises.push(processGroup(file.name));
            } else if (file.name.endsWith('.md')) {
                const slug = file.name.replace('.md', '');
                nonGroupPromises.push(getCourse(slug));
                coursesCount++;
            }
        }

        const [groupOrders, nonGroupCourses] = await Promise.all([
            Promise.all(groupPromises),
            Promise.all(nonGroupPromises),
        ]);

        const merged: (Course | CourseGroup)[] = [...nonGroupCourses, ...groupOrders];
        merged.sort((a, b) => a.order - b.order);

        courseCache.courses = merged;
        courseCache.numberOfCourses = coursesCount;

        return courseCache;
    } catch (error) {
        console.error('Error loading courses:', error);
        return { courses: [] };
    }
}

// Get flattened list of all course slugs
export function getFlatSlugs(): string[] {
    if (flatSlugsCache.length > 0) {
        return flatSlugsCache;
    }
    
    const courses = courseCache.courses;
    const slugs = courses.map((c) => {
        if ("courses" in c) {
            c.courses.sort((a, b) => a.order - b.order);
            return c.courses.map((course) => course.slug.replace(/\\/g, "/"));
        }
        return c.slug.replace(/\\/g, "/");
    });
    
    const flatSlugs = slugs.flat();
    flatSlugsCache = flatSlugs;
    return flatSlugs;
}

// Get the number of total courses
export function getNumberOfCourses(): number {
    return courseCache.numberOfCourses;
}

// Find the next course
export function findNextCourse(slug: string): string | undefined {
    const flatSlugs = getFlatSlugs();
    const index = flatSlugs.indexOf(slug);
    return flatSlugs[index + 1];
}

// Find the previous course
export function findPrevCourse(slug: string): string | undefined {
    const flatSlugs = getFlatSlugs();
    const index = flatSlugs.indexOf(slug);
    return index > 0 ? flatSlugs[index - 1] : undefined;
}