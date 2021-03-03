function daysInMonth(month) {
  var year = new Date().getFullYear();
  return new Date(year, month, 0).getDate();
}

function getWeekDayName(day, month) {
  var days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  var year = new Date().getFullYear();
  var d = new Date(year, month - 1, day);
  return days[d.getDay()];
}

function getRandomColor() {
  return "hsl(" + 360 * Math.random() + ',' +
             (25 + 70 * Math.random()) + '%,' +
             (50 + 10 * Math.random()) + '%)';
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

$.fn.multiline = function(text){
  this.text(text);
  this.html(this.html().replace(/\n/g,'<br />'));
  return this;
}

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(380|)?(\d{2})(\d{3})(\d{2})(\d{2})$/);

  if (match) {
    var intlCode = (match[1] ? '+380 ' : '');
    return [intlCode, '(', match[2], ') ', match[3], ' ', match[4], ' ', match[5]].join('');
  }

  return phoneNumberString;
}

function rgb2hsl(rgb_s) {
  tmp_s = rgb_s.substring(4, rgb_s.length - 1);
  rgb_vals = tmp_s.split(',');
  r = rgb_vals[0];
  g = rgb_vals[1];
  b = rgb_vals[2];

  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
      h = s = 0;
  }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
}

let days_amount = 153;
let rooms_amount = 45;

let ch = 30;
let cw = 60;

var tmp_d = 1;
var tmp_m = 5;

var rooms_list_block_w = 100;

function createBookingDiv(start_day_index, room, days, b_id, timetype) {
  var $pr_err_stop = 0;

  if(start_day_index + days > days_amount) {
    alert('ERR3100: Невозможно создать бронирование для даты, которая выходит за границы сезона.');
    return false;
  }

  var $resolved_x = 132 + start_day_index * cw;
  var $resolved_y = (room_num_list.indexOf(room) + 1) * ch + 22;
  var $resolved_l = cw * Math.round(days);

  if(timetype.charAt(0) == 'd') {
    $resolved_x -= 30;
    $resolved_l += 30;
  }
  if(timetype.charAt(1) == 'n') {
    $resolved_l += 28;
  } else {
    $resolved_l -= 2;
  }

  $('.schedule-booked').each(function() {
    if($resolved_y == $(this).position().top) {
      var $tmp_l_start = $(this).position().left;
      var $tmp_l_end = $tmp_l_start + $(this).width();

      if(($resolved_x + $resolved_l >= $tmp_l_start && $resolved_x + $resolved_l <= $tmp_l_end) || ($resolved_x <= $tmp_l_start && $tmp_l_end <= $resolved_x + $resolved_l) || ($resolved_x >= $tmp_l_start && $resolved_x <= $tmp_l_end)) {
        alert('ERR3102: Невозможно создать бронирование на период, который пересекает другое бронирование.');
        $pr_err_stop = 1;
      }
    }
  });

  if($pr_err_stop == 1) {
    return false;
  }

  $cell_div_bg = $('<div />').appendTo('#booking-boxes');
  $cell_div_bg.css("left", $resolved_x);
  $cell_div_bg.css("top", $resolved_y);
  $cell_div_bg.css("width", $resolved_l);
  $cell_div_bg.attr('class', 'schedule-booked');
  $cell_div_bg.attr('id', 'bgsch-id-' + b_id);

  $cell_div_b = $('<div />').appendTo($cell_div_bg);
  $cell_div_b.attr('class', 'schedule-booked-box');
  $cell_div_b.css("background-color", getRandomColor());
  $cell_div_b.attr('id', 'bsch-id-' + b_id);

  return $cell_div_b;
}

