function BrowserVersionCheck() { 
	var word; 
	var versionOrType = "another"; 
	var ieName = navigator.appName; 
	var agent = navigator.userAgent.toLowerCase(); 
	/*** 1. IE 버전 체크 ***/ 
	// IE old version ( IE 10 or Lower ) 
	if ( ieName == "Microsoft Internet Explorer" ){ 
		word = "msie "; 
	}else{ 
  		// IE 11 
  		if( agent.search("trident") > -1 ) word = "trident/.*rv:"; 
  		// IE 12 ( Microsoft Edge ) 
  		else if( agent.search("edge/") > -1 ) word = "edge/"; 
	}
	
	var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" ); 
	if ( reg.exec( agent ) != null ) versionOrType = RegExp.$1 + RegExp.$2;
	if( versionOrType == "another" ){ 
  		if (agent.indexOf("chrome") != -1) versionOrType = "Chrome";
  		else if (agent.indexOf("opera") != -1) versionOrType = "Opera";
  		else if (agent.indexOf("firefox") != -1) versionOrType = "Firefox";
  		else if (agent.indexOf("safari") != -1) versionOrType = "Safari"; 
  	}	
	if(versionOrType !== ("Chrome" || "Opera" || "Firefox" || "Safari") ) {
  		return alert("원활한 사용을 위해 아래의 지원브라우저로 접속을 부탁드립니다.\n인터넷 익스플로러 (IE) 브라우저는 마이크로소프트 보안업데이트 종료로 인하여 더이상 지원하지 않습니다.\n(지원 브라우저: Chrome, Opera, Firefox, Safari, Edge 그 외 Chrome 기반 브라우저)");
	}
  	return versionOrType; 
}
    
function fnTestChatbot () {
	$.laybox({
		type: 'iframe',
		source: '../etc/chatbotKeyboard.do',
// 			source: '../order/buy_direct_ifrm.do?gno='+gno+'&cate='+cate,
		borderSize: 0,
		canvasPadding: 0,
		canvasBgColor: null,
		close: false
	});
	return false;
}
function NotReload(){
    if( (event.ctrlKey == true && (event.keyCode == 78 || event.keyCode == 82)) || (event.keyCode == 116) ) {
        event.keyCode = 0;
        event.cancelBubble = true;
        event.returnValue = false;
    } 
}
//상품상세보기(pop)
function detailpop(gno){
	openPopup('/goods/detail_view_pop.do?gno='+gno, "detailpop", 810, 755, "scrollbars=1");
	return false;
}
//상품확대보기(pop)
function zoompop(gno){
	
	layboxOpen('iframe', '../common/zoom_goods_pop.do?gno='+gno);
	return false;
}


//약학정보 보기(pop)
function healthpop(gno){
	layboxOpen('iframe', 'health_goods_pop.do?gno='+gno);
	return false;
}
//관심상품
function wish(gno, btn){
	var target = $(btn);
	if(target.hasClass('active')){
		target.removeClass('active');
	} else {
		target.addClass('active');
	}
}
//장바구니 담기 상세(iframe)
function cartInfo(gno,dno){
	fnSdkDetail(gno,dno)
	layboxOpen('iframe', '/goods/cart_info_ifrm.do?gno='+gno+'&dno='+dno);
}
function mainSlide(a){
	var box = $('#'+a);
	var slide = box.find('.swiper-container');
	var len = slide.find('.swiper-slide').length;

	if( len > 1 ){
		box.find('.swiper-button-box').show();
		slide.addClass('active');
		box.removeClass('swiper-none');
		var wingSwiper = new Swiper(slide, {
			navigation: {
				nextEl: box.find('.swiper-button-next'),
				prevEl: box.find('.swiper-button-prev'),
			},
			loop: true,
			loopAdditionalSlides: 1,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			pagination: {
		        el: box.find('.swiper-pagination'),
		        type: 'fraction',
		      },
		});
	} else {
		box.find('.swiper-button-box').hide();
		slide.removeClass('active');
		box.addClass('swiper-none');
	}
}

