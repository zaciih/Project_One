$(function(){

//refernce game area
  var container = $("#game_area");
//reference to enemies
  var enemy = $(".enemy");

  var progRunning = true;

//game_area collision
  var container_left = container.offset().left;
  var container_right = container_left + container.width();
  var container_top = container.offset().top;
  var container_bottom = container_top + container.height();
  var spawn_width = container.width() - 60;
  var spawn_height = 0;
  var spawn_rate = 10000;

  var level = $("#level");
  var level_up = 1;
  var earth = $("#earth");
  var earth_hp = 100;
  earth.html("Earth HP: " + earth_hp + "%");
  level.html("Level: " + level_up);

  var score = $("#score");
  var score_up = 0;
  score.html("Score: " + score_up);

  var rocket = $("#rocket");
  var rocket_posx = container.width()/2 - rocket.width()/2;
  var rocket_posy = container.height()-100 - rocket.height()/2;

  var left = false;
  var right = false;
  var up = false;
  var down = false;

  var lazers = $(".lazers");
  var lazer_posx = rocket_posx;
  var lazer_posy = rocket_posy;

  var shoot = false;
  var bullet_count = 100;
  var ammo = $("#ammo");

//arrow key pressed
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        case 65: // left
          left = true;
        break;

        case 38: // up
        case 87: // up
          up = true;
        break;

        case 39: // right
        case 68: // right
          right = true;
        break;

        case 40: // down
        case 83: // down
          down = true;
        break;

        case 32: //spacebar
          shoot = true;
        break;

        case 13: //enter
          progRunning = false;
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });
//arrow key released
  $(document).keyup(function(e) {
    switch(e.which) {
        case 37: // left
        case 65: // left
          left = false;
        break;

        case 38: // up
        case 87: // up
          up = false;
        break;

        case 39: // right
        case 68: // right
          right = false;
        break;

        case 40: // down
        case 83: // down
          down = false;
        break;

        case 32: //spacebar
          shoot = false;
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });

  var shoot_interval;
  var bullet_interval;
  var ammo_interval;
  var deplete_interval;
  var enemy_interval;
  var spawn_interval;
  var level_interval;
  var interval;
//function to call every frame (60fps)
  interval = setInterval(function(){
  //rocket movement
    rocket.css({
      'left': rocket_posx + "px",
      'top': rocket_posy + "px"
    });

  //rocket collision
    var rocket_left = rocket.offset().left
    var rocket_right = rocket_left + rocket.width();
    var rocket_top = rocket.offset().top;
    var rocket_bottom = rocket_top + rocket.height();
  //if rocket hits left wall stop, else move left
    if (rocket_left >= container_left) {
      if (left == true){
        rocket_posx -=2;
      }
    }
  //if rocket hits right wall stop, else move right
    if (rocket_right <= container_right){
      if (right == true){
      rocket_posx +=2;
      }
    }
  //if rocket hits top wall stop, else move up
    if (rocket_top >= container_top){
      if (up == true){
        rocket_posy -=1;
      }
    }
  //if rocket hits bottom wall stop, else move down
    if (rocket_bottom <= container_bottom){
      if (down == true){
        rocket_posy +=1.5;
      }
    }

  }, 10);


//function to shoot every frame
  shoot_interval = setInterval(function(){
  //spacebar to shoot
    if (shoot == true && bullet_count > 0){
      fireBullet();
    }
    ammo.html(bullet_count + "%");
  }, 100);
//function to deplete energy
  deplete_interval = setInterval(function(){
    if (shoot == true && bullet_count > 0){
      bullet_count --;
    }
  }, 40);
//function to refresh bullets every 2 seconds
  ammo_interval = setInterval(function(){
    if (bullet_count < 100 && shoot == false){
      bullet_count++;
    }
  }, 100);

//function to move bullets every frame
  bullet_interval = setInterval(function(){
    moveBullet();
    collision_check();
  }, 10);
//set lazer position and fire upwards
  function moveBullet() {
    $(".lazers").each(function(){
      y_pos = $(this).offset().top - 91;
      if (y_pos <= 0) {
        $(this).remove();
      } else {
        $(this).css({'top': y_pos + "px"})
      }
    })
  };
  function fireBullet() {
    container.prepend("<div class='lazers'></div>");
  //reference the lazers
    var lazers = $(".lazers");
  //lazer position
    var lazer_posx = rocket_posx + 3.75;
    var lazer_posy = rocket_posy;
  //lazer movement
    lazers.first().css({
      'left': lazer_posx + "px",
      'top': lazer_posy + "px"
    });
  };

//checks collisions of every enemy and lazer
  function collision_check(){
    $(".enemy").each(function() {
      enemy_top = $(this).offset().top;
      enemy_bottom = $(this).offset().top + $(this).height();
      enemy_left = $(this).offset().left;
      enemy_right = $(this).offset().left + $(this).width();
      enemy = $(this);
      $(".lazers").each(function(){
        lazers_top = $(this).offset().top;
        lazers_bottom = $(this).offset().top + $(this).height();
        lazers_left = $(this).offset().left;
        lazers_right = $(this).offset().left + $(this).width();

        if (lazers_top <= enemy_bottom && lazers_left <= enemy_right && lazers_right >= enemy_left){
          $(this).remove();
          enemy.remove();
          score_up += 10;
          score.html("Score: " + score_up);
        }
      });
    });
  }

  loop();

  function spawn_enemy(){
    container.prepend("<div class='enemy'></div>");
    var enemy = $(".enemy");
    var enemy_posx = Math.floor(Math.random()* spawn_width);
    var enemy_posy = spawn_height;
    enemy.first().css({
      'left': enemy_posx + "px",
      'top': enemy_posy + "px"
    });
  };
  spawn_interval = setInterval(function(){
    if (spawn_rate > 500) {
      spawn_rate = spawn_rate - 25;
    } else {
      clearInterval(level_interval);
      clearInterval(spawn_interval);
    }
  }, 1000);

  function move_enemy() {
    $(".enemy").each(function(){
      y_pos = $(this).offset().top - 79;
      if (y_pos >= 560) {
        $(this).remove();
        if (earth_hp > 0){
          earth_hp -= 5;
          earth.html("Earth HP: " + earth_hp + "%");
        }
      } else {
        $(this).css({'top': y_pos + "px"})
      }
    })
  };
  enemy_interval = setInterval(function(){
    move_enemy();
  }, 10);

  level_interval = setInterval(function(){
    level_up++;
    level.html("Level: " + level_up);
  }, 20000);

//random loop to spawn enemy
  function loop(){
    var random = Math.round(Math.random()* spawn_rate);
    setTimeout(function(){
      spawn_enemy();
      loop();
    }, random);
  };









});
