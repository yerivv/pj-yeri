//팝업 v2
// 팝업이 1개라도 있다면 dimd 생성
var $splitPopup = $('.pop_main_split');
var $rolingPopup = $('.pop_main_bnr');
var $dim        = $('#splitDim');

console.log('$splitPopup', $splitPopup.length, ' & $rolingPopup', $rolingPopup.length)

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