//메인배너
function mainVisualSlide02(){
	var slide = $('.big_banners').find('.swiper-container');
	var len = slide.find('.swiper-slide').length;
	var thumb = $('.tab_banners').find('.swiper-container');
	
	if( len > 1 ){
		slide.find('.swiper-button-box').show();
		slide.removeClass('swiper-none');
		thumb.removeClass('swiper-none');

		var swiperThumbs = new Swiper(thumb, {
			slidesPerView: 4,
		    freeMode: true,
		    watchSlidesVisibility: true,
		    watchSlidesProgress: true,
		});

		var swiper = new Swiper(slide, {
			navigation: {
				nextEl: $('.visualBanner .swiper-button-next'),
				prevEl: $('.visualBanner .swiper-button-prev'),
			},
			loop: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			thumbs: {  
	          swiper: swiperThumbs,
	        },
 			pagination: {
		        el: slide.find('.swiper-pagination'),
		        type: 'fraction',
		      },
		});
	} else {
		slide.find('.swiper-button-box').hide();
		slide.addClass('swiper-none');
		thumb.addClass('swiper-none');
	}
}
//상품탭
function itemTab(a){
	var box = $('#'+a);
	var slide = box.find('.swiper-container');
		
		var tabSwiper01 = new Swiper(slide, {
			slidesPerView: "auto",
	        spaceBetween: 4,
	        freeMode: true,
		});		
}

//tab active 가운데로
function muCenter(target) {
    var itemTabWrap = target.closest('.item_tab .swiper-wrapper');
    var targetPos = target.parent("li").position();
    var box = target.closest('.item_tab');
    var boxHalf = box.width() / 2;
    var pos;
    var listWidth = 0;

    itemTabWrap.find('.swiper-slide').each(function() { listWidth += $(this).outerWidth(); });

    var selectTargetPos = targetPos.left + target.outerWidth() / 2;
    var containerWidth = itemTabWrap.closest('.swiper-container').width();

    if (listWidth > containerWidth) {
        if (selectTargetPos <= boxHalf) { // 왼쪽
            pos = 0;
        } else if ((listWidth - selectTargetPos) <= boxHalf) { // 오른쪽
            pos = listWidth - containerWidth;
            if (pos < 0) pos = 0;
        } else {
            pos = selectTargetPos - boxHalf;
        }

        setTimeout(function() {
            itemTabWrap.css({
                "transform": "translate3d(" + (pos * -1) + "px, 0, 0)",
                "transition-duration": "500ms"
            });
        }, 200);
    }

    var itemList = target.closest('.item_tab').siblings('.item_list').attr('id');
    itemSlide(itemList);
}

//베스트상품슬라이드
function itemSlide(a){
	var box = $('#'+a);
	var slide = box.find('.swiper-container');			
	var itemListSwiper01 = new Swiper(slide, {
		slidesPerView: "auto",
		watchSlidesProgress: true,
        scrollbar: {
        	el: box.find('.swiper-scrollbar'),
          },
        navigation: {
        	nextEl: box.find('.swiper-button-next'),
			prevEl: box.find('.swiper-button-prev'),
        },
	});		
}

//타임세일
function timesaleSlide(){
	var box = $('.timesale .bnr_slide');
	var slide = box.find('.swiper-container');
	var len = slide.find('.swiper-slide').length;

	if( len > 1 ){
		box.find('.swiper-button-box').show();
		box.find('.swiper-pagination').show();		
		box.removeClass('swiper-none');
		var timeSwiper = new Swiper(slide, {
			navigation: {
				nextEl: box.find('.swiper-button-next'),
				prevEl: box.find('.swiper-button-prev'),
			},
			loop: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			pagination: {
		        el: box.find('.swiper-pagination'),
		      },
		});
		
		box.hover(function() { 
			timeSwiper.autoplay.stop();
		}, function(){    
			timeSwiper.autoplay.start();
		});

	} else {
		box.find('.swiper-button-box').hide();
		box.find('.swiper-pagination').hide();
		box.addClass('swiper-none');
	}
}
function timePdt(gno){
    var timeSwiper = $('.timesale .swiper-container')[0].swiper;
    timeSwiper.autoplay.stop();
	zoompop(gno);
}
//타임세일 전체일정보기
function fncAllTime() {
	layboxOpen('iframe', '../common/timesale_ifrm.do');
}	
//기획전슬라이드
function evtListSlide(){
	var box = $('#evtListBnr');
	var slide = box.find('.swiper-container');
	var len = slide.find('.swiper-slide').length;

	if( len > 1 ){
		box.find('.swiper-button-box').show();
		slide.addClass('active');
		box.removeClass('swiper-none');
		var brandBnr = new Swiper(slide, {
			navigation: {
				nextEl: box.find('.swiper-button-next'),
				prevEl: box.find('.swiper-button-prev'),
			},
			spaceBetween: 16,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			slidesPerView: 4,
		});
	} else {
		box.find('.swiper-button-box').hide();
		slide.removeClass('active');
		box.addClass('swiper-none');
	}
}
function mainShowroomSlide02(){
	var box = $('#showroomBox');
	var slide = box.find('.swiper-container');
	var len = slide.find('.swiper-slide').length;

	if( len > 1 ){
		box.find('.swiper-button-box').show();
		slide.addClass('active');
		box.removeClass('swiper-none');
		var swiper = new Swiper(slide, {
			navigation: {
				nextEl: box.find('.swiper-button-next'),
				prevEl: box.find('.swiper-button-prev'),
			},
			spaceBetween: 16,
			loop: true,
			loopAdditionalSlides: 1,
			slidesPerView: 2,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
		});
	} else {
		box.find('.swiper-button-box').hide();
		slide.removeClass('active');
		box.addClass('swiper-none');
	}
}

