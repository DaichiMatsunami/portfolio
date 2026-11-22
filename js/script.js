// lenis

const lenis = new Lenis({
    autoRaf: true,
    duration: 1.4,
    smoothWheel: true,
    anchors: true,
});

// e:lenis

//loadFont + worksExpansion

const body = document.querySelector('body')
const loadFont = document.getElementById('worksTrigger');

const works = document.querySelector('.works');

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