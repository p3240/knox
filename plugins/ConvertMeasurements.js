// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃                   Performers                 ┃
// ┗━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━┛
//      ┃  Details ┃ Convert Measurements ┃
//      ┗━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━┛
// ==UserScript==
// @name         Convert Measurements - High Precision
// @namespace    https://github.com/Stash-KennyG
// @version      1.2
// @description  Allows the conversion of measurements (Inches to CM) without rounding
// @author       KennyG
// @match        http://localhost:9999/performers*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, "value")?.set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

        if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else if (valueSetter) {
            valueSetter.call(element, value);
        } else {
            throw new Error("The given element does not have a value setter");
        }

        const eventName = element instanceof HTMLSelectElement ? "change" : "input";
        element.dispatchEvent(new Event(eventName, { bubbles: true }));
    }

    // UPDATED: Removed Math.round to allow decimals
    function cmToIn(cm) {
        return (parseFloat(cm) / 2.54).toFixed(2);
    }

    function inchesToCm(inches) {
        return (parseFloat(inches) * 2.54).toFixed(2);
    }

    function lbsToKg(lbs) {
        return (parseFloat(lbs) * 0.453592).toFixed(2);
    }

    function parseAndConvert(value) {
        let parts = value.split('-');
        return parts.map(part => {
            const match = part.match(/^([\d.]+)([A-Z]*)$/i); // Updated regex to allow decimal points in input
            if (!match) return part;
            const [, num, cup] = match;
            
            const cms = inchesToCm(num); 
            return `${cms}${cup || ''}`;
        }).join('-');
    }

    function parseHeightToCm(value) {
        value = value.trim();
        // Updated regex to allow decimals in height as well
        const inchOnlyMatch = value.match(/^([\d.]+)(\"?)$/);
        if (inchOnlyMatch) {
            const totalInches = parseFloat(inchOnlyMatch[1]);
            return inchesToCm(totalInches);
        }
        return null;
    }

    function injectWeightButton() {
        const input = document.querySelector('input#weight');
        if (!input || input.dataset.buttonAdded === 'true') return;

        const wrapper = document.createElement('div');
        wrapper.className = 'input-group';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const append = document.createElement('div');
        append.className = 'input-group-append';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mr-2 btn btn-secondary';
        button.title = 'Convert lbs to kg';
        button.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="weight" class="svg-inline--fa fa-weight-scale fa-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M116.6 192c-3-10.1-4.6-20.9-4.6-32 0-61.9 50.1-112 112-112S336 98.1 336 160c0 11.1-1.6 21.9-4.6 32l-71 0 24.6-44.3c6.4-11.6 2.3-26.2-9.3-32.6s-26.2-2.3-32.6 9.3l-37.6 67.7-88.8 0zM128 32L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-64 0C293.3 11.9 260 0 224 0s-69.3 11.9-96 32z"/></svg>`;

        button.addEventListener('click', () => {
            const original = input.value.trim();
            if (!original) return;
            setNativeValue(input, lbsToKg(original));
        });

        append.appendChild(button);
        wrapper.appendChild(append);
        input.dataset.buttonAdded = 'true';
    }

    function injectMeasurementsButton() {
        const input = document.querySelector('input#penis_length');
        if (!input || input.dataset.buttonAdded === 'true') return;

        const wrapper = document.createElement('div');
        wrapper.className = 'input-group';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const append = document.createElement('div');
        append.className = 'input-group-append';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mr-2 btn btn-secondary';
        button.title = 'Convert Inches to Centimeters';
        button.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ruler-horizontal" class="svg-inline--fa fa-ruler-horizontal fa-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M48 384c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48l24 0 0 104c0 13.3 10.7 24 24 24s24-10.7 24-24l0-104 48 0 0 72c0 13.3 10.7 24 24 24s24-10.7 24-24l0-72 48 0 0 104c0 13.3 10.7 24 24 24s24-10.7 24-24l0-104 48 0 0 72c0 13.3 10.7 24 24 24s24-10.7 24-24l0-72 48 0 0 104c0 13.3 10.7 24 24 24s24-10.7 24-24l0-104 24 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48L48 384z"/></svg>`;

        button.addEventListener('click', () => {
            const original = input.value.trim();
            if (!original) return;
            setNativeValue(input, parseAndConvert(original));
        });

        append.appendChild(button);
        wrapper.appendChild(append);
        input.dataset.buttonAdded = 'true';
    }

    function injectHeightButton() {
        const input = document.querySelector('input#height_cm');
        if (!input || input.dataset.buttonAdded === 'true') return;

        const wrapper = document.createElement('div');
        wrapper.className = 'input-group';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const append = document.createElement('div');
        append.className = 'input-group-append';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mr-2 btn btn-secondary';
        button.title = 'Convert U.S. height to cm';
        button.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ruler-vertical" class="svg-inline--fa fa-ruler-vertical fa-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M0 16C0-10.5 21.5-32 48-32l160 0c26.5 0 48 21.5 48 48l0 24-104 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l104 0 0 48-72 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 0 48-104 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l104 0 0 48-72 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 0 48-104 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l104 0 0 24c0 26.5-21.5 48-48 48L48 544c-26.5 0-48-21.5-48-48L0 16z"/></svg>`;

        button.addEventListener('click', () => {
            const original = input.value.trim();
            if (!original) return;
            const converted = parseHeightToCm(original);
            if (converted !== null) {
                setNativeValue(input, converted);
            }
        });

        append.appendChild(button);
        wrapper.appendChild(append);
        input.dataset.buttonAdded = 'true';
    }

    function injectAll() {
        injectMeasurementsButton();
        injectWeightButton();
        injectHeightButton();
    }

    window.addEventListener('load', injectAll);
    new MutationObserver(injectAll).observe(document.body, { childList: true, subtree: true });
})();