var timerInterval=[];
function startTimer(obj, duration, i) {
	if(duration) {
		var oneDay = 24 * 60 * 60 * 1000;
		var day = Math.trunc(duration / oneDay);
		
		obj.find("span.day").html('D-' + day );
		
		if(day > 0) {
			duration = duration - (day*oneDay);
		}
		
			clearInterval(timerInterval[i]);
			var timer = duration / 1000;
			var hour, min, sec;
			
		    timerInterval[i] = setInterval(function () {
		    	hour = parseInt(timer / 3600);
		    	minutes = parseInt(timer % 3600 / 60);
		    	seconds = parseInt(timer % 3600 % 60);
		    	
		    	hour = hour < 10 ? "0" + hour : hour.toString();
		        minutes = minutes < 10 ? "0" + minutes : minutes.toString();
		        seconds = seconds < 10 ? "0" + seconds : seconds.toString();
			   	
		       if (--timer < 0) {
					if(day > 0){
						--day;
						timer = 86400;
						obj.find("span.day").html('D-' + day );
					}
					else{
			        	clearInterval(timerInterval[i]);
	// 		        	location.reload();
					}
		       }
	
		       obj.find("span.count").html( hour + '<small>:</small>' + minutes + '<small>:</small>' + seconds);
		    }, 1000);
	}
}

function fnSetTimesaleTimer(){
	var i = 1;
	$(".sale_timer").each(function(){
		if($(this).attr("isOpen") == "F"){
			startTimer($(this),$(this).attr("renmain_period"),i++);			
		}
		else{
			$(this).find("span.day").html("진행중");
			$(this).find("span.day").addClass("ing");
            // 종료일시 표시
            var endDate = $(this).attr("endDate");
            var endTime= $(this).attr("endTime").split(":");
            var countHtml = "~ " + endDate + " " + endTime[0] + "<small>:</small>" + endTime[1] + "<small>까지</small>";
			$(this).find("span.count").html(countHtml);
		}
	});
}

var popMainSwiper;

function popMainSlide(){
	const popMainWrap = $('#pop_main_bnr');
	const mainBnrSlide = popMainWrap.find('.swiper-container');		
	popMainSwiper = new Swiper(mainBnrSlide, {
			pagination: {
		      el: '.bnr_paging',
		      clickable: true,
		    },
			navigation: {
				nextEl: popMainWrap.find('.swiper-button-next'),
				prevEl: popMainWrap.find('.swiper-button-prev'),
			},
			loop:true,
		});	
}


var popSplitSlide;

// popup 소스와 겹치는 부분이라 해당 영역으로 업데이트 (분할팝업)
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

    
    // var $mainSplitSlide = $popSplitWrap.find('.swiper-container');

    // popSplitSwiper = new Swiper($mainSplitSlide[0], {
    //     pagination: {
    //         el: $popSplitWrap.find('.bnr_paging')[0],
    //         clickable: true
    //     },
    //     navigation: {
    //         nextEl: $popSplitWrap.find('.swiper-button-next')[0],
    //         prevEl: $popSplitWrap.find('.swiper-button-prev')[0]
    //     },
    //     loop: true,
    //     on: {
    //         init: function () {
    //             adjustPopSplitLayout();      //배너 개수별 너비정의
    //         }
    //     }
    // });
}

