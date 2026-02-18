<script setup lang="ts">
import renderMathInElement from 'katex/contrib/auto-render';
import mermaid from 'mermaid';
import GLightbox from 'glightbox';
import { computed, useTemplateRef, watch } from 'vue';
import { usePlugin } from '@/composables';

const props = defineProps({
    html: {
        type: String,
        required: true,
    },
    // Toggle manual click-to-load behavior
    lazyIframes: {
        type: Boolean,
        default: false,
    },
});

const plugin = usePlugin();
const content = useTemplateRef('content');

/**
 * 1. Process HTML
 * If lazyIframes is true, we strip the 'src', put it in 'data-src',
 * and wrap the iframe in a clickable UI container.
 */
const pluggedHtml = computed(() => {
    let html = plugin.allPluginLoaded.value ? plugin.embed(props.html) : props.html;
    if (!html) return '';

    html = transformMermaidBlock(html);

    if (props.lazyIframes) {
        // Regex looks for iframes, captures attributes and the URL
        return html.replace(
            /<iframe([^>]*)src=["']([^"']+)["']([^>]*)>/gi,
            `<div class="iframe-wrapper">
                <iframe$1data-src="$2"$3 class="lazy-iframe" data-loaded="false"></iframe>
                <div class="iframe-placeholder">
                    <div class="play-button-outer">
                        <div class="play-button-inner"></div>
                    </div>
                </div>
            </div>`
        );
    } else {
        return html.replace(
            /<iframe([^>]*)src=["']([^"']+)["']([^>]*)>/gi,
            `<div class="iframe-wrapper">
                <iframe$1src="$2"$3 class="iframe"></iframe>
            </div>`
        );
    }
});

watch(content, () => {
    renderMath();
    renderMermaid();
});

/**
 * 2. Click Handling
 * Handles Lightbox for <img> and activation for lazy <iframe>.
 */
const handleClick = (event: Event) => {
    const target = event.target as HTMLElement;

    // Handle Lightbox for images
    if (target.tagName === 'IMG') {
        const imgSrc = (target as HTMLImageElement).src;
        openLightBox(imgSrc);
        return;
    }

    // Handle Lazy Iframe activation
    if (props.lazyIframes) {
        const wrapper = target.closest('.iframe-wrapper');
        if (wrapper) {
            const iframe = wrapper.querySelector('iframe');
            if (iframe && iframe.getAttribute('data-loaded') === 'false') {
                const realSrc = iframe.getAttribute('data-src');
                if (realSrc) {
                    iframe.src = realSrc;
                    iframe.setAttribute('data-loaded', 'true');
                    wrapper.classList.add('is-loaded');
                }
            }
        }
    }
};

const openLightBox = (imageUrl: string) => {
    const elements = [{ href: imageUrl, type: 'image', alt: 'image' }];
    const lightbox = GLightbox({
        touchNavigation: true,
        loop: false,
        zoomable: true,
        draggable: true,
        elements: elements,
    });
    lightbox.open();
};

const renderMath = () => {
    if (content.value) {
        renderMathInElement(content.value, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true },
            ],
            throwOnError: false,
            output: 'html',
        });
    }
};

const transformMermaidBlock = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    doc.querySelectorAll('p').forEach((p) => {
        if (!p.textContent?.startsWith('```mermaid')) return;

        const source = p.innerHTML
            .replace(/^```mermaid/, '')
            .replace(/```$/, '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/&nbsp;/g, ' ')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&')
            .trim();

        const div = doc.createElement('div');
        div.className = 'mermaid';
        div.textContent = source;
        p.replaceWith(div);
    });

    return doc.body.innerHTML;
};

const renderMermaid = async () => {
    mermaid.initialize({ startOnLoad: false });
    const mermaidDiagram = content.value?.querySelector('.mermaid');
    if (mermaidDiagram) {
        const { svg } = await mermaid.render('mermaid-svg', mermaidDiagram.textContent ?? '');
        mermaidDiagram.innerHTML = svg;
    }
};
</script>

<template>
    <div
        ref="content"
        class="html-content"
        :class="{ 'mode-lazy-iframes': lazyIframes }"
        v-html="pluggedHtml"
        @click="handleClick($event)"
    />
</template>

<style lang="scss">
@use 'sass:color';

.html-content {
    user-select: text;

    /* --- Lazy Iframe Logic --- */
    &.mode-lazy-iframes {
        .iframe-wrapper {
            position: relative;
            cursor: pointer;

            .lazy-iframe {
                border: none;
                display: block;
                opacity: 0;
                transition: opacity 0.8s ease;

                &[data-loaded='true'] {
                    opacity: 1;
                }
            }

            .iframe-placeholder {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: var(--ion-color-content);
                color: #fff;
                z-index: 5;
                transition: opacity 0.4s ease, visibility 0.4s;

                span {
                    margin-top: 15px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0.8;
                }

                .play-button-outer {
                    width: 70px;
                    height: 70px;
                    background: rgba(var(--ion-color-inria-rgb, 56, 128, 255), 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .play-button-inner {
                        width: 50px;
                        height: 50px;
                        background: var(--ion-color-white);
                        border-radius: 50%;
                        position: relative;

                        &::after {
                            content: '';
                            position: absolute;
                            top: 50%;
                            left: 55%;
                            transform: translate(-50%, -50%);
                            border-top: 10px solid transparent;
                            border-bottom: 10px solid transparent;
                            border-left: 15px solid white;
                        }
                    }
                }
            }

            &.is-loaded {
                cursor: default;
                .iframe-placeholder {
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                }
            }
        }
    }

    @for $i from 1 through 6 {
        h#{7 - $i} {
            font-size: calc(1rem + (0.125rem * $i));
            font-weight: 700;
            line-height: 1.2;
            color: var(--ion-color-text);
            margin-bottom: 0.5em;
        }
    }

    .ill-alert {
        display: flex;
        align-items: center;
        margin: 1em 0;
        background: var(--ion-color-primary);
        color: white;
        border-radius: 4px;
        .ill-icon {
            min-width: 50px;
            text-align: center;
            font-size: 20px;
        }
        p {
            padding: 1em;
            margin: 0;
            font-size: 16px;
        }
    }

    .accordion {
        margin: 1em 0;
        border: 1px solid var(--ion-color-border, #ccc);
        border-radius: 4px;
        // ... (Keep the rest of your accordion CSS)
    }

    .katex-display {
        display: block;
        margin: 1em 0;
    }
}
</style>
