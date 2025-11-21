/*
    분할 팝업이 1개라도 있을 경우 실행. ('pop_main_split_multi')
    1. 스와이퍼 실행
    2. 딤드 (1개라도 있을 경우 노출)
    3. close (팝업이 다중일 때 모두 닫아야 dim 닫힘.)

*/

function popSplitMultiInit() {
    const popups = document.querySelectorAll('.pop_main_split_multi');

    popups.forEach(popup => {
        const slide = popup.querySelector('.swiper-slide');
        if(slide.length > 1) {
            popup.querySelectorAll('.bnr_paging, .bnr_btns').forEach(el => {
                el.style.display = 'block';
            });
        } else {
            popup.querySelectorAll('.bnr_paging, .bnr_btns').forEach(el => {
                el.style.display = 'none';
            });
            return;
        }

        const slider = popup.querySelector('.swiper-container')
        if (!slider.length) return;
        if (slider[0].swiper) return;

        new Swiper(slider[0], {
            pagination: {
                el: popup.querySelector('.bnr_paging')[0],
                clickable: true,
            },
            navigation: {
                nextEl: popup.querySelector('.swiper-button-next')[0],
                prevEl: popup.querySelector('.swiper-button-prev')[0],
            },
            loop: true,
            allowTouchMove:false,
            on: {
                init: function () {
                    //adjustPopSplitLayout(); // 배너 개수별 너비 정의
                },
            },
        });
    })
}


function closePopup(id, done) {
    var obj = document.getElementById(id);
    if (obj) {
        var cb = document.getElementById(id+'_done');
        if (cb && cb.checked) {
            setCookieStd(id, 'done', 1);
        }
        if (typeof (done) != 'undefined' && done) {
            setCookieStd(id, 'done', 1);
        }
        if (obj.classList.contains('btm_pop')) {  // 슬라이딩 팝업
            obj.classList.remove('open');
        } else if (obj.classList.contains('pop_main_bnr')) {  // 슬라이딩 팝업
            obj.classList.remove('open');
        } else {
            obj.style.display = 'none';
        }
        //분할팝업 딤드처리
        if (obj.classList.contains('pop_main_split')) {
            // 지금 닫은 것까지 포함해서, 화면에 남은 분할팝업이 하나도 없을 때만 딤드 제거
            if ($('.pop_main_split:visible').length === 0) {
                $('#splitDim').removeClass('on');
            }
        }
    }
    }

function adjustPopSplitLayout() {
    var $popup = $('.pop_main_split').not('.except');
    if (!$popup.length) return;

    var CARD_W = 200;  
    var GAP    = 5;    
    var PAD_L  = 25;   
    var PAD_R  = 24;   
    var maxCount = 0;
    $('.pop_main_split:not(.except) .swiper-slide .cts').each(function () {
        var cnt = $(this).find('a').length;
        if (cnt > maxCount) maxCount = cnt;
    });
    var cols;
    if (maxCount <= 2) {       
        cols = 2;
    } else if (maxCount <= 4) { 
        cols = 2;
    } else if (maxCount <= 6) { 
        cols = 3;
    } else {                    
        cols = 4;
    }

    // 팝업 전체 가로폭 계산
    var popupWidth = PAD_L + PAD_R + CARD_W * cols + GAP * (cols - 1);
    $popup.css('width', popupWidth + 'px');
    
    console.log('no 멀티')

    // 분할팝업
    var $popupMulti = $('.pop_main_split.except');
    if (!$popupMulti.length) return
    console.log('yes 멀티')
}

function popSplitSlide() {
    var $popSplitWrap   = $('.pop_main_split');
    $popSplitWrap.each(function () {
        console.log('실행');
        var $wrap = $(this);
        var $slides = $wrap.find('.swiper-slide');

        if ($slides.length > 1) {
            $wrap.find('.bnr_paging').show();
            $wrap.find('.bnr_btns').show();
        } else {
            $wrap.find('.bnr_paging').hide();
            $wrap.find('.bnr_btns').hide();
            return; // 슬라이드가 하나면 Swiper 자체 생성 안 함
        }
        
        var $mainSplitSlide = $wrap.find('.swiper-container')
        if (!$mainSplitSlide.length) return;
        if ($mainSplitSlide[0].swiper) return;

        popSplitSwiper = new Swiper($mainSplitSlide[0], {
            pagination: {
                el: $wrap.find('.bnr_paging')[0],
                clickable: true,
            },
            navigation: {
                nextEl: $wrap.find('.swiper-button-next')[0],
                prevEl: $wrap.find('.swiper-button-prev')[0],
            },
            loop: true,
            allowTouchMove:false,
            on: {
                init: function () {
                    adjustPopSplitLayout(); // 배너 개수별 너비 정의
                },
            },
        });
    });
}



$(function() {


    popSplitSlide();

    popSplitMultiInit()

    // 여러개의 분할팝업이 있을 경우, 모두 닫기
    var $splitPopup = $('.pop_main_split');
    var $dim        = $('#splitDim');
    if ($splitPopup.length > 0) {
        $dim.addClass('on');
    }
    $dim.on('click', function () {
        var $opened = $('.pop_main_split:visible');
        if ($opened.length) {
            $opened.each(function () {
                closePopup($(this).attr('id'));
            });

            // 팝업 다 닫힌 후 dim 제거
            $dim.removeClass('on');
        } else {
            $dim.removeClass('on');
        }
    });
});