function fnMainMainTimesaleAlarmActAjax(mainTimesaleIdx){
	var msg = "타임세일 알림신청을 하시겠습니까?";
	if( $(".mainTimesaleIdx_"+mainTimesaleIdx).hasClass("pressed") ){
		msg = "타임세일 알림신청을 취소 하시겠습니까?"
	}
					
	if (confirm(msg)) {
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "../main/main_timesale_alarm_act_ajax.do",
			data: {mainTimesaleIdx:mainTimesaleIdx},
			error: function (request) {
				alert(request.responseText)
			},
			success: function (response) {
				if (response.result.code == 1) {
					alert(response.result.msg);
					if( $(".mainTimesaleIdx_"+mainTimesaleIdx).hasClass("pressed") ){
						$(".mainTimesaleIdx_"+mainTimesaleIdx).removeClass("pressed");
						$(".mainTimesaleIdx_"+mainTimesaleIdx).text("알림받기");
					}
					return false;
				}
				else if (response.result.code == 0) {
					alert(response.result.msg);
					if( !$(".mainTimesaleIdx_"+mainTimesaleIdx).hasClass("pressed") ){
						$(".mainTimesaleIdx_"+mainTimesaleIdx).addClass("pressed");
						$(".mainTimesaleIdx_"+mainTimesaleIdx).text("신청완료");
					}
					return false;
				}
				else if (response.result.code == 2) {
					alert(response.result.msg);
					return false;
				}
			},
			beforeSend: function() {
				$('.wrap-loading').show();
			}, 
			complete  : function() {
				$('.wrap-loading').hide();
			}
		});	
	}
}		

$(function(){
	BrowserVersionCheck();
	//topAdSlide();
	mainSlide('posterBanner');
	mainSlide('wingLeft01');
	mainSlide('wingLeft02');
	mainSlide('wingRight01');
	mainSlide('wingRight02');
	mainSlide('lineBnr01');
	mainSlide('lineBnr02');
	mainVisualSlide02();
	mainSlide('bestBnr01');
	mainSlide('bestBnr02');	
	itemTab('bestTab');
	itemTab('mdTab');
	// itemSlide('bestList');  //베스트상품 슬라이드
	// itemSlide('mdList'); //md상품 슬라이드
	mainSlide('mainBrandBnr');	
	timesaleSlide();
	evtListSlide();
	mainShowroomSlide02();
	mainSlide('b2cBnr01');	//b2c전용관 배너 슬라이드
	itemTab('b2cTab');//b2c전용관 상품탭 슬라이드
	itemSlide('b2cList'); //b2c전용관 상품 슬라이드
	$('.item_tab').each(function() {
        var $itemTabSwiperItem = $(this).find('.swiper-wrapper .swiper-slide span');

        // 페이지 로드 시 active 항목을 중심으로 설정
        var initialTarget = $itemTabSwiperItem.filter('.active');
        if (initialTarget.length === 0) {
            initialTarget = $itemTabSwiperItem.first();
            initialTarget.addClass('active');
        }
        muCenter(initialTarget);

        $itemTabSwiperItem.click(function() {
            var target = $(this);
            target.closest('.swiper-slide').siblings().find('span').removeClass('active');
            target.addClass('active');
            muCenter(target);
        });
    });
	fnSetTimesaleTimer();
	
	//메인하단팝업 리뉴얼
	if (getCookie('pop_main_bnr') != 'done') {
		$('#pop_main_bnr').addClass('open');
		setTimeout(function() {
			$('#pop_main_bnr.open .bnr_box').css("bottom","0");
		},500);
	}	
	var popBnrSlides = document.querySelectorAll('#pop_main_bnr .swiper-slide');
	if(popBnrSlides.length > 1){
		popMainSlide();
		$('.bnr_btns').show();
	}	
	$('.bnr_bg').on('click', function(event) {
		if ($(event.target).hasClass('bnr_bg')) {
			closePopup('pop_main_bnr');
		}
	});
	//메인분할팝업 리뉴얼
	if (getCookie('pop_main_split') != 'done') {
		$('.pop_main_split').addClass('open');
	}	

	// 위의 다중 팝업 확인 후 스와이퍼 실행되는 부분에 옮김
	// var popSplitSlides = document.querySelectorAll('.pop_main_split .swiper-slide');
	// if(popSplitSlides.length > 1){
	// 	popSplitSlide();
	// 	$('.pop_main_split .bnr_paging').show();
	// 	$('.pop_main_split .bnr_btns').show();
	// }else{
	// 	$('.pop_main_split .bnr_btns').hide();
	// 	$('.pop_main_split .bnr_paging').hide();
	// }
    popSplitSlide();
	adjustPopSplitLayout();
})
$(window).on('scroll',function(){
	var s=$(window).scrollTop();
	var topap = $('#topAd').innerHeight();
	var fixed= topap + 40;
	
	if(s>fixed){
		$('#header').addClass('scroll');
		$('.quick_wing').addClass('sticky');
	}else{
		$('#header').removeClass('scroll');
		$('.quick_wing').removeClass('sticky');
	}
});
document.addEventListener('DOMContentLoaded', function () {
    var closeButtons = document.querySelectorAll('.tooltip_close');
    closeButtons.forEach(function(button) {
        button.addEventListener('click', function () {
            var tooltipBox = this.parentNode; 
            tooltipBox.style.display = 'none'; 
        });
    });
});
document.onkeydown = NotReload;