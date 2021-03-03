<?php
  include_once('utils.php');

  if(isset($_COOKIE['id']) && isset($_COOKIE['token'])) {
    $res = Database::query('SELECT * FROM `sessions` WHERE `user_id` = :id AND `token` = :token AND `active` = 1', array('id' => $_COOKIE['id'], 'token' => hash("sha512", $_COOKIE['token'])));

    if(count($res) > 0) {
      header("Location: ./");
      die();
    }
  }

  if(isset($_POST['username']) && isset($_POST['password'])) {
    $res = Database::query('SELECT `id` FROM `users` WHERE `name` = :username AND `password` = :password', array('username' => $_POST['username'], 'password' => hash("sha512", $_POST['password'])));

    if(count($res) > 0) {
      $uid = $res[0]['id'];
      $token = bin2hex(openssl_random_pseudo_bytes(256));

      Database::query('INSERT INTO `sessions` (`token`, `user_id`) VALUES (:tokenhash, :userid)', array('userid' => $uid, 'tokenhash' => hash("sha512", $token)));
      setcookie("id", $uid, time() + 60 * 60 * 24 * 30);
      setcookie("token", $token, time() + 60 * 60 * 24 * 30);

      header("Location: ./");
      die();
    } else {
      header("Location: ./login?invalid");
      die();
    }
  }
?>


<!doctype html>
<html>
<head>
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.teal-indigo.min.css" />
  <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
  <title>Система Диана.Бронирование</title>
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="static/style.min.css">
</head>
<body>
  <div class="mdl-layout mdl-js-layout">
    <section class="container">
      <div class="show-front">
        <figure class="front">
          <div class="mdl-card mdl-shadow--4dp align-page-center">
            <div class="mdl-card__title mdl-color--primary mdl-color-text--white relative">
              <h2 class="mdl-card__title-text">Войдите в систему</h2>
            </div>

            <form action="login" method="post">
              <div class="mdl-card__supporting-text">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label<?php if(isset($_GET['invalid'])) {echo(' is-invalid');} ?>">
                  <input name="username" class="mdl-textfield__input" id="username" />
                  <label class="mdl-textfield__label" for="username">Имя пользователя</label>
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label<?php if(isset($_GET['invalid'])) {echo(' is-invalid');} ?>">
                  <input name="password" class="mdl-textfield__input" type="password" id="password" />
                  <label class="mdl-textfield__label" for="password">Пароль</label>
                </div>
              </div>

              <div class="mdl-card__actions mdl-card--border">
                <div class="mdl-grid">
                  <button class="mdl-cell mdl-cell--12-col mdl-button mdl-button--raised mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-color-text--white">Войти</button>
                </div>
              </div>
            </form>
          </div>
        </figure>
      </div>
    </section>
  </div>
</body>
</html>
