const parallax = document.getElementById('parallax');
if(parallax) {
    const box1 = parallax.querySelector('#wrap1 .item');
    const box2 = parallax.querySelector('#wrap2 .item');
    const box3 = parallax.querySelector('#wrap3 .item');
    const box4 = parallax.querySelector('#wrap4 .item');
    const box5 = parallax.querySelector('#wrap5 .item');
    const box6 = parallax.querySelector('#wrap6 .item');
    const box7 = parallax.querySelector('#wrap7 .item');
    const box8 = parallax.querySelector('#wrap8 .item');
    const box9 = parallax.querySelector('#wrap9 .item');

    // 2초 동안 오른쪽으로 500px 이동 
    // .to 메서드를 사용하면 선택요소는 움직임
    gsap.to(box1, {
        duration: 2,
        x: 500,
        borderRadius: 100,
        rotation: 360
    });

    // 스크롤을 내리고 요소가 보이는 영역에 오면 움직이도록 설정. (scrollTrigger)
    // 움직이는 시점을 trigger 설정
    gsap.to(box2, {
        duration: 2,
        x: 500,
        rotation: 360,
        borderRadius: 100,
        scrollTrigger: {
            trigger: box2,  //시작점 설정
        }
    });

    // 애니메이션 행동을 설정 (toggleActions)
    // onEnter : 애니메이션이 시작했을 때
    // onLeave : 애니메이션이 끝났을 때
    // onEnterBack : 애니메이션이 시작하고 화면에 보이지 않을때
    // onLeaveBack : 애니메이션이 끝나고 화면에 보이지 않을때
    // 요소 값 : play, pause, resume, reset, restart, complete, reverse, none
    gsap.to(box3, {
        duration: 2,
        x: 500,
        rotation: 360,
        borderRadius: 100,
        scrollTrigger: {
            trigger: box3,  //시작점 설정
            toggleActions: "pause play reverse none"
        }
    });

    // 애니메이션의 기준점 : trigger
    // start : 요소의 시작점
    // end : 브라우저의 시작점 -> 요소의 시작점과 브라우저의 시작점이 만나면 작동
    gsap.to(box4, {
        duration: 2,
        x: 500,
        rotation: 360,
        borderRadius: 100,
        scrollTrigger: {
            trigger: box4,  //시작점 설정
            start: 'top 20px',
            end: 'bottom 50%',
            toggleActions: "pause play reverse none",
            markers: false,
        }
    });

    // 스크롤을 내리면 같이 움직이게 설정 : scrub (마우스 스크롤 값에 따라 움직이도록 설정)
    // true 및 정수값 넣을 수 있음 (0.5, 1, 2..) 속도느낌?
    gsap.to(box5, {
        duration: 2,
        x: 500,
        rotation: 360,
        borderRadius: 100,
        scrollTrigger: {
            trigger: box5,  //시작점 설정
            start: 'top 50%',
            end: 'bottom 20%',
            scrub: .5,
            markers: false,
        }
    });

    // ❓ 고정시키는 속성 : pin
    // 핀의 위치는 end의 두번째 속성값을 변경해보면 확인
    gsap.to(box6, {
        duration: 2,
        x: 500,
        rotation: 360,
        borderRadius: 100,
        scrollTrigger: {
            trigger: box6,  //시작점 설정
            start: 'top 50%',
            end: 'top 10%',
            pin: true,
            scrub: true,
            markers: false,
        }
    });

    // 시작점이 됐을때 class 추가 : toggleClass
    // id 값을 추가하면 마커의 이름을 변경할 수 있음
    gsap.to(box7, {
        duration: 2,
        x: 500,
        rotation: 360,
        borderRadius: 100,
        scrollTrigger: {
            trigger: box7,
            start: "top center",
            end: "bottom top",
            scrub: true,    
            markers: false,
            toggleClass: "active",
            id: "box7"
        }
    });

    // 시작점이 됐을때 class 추가 : toggleClass
    // id 값을 추가하면 마커의 이름을 변경할 수 있음
    // 각각 콜백 함수에 대한 설정값 확인
    gsap.to(box8, {
        duration: 2,
        x: 500,
        rotation: 360,
        borderRadius: 100,
        scrollTrigger: {
            trigger: box8,
            start: "top center",
            end: "bottom 30%",
            scrub: true,    
            markers: true,
            id: "box8",
            onEnter: () => {console.log("box8 onEnter")},
            onLeave: () => {console.log("box8 onLeave")},
            onEnterBack: () => {console.log("box8 onEnterBack")},
            onLeaveBack: () => {console.log("box8 onLeaveBack")},
        // onUpdate : (self) => {console.log("onUpdate", self.progress.toFixed(3))}, // progress : 현재 애니메이션의 진행률을 나타내는 값으로, toFixed(N) : 값을 소수점 세 자리까지 고정하여 표시해 줍니다
            onToggle : (self) => {console.log("onToggle", self.isActive)},
        }
    });
}

