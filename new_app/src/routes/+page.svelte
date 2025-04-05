<script lang="ts">
    import { onMount } from 'svelte';
</script>

<svelte:head>
    <title>نخلة جي أس - تعلم جافاسكريبت بالعربي</title>
    <meta name="description" content="منصة تعليمية عربية متخصصة في تعلم لغة البرمجة جافاسكريبت بطريقة مبتكرة وتفاعلية." />
    <meta name="keywords" content="تعلم برمجة جافا سكريبت, دورة جافا سكريبت, مبتدئين جافا سكريبت, تطوير الويب بجافا سكريبت, أساسيات جافا سكريبت, nakhlahjs, نخلة جي اس" />
    <meta property="og:title" content="نخلة جي أس" />
    <meta property="og:description" content="منصة تعليمية عربية متخصصة في تعلم لغة البرمجة جافاسكريبت بطريقة مبتكرة وتفاعلية." />
</svelte:head>

<main class="h-[90vh] relative">
    <section class="w-full overflow-hidden">
        <div class="container relative w-full px-8 pt-16 mx-auto lg:px-4 z-[5]">
            <div class="flex flex-col w-full mb-12 text-center">
                <h1 class="mb-2 text-6xl font-bold tracking-tighter lg:text-8xl">
                    <span class="bg-gradient-to-br from-yellow-500 to-yellow-300 bg-clip-text text-transparent font-bold">JS</span>
                    <span class="ml-2 bg-gradient-to-bl from-base-content to-base-content/80 bg-clip-text text-transparent font-bold">نخلة</span>
                </h1>
                <p class="text-3xl mb-2">
                    تعلم بسهولة وفعالية
                </p>
                <p class="mx-auto text-lg leading-snug lg:w-1/2">
                    منصة تعليمية عربية. مخصصة لاكتساب مهارات لغة البرمجة جافاسكريبت بشكل ممتع ومبتكر. نتبنى نهجًا فريدًا يركز على التعلم التفاعلي والتطبيق العملي المباشر، مما يمكّن المتعلمين من فهم الأساسيات بشكل أعمق وتطبيق مهاراتهم على الفور.
                </p>
                <div class="mt-4 mb-2 flex flex-col md:flex-row justify-center items-center gap-1">
                    <a
                        href="/intro"
                        class="px-8 text-lg btn bg-primary text-primary-content hover:bg-primary-focus rounded-box"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                        ابدأ الآن
                    </a>
                    <button id="install-pwa" class="px-6 text-lg btn bg-secondary text-secondary-content hover:bg-secondary-focus rounded-box hidden">
                        تحميل التطبيق
                    </button>
                </div>
                
                <!-- About Icons Section -->
                <div class="flex flex-wrap justify-center gap-4 mt-8">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                        <span>تعلم مجاني</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
                        <span>دروس متنوعة</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-4"></path><path d="M12 8h.01"></path><circle cx="12" cy="12" r="10"></circle></svg>
                        <span>معلومات عربية</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="m9 14 2 2 4-4"></path></svg>
                        <span>تدريب عملي</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<!-- Footer -->
<footer class="footer footer-center p-10 bg-base-200 text-base-content rounded">
    <nav class="grid grid-flow-col gap-4">
        <a href="/about" class="link link-hover">من نحن</a>
        <a href="/courses" class="link link-hover">الدروس</a>
        <a href="https://github.com/m7medVision/nakhlah.js" target="_blank" rel="noopener noreferrer" class="link link-hover">المصدر</a>
    </nav> 
    <div>
        <div class="grid grid-flow-col gap-4">
            <a href="https://twitter.com/Mo7medBedwyV" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
            </a> 
            <a href="https://github.com/m7medVision/nakhlah.js" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
            </a>
        </div>
    </div> 
    <div>
        <p>حقوق النشر © 2024 - كل الحقوق محفوظة لمنصة نخلة جي أس</p>
    </div>
</footer>
