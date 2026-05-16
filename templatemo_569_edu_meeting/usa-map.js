document.addEventListener("DOMContentLoaded", () => {
    const mappContainer = document.querySelector("#usa_map");

    if(!mappContainer) return;

    /* Hover effects (Mouseenter) */
    mappContainer.addEventListener("mouseover", (event) => {
        if(event.target.classList.contains("state")) {
            event.target.classList.add("hover");
        }
    });

    /* Hover effects (Mouse leaves) */
    mappContainer.addEventListener("mouseout", (event) => {
        if(event.target.classList.contains("state")) {
            event.target.classList.remove("hover");
        }
    });

    /* Click events */
    mappContainer.addEventListener("click", (event) => {
        if(event.target.classList.contains("state")) {
            const currentHighlighted = mappContainer.querySelector(".highlight-stance");
            if(currentHighlighted && currentHighlighted !== event.target) {
                currentHighlighted.classList.remove("highlight-stance");
            }

            event.target.classList.toggle("highlight-stance");

            const stateId = event.target.id;
            console.log('You clicked on: ${stateId}');
        }

        const linkTarget = event.target.closest("a");
        if(linkTarget) {
            return;
        }

    });
});