const parallax2 = document.getElementById('parallax2');
if(parallax2) {
    console.log(parallax2);

    // 기본 애니메이션
    const box1 = parallax2.querySelector('#wrap1');
    const ani1 = gsap.timeline();
    ani1.to(box1.querySelector('.img'), {rotation: 720, scale: 0, borderRadius: 200})
        .to(box1.querySelector('.img'), {rotation: 0, scale: 1, borderRadius: 20});

    // animation: ani1: ani1이라는 GSAP 애니메이션을 스크롤바와 연결합니다. 사용자가 스크롤을 움직이면 ani1의 재생 진행률이 스크롤 위치에 맞춰 동기화됩니다.
    // trigger: box1: 이 스크롤 동작을 시작하고 끝내는 기준이 되는 HTML 요소입니다. 즉, box1이 특정 위치에 도달하면 애니메이션이 시작됩니다.
    // start: "top top": 애니메이션이 시작되는 시점을 정의합니다. **trigger 요소(box1)의 상단(top)**이 **뷰포트(브라우저 창)의 상단(top)**에 닿는 순간 애니메이션이 시작됩니다.
    // end: "+=2000": 애니메이션이 끝나는 스크롤 지점을 정의합니다. start 지점부터 스크롤을 2000px 더 내려갈 때까지 애니메이션이 계속 재생됩니다. 애니메이션 전체가 재생되는 스크롤 구간은 2000px입니다.
    // scrub: true: 이 속성은 애니메이션의 재생률을 스크롤 진행률과 1:1로 연결합니다. 스크롤을 내리면 애니메이션이 재생되고, 스크롤을 올리면 애니메이션이 되감아집니다. 이 속성이 없으면 애니메이션은 start 지점에서 한 번만 재생됩니다.
    // 📌 pin: true: 핵심적인 속성입니다. start 지점에 도달하면 box1 요소를 화면에 고정시킵니다. 사용자가 2000px를 스크롤하는 동안 box1은 움직이지 않고 제자리에 고정된 상태로 애니메이션이 재생됩니다. 2000px 구간이 끝나면 고정이 풀리고 일반적인 스크롤이 다시 가능해집니다.
    // 📌 anticipatePin: true: 고정 기능(pin)이 더 안정적으로 작동하도록 돕는 속성입니다. 고정 시작/종료 지점에 아주 미세한 여백을 추가하여, 특히 모바일 환경에서 발생할 수 있는 화면 튕김 현상을 방지합니다.
    // markers: true: 개발 및 디버깅용 속성입니다. 화면에 start, end, pin-start 등 스크롤 트리거의 동작 지점을 시각적으로 표시해줍니다. 이를 통해 애니메이션이 정확히 어디서 시작하고 끝나는지 쉽게 파악할 수 있습니다.
    ScrollTrigger.create({
        animation: ani1,
        trigger: box1,
        start: "top top",
        end: "+=2000",
        scrub: true,
        pin: true,
        anticipatePin: true,
        markers: false,
    });

    // 이미지 순차 노출
    const box2 = parallax2.querySelector('#wrap2');
    const ani2 = gsap.timeline();
    ani2.from(box2.querySelector('.i1'), {y: -100, autoAlpha: 0, borderRadius: 200})
        .from(box2.querySelector('.i2'), {y: 100, autoAlpha: 0, borderRadius: 200})
        .from(box2.querySelector('.i3'), {y: -100, autoAlpha: 0, borderRadius: 200});

    // anticipatePin: true는 1과 동일합니다. 
    // 이는 GSAP가 pinSpacing을 위한 공간을 추가할 때, 스크롤 시작 지점과 끝 지점 양쪽에 각각 추가적인 공간을 확보하도록 합니다. 이 공간의 크기는 일반적으로 start 지점의 스크롤 속도와 관련이 있으며, 부드러운 전환을 위해 계산됩니다.
    ScrollTrigger.create({
        animation: ani2,
        trigger: box2,
        start: "top top",
        end: "+=2000",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: false,
    })

    // 이미지 랜덤 노출
    const box3 = parallax2.querySelector('#wrap3');
    const ani3 = gsap.timeline();
    ani3.from(box3.querySelectorAll('.img'), {
        autoAlpha: 0,
        y: -100,
        ease: 'back.out(3)',
        stagger: {
            amount: 3,
            from: 'random',
        }
    })

    ScrollTrigger.create({
        animation: ani3,
        trigger: box3,
        start: "top top",
        end: "+=3000",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: false,
    })

    // 이미지 확대 > 축소
    const box4 = parallax2.querySelector('#wrap4');
    const ani4 = gsap.timeline();
    ani4.from(box4.querySelector('.img'), {
        autoAlpha: .0,
        scale: 3,
        width:  '100vw',
        height: '100vh',
    })

    ScrollTrigger.create({
        animation: ani4,
        trigger: box4,
        start: "top top",
        end: "+=3000",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: false,
    })

    // 텍스트 좌우 펼쳐지기
    const box5 = parallax2.querySelector('#wrap5');
    const ani5 = gsap.timeline();
    ani5.to(box5.querySelector('.t1'), {xPercent: 300}, "text")
        .to(box5.querySelector('.t2'), {xPercent: -300}, "text")
        .to(box5.querySelector('.t3'), {xPercent: 300}, "text")
        .to(box5.querySelector('.t4'), {xPercent: -300}, "text")
        
    ScrollTrigger.create({
        animation: ani5,
        trigger: box5,
        start: "top top",
        end: "+=3000",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: false,
    })

    // 텍스트 확대
    const box6 = parallax2.querySelector('#wrap6');
    const ani6 = gsap.timeline();
    ani6.to(box6.querySelector('.text'), {scale: 10, duration: 2})
        .to(box6.querySelector('.text'), {autoAlpha: 0})
        
    ScrollTrigger.create({
        animation: ani6,
        trigger: box6,
        start: "top top",
        end: "+=3000",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: false,
    })

    // 텍스트 제자리에 순차 노출
    const box7 = parallax2.querySelector('#wrap7');
    const ani7 = gsap.timeline();
    ani7.from(box7.querySelector('.t1'), {autoAlpha: 0, duration: 1, y: 50}, "+=1")
        .from(box7.querySelector('.t2'), {autoAlpha: 0, duration: 1, y: 50}, "+=1")
        .from(box7.querySelector('.t3'), {autoAlpha: 0, duration: 1, y: 50}, "+=1")
        .from(box7.querySelector('.t4'), {autoAlpha: 0, duration: 1, y: 50}, "+=1")
        .from(box7.querySelector('.t5'), {autoAlpha: 0, duration: 1, y: 50}, "+=1")
        .from(box7.querySelector('.t6'), {autoAlpha: 0, duration: 1, y: 50}, "+=1")
        .from(box7.querySelector('.t7'), {autoAlpha: 0, duration: 1, y: 50}, "+=1")
        
    ScrollTrigger.create({
        animation: ani7,
        trigger: box7,
        start: "top top",
        end: "+=6000",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: false,
    })

    // 텍스트 좌우에서 몰려오기
    const box8 = parallax2.querySelector('#wrap8');
    const ani8 = gsap.timeline();
    ani8.from(box8.querySelector('.t1'), {x: innerWidth * 1})
        .from(box8.querySelector('.t2'), {x: innerWidth * -1})
        .from(box8.querySelector('.t3'), {x: innerWidth * 1})
        
    ScrollTrigger.create({
        animation: ani8,
        trigger: box8,
        start: "top top",
        end: "+=4000",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        markers: false,
    })

    // 이미지 확대
    const box9 = parallax2.querySelector('#wrap9');
    const ani9 = gsap.timeline();
    ani9.to(box9.querySelector('.img'), {scale: 10})
        
    ScrollTrigger.create({
        animation: ani9,
        trigger: box9,
        start: "top top",
        end: "+=4000",
        scrub: true,
        pin: true,
        anticipatePin: 'auto',
        markers: false,
    })
}