import "./load.js";
import "./vrm.js";
import "./common.js";

//loadFont + worksExpansion

const body = document.getElementById('body-index')
const loadFont = document.getElementById('worksTrigger');
const works = document.getElementById('works-index');

const loadObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            body.classList.add("is-visible");
            works.classList.add("is-visible");
            loadObserver.unobserve(loadFont);
        }
    });
});

loadObserver.observe(loadFont);//trigger

//e:loadFont + worksExpansion

//card

const cards = document.querySelectorAll('.c-container');

cards.forEach((card) => {

    card.addEventListener('mousemove', (e) => {

        const rect = card.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 12;
        const rotateX = (0.5 - y) * 12;

        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
    });

    card.addEventListener('mouseleave', () => {

        card.style.removeProperty('--rotate-x');
        card.style.removeProperty('--rotate-y');

        // インラインのtransformを完全解除
        card.style.removeProperty('transform');
    });

});

//e:card
