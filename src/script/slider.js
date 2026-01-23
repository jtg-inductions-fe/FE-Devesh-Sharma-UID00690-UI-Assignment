import EmblaCarousel from 'embla-carousel';
import Accessibility from 'embla-carousel-accessibility';
import Autoplay from 'embla-carousel-autoplay';

/**
 * Initializes a single Embla slider in a wrapper element.
 * @param {HTMLElement} wrapperNode - The root slider element containing viewport, controls, and dots.
 * @returns {import('embla-carousel').EmblaCarouselType | undefined}
 */
const initializeSlider = (wrapperNode) => {
    /** @type {HTMLElement | null} */
    const viewportNode = wrapperNode.querySelector('.slider__viewport');
    /** @type {HTMLElement | null} */
    const prevButtonNode = wrapperNode.querySelector('.slider__button--prev');
    /** @type {HTMLElement | null} */
    const nextButtonNode = wrapperNode.querySelector('.slider__button--next');
    /** @type {HTMLElement | null} */
    const dotsNode = wrapperNode.querySelector('.slider__dots');

    if (!viewportNode) return;

    const emblaApi = EmblaCarousel(
        viewportNode,
        { loop: true, align: 'center' },
        [
            Autoplay({ delay: 5000, defaultInteraction: false }),
            Accessibility({}),
        ],
    );
    emblaApi.plugins().autoplay?.play();
    emblaApi.plugins().accessibility?.setupDotButtons(dotsNode);
    emblaApi
        .plugins()
        .accessibility?.setupPrevAndNextButtons(prevButtonNode, nextButtonNode);

    /** @type {HTMLElement[]} */
    let dotNodes = [];

    /**
     * Creates dot button elements based on Embla
     * @param {import('embla-carousel').EmblaCarouselType} emblaApi
     * @param {HTMLElement | null} dotsNode
     * @returns {HTMLElement[]}
     */
    const createDotButtonHtml = (emblaApi, dotsNode) => {
        const dotTemplate = document.getElementById('slider-dot-template');
        if (!dotTemplate || !dotsNode) return [];

        const snapList = emblaApi.snapList();
        dotsNode.innerHTML = snapList.reduce(
            (acc) => acc + dotTemplate.innerHTML,
            '',
        );
        return Array.from(dotsNode.querySelectorAll('.slider__dot'));
    };

    /**
     * Attaches onClick handlers to dot buttons for switching slides
     * @param {import('embla-carousel').EmblaCarouselType} emblaApi
     * @param {HTMLElement[]} dotNodes
     */
    const addDotButtonClickHandlers = (emblaApi, dotNodes) => {
        dotNodes.forEach((dotNode, index) => {
            dotNode.addEventListener(
                'click',
                () => emblaApi.goTo(index),
                false,
            );
        });
    };

    /**
     * Updates the state of dot buttons based on the current slide
     * @param {import('embla-carousel').EmblaCarouselType} emblaApi
     * @param {HTMLElement[]} dotNodes
     */
    const toggleDotButtonsActive = (emblaApi, dotNodes) => {
        if (!dotNodes.length) return;
        const previous = emblaApi.previousSnap();
        const selected = emblaApi.selectedSnap();
        dotNodes[previous]?.classList.remove('slider__dot--selected');
        dotNodes[selected]?.classList.add('slider__dot--selected');
    };

    /**
     * Initializes dot indicators
     * @param {import('embla-carousel').EmblaCarouselType} emblaApi
     * @param {HTMLElement | null} dotsNode
     */
    const createAndSetupDotButtons = (emblaApi, dotsNode) => {
        if (!dotsNode) return;
        dotNodes = createDotButtonHtml(emblaApi, dotsNode);
        addDotButtonClickHandlers(emblaApi, dotNodes);
        toggleDotButtonsActive(emblaApi, dotNodes);
    };

    // Setup dots if dots container exists
    if (dotsNode) {
        createAndSetupDotButtons(emblaApi, dotsNode);
        emblaApi.on('reinit', () =>
            createAndSetupDotButtons(emblaApi, dotsNode),
        );
        emblaApi.on('select', (emblaApi) =>
            toggleDotButtonsActive(emblaApi, dotNodes),
        );
    }

    // Setup navigation buttons if they exist
    if (prevButtonNode) {
        prevButtonNode.addEventListener(
            'click',
            () => emblaApi.goToPrev(),
            false,
        );
    }

    if (nextButtonNode) {
        nextButtonNode.addEventListener(
            'click',
            () => emblaApi.goToNext(),
            false,
        );
    }

    return emblaApi;
};

/**
 * Initialize all sliders on the page
 * @returns {import('embla-carousel').EmblaCarouselType[]}
 */
const initializeAllSliders = () => {
    const sliderNodes = document.querySelectorAll('.slider');
    const emblaApis = [];

    sliderNodes.forEach((sliderNode) => {
        const emblaApi = initializeSlider(sliderNode);
        if (emblaApi) {
            emblaApis.push(emblaApi);
        }
    });

    return emblaApis;
};

// Initialize all sliders when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeAllSliders();
});

// Export for manual initialization if needed
export { initializeSlider, initializeAllSliders };
