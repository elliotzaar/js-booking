<?php
  // 0 + 3 = 3 - 3 = 0 - DN
  // 0 + 4 = 4 - 3 = 1 - DD
  // 2 + 3 = 5 - 3 = 2 - NN
  // 2 + 4 = 6 - 3 = 3 - ND

  include_once('utils.php');

  $response = array();

  if(isset($_GET['auth']) && isset($_GET['uid'])) {
      $res = Database::query('SELECT * FROM `sessions` WHERE `user_id` = :id AND `token` = :token AND `active` = 1', array('id' => $_GET['uid'], 'token' => hash("sha512", $_GET['auth'])));

      if(count($res) <= 0) {
        header('Content-Type: application/json');
        echo(json_encode(array('status' => 'error', 'err_code' => 9102, 'err_desc' => 'Не указаны корректные данные для авторизации.')));
        die();
      }
  } else {
    header('Content-Type: application/json');
    echo(json_encode(array('status' => 'error', 'err_code' => 9101, 'err_desc' => 'Не указаны данные для авторизации.')));
    die();
  }

  function get_int($i) {
    try {
      return intval($i);
    } catch (Exception $e) {
      return null;
    }
  }

  function check_input($name, $phone, $room, $date_of_arrival, $duration, $timetype, $exclude_id = -1) {
    if(strlen($name) > 64) {
      return 'Длина имени превышает 64 символов.';
    }
    if(strlen($name) == 0 || $name == null) {
      return 'Длина имени не может быть нулевой.';
    }
    if(strlen($phone) != 13 || substr($phone, 0, 4) !== "+380") {
      return 'Проверьте номер телефона (должен отвечать формату +380ХХХХХХХХХ).';
    }
    $room = get_int($room);
    if($room == null || $room > 45 || $room <= 0) {
      return 'Некорректный номер комнаты.';
    }
    $date_of_arrival = get_int($date_of_arrival);
    if($date_of_arrival > 151 || $date_of_arrival < 0) {
      return 'Некорректный номер дня прибытия.';
    }
    $duration = get_int($duration);
    if($duration == null || $date_of_arrival + $duration > 153 || $duration <= 0) {
      return 'Длительность пребывания превышает возможный период бронирования.';
    }

    $timetype = get_int($timetype);
    if($timetype > 3 || $timetype < 0) {
      return 'Некорректный тип времени прибытия / выезда.';
    }

    $timetypes = array('dn', 'dd', 'nn', 'nd');

    $f_timetype = $timetypes[$timetype];

    $res = Database::query('SELECT * FROM `bookings` WHERE `room` = :room AND `active` = 1 AND `id` != :eid', array('room' => $room, 'eid' => $exclude_id));

    if(count($res) > 0) {
      foreach ($res as $r) {
        $a = $r['day_index'];
        $b = $r['day_index'] + $r['duration'];

        $rf_timetype = $timetypes[intval($r['timetype'])];
        if($rf_timetype[0] == 'd') {
          $a = $a - 0.5;
        }
        if($rf_timetype[1] == 'n') {
          $b = $b + 0.5;
        }

        $c = $date_of_arrival;
        $d = $date_of_arrival + $duration;

        if($f_timetype[0] == 'd') {
          $c = $c - 0.5;
        }
        if($f_timetype[1] == 'n') {
          $d = $d + 0.5;
        }

        if(($c <= $a && $a < $d) || ($c < $b && $b <= $d) || ($a <= $c && $c < $b) || ($a < $d && $d <= $b)) {
          return 'Невозможно создать бронирование, которое пересекается с другим бронированием ['.$r['id'].']';
        }
      }
    }

    return null;
  }

  if(isset($_GET['list'])) {
    $res = Database::query('SELECT * FROM `bookings` WHERE `active` = 1');

    if(count($res) > 0) {
      $response['status'] = 'ok';
      $tmp_r = array();
      foreach ($res as $key) {
        $ad_str='';
        if($key['timetype']==0||$key['timetype']==1){$ad_str.='d';}else{$ad_str.='n';}if($key['timetype']==1||$key['timetype']==3){$ad_str.='d';}else{$ad_str.='n';}

        array_push($tmp_r, array('id' => $key['id'], 'name' => $key['name'], 'first_day_index' => $key['day_index'], 'duration' => $key['duration'], 'room' => $key['room'], 'phone' => $key['phone'], 'info' => str_replace("<br />", "\n", $key['info']), 'timetype' => $ad_str));
      }
      $response['res'] = $tmp_r;
    } else {
      $response['status'] = 'ok';
    }
  } else if(isset($_GET['get'])) {
    if(isset($_GET['id'])) {
      $res = Database::query('SELECT * FROM `bookings` WHERE `id` = :id AND `active` = 1', array('id' => $_GET['id']));
      if(count($res) > 0) {
        $response['status'] = 'ok';
        $k = $res[0];

        $ad_str='';
        if($k['timetype']==0||$k['timetype']==1){$ad_str.='d';}else{$ad_str.='n';}if($k['timetype']==1||$k['timetype']==3){$ad_str.='d';}else{$ad_str.='n';}

        $response['id'] = $k['id'];
        $response['name'] = $k['name'];
        $response['first_day_index'] = $k['day_index'];
        $response['duration'] = $k['duration'];
        $response['room'] = $k['room'];
        $response['phone'] = $k['phone'];
        $response['info'] = str_replace("<br />", "\n", $k['info']);
        $response['timetype'] = $ad_str;
      }
    } else {
      $response = array('status' => 'error', 'err_code' => 9501, 'err_desc' => 'Недостаточно параметров для этой команды.');
    }
  } else if(isset($_GET['delete'])) {
    if(isset($_GET['id'])) {
      $res = Database::query('UPDATE `bookings` SET `active` = 0 WHERE `bookings`.`id` = :id', array('id' => $_GET['id']));
      $response['status'] = 'ok';
    } else {
      $response = array('status' => 'error', 'err_code' => 9503, 'err_desc' => 'Недостаточно параметров для этой команды.');
    }
  } else if(isset($_GET['update'])) {
    if(isset($_GET['id']) && isset($_GET['name']) && isset($_GET['phone']) && isset($_GET['room']) && isset($_GET['doa']) && isset($_GET['duration']) && isset($_GET['info']) && isset($_GET['timetype'])) {
      $chi = check_input($_GET['name'], $_GET['phone'], $_GET['room'], $_GET['doa'], $_GET['duration'], $_GET['timetype'], $_GET['id']);

      if($chi == null) {
        $res = Database::query('UPDATE `bookings` SET `day_index` = :doa, `room` = :room, `duration` = :duration, `name` = :name, `phone` = :phone, `info` = :info, `timetype` = :tt WHERE `bookings`.`id` = :id', array('id' => $_GET['id'], 'doa' => $_GET['doa'], 'room' => $_GET['room'], 'duration' => $_GET['duration'], 'name' => $_GET['name'], 'phone' => $_GET['phone'], 'info' => str_replace("<br />", "\n", $_GET['info']), 'tt' => $_GET['timetype']));
        $response['status'] = 'ok';
      } else {
        $response = array('status' => 'error', 'err_code' => 9512, 'err_desc' => $chi);
      }
    } else {
      $response = array('status' => 'error', 'err_code' => 9504, 'err_desc' => 'Недостаточно параметров для этой команды.');
    }
  } else if(isset($_GET['create'])) {
    if(isset($_GET['name']) && isset($_GET['phone']) && isset($_GET['room']) && isset($_GET['doa']) && isset($_GET['duration']) && isset($_GET['info']) && isset($_GET['timetype'])) {
      $chi = check_input($_GET['name'], $_GET['phone'], $_GET['room'], $_GET['doa'], $_GET['duration'], $_GET['timetype']);

      if($chi == null) {
        $res = Database::insertQuery('INSERT INTO `bookings` (`day_index`, `room`, `duration`, `name`, `phone`, `info`, `timetype`) VALUES (:doa, :room, :duration, :name, :phone, :info, :tt)', array('doa' => $_GET['doa'], 'room' => $_GET['room'], 'duration' => $_GET['duration'], 'name' => $_GET['name'], 'phone' => $_GET['phone'], 'info' => str_replace("<br />", "\n", $_GET['info']), 'tt' => $_GET['timetype']));
        $response['status'] = 'ok';

        $response['id'] = $res;
      } else {
        $response = array('status' => 'error', 'err_code' => 9521, 'err_desc' => $chi);
      }
    } else {
      $response = array('status' => 'error', 'err_code' => 9504, 'err_desc' => 'Недостаточно параметров для этой команды.');
    }
  } else if(isset($_GET['search'])) {
    if(isset($_GET['q'])) {
      $response['status'] = 'ok';
      $tmp_r = array();
      $tmp_returned_ids = array();

      $res = Database::query('SELECT * FROM `bookings` WHERE `active` = 1 AND `name` LIKE :squery', array('squery' => '%'.$_GET['q'].'%'));
      if(count($res) > 0) {
        foreach ($res as $key) {
          if(!in_array($key['id'], $tmp_returned_ids)) {
            array_push($tmp_r, array('id' => $key['id'], 'name' => $key['name'], 'first_day_index' => $key['day_index'], 'duration' => $key['duration'], 'room' => $key['room'], 'phone' => $key['phone'], 'info' => str_replace("<br />", "\n", $key['info'])));
            array_push($tmp_returned_ids, $key['id']);
          }
        }
      }
      $res = Database::query('SELECT * FROM `bookings` WHERE `active` = 1 AND `phone` LIKE :squery', array('squery' => '%'.$_GET['q'].'%'));
      if(count($res) > 0) {
        foreach ($res as $key) {
          if(!in_array($key['id'], $tmp_returned_ids)) {
            array_push($tmp_r, array('id' => $key['id'], 'name' => $key['name'], 'first_day_index' => $key['day_index'], 'duration' => $key['duration'], 'room' => $key['room'], 'phone' => $key['phone'], 'info' => str_replace("<br />", "\n", $key['info'])));
            array_push($tmp_returned_ids, $key['id']);
          }
        }
      }
      $res = Database::query('SELECT * FROM `bookings` WHERE `active` = 1 AND `info` LIKE :squery', array('squery' => '%'.$_GET['q'].'%'));
      if(count($res) > 0) {
        foreach ($res as $key) {
          if(!in_array($key['id'], $tmp_returned_ids)) {
            array_push($tmp_r, array('id' => $key['id'], 'name' => $key['name'], 'first_day_index' => $key['day_index'], 'duration' => $key['duration'], 'room' => $key['room'], 'phone' => $key['phone'], 'info' => str_replace("<br />", "\n", $key['info'])));
            array_push($tmp_returned_ids, $key['id']);
          }
        }
      }

      $response['res'] = $tmp_r;
      $response['amount'] = count($tmp_r);
    } else {
      $response = array('status' => 'error', 'err_code' => 9600, 'err_desc' => 'Недостаточно параметров для этой команды.');
    }
  } else if(isset($_GET['listbydate'])) {
    $tmp_r = array();

    $res = Database::query('SELECT * FROM `bookings` WHERE `day_index` = :day AND `active` = 1', array('day' => intval($_GET['listbydate'])));
    if(count($res) > 0) {
      foreach ($res as $key) {
        $ad_str='';
        if($key['timetype']==0||$key['timetype']==1){$ad_str.='d';}else{$ad_str.='n';}if($key['timetype']==1||$key['timetype']==3){$ad_str.='d';}else{$ad_str.='n';}

        array_push($tmp_r, array('id' => $key['id'], 'name' => $key['name'], 'first_day_index' => $key['day_index'], 'duration' => $key['duration'], 'room' => $key['room'], 'phone' => $key['phone'], 'info' => str_replace("<br />", "\n", $key['info']), 'timetype' => $ad_str));
      }
    }
    $res = Database::query('SELECT * FROM `bookings` WHERE `day_index` + `duration` = :day AND `active` = 1', array('day' => intval($_GET['listbydate'])));
    if(count($res) > 0) {
      foreach ($res as $key) {
        $ad_str='';
        if($key['timetype']==0||$key['timetype']==1){$ad_str.='d';}else{$ad_str.='n';}if($key['timetype']==1||$key['timetype']==3){$ad_str.='d';}else{$ad_str.='n';}

        array_push($tmp_r, array('id' => $key['id'], 'name' => $key['name'], 'first_day_index' => $key['day_index'], 'duration' => $key['duration'], 'room' => $key['room'], 'phone' => $key['phone'], 'info' => str_replace("<br />", "\n", $key['info']), 'timetype' => $ad_str));
      }
    }

    $response['status'] = 'ok';
    $response['amount'] = count($tmp_r);
    if(count($tmp_r) > 0) {
      $response['res'] = $tmp_r;
    }
  } else {
    $response = array('status' => 'error', 'err_code' => 9500, 'err_desc' => 'Запрос не распознан.');
  }

  header('Content-Type: application/json');
  echo(json_encode($response));
?>
