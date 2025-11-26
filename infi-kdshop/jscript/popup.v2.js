// 팝업 닫기
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
    }
}


// 팝업 사이즈 계산
function adjustPopSplitLayout() {
    adjustPopSplitLayoutV1(); // 구버전용
    adjustPopSplitLayoutV2(); // v2용
}
function adjustPopSplitLayoutV1() {
    var $popup = $('.pop_main_split').not('.v2');
    if (!$popup.length) return;

    var CARD_W = 200;
    var GAP    = 5;
    var PAD_L  = 25;
    var PAD_R  = 24;

    var maxCount = 0;

    // v1: a 개수 기반으로 cols 계산
    $popup.find('.swiper-slide .cts').each(function () {
        var cnt = $(this).find('a').length;
        if (cnt > maxCount) maxCount = cnt;
    });

    var cols;
    if (maxCount <= 2) {        // 1~2개
        cols = 2;
    } else if (maxCount <= 4) { // 3~4개
        cols = 2;
    } else if (maxCount <= 6) { // 5~6개
        cols = 3;
    } else {                    // 7개 이상
        cols = 4;
    }

    var popupWidth = PAD_L + PAD_R + CARD_W * cols + GAP * (cols - 1);
    $popup.css('width', popupWidth + 'px');
}
function adjustPopSplitLayoutV2() {
    // v2 전용 팝업만
    $('.pop_main_split.v2').each(function () {
        var $popup = $(this);
        
        var SINGLE_W = 1040; // 싱글배너 너비
        var CARD_W = 250; // 쿼터, 더블쿼터 1칸 너비
        var GAP    = 4; // 칸 사이 간격
        var PAD_L  = 25;   
        var PAD_R  = 24;   
        
        var hasSingle = false; // 싱글배너 존재 여부
        var maxCells = 0;

        $popup.find('.swiper-slide .cts').each(function(){
            var $cts = $(this);

            if($cts.find('.is-single').length) {
                hasSingle = true;
                return false;
            }

            var cnt = $cts.find('.cell .is-quarter, .cell .is-double').length;
            if(cnt > maxCells) {
                maxCells = cnt;

                //console.log('maxcells', cnt);
            }
        });

        var popupWidth;

        if(hasSingle) {
            popupWidth = SINGLE_W + PAD_L + PAD_R;
        } else {
            if(maxCells < 1) maxCells = 1;

            popupWidth = PAD_L + PAD_R + CARD_W * maxCells + GAP * (maxCells - 1);
        }

        $popup.css('width', popupWidth + 'px');
    });
}

// 팝업 배경 설정 관련
function bindPopupDimClick() {
    $('.popupDim').each(function(){
        $(this).off('click.popupDim') // 중복 바인딩 방지
            .on('click.popupDim', function () {
                var $opened = $(this).closest('.popupWrap:visible');

                $opened.each(function () {
                    closePopup(this.id);
                });
        });
    })
}

