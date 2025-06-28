<script lang="ts">
    import '../app.css';
    import { onMount } from 'svelte';
    
    let darkMode = false;
    
    onMount(() => {
        // Check for dark mode preference
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            darkMode = true;
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'night');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    });
    
    function toggleTheme() {
        darkMode = !darkMode;
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'night');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }
</script>

<div class="flex flex-col min-h-screen" dir="rtl">
    <!-- Navigation -->
    <header class="navbar bg-base-100 shadow-md">
        <div class="container mx-auto">
            <div class="flex-1">
                <a href="/" class="text-xl font-bold">
                    <span class="bg-gradient-to-br from-yellow-500 to-yellow-300 bg-clip-text text-transparent font-bold">JS</span>
                    <span class="ml-1 bg-gradient-to-bl from-base-content to-base-content/80 bg-clip-text text-transparent font-bold">نخلة</span>
                </a>
            </div>
            <div class="flex-none">
                <ul class="menu menu-horizontal px-1 gap-2">
                    <li><a href="/">الرئيسية</a></li>
                    <li><a href="/courses">الدروس</a></li>
                    <li>
                        <button class="btn btn-ghost btn-circle" on:click={toggleTheme} aria-label="Toggle theme">
                            {#if darkMode}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                            {:else}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                            {/if}
                        </button>
                    </li>
                    <li>
                        <a href="https://github.com/m7medVision/nakhlah.js" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-circle" aria-label="GitHub repository">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </header>
    
    <!-- Main content -->
    <main class="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <slot />
    </main>
</div>
