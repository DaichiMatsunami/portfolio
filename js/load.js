gsap.registerPlugin(ScrollTrigger);

const svg = document.querySelector(".visualizer-svg");

// 各バーの幅
const barWidths = Array.from({ length: 50 }, () =>
    Math.floor(Math.random() * 10) + 1
);

const barHeight = 90;
const minGap = 3;
const maxGap = 10;

// SVGのバーを生成
let x = 0;

barWidths.forEach((width, index) => {
    const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
    );

    rect.setAttribute("x", x);
    rect.setAttribute("width", width);
    rect.setAttribute("height", barHeight);

    rect.classList.add("bar");

    if (index === 1) {
        rect.classList.add("active");
    }

    svg.appendChild(rect);

    const gap = Math.random() * (maxGap - minGap) + minGap;

    x += width + gap;
});

// バーの初期状態
const bars = svg.querySelectorAll(".bar");

gsap.set(bars, {
    scaleY: 0,
    transformOrigin: "center bottom"
});

// ページ読み込み時にアニメーション
window.addEventListener("load", () => {

    gsap.to(bars, {
        scaleY: 1,
        duration: 0.4,
        stagger: 0.025,
        ease: "power2.out"
    });
});