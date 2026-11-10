/**
 * 출석체크 캘린더 (Vanilla JS, ES5 / 외부 라이브러리 없음)
 *
 * - 관리자가 설정한 월(month)로 달력 렌더링
 * - 오늘 이후 날짜, 관리자가 설정한 시작일(startDate) 이전 날짜는 선택 불가
 * - N일 연속 출석 시 혜택 (N은 관리자 설정, 구간 여러 개 가능)
 *
 * ※ JSP 안에 인라인으로 넣을 경우 ES6 템플릿 리터럴(`${...}`)은 EL과 충돌하므로
 *    이 파일은 외부 .js 파일로 불러오는 것을 권장합니다.
 *
 * 사용법:
 *   AttendanceCalendar.init({
 *     el: '#attendanceCalendar',
 *     month: '2026-11',              // 관리자 설정 월 (YYYY-MM)
 *     startDate: '2026-11-03',       // 관리자 설정 시작일 (이전 날짜 선택 불가)
 *     today: '2026-11-10',           // 서버 기준 오늘 날짜 (클라이언트 시간 신뢰 X)
 *     attendedDates: ['2026-11-03'], // 이미 출석한 날짜
 *     rewards: [                     // 관리자 설정 혜택 구간 (한 구간에 여러 혜택 지급 가능)
 *       { id: 1, days: 7, items: [
 *           { type: 'POINT',  name: '1,000 포인트' }
 *       ]},
 *       { id: 2, days: 20, items: [
 *           { type: 'POINT',  name: '3,000 포인트' },
 *           { type: 'COUPON', name: '10% 할인 쿠폰' }
 *       ]}
 *     ],
 *     // ※ 단일 혜택은 기존 형식 { id, days, type, name } 도 그대로 동작
 *     receivedRewardIds: [],         // 이미 지급된 혜택 id
 *     onlyToday: false,              // true면 오늘만 출석 가능
 *     checkUrl: '/event/attendance/check.do', // 비우면 데모 모드(로컬에서만 반영)
 *     extraParams: { _csrf: '...' }  // 요청에 같이 보낼 값 (CSRF 등)
 *   });
 *
 * 서버 응답(JSON) 형식:
 *   {
 *     "success": true,
 *     "message": "출석 완료!",
 *     "attendedDates": ["2026-11-03", ...],   // (선택) 서버 기준 최신 출석일 목록
 *     "newRewards": [{ "id": 2 }] // (선택) 이번에 지급된 혜택 구간 id (items를 같이 내려줘도 됨)
 *   }
 */
