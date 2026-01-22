// Class Constants
const DROPDOWN_TRIGGER_CLASS = 'dropdown__trigger';
const DROPDOWN_TRIGGER_ACTIVE_CLASS = 'dropdown__trigger--active';
const DROPDOWN_MENU_CLASS = 'dropdown__menu';
const DROPDOWN_MENU_OPEN_CLASS = 'dropdown__menu--open';

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
 * Toggles a dropdown menu between it's open & closed states
 * @param {MouseEvent} event - The click event object
 * @this {HTMLElement} - The trigger button element
 */
function toggleDropdown(event) {
    event.stopPropagation();

    /** @type {HTMLElement} */
    const trigger = this;

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

    // If clicking the same dropdown that's open, just close it
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
}

/**
 * Closes the currently open dropdown (if any).
 */
function closeDropdown() {
    if (activeDropdown === null) return;

    activeDropdown.classList.remove(DROPDOWN_MENU_OPEN_CLASS);
    activeTrigger.classList.remove(DROPDOWN_TRIGGER_ACTIVE_CLASS);
    activeTrigger.setAttribute('aria-expended', false);

    activeDropdown = null;
    activeTrigger = null;
}

/**
 * Initializes all dropdown triggers after the DOM is fully loaded.
 */
function initDropdowns() {
    document
        .querySelectorAll(`.${DROPDOWN_TRIGGER_CLASS}`)
        .forEach((trigger) => {
            trigger.addEventListener('click', toggleDropdown);
        });
}

/**
 * Global click handler to close dropdown when clicking outside
 * @param {MouseEvent} event
 */
function handleOutsideClick(event) {
    if (!activeDropdown) return;

    // Check if click happened inside any open dropdown or its trigger
    const clickedInside =
        activeDropdown.contains(/** @type {Node} */ (event.target)) ||
        activeTrigger?.contains(/** @type {Node} */ (event.target));

    if (!clickedInside) {
        closeDropdown();
    }
}

// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initDropdowns);

// Use capture phase? Usually not needed for this case — bubbling is fine
window.addEventListener('click', handleOutsideClick);
