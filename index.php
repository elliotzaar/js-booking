<?php
  include_once('utils.php');

  if(isset($_COOKIE['id']) && isset($_COOKIE['token'])) {
    $res = Database::query('SELECT * FROM `sessions` WHERE `user_id` = :id AND `token` = :token AND `active` = 1', array('id' => $_COOKIE['id'], 'token' => hash("sha512", $_COOKIE['token'])));

    if(count($res) <= 0) {
      setcookie("id", '', time() + 1);
      setcookie("token", '', time() + 1);
      header("Location: ./login");
      die();
    }
  } else {
    header("Location: ./login");
    die();
  }
?>

<!doctype html>
<html lang="ru">
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
  <link rel="stylesheet" href="static/style.min.css" />
  <meta http-equiv="cache-control" content="no-cache" />
  <title>Веб-система Диана.Бронирование</title>
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
  <script src="static/script.min.js"></script>
</head>
<body>
  <div id="empty-placeholder"></div>
  <div id="days-list"></div>
  <div id="rooms-list">
    <div class="schedule-room-class" style="top: 82px; height: 838px;">ЛЮКС</div>
    <div class="schedule-room-class" style="top: 82px; height: 448px; left: 22px; background-color: #e57373; width: 19px;">2</div>
    <div class="schedule-room-class" style="top: 532px; height: 298px; left: 22px; background-color: #a5d6a7; width: 19px;">4</div>
    <div class="schedule-room-class" style="top: 832px; height: 88px; left: 22px; background-color: #fff59d; width: 19px;">6</div>
    <div class="schedule-room-class" style="top: 922px; height: 480px;">ЭКОНОМ</div>
    <div class="schedule-room-class" style="top: 922px; height: 238px; left: 22px; background-color: #90caf9; width: 19px;">2</div>
    <div class="schedule-room-class" style="top: 1162px; height: 240px; left: 22px; background-color: #f48fb1; width: 19px;">3</div>
  </div>
  <div id="schedule-body"></div>
  <div id="booking-boxes"></div>
  <div id="booking-tooltip">Загрузка данных...</div>
  <div id="booking-details-popup" class="align-page-center" hidden>
    <div class="fullscreen-close" onclick="close_details_popup();"></div>
    <h2>Детали записи</h2>
    <div id="booking-details-form">
      <label for="booking-inp-name">Имя </label><br /><input type="text" id="booking-inp-name"><br />
      <label for="booking-inp-phone">Номер телефона </label><br /><input type="text" id="booking-inp-phone"><br />
      <label for="booking-inp-room">Комната </label><br /><select id="booking-inp-room"></select><br />
      <label for="booking-inp-doa">Дата въезда </label><label for="booking-inp-dod" id="booking-lab-dod">Дата выезда </label><br />
      <select id="booking-inp-doa"></select>
      <select id="booking-inp-doa-timetype">
        <option value="0">утром</option>
        <option selected value="2">вечером</option>
      </select>
      <select id="booking-inp-dod"></select>
      <select id="booking-inp-dod-timetype">
        <option selected value="4">утром</option>
        <option value="3">вечером</option>
      </select>
      <br />
      <label for="booking-inp-mod">Длительность визита </label><br /><input type="number" id="booking-inp-mod" min="1" value="1"><br />
      <label for="booking-inp-info">Дополнительная информация</label><br /><textarea id="booking-inp-info"></textarea>
      <button id="booking-details-save-btn">Сохранить запись</button>
      <button id="booking-details-delete-btn">Удалить запись</button>
    </div>
  </div>
  <div id="booking-search-popup" class="align-page-center" hidden>
    <div class="fullscreen-close" onclick="close_search_popup();"></div>
    <h2>Поиск записи</h2>
    <label for="search-inp-req">Запрос </label><input type="text" id="search-inp-req"><br />
    <span id="search-results-amount" hidden>Найдено результатов: 0</span>
    <ul id="search-results" hidden></ul>
  </div>
  <div id="booking-dailyreport-popup" class="align-page-center" hidden>
    <div class="fullscreen-close" onclick="close_dailyreport_popup();"></div>
    <h2>Ежедневный отчёт</h2>
    <label for="dailyreport-inp-req">День </label><select id="dailyreport-inp-req"></select><br />
    <ul id="dailyreport-results"></ul>
  </div>
  <div class="side-button" id="dailyreport-button">
    <img src="static/summarize-white-36dp.svg" />
  </div>
  <div class="side-button" id="search-button">
    <img src="static/person_search-white-36dp.svg" />
  </div>
  <div id="side-button-tooltip"></div>
</body>
</html>
