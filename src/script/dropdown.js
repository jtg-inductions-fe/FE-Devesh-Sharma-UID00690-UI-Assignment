// Class Constants
const DROPDOWN_TRIGGER_CLASS = 'dropdown__trigger';
const DROPDOWN_TRIGGER_ACTIVE_CLASS = 'dropdown__trigger--active';
const DROPDOWN_MENU_CLASS = 'dropdown__menu';
const DROPDOWN_MENU_OPEN_CLASS = 'dropdown__menu--open';
const DROPDOWN_CLASS = 'dropdown';

/**
 * Detemines if the current device is touch using touch event capability
 * @returns {boolean} - weather the current client is a touch device
 */
function isTouchDevice() {
    const isTouchScreen =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return isTouchScreen;
}

/**
 * Stores the currently open dropdown menu.
 * @type {HTMLElement | null}
 */
let activeDropdown = null;

/**
 * Tracks the currently open dropdown trigger.
 * @type {HTMLElement | null}
 */
let activeTrigger = null;

/**
 * Toggle dropdown
 * @param {HTMLElement} trigger - The trigger button element
 */
const toggleDropdown = (trigger) => {
    /** @type {HTMLElement} */
    let menu = trigger.nextSibling;

    // Skip non-element nodes (text nodes, comments, etc.)
    while (menu && menu.nodeType !== 1) {
        menu = menu.nextSibling;
    }
    // Verify the node is an element and is a dropdown menu
    if (!menu || !menu.classList.contains(DROPDOWN_MENU_CLASS)) {
        return;
    }

    // Close any existing dropdowns
    const isOpen = menu.classList.contains(DROPDOWN_MENU_OPEN_CLASS);

    // If opening the same dropdown that's open, just close it
    if (isOpen) {
        closeDropdown();
        return;
    }

    // Close any other open dropdown before opening this one
    if (activeDropdown !== null) {
        closeDropdown();
    }

    menu.classList.add(DROPDOWN_MENU_OPEN_CLASS);
    trigger.classList.add(DROPDOWN_TRIGGER_ACTIVE_CLASS);
    trigger.setAttribute('aria-expanded', true);
    activeDropdown = menu;
    activeTrigger = trigger;
};

/**
 * Closes the currently open dropdown (if any).
 */
const closeDropdown = () => {
    if (activeDropdown === null) return;

    activeDropdown.classList.remove(DROPDOWN_MENU_OPEN_CLASS);
    activeTrigger.classList.remove(DROPDOWN_TRIGGER_ACTIVE_CLASS);
    activeTrigger.setAttribute('aria-expanded', false);

    activeDropdown = null;
    activeTrigger = null;
};

/**
 * Initializes all dropdown triggers after the DOM is fully loaded.
 */
const initDropdowns = () => {
    if (!isTouchDevice()) {
        document.querySelectorAll(`.${DROPDOWN_CLASS}`).forEach((menu) => {
            menu.addEventListener('mouseenter', (event) => {
                toggleDropdown(
                    event.target.querySelector(`.${DROPDOWN_TRIGGER_CLASS}`),
                );
            });
        });
    }
    document
        .querySelectorAll(`.${DROPDOWN_TRIGGER_CLASS}`)
        .forEach((trigger) => {
            trigger.addEventListener('click', (event) =>
                toggleDropdown(event.target),
            );
        });
    document.querySelectorAll(`.${DROPDOWN_CLASS}`).forEach((menu) => {
        menu.addEventListener('mouseleave', closeDropdown);
    });
};

document.addEventListener('DOMContentLoaded', initDropdowns);