(function (window, document) {
  'use strict';

  var WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
  var REWARD_TYPE_LABEL = { POINT: '포인트', COUPON: '쿠폰' };

  /* ---------- 날짜 유틸 (타임존 이슈 없이 YYYY-MM-DD 문자열로 처리) ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function parseDate(str) {
    var p = String(str).split('-');
    return new Date(+p[0], +p[1] - 1, p[2] ? +p[2] : 1);
  }

  function formatDate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function addDays(d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // 혜택 구간의 지급 항목 목록 (items 배열 / 기존 type+name 단일 형식 모두 지원)
  function getRewardItems(r) {
    if (r && r.items && r.items.length) return r.items;
    if (r && (r.type || r.name)) return [{ type: r.type, name: r.name }];
    return [];
  }

  // "1,000 포인트 + 무료배송 쿠폰" 형태의 텍스트
  function getRewardText(r) {
    var items = getRewardItems(r), names = [];
    for (var i = 0; i < items.length; i++) names.push(items[i].name);
    return names.join(' + ');
  }

  function toSet(arr) {
    var set = {};
    for (var i = 0; i < (arr || []).length; i++) set[arr[i]] = true;
    return set;
  }

  /* ---------- 연속 출석 계산 ---------- */

  // 이번 달(이벤트 기간) 안에서 가장 긴 연속 출석 일수
  function calcMaxStreak(attendedSet, firstDay, lastDay) {
    var max = 0, cur = 0, d = firstDay;
    while (d <= lastDay) {
      if (attendedSet[formatDate(d)]) { cur++; if (cur > max) max = cur; }
      else cur = 0;
      d = addDays(d, 1);
    }
    return max;
  }

  // 현재 진행 중인 연속 출석 일수 (오늘 미출석이면 어제까지 기준)
  function calcCurrentStreak(attendedSet, todayStr, firstDay) {
    var d = parseDate(todayStr);
    if (!attendedSet[todayStr]) d = addDays(d, -1);
    var count = 0;
    while (d >= firstDay && attendedSet[formatDate(d)]) {
      count++;
      d = addDays(d, -1);
    }
    return count;
  }

  /* ---------- 메인 ---------- */
  function AttendanceCalendar(options) {
    this.opt = options;
    this.root = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
    if (!this.root) throw new Error('[AttendanceCalendar] el을 찾을 수 없습니다: ' + options.el);

    this.monthDate = parseDate(options.month + '-01');
    this.firstDay = this.monthDate;
    this.lastDay = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
    this.startDate = options.startDate ? parseDate(options.startDate) : this.firstDay;
    this.today = parseDate(options.today);
    this.todayStr = formatDate(this.today);

    this.attended = toSet(options.attendedDates);
    this.received = toSet(options.receivedRewardIds);
    this.rewards = (options.rewards || []).slice().sort(function (a, b) { return a.days - b.days; });
    this.loading = false;

    var self = this;
    this.root.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-date]') : null;
      if (btn && self.root.contains(btn) && !btn.disabled) self.check(btn.getAttribute('data-date'));
    });

    this.render();
  }

  // 날짜 선택 가능 여부
  AttendanceCalendar.prototype.isSelectable = function (d) {
    var str = formatDate(d);
    if (d.getMonth() !== this.monthDate.getMonth()) return false; // 설정 월 외
    if (d > this.today) return false;                             // 오늘 이후
    if (d < this.startDate) return false;                         // 설정일 이전
    if (this.opt.onlyToday && str !== this.todayStr) return false;
    if (this.attended[str]) return false;                         // 이미 출석
    return true;
  };

  AttendanceCalendar.prototype.getStats = function () {
    var count = 0;
    for (var k in this.attended) {
      if (this.attended.hasOwnProperty(k) && k.indexOf(this.opt.month) === 0) count++;
    }
    return {
      total: count,
      maxStreak: calcMaxStreak(this.attended, this.firstDay, this.lastDay),
      currentStreak: calcCurrentStreak(this.attended, this.todayStr, this.firstDay)
    };
  };

  AttendanceCalendar.prototype.render = function () {
    var stats = this.getStats();
    var y = this.monthDate.getFullYear();
    var m = this.monthDate.getMonth() + 1;
    var html = '';

    // 헤더
    html += '<div class="atd-head">';
    html += '  <h3 class="atd-title">' + y + '년 ' + m + '월 출석체크</h3>';
    html += '  <ul class="atd-stats">';
    html += '    <li><span>연속 출석</span><strong>' + stats.maxStreak + '일</strong></li>';
    html += '    <li><span>이번 달 출석</span><strong>' + stats.total + '일</strong></li>';
    html += '  </ul>';
    html += '</div>';

    // 혜택 구간
    if (this.rewards.length) {
      var maxDays = this.rewards[this.rewards.length - 1].days;
      var percent = Math.min(100, Math.round(stats.maxStreak / maxDays * 100));
      html += '<div class="atd-rewards">';
      html += '  <div class="atd-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + maxDays +
              '" aria-valuenow="' + stats.maxStreak + '"><span style="width:' + percent + '%"></span></div>';
      html += '  <ul class="atd-reward-list">';
      for (var i = 0; i < this.rewards.length; i++) {
        var r = this.rewards[i];
        var done = this.received[r.id] || stats.maxStreak >= r.days;
        var remain = r.days - stats.maxStreak;
        html += '<li class="atd-reward' + (done ? ' is-done' : '') + '">';
        html += '  <em class="atd-reward-days">' + r.days + '일 연속</em>';
        html += '  <ul class="atd-reward-items">';
        var items = getRewardItems(r);
        for (var j = 0; j < items.length; j++) {
          html += '<li class="atd-reward-item">' +
                  '<span class="atd-reward-type is-' + escapeHtml(String(items[j].type || '').toLowerCase()) + '">' +
                  escapeHtml(REWARD_TYPE_LABEL[items[j].type] || items[j].type || '') + '</span>' +
                  '<strong class="atd-reward-name">' + escapeHtml(items[j].name) + '</strong></li>';
        }
        html += '  </ul>';
        html += '  <span class="atd-reward-state">' + (done ? '지급 완료' : remain + '일 남음') + '</span>';
        html += '</li>';
      }
      html += '  </ul>';
      html += '</div>';
    }

    // 달력
    html += '<div class="atd-calendar">';
    html += '<div class="atd-week">';
    for (var w = 0; w < 7; w++) html += '<span class="atd-weekday' + (w === 0 ? ' is-sun' : w === 6 ? ' is-sat' : '') + '">' + WEEK_LABELS[w] + '</span>';
    html += '</div><div class="atd-days">';

    var startWeekday = this.firstDay.getDay();
    for (var b = 0; b < startWeekday; b++) html += '<span class="atd-day is-empty" aria-hidden="true"></span>';

    for (var d = this.firstDay; d <= this.lastDay; d = addDays(d, 1)) {
      var str = formatDate(d);
      var cls = ['atd-day'];
      var label = '';
      var isAttended = !!this.attended[str];
      var selectable = this.isSelectable(d);

      if (d.getDay() === 0) cls.push('is-sun');
      if (d.getDay() === 6) cls.push('is-sat');
      if (str === this.todayStr) cls.push('is-today');

      if (isAttended) { cls.push('is-attended'); label = '출석'; }
      else if (d > this.today) { cls.push('is-future'); }
      else if (d < this.startDate) { cls.push('is-before'); }
      else if (selectable) { cls.push('is-available'); label = str === this.todayStr ? '출석하기' : ''; }
      else { cls.push('is-missed'); }

      html += '<button type="button" class="' + cls.join(' ') + '" data-date="' + str + '"' +
              (selectable ? '' : ' disabled') +
              ' aria-label="' + m + '월 ' + d.getDate() + '일' + (isAttended ? ' 출석 완료' : selectable ? ' 출석 가능' : ' 선택 불가') + '">' +
              '<span class="atd-num">' + d.getDate() + '</span>' +
              (label ? '<span class="atd-label">' + label + '</span>' : '') +
              '</button>';
    }
    html += '</div></div>';

    this.root.innerHTML = html;
    this.root.classList.add('atd');
    if (this.loading) this.root.classList.add('is-loading');
    else this.root.classList.remove('is-loading');
  };

  // 출석 처리
  AttendanceCalendar.prototype.check = function (dateStr) {
    if (this.loading || !this.isSelectable(parseDate(dateStr))) return;
    var self = this;

    // 데모 모드: 서버 없이 로컬 반영
    if (!this.opt.checkUrl) {
      var before = this.getStats().maxStreak;
      this.attended[dateStr] = true;
      var after = this.getStats().maxStreak;
      var newRewards = [];
      for (var i = 0; i < this.rewards.length; i++) {
        var r = this.rewards[i];
        if (!this.received[r.id] && before < r.days && after >= r.days) {
          this.received[r.id] = true;
          newRewards.push(r);
        }
      }
      this.render();
      this.notify({ success: true, message: '출석 완료!', newRewards: newRewards }, dateStr);
      return;
    }

    this.loading = true;
    this.render();

    var params = { date: dateStr };
    var extra = this.opt.extraParams || {};
    for (var k in extra) if (extra.hasOwnProperty(k)) params[k] = extra[k];
    var body = [];
    for (var p in params) if (params.hasOwnProperty(p)) body.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.opt.checkUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      self.loading = false;
      var res;
      try { res = JSON.parse(xhr.responseText); } catch (e) { res = null; }

      if (xhr.status === 200 && res && res.success) {
        if (res.attendedDates) self.attended = toSet(res.attendedDates);
        else self.attended[dateStr] = true;
        var list = res.newRewards || [];
        for (var i = 0; i < list.length; i++) self.received[list[i].id] = true;
        self.render();
        self.notify(res, dateStr);
      } else {
        self.render();
        self.notify({ success: false, message: (res && res.message) || '출석 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }, dateStr);
      }
    };
    xhr.send(body.join('&'));
  };

  // 결과 안내 (onCheck 콜백이 있으면 그걸 사용, 없으면 alert)
  AttendanceCalendar.prototype.notify = function (res, dateStr) {
    if (typeof this.opt.onCheck === 'function') {
      this.opt.onCheck(res, dateStr, this.getStats());
      return;
    }
    var msg = res.message || (res.success ? '출석 완료!' : '출석에 실패했습니다.');
    if (res.success && res.newRewards && res.newRewards.length) {
      var names = [];
      for (var i = 0; i < res.newRewards.length; i++) {
        var nr = res.newRewards[i];
        // 서버가 id만 내려줘도 설정값에서 항목을 찾아 표시
        if (!getRewardItems(nr).length) {
          for (var k = 0; k < this.rewards.length; k++) if (this.rewards[k].id === nr.id) nr = this.rewards[k];
        }
        names.push(getRewardText(nr));
      }
      msg += '\n\n🎉 연속 출석 혜택이 지급되었습니다.\n- ' + names.join('\n- ');
    }
    window.alert(msg);
  };

  window.AttendanceCalendar = {
    init: function (options) { return new AttendanceCalendar(options); },
    // 테스트/재사용용
    _util: { getRewardText: getRewardText, calcMaxStreak: calcMaxStreak, calcCurrentStreak: calcCurrentStreak, parseDate: parseDate, formatDate: formatDate, toSet: toSet }
  };
})(window, document);