function highlight_booking_div(selected_id) {
  var tmp_color = $('#bsch-id-' + selected_id).css("background-color");
  tmp_color = rgb2hsl(tmp_color);

  $("body,html").animate({
    scrollTop: $('#bgsch-id-' + selected_id).offset().top - ($(window).height() / 2) + 15,
    scrollLeft: $('#bgsch-id-' + selected_id).offset().left - ($(window).width() / 2) + (parseInt($('#bgsch-id-' + selected_id).css('width')) / 2)
  }, 300);

  setTimeout(function() {
    $('#bsch-id-' + selected_id).css('background-color', "hsl(" + tmp_color[0] + ',' + tmp_color[1] + '%,' + 95 + '%)');
    setTimeout(function() {
      $('#bsch-id-' + selected_id).css('background-color', "hsl(" + tmp_color[0] + ',' + tmp_color[1] + '%,' + tmp_color[2] + '%)');
    }, 750);
  }, 300);
}

function close_details_popup() {
  $('#shaded-screen').remove();
  $('body').css('overflow', '');
  $('#booking-details-popup').toggle();

  $('#booking-inp-name').val('');
  $('#booking-inp-phone').val('');
  $('#booking-inp-room').val('');
  $('#booking-inp-doa').val('');
  $('#booking-inp-dod').val('');
  $('#booking-inp-mod').val('');
  $('#booking-inp-info').val('');

  $('#booking-inp-doa-timetype').val('2');
  $('#booking-inp-dod-timetype').val('4');

  $('#booking-details-save-btn').attr('class', '');
  $('#booking-details-delete-btn').attr('class', '');
  $('#booking-details-delete-btn').removeAttr('hidden');
}

function close_search_popup() {
  $('#shaded-screen').remove();
  $('body').css('overflow', '');
  $('#booking-search-popup').toggle();
}

function close_dailyreport_popup() {
  $('#shaded-screen').remove();
  $('body').css('overflow', '');
  $('#booking-dailyreport-popup').toggle();
}

function update_dailyreport(day_index) {
  $('#dailyreport-results').empty();

  if(day_index == -1) {
    return false;
  }

  $.getJSON('action', {listbydate:day_index, uid:getCookie('id'), auth:getCookie('token')}, function(data) {
    if(`${data.status}` == 'ok') {
      if(data.amount > 0) {
        $.each(data.res, function() {
          var search_ul_li = $("<li />");
          search_ul_li.attr('id', 'dailyrepres-id-' + this.id);
          search_ul_li.text(this.name);

          var txt_dr_desc = '';
          if(parseInt($('#dailyreport-inp-req').val()) == parseInt(this.first_day_index)) {
            txt_dr_desc = txt_dr_desc + 'Въезд ';
            if(this.timetype.charAt(0) == 'd') {
              txt_dr_desc = txt_dr_desc + 'в первой половине дня';
            } else if(this.timetype.charAt(0) == 'n'){
              txt_dr_desc = txt_dr_desc + 'во второй половине дня';
            }
          } else {
            txt_dr_desc = txt_dr_desc + 'Выезд ';
            if(this.timetype.charAt(1) == 'd') {
              txt_dr_desc = txt_dr_desc + 'в первой половине дня';
            } else if(this.timetype.charAt(1) == 'n'){
              txt_dr_desc = txt_dr_desc + 'во второй половине дня';
            }
          }

          search_ul_li.append($("<p />").text('Комната: ' + this.room + '\nНомер телефона: ' + this.phone + '\n' + txt_dr_desc));
          $('#dailyreport-results').append(search_ul_li);
        });
      } else {
        alert('В выбранный день нет записей о въезде или выезде.');
      }
    } else {
      alert('ERR0019 Ошибка запроса.');
    }
  });
}

$(window).on('scroll', function() {
    var tmp_top_s = $(this).scrollTop();
    $('#rooms-list').css('top', -tmp_top_s);

    var tmp_left_s = $(this).scrollLeft();
    $('#days-list').css('left', -tmp_left_s + 100);
});

var day_i_arr = [];