// 팝업 노출시 슬라이드 실행 
function popupMultiSlideInit() {
    var $popupWrap   = $('.popupWrap');

    $popupWrap.each(function () {
        var $wrap = $(this);


        //console.log($wrap)

        // 롤링 레이어의 경우,
        if($wrap.hasClass('rollingPopWrap')) {
            var $rollingCont = $wrap.find('.rolling_cont');
            var $rollingTab  = $wrap.find('.rolling_tab');
            
            console.log('1111')

            if (!$rollingCont.length || !$rollingTab.length) return;

            // rolling_cont가 여러 개일 수도 있으므로 each 처리
            if ($rollingCont.length > 1) {
                $rollingCont.each(function (index) {
                    var $cont      = $(this);
                    var $popSlide  = $cont.find('.swiper-container');
                    var popLen     = $popSlide.find('.swiper-slide').length;
                    var $popThumb  = $rollingTab.eq(index).find('.swiper-container');
                    var popContAct = return_index('rolling_cont', index); // 활성 인덱스
                    var popThumbAct = popContAct + 1;

                    if (!$popSlide.length || !$popThumb.length) return;
                    if ($popSlide[0].swiper) return; // 중복 생성 방지

                    var rollingThumbs = new Swiper($popThumb[0], {
                        freeMode: true,
                        slidesPerView: popLen,
                        watchSlidesVisibility: true,
                        watchSlidesProgress: true,
                    });

                    var rollingSwiper = new Swiper($popSlide[0], {
                        loop: true,
                        slidesPerView: 1,
                        pagination: {
                            el: $cont.find('.swiper-pagination')[0],
                            type: 'fraction',
                        },
                        navigation: {
                            nextEl: $cont.find('.swiper-button-next')[0],
                            prevEl: $cont.find('.swiper-button-prev')[0],
                        },
                        allowTouchMove: false,
                        thumbs: {
                            swiper: rollingThumbs,
                        },
                        initialSlide: popContAct,
                    });

                    // 썸네일 active 처리
                    $wrap.find('.rolling_tab .swiper-slide').removeClass('swiper-slide-thumb-active');
                    $wrap.find('.rolling_tab .swiper-slide:nth-child(' + popThumbAct + ')').addClass('swiper-slide-thumb-active');
                });
            } else {
                // rolling_cont가 1개인 경우
                var $cont      = $rollingCont.eq(0);
                var $popSlide  = $cont.find('.swiper-container');
                var popLen     = $popSlide.find('.swiper-slide').length;
                var $popThumb  = $rollingTab.eq(0).find('.swiper-container');
                var popContAct = return_index('rolling_cont');
                var popThumbAct = popContAct + 1;

                if (!$popSlide.length || !$popThumb.length) return;
                if ($popSlide[0].swiper) return;

                var rollingThumbs = new Swiper($popThumb[0], {
                    freeMode: true,
                    slidesPerView: popLen,
                    watchSlidesVisibility: true,
                    watchSlidesProgress: true,
                });

                var rollingSwiper = new Swiper($popSlide[0], {
                    loop: true,
                    slidesPerView: 1,
                    pagination: {
                        el: $cont.find('.swiper-pagination')[0],
                        type: 'fraction',
                    },
                    navigation: {
                        nextEl: $cont.find('.swiper-button-next')[0],
                        prevEl: $cont.find('.swiper-button-prev')[0],
                    },
                    allowTouchMove: false,
                    thumbs: {
                        swiper: rollingThumbs,
                    },
                    initialSlide: popContAct,
                });

                $wrap.find('.rolling_tab .swiper-slide').removeClass('swiper-slide-thumb-active');
                $wrap.find('.rolling_tab .swiper-slide:nth-child(' + popThumbAct + ')').addClass('swiper-slide-thumb-active');
            }
        } else {
            // 분할 레이어
            var $slides = $wrap.find('.swiper-slide');

            if ($slides.length > 1) {
                $wrap.find('.bnr_paging').show();
                $wrap.find('.bnr_btns').show();
            } else {
                $wrap.find('.bnr_paging').hide();
                $wrap.find('.bnr_btns').hide();
                return;
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
                        adjustPopSplitLayout();
                    },
                },
            });
        };
    });
}

var popups = {};
    popups['popup_base369'] = { idx:369, width:100, height:100, left:0, top:0 }
    popups['popup_base378'] = { left:0, top:0, baseX:0}
    popups['popup_base376'] = { left:1000, top:200, baseX:0}
    popups['popup_base374'] = { left:200, top:200, baseX:0}
    popups['popup_base377'] = { left:500, top:500, baseX:0}
    popups['popup_base393'] = { left:100, top:100, baseX:0 }
    popups['popup_base395'] = { left:0, top:0, baseX:0 }


$(function() {
    $('.dragPopup').parent().draggable({
        start:function(){$(this).find('.dragDummy').css({'display':'block'});}
        , stop:function(){$(this).find('.dragDummy').css({'display':'none'});}
        , drag: function( event, ui ) {
            if(ui.helper.data("basex") > 0){								
                ui.position.top = ui.offset.top;
                ui.position.left = ui.offset.left;
            }
        }
    });
    
    layerPopup.guide = $('#container')[0];

    popupMultiSlideInit();
    bindPopupDimClick();
});

$(document).ready(function(){	
});