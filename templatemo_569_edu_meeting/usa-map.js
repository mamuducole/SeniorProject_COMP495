document.addEventListener("DOMContentLoaded", () => {
    const mappContainer = document.querySelector("#usa_map");

    if(!mappContainer) return;

    const getStateElement = (target) => {
        const stateEl = target.closest('.state');
        if (stateEl) return stateEl;
        const group = target.closest('.state-group');
        return group ? group.querySelector('.state') || group.querySelector('path') : null;
    };

    /* Hover effects */
    mappContainer.addEventListener('mouseover', (event) => {
        const stateEl = getStateElement(event.target);
        if(stateEl) stateEl.classList.add('hover');
    });
    mappContainer.addEventListener('mouseout', (event) => {
        const stateEl = getStateElement(event.target);
        if(stateEl) stateEl.classList.remove('hover');
    });

    /* Popup element (created on demand) */
    let popup = null;
    function createPopup() {
        popup = document.createElement('div');
        popup.id = 'statePopup';
        popup.className = 'state-popup';
        popup.style.position = 'absolute';
        popup.style.zIndex = 10000;
        popup.addEventListener('click', (e) => e.stopPropagation());
        document.body.appendChild(popup);
    }
    function showPopup(name, href, x, y) {
        if(!popup) createPopup();
        popup.innerHTML = `
            <div class="state-popup-inner">
                <button class="state-popup-close" aria-label="Close">&times;</button>
                <div class="state-popup-title">${name}</div>
                ${ href ? `<button class="state-popup-action" type="button">Visit chapter site</button>` : `<div class="state-popup-no">No chapter website available</div>` }
            </div>
        `;
        const closeBtn = popup.querySelector('.state-popup-close');
        if(closeBtn) closeBtn.addEventListener('click', hidePopup);
        const actionBtn = popup.querySelector('.state-popup-action');
        if(actionBtn && href) {
            actionBtn.addEventListener('click', () => {
                window.open(href, '_blank', 'noopener');
            });
        }

        // Position popup near click, with basic viewport clamping
        const pad = 12;
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        let left = x + pad;
        let top = y + pad + window.scrollY;

        // temporarily set to get size
        popup.style.left = left + 'px';
        popup.style.top = top + 'px';
        popup.style.visibility = 'hidden';
        popup.style.display = 'block';
        const rect = popup.getBoundingClientRect();
        popup.style.visibility = '';

        if(left + rect.width > vw) left = x - rect.width - pad;
        if(top - window.scrollY + rect.height > vh) top = y - rect.height - pad + window.scrollY;

        popup.style.left = Math.max(8, left) + 'px';
        popup.style.top = Math.max(8 + window.scrollY, top) + 'px';
    }
    function hidePopup() {
        if(popup) {
            popup.remove();
            popup = null;
        }
    }

    /* Click events */
    mappContainer.addEventListener('click', (event) => {
        const stateEl = getStateElement(event.target);
        if(stateEl) {
            event.stopPropagation();

            const currentHighlighted = mappContainer.querySelector('.highlight-stance');
            if(currentHighlighted && currentHighlighted !== stateEl) currentHighlighted.classList.remove('highlight-stance');
            stateEl.classList.toggle('highlight-stance');

            const group = stateEl.closest('.state-group');
            const labelEl = group ? group.querySelector('.state-label') || group.querySelector('text') : null;
            const stateName = labelEl ? labelEl.textContent.trim() : (stateEl.id || 'Unknown');
            const linkEl = event.target.closest('a') || stateEl.closest('a') || (group ? group.querySelector('a') : null);
            const href = linkEl ? linkEl.getAttribute('href') : null;

            showPopup(stateName, href, event.clientX, event.clientY);
            if (linkEl) event.preventDefault();
            return;
        }

        const linkTarget = event.target.closest('a');
        if(linkTarget) {
            // If anchor wraps a state, show popup instead of immediately navigating.
            const pathInside = linkTarget.querySelector('.state') || linkTarget.querySelector('path');
            if(pathInside) {
                const group = pathInside.closest('.state-group');
                const labelEl = group ? group.querySelector('.state-label') || group.querySelector('text') : null;
                const stateName = labelEl ? labelEl.textContent.trim() : (pathInside.id || 'Unknown');
                const href = linkTarget.getAttribute('href');
                showPopup(stateName, href, event.clientX, event.clientY);
                event.preventDefault();
            }
        }
    });

    document.addEventListener('click', () => {
        if(popup) hidePopup();
    });

    /* Search/filter function */
    window.filterChapters = function() {
        const input = document.getElementById('chapterSearch');
        if(!input) return;
        const q = (input.value || '').trim().toLowerCase();
        const groups = mappContainer.querySelectorAll('.state-group');

        if(!q) {
            groups.forEach(g => {
                const p = g.querySelector('.state');
                if(p) { p.classList.remove('dim'); p.classList.remove('match'); }
            });
            return;
        }

        let matches = [];
        groups.forEach(g => {
            const labelEl = g.querySelector('.state-label') || g.querySelector('text');
            const name = (labelEl ? labelEl.textContent : (g.querySelector('.state')?.id || '')).toLowerCase();
            const pathEl = g.querySelector('.state') || g.querySelector('path');
            if(name && name.includes(q)) {
                matches.push(g);
                if(pathEl) { pathEl.classList.add('match'); pathEl.classList.remove('dim'); }
            } else {
                if(pathEl) { pathEl.classList.add('dim'); pathEl.classList.remove('match'); }
            }
        });

        if(matches.length === 1) {
            const matchedPath = matches[0].querySelector('.state') || matches[0].querySelector('path');
            if(matchedPath) {
                const rect = matchedPath.getBoundingClientRect();
                const evt = new MouseEvent('click', {clientX: rect.left + 8, clientY: rect.top + 8, bubbles: true});
                matchedPath.dispatchEvent(evt);
            }
        }
    };

});