var room_num_list = [39, 1, 2, 3, 4, 5, 6, 7, 8, 35, 36, 37, 38, 43, 44, 45, 25, 27, 28, 29, 30, 32, 34, 40, 41, 42, 26, 31, 33, 17, 18, 19, 20, 21, 22, 23, 24, 9, 10, 11, 12, 13, 14, 15, 16];

function fill_dod_select(start_day_index) {
  $("#booking-inp-dod").empty();
  for(let i = start_day_index + 1; i < days_amount; i++) {
    $("#booking-inp-dod").append($("<option />").val(i - start_day_index).text(day_i_arr[i]));
  }
}

$(document).ready(function() {
  var tmp_ard = 1;
  var tmp_arm = 5;

  for(let i = 0; i < days_amount; i++) {
    day_i_arr.push(("0" + tmp_ard).slice(-2) + '.' + ("0" + tmp_arm).slice(-2));

    tmp_ard++;

    if(tmp_ard > daysInMonth(tmp_arm)) {
      tmp_ard = 1;
      tmp_arm++;
    }
  }

  var $roomslist_div = $('#rooms-list');
  $roomslist_div.css("width", rooms_list_block_w);
  $roomslist_div.css("height", ch * (rooms_amount + 1));

  var $dayslist_div = $('#days-list');
  $dayslist_div.css("width", cw * days_amount);

  for (let i = 1; i <= rooms_amount; i++) {
    $cell_div_room = $('<div />').appendTo('#rooms-list');
    $cell_div_room.attr('class', 'schedule-cell');
    $cell_div_room.css("top", i * ch + 20);
    $cell_div_room.attr('id', 'room-index-' + room_num_list[i - 1]);
    var $cell_div_p = $('<p />').appendTo($cell_div_room);
    if(i == 1) {
      $cell_div_p.text('Коттедж ' + room_num_list[i - 1]);
    } else {
      $cell_div_p.text(room_num_list[i - 1]);
    }
  }

  for (let i = 0; i <= rooms_amount; i++) {
    for (let j = 0; j < days_amount; j++) {
      if(i == 0) {
        var $cell_div = $('<div />').appendTo('#days-list');
        $cell_div.attr('class', 'schedule-cell');
        $cell_div.attr('id', 'day-index-' + j);
        $cell_div.css("left", j * cw);
        var $cell_div_p = $('<p />').appendTo($cell_div);
        $cell_div_p.text(("0" + tmp_d).slice(-2) + '.' + ("0" + tmp_m).slice(-2));
        var $cell_div_p2 = $('<p />').appendTo($cell_div);
        $cell_div_p2.text(getWeekDayName(tmp_d, tmp_m));

        tmp_d++;
        if(tmp_d > daysInMonth(tmp_m)) {
          tmp_d = 1;
          tmp_m++;
        }

        continue;
      }


      var $cell_div = $('<div />').appendTo('#schedule-body');
      $cell_div.attr('class', 'schedule-cell');
      $cell_div.css("top", i * ch + 20);
      $cell_div.css("left", j * cw + rooms_list_block_w);
      $cell_div.data("room", room_num_list[i - 1]);
      $cell_div.data("day", j);
    }
  }

  $('#schedule-body .schedule-cell').mouseenter(function() {
    var $tmp_hov_r = $(this).data("room");
    var $tmp_hov_d = $(this).data("day");

    $('#day-index-' + $tmp_hov_d).css('background-color', '#bbb');
    $('#room-index-' + $tmp_hov_r).css('background-color', '#bbb');
  });
  $('#schedule-body .schedule-cell').mouseleave(function() {
    var $tmp_hov_r = $(this).data("room");
    var $tmp_hov_d = $(this).data("day");

    $('#day-index-' + $tmp_hov_d).css('background-color', '');
    $('#room-index-' + $tmp_hov_r).css('background-color', '');
  });

  $('#schedule-body .schedule-cell').click(function() {
    var $tmp_hov_r = $(this).data("room");
    var $tmp_hov_d = $(this).data("day");

    var $fullscreen_block_div = $('<div />').appendTo('body');
    $fullscreen_block_div.attr('id', 'shaded-screen');
    $('body').css('overflow', 'hidden');
    $('#booking-details-delete-btn').attr("hidden", true);
    $('#booking-details-popup').toggle();

    $('#booking-inp-room').val($tmp_hov_r);
    $('#booking-inp-doa').val($tmp_hov_d);
    fill_dod_select($tmp_hov_d);
    $('#booking-inp-mod').val(1);
    $('#booking-inp-dod').val(1);
    $('#booking-inp-phone').val('+380');

    $('#booking-inp-info').val('');
  });

  var $tmp_room_optgroup_ct = $('<optgroup label="Коттедж" />');
  var $tmp_room_optgroup_2l = $('<optgroup label="Двухместный люкс" />');
  var $tmp_room_optgroup_4l = $('<optgroup label="Четырёхместный люкс" />');
  var $tmp_room_optgroup_6l = $('<optgroup label="Шестиместный люкс" />');
  var $tmp_room_optgroup_2e = $('<optgroup label="Двухместный эконом" />');
  var $tmp_room_optgroup_4e = $('<optgroup label="Четырёхместный эконом" />');

  for (let tmp_r_i = 0; tmp_r_i < rooms_amount; tmp_r_i++) {
    if(tmp_r_i == 0) {
      $tmp_room_optgroup_ct.append($("<option />").val(room_num_list[tmp_r_i]).text(room_num_list[tmp_r_i]));
    } else if(tmp_r_i >= 1 && tmp_r_i < 16) {
      $tmp_room_optgroup_2l.append($("<option />").val(room_num_list[tmp_r_i]).text(room_num_list[tmp_r_i]));
    } else if(tmp_r_i >= 16 && tmp_r_i < 26) {
      $tmp_room_optgroup_4l.append($("<option />").val(room_num_list[tmp_r_i]).text(room_num_list[tmp_r_i]));
    } else if(tmp_r_i >= 26 && tmp_r_i < 29) {
      $tmp_room_optgroup_6l.append($("<option />").val(room_num_list[tmp_r_i]).text(room_num_list[tmp_r_i]));
    } else if(tmp_r_i >= 29 && tmp_r_i < 37) {
      $tmp_room_optgroup_2e.append($("<option />").val(room_num_list[tmp_r_i]).text(room_num_list[tmp_r_i]));
    } else if(tmp_r_i >= 37 && tmp_r_i < 45) {
      $tmp_room_optgroup_4e.append($("<option />").val(room_num_list[tmp_r_i]).text(room_num_list[tmp_r_i]));
    }
  }

  $("#booking-inp-room").append($tmp_room_optgroup_ct);
  $("#booking-inp-room").append($tmp_room_optgroup_2l);
  $("#booking-inp-room").append($tmp_room_optgroup_4l);
  $("#booking-inp-room").append($tmp_room_optgroup_6l);
  $("#booking-inp-room").append($tmp_room_optgroup_2e);
  $("#booking-inp-room").append($tmp_room_optgroup_4e);

  var tmp_d_d = 1;
  var tmp_d_m = 5;

  for (let tmp_d_i = 0; tmp_d_i < days_amount; tmp_d_i++) {
    $("#booking-inp-doa").append($("<option />").val(tmp_d_i).text(("0" + tmp_d_d).slice(-2) + '.' + ("0" + tmp_d_m).slice(-2)));

    tmp_d_d++;
    if(tmp_d_d > daysInMonth(tmp_d_m)) {
      tmp_d_d = 1;
      tmp_d_m++;
    }
  }

  for (let tmp_dr_d_i = 0; tmp_dr_d_i < days_amount; tmp_dr_d_i++) {
    var tmp_dr_i = $("#dailyreport-inp-req").append($("<option />").val(tmp_dr_d_i).text(day_i_arr[tmp_dr_d_i]));
  }

  $('#booking-inp-doa').on('change', function() {
    $('#booking-inp-mod').attr('max', days_amount - parseInt(this.value));
    fill_dod_select(parseInt(this.value));
    $('#booking-inp-dod').val($('#booking-inp-mod').val());
  });

  // Loading booking info.
  $.getJSON('action', {list:'', uid:getCookie('id'), auth:getCookie('token')}, function(data) {
    if(`${data.status}` == 'ok') {
      $.each(data.res, function() {
        createBookingDiv(this.first_day_index, this.room, this.duration, this.id, this.timetype);
      });
    } else {
      alert('ERR0000 Ошибка запроса.');
    }
  });

  function open_edit_menu(tmp_selected_box) {
    var $fullscreen_block_div = $('<div />').appendTo('body');
    $fullscreen_block_div.attr('id', 'shaded-screen');
    $('body').css('overflow', 'hidden');
    $('#booking-details-popup').toggle();

    $.getJSON('action', {get:'', id:tmp_selected_box, uid:getCookie('id'), auth:getCookie('token')}, function(data) {
      if(`${data.status}` == 'ok') {
        $('#booking-inp-name').val(data.name);
        $('#booking-inp-phone').val(data.phone);
        $('#booking-inp-room').val(data.room);
        $('#booking-inp-doa').val(data.first_day_index);
        $('#booking-inp-mod').val(data.duration);
        fill_dod_select(data.first_day_index);
        $('#booking-inp-dod').val(data.duration);
        $('#booking-inp-info').val(data.info);

        $('#booking-inp-doa-timetype').val(data.timetype.charAt(0) == 'd' ? '0' : '2');
        $('#booking-inp-dod-timetype').val(data.timetype.charAt(1) == 'd' ? '4' : '3');

        $('#booking-details-save-btn').attr('class', 'save-btn-id-' + tmp_selected_box);
        $('#booking-details-delete-btn').attr('class', 'delete-btn-id-' + tmp_selected_box);
      } else {
        alert('ERR0001 Ошибка запроса.');
      }
    });
  }

  $("#booking-boxes").on("click", ".schedule-booked-box", function() {
    if($(this).attr('id').startsWith('bsch-id-')) {
      var tmp_selected_box = $(this).attr('id').split('-')[2];

      open_edit_menu(tmp_selected_box);
    }
  });

  $('#booking-details-delete-btn').on("click", function() {
    let is_confirmed = confirm("Вы подтверждаете удаление этой записи?");

    if(is_confirmed) {
      var tmp_selected_box = $(this).attr('class').split('-')[3];

      $.getJSON('action', {delete:'', id:tmp_selected_box, uid:getCookie('id'), auth:getCookie('token')}, function(data) {
        if(`${data.status}` == 'ok') {
          close_details_popup();
          alert('Запись была удалена');
          $('#bgsch-id-' + tmp_selected_box).remove();
        } else {
          alert('ERR0002 Ошибка запроса.');
        }
      });
    }
  });

  $('#booking-details-save-btn').on("click", function() {
    if($(this).attr('class') === undefined || $(this).attr('class') == '') {
      $.getJSON('action', {create:'', name:$('#booking-inp-name').val(), phone:$('#booking-inp-phone').val(), room:$('#booking-inp-room').val(), doa:$('#booking-inp-doa').val(), duration:$('#booking-inp-mod').val(), info:$('#booking-inp-info').val(), timetype:(parseInt($('#booking-inp-doa-timetype').val()) + parseInt($('#booking-inp-dod-timetype').val()) - 3), uid:getCookie('id'), auth:getCookie('token')}, function(data) {
        if(`${data.status}` == 'ok') {
          close_details_popup();

          $.getJSON('action', {get:'', id:data.id, uid:getCookie('id'), auth:getCookie('token')}, function(data) {
            if(`${data.status}` == 'ok') {
              createBookingDiv(data.first_day_index, data.room, data.duration, data.id, data.timetype);
            } else {
              alert('ERR0000 Ошибка запроса.');
            }
          });
        } else {
          alert('ERR0010 Ошибка запроса: ' + `${data.err_desc}`);
        }
      });
    } else if($(this).attr('class').startsWith('save-btn-id-')) {
      var tmp_selected_box = $(this).attr('class').split('-')[3];

      $.getJSON('action', {update:'', id:tmp_selected_box, name:$('#booking-inp-name').val(), phone:$('#booking-inp-phone').val(), room:$('#booking-inp-room').val(), doa:$('#booking-inp-doa').val(), duration:$('#booking-inp-mod').val(), info:$('#booking-inp-info').val(), timetype:(parseInt($('#booking-inp-doa-timetype').val()) + parseInt($('#booking-inp-dod-timetype').val()) - 3), uid:getCookie('id'), auth:getCookie('token')}, function(data) {
        if(`${data.status}` == 'ok') {
          close_details_popup();
          alert('Запись обновлена.');

          $('#bgsch-id-' + tmp_selected_box).remove();
          $.getJSON('action', {get:'', id:tmp_selected_box, uid:getCookie('id'), auth:getCookie('token')}, function(data) {
            if(`${data.status}` == 'ok') {
              createBookingDiv(data.first_day_index, data.room, data.duration, tmp_selected_box, data.timetype);
            } else {
              alert('ERR0000 Ошибка запроса.');
            }
          });

        } else {
          alert('ERR0001 Ошибка запроса: ' + `${data.err_desc}`);
        }
      });
    }
  });

  $("#booking-boxes").on('mouseover', ".schedule-booked", function() {
    var tmp_selected_box = $(".schedule-booked-box", this).attr('id').split('-')[2];
    var tmp_color = $(".schedule-booked-box", this).css("background-color");
    tmp_color = rgb2hsl(tmp_color);

    var tmp_th_el_e = $(this);

    $.getJSON('action', {get:'', id:tmp_selected_box, uid:getCookie('id'), auth:getCookie('token')}, function(data) {
      if(`${data.status}` == 'ok') {
        $('#booking-tooltip').multiline('Имя: ' + data.name + '\nНомер телефона: ' + formatPhoneNumber(data.phone) + '\n\nДополнительная информация:\n' + ((data.info == null || data.info == '') ? "-" : data.info));

        if(tmp_th_el_e.position().top >= 1000) {
          $('#booking-tooltip').css('top', tmp_th_el_e.position().top - $('#booking-tooltip').height() - 10);
        }
        if(tmp_th_el_e.position().left >= 8900) {
          $('#booking-tooltip').css('left', tmp_th_el_e.position().left - $('#booking-tooltip').width());
        }
      } else {
        alert('ERR0001 Ошибка запроса.');
      }
    });

    if($(this).position().top < 1000) {
      $('#booking-tooltip').css('top', $(this).position().top + 28);
    }
    if($(this).position().left < 8900) {
      $('#booking-tooltip').css('left', $(this).position().left + 10);
    }

    $('#booking-tooltip').css('opacity', '1');
    $('#booking-tooltip').css('z-index', '5000');
    $('#booking-tooltip').css('background-color', "hsl(" + tmp_color[0] + ',' + tmp_color[1] + '%,' + (tmp_color[2] + 30) + '%)');
  });

  $("#booking-boxes").on('mouseleave', ".schedule-booked", function() {
    $('#booking-tooltip').css('opacity', '0');
    $('#booking-tooltip').css('z-index', '-1');
    $('#booking-tooltip').text('Загрузка данных...');
  });

  $("#search-button").on("click", function() {
    var $fullscreen_block_div = $('<div />').appendTo('body');
    $fullscreen_block_div.attr('id', 'shaded-screen');
    $('body').css('overflow', 'hidden');
    $('#booking-search-popup').toggle();
  });

  $("#dailyreport-button").on("click", function() {
    var $fullscreen_block_div = $('<div />').appendTo('body');
    $fullscreen_block_div.attr('id', 'shaded-screen');
    $('body').css('overflow', 'hidden');
    $('#booking-dailyreport-popup').toggle();

    var dateObj = new Date();
    f_date = ("0" + dateObj.getDate()).slice(-2) + '.' + ("0" + (dateObj.getMonth() + 1)).slice(-2);
    tmp_dr_for_di = day_i_arr.indexOf(f_date);
    $("#dailyreport-inp-req").val(tmp_dr_for_di);
    update_dailyreport(tmp_dr_for_di);
  });

  $('#dailyreport-inp-req').on("input", function() {
    update_dailyreport(parseInt($(this).val()));
  });

  $(".side-button").on('mouseover', function() {
    $('#side-button-tooltip').css('opacity', '1');
    $('#side-button-tooltip').css('z-index', '7500');
    $('#side-button-tooltip').css('top', $(this).position().top + 5);

    var tmp_tooltip_for_id = $(this).attr('id');
    if(tmp_tooltip_for_id == 'dailyreport-button') {
      $('#side-button-tooltip').text('Ежедневный отчёт');
    } else if(tmp_tooltip_for_id == 'search-button') {
      $('#side-button-tooltip').text('Поиск записи');
    }
  });

  $(".side-button").on('mouseleave', function() {
    $('#side-button-tooltip').css('opacity', '0');
    $('#side-button-tooltip').css('z-index', '-1');
    $('#side-button-tooltip').text('');
  });

  $('#search-inp-req').on("input", function() {
    $('#search-results-amount').removeAttr('hidden');
    $('#search-results').removeAttr('hidden');

    $.getJSON('action', {search:'', q:$(this).val(), uid:getCookie('id'), auth:getCookie('token')}, function(data) {
      if(`${data.status}` == 'ok') {
        $('#search-results-amount').text('Найдено результатов: ' + data.amount);
        $('#search-results').empty();
        $.each(data.res, function() {
          var search_ul_li = $("<li />");
          search_ul_li.attr('id', 'searchres-id-' + this.id);
          search_ul_li.text(this.name);
          search_ul_li.append($("<p />").text('Комната: ' + this.room + '\nНомер телефона: ' + this.phone + '\nВремя пребывания: ' + day_i_arr[this.first_day_index] + ' - ' + day_i_arr[this.first_day_index + this.duration]));
          $('#search-results').append(search_ul_li);
        });
      } else {
        alert('ERR0009 Ошибка запроса.');
      }
    });
  });

  $('#booking-inp-mod').on("input", function() {
    $('#booking-inp-dod').val(this.value);
  });

  $('#booking-inp-dod').on("change", function() {
    $('#booking-inp-mod').val(this.value);
  });

  $('#search-results').on("click", "li", function() {
    if($(this).attr('id').startsWith('searchres-id-')) {
      close_search_popup();

      highlight_booking_div($(this).attr('id').split('-')[2]);
    }
  });

  $('#dailyreport-results').on("click", "li", function() {
    if($(this).attr('id').startsWith('dailyrepres-id-')) {
      close_dailyreport_popup();

      highlight_booking_div($(this).attr('id').split('-')[2]);
    }
  });
});

window.onload = function() {
  var dateObj = new Date();
  f_date = ("0" + dateObj.getDate()).slice(-2) + '.' + ("0" + (dateObj.getMonth() + 1)).slice(-2);
  curr_d_i = day_i_arr.indexOf(f_date);

  if(curr_d_i != -1) {
    setTimeout(window.scrollTo, 10, Math.max(0, (curr_d_i * cw) - (cw * 5)), window.scrollY);
  }
}
