const enquireBtn = document.getElementById("enquireBtn");
const enquireBtnArrow = document.getElementById("NE_arrow");

let t1 = gsap.timeline();

enquireBtn.onmouseenter = () => {
    gsap.to(enquireBtn, {
        delay: 0.1,
        // width: "9em", // todo
        // height: "9em",
        clipPath: "circle(40% at 50% 50%)",
        duration: 0.8,
        ease: Circ.easeOut,
    });
    t1.to(enquireBtnArrow, {
        delay: 0.1,
        y: `-${enquireBtn.clientHeight / 2}px`,
        x: `${enquireBtn.clientHeight / 2}px`,
        duration: 0.3,
    })
        .set(enquireBtnArrow, {
            x: `-${enquireBtn.clientHeight / 2}px`,
            y: `${enquireBtn.clientHeight / 2}px`,
        })
        .to(enquireBtnArrow, {
            x: 0,
            y: 0,
            duration: 1,
            ease: Expo.easeOut,
        });
};
enquireBtn.onmouseleave = () => {
    t1.clear();
    gsap.to(enquireBtnArrow, {
        x: 0,
        y: 0,
        ease: Circ.easeOut,
    });
    gsap.to(enquireBtn, {
        // width: "12em", // todo
        // height: "12em",
        clipPath: "circle(50% at 50% 50%)",
        duration: 1,
        ease: Circ.easeOut,
    });
};
