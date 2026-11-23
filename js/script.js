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

//card

const cards = document.querySelectorAll('.c-container');

cards.forEach((card) => {

    card.addEventListener('mousemove', (e) => {

        const rect = card.getBoundingClientRect();

        // カード内のマウス位置を -1 ～ 1 に正規化
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // 回転角度
        const rotateY = (x - 0.5) * 12;
        const rotateX = (0.5 - y) * 12;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(20px)
        `;
    });

    card.addEventListener('mouseleave', () => {

        card.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            translateZ(20px)
        `;
    });

});

//e:card
