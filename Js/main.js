$(function(){

//refernce game area
  var container = $("#game_area");
//reference to enemies
  var enemy = $(".enemy");
  var enemy_hits = 0;

//refernce to comets
  var comet = $(".comet");
  var com_spawn_rate = 2000;
  var comet_speed = Math.floor(Math.random()*(79-73+1)+73);
  var comet_hits = 0;

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
          if (progRunning == false){
            progRunning = true;
            pause_interval = setInterval(function(){
                rocket_collision_check();
                moveBullet();
                move_enemy();
                move_comet();
                lazer_collision_check();
                com_collision_check();
            }, 10);
          }else {
            progRunning = false;
            clearInterval(pause_interval);
            clearInterval(game_interval);
          }
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
  var ammo_interval;
  var deplete_interval;
  var spawn_interval;
  var level_interval;
  var game_interval;
  var pause_interval;

//function to call every frame (60fps)
  game_interval = setInterval(function(){
    rocket_collision_check();
    moveBullet();
    move_enemy();
    move_comet();
    lazer_collision_check();
    com_collision_check();
  }, 10);

  function rocket_collision_check(){
    var rocket_left = rocket.offset().left
    var rocket_right = rocket_left + rocket.width();
    var rocket_top = rocket.offset().top;
    var rocket_bottom = rocket_top + rocket.height();
    if (rocket_left >= container_left) {
      if (left == true){
        rocket_posx -=2;
      }
    }
    if (rocket_right <= container_right){
      if (right == true){
      rocket_posx +=2;
      }
    }
    if (rocket_top >= container_top){
      if (up == true){
        rocket_posy -=1;
      }
    }
    if (rocket_bottom <= container_bottom){
      if (down == true){
        rocket_posy +=1.5;
      }
    }
    rocket.css({
      'left': rocket_posx + "px",
      'top': rocket_posy + "px"
    });
  }

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
    var lazers = $(".lazers");
    var lazer_posx = rocket_posx + 3.75;
    var lazer_posy = rocket_posy;
    lazers.first().css({
      'left': lazer_posx + "px",
      'top': lazer_posy + "px"
    });
  };

//checks collisions of every enemy and lazer
  function lazer_collision_check(){
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
      //lazer vs enemy collision
        if (lazers_top <= enemy_bottom && lazers_left <= enemy_right && lazers_right >= enemy_left && lazers_bottom >= enemy_top){
          if (enemy_hits < 1){
            $(this).remove();
            enemy_hits++;
            death_anim(enemy);
          }
        }
      });
    });
  }

  function death_anim(enemy){
    enemy.css({
      content:'url(images/imp_death_blue.gif)'
    });
    setTimeout(function(){
      enemy.css({
        content:''
      });
      enemy.remove();
      enemy_hits = 0;
      score.html("Score: " + score_up)
    }, 150);
    if (enemy_hits <= 1){
      score_up += 10;
    }
  }
  //checks collisions of every comet and lazer
    function com_collision_check(){
      $(".comet").each(function() {
        comet_top = $(this).offset().top;
        comet_bottom = $(this).offset().top + $(this).height();
        comet_left = $(this).offset().left;
        comet_right = $(this).offset().left + $(this).width();
        comet = $(this);
        $(".lazers").each(function(){
          lazers_top = $(this).offset().top;
          lazers_bottom = $(this).offset().top + $(this).height();
          lazers_left = $(this).offset().left;
          lazers_right = $(this).offset().left + $(this).width();
        //lazer vs enemy collision
          if (lazers_top <= comet_bottom && lazers_left <= comet_right && lazers_right >= comet_left && lazers_bottom >= comet_top){
            if (comet_hits < 1){
              $(this).remove();
              comet_hits++;
              console.log(comet_hits);
              com_death_anim(comet);
            }
          }
        });
      });
    }
    function com_death_anim(comet){
      comet.css({
        content:'url(images/com_exp.gif)'
      });
      setTimeout(function(){
        comet.css({
          content:''
        });
        comet.remove();
        comet_hits = 0;
      }, 150);
    }

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

  level_interval = setInterval(function(){
    level_up++;
    level.html("Level: " + level_up);
  }, 20000);

  enemy_loop();
//random loop to spawn enemy
  function enemy_loop(){
    var random = Math.round(Math.random()* spawn_rate);
    setTimeout(function(){
      spawn_enemy();
      // spawn_comet();
      enemy_loop();
    }, random);
  };

  function spawn_comet(){
    container.prepend("<div class='comet'></div>");
    var comet = $(".comet");
    var comet_posx = Math.floor(Math.random()* spawn_width);
    var comet_posy = spawn_height;
    function randomIntFromInterval(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }
    comet.first().css({
      'left': comet_posx + "px",
      'top': comet_posy + "px"
    });
  };
  function move_comet() {
    $(".comet").each(function(){
      comet_speed =  Math.floor(Math.random()*(80-75+1)+75);
      y_pos = $(this).offset().top - comet_speed;
      if (y_pos >= 560) {
        $(this).remove();
      } else {
        $(this).css({
          'top': y_pos + "px"
        })
      }
    })
  };
  com_loop();
//random loop to spawn comet
    function com_loop(){
      var random = Math.round(Math.random()* com_spawn_rate);
      setTimeout(function(){
        spawn_comet();
        com_loop();
      }, random);
    };







});
