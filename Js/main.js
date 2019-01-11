$(function(){
  game_start();
function game_start(){

  var start_btn = $("#start_btn");
  $("#start_btn").click(function(){
    if (game_over == true){
      document.location.reload();
    }
    if (progRunning == false){
      progRunning = true;
      game_loop();
      start_btn.hide();
      $("#music").get(0).play();
    }
  });

//refernce game area
  var container = $("#game_area");
  var background = $("#background");
  var screen_text = $("#screen_text");
  screen_text.hide();
  // var pause_text = screen_text.html();
//reference to enemies
  var enemy = $(".enemy");
  var enemy_hits = 0;

//refernce to comets
  var comet = $(".comet");
  var com_spawn_rate = 2000;
  var comet_hits = 0;

  var progRunning = false;
  var game_over = false;

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
  // var rocket_hp = $("#hp");
  var life1 = $(".hp1");
  var life2 = $(".hp2");
  var life3 = $(".hp3");
  var lives = 3;

  // var hp_change = rocket_hp.html(3);
  rocket.css({
    'left': rocket_posx + "px",
    'top': rocket_posy + "px"
  });

  var left = false;
  var right = false;
  var up = false;
  var down = false;

  var lazers = $(".lazers");
  var lazer_posx = rocket_posx;
  var lazer_posy = rocket_posy;

  var shoot = false;
  var bullet_count = 40;
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
          if (progRunning == true){
            screen_text.show();
            clearInterval(game_interval);
            clearInterval(shoot_interval);
            clearInterval(ammo_interval);
            clearInterval(deplete_interval);
            clearInterval(spawn_interval);
            clearInterval(level_interval);
            clearTimeout(enemy_timeout);
            clearTimeout(com_timeout);
            progRunning = false;
          }else {
            progRunning = true;
            screen_text.hide();
            game_loop();
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
//intervals
  var shoot_interval;
  var ammo_interval;
  var deplete_interval;
  var spawn_interval;
  var level_interval;
  var game_interval;
//timeouts
  var enemy_timeout;
  var com_timeout;

//function to call every frame (60fps)
  function game_loop(){
    if (progRunning == true){
      game_interval = setInterval(function(){
        if (lives < 1){
          screen_text.show();
          screen_text.css({
            fontSize: 75,
            marginLeft: 100
          })
          life1.hide();
          ammo.css({
            marginLeft: 260
          })
          start_btn.show();
          start_btn.html("RESTART");
          screen_text.html("GAME OVER");
          clearInterval(game_interval);
          clearInterval(shoot_interval);
          clearInterval(ammo_interval);
          clearInterval(deplete_interval);
          clearInterval(spawn_interval);
          clearInterval(level_interval);
          clearTimeout(enemy_timeout);
          clearTimeout(com_timeout);
          progRunning = false;
          game_over = true;
        }
        rocket_collision_check();
        moveBullet();
        move_enemy();
        move_comet();
        lazer_collision_check();
        com_collision_check();
      }, 10);
      shoot_interval = setInterval(function(){
        if (shoot == true && bullet_count > 0){
          fireBullet();
        }
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
      spawn_interval = setInterval(function(){
        if (spawn_rate > 500) {
          spawn_rate = spawn_rate - 25;
        } else {
          clearInterval(level_interval);
          clearInterval(spawn_interval);
        }
      }, 1000);
      level_interval = setInterval(function(){
        level_up++;
        level.html("Level: " + level_up);
      }, 20000);
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
      enemy_loop();
    //random loop to spawn enemy
      function enemy_loop(){
        var random = Math.round(Math.random()* spawn_rate);
        if (progRunning == true){
          enemy_timeout = setTimeout(function(){
            spawn_enemy();
            enemy_loop();
          }, random);
        }
      };
      function spawn_comet(){
        container.prepend("<div class='comet'></div>");
        var comet = $(".comet");
        var comet_posx = Math.floor(Math.random()* spawn_width);
        var comet_posy = spawn_height;
        container.append("<audio id='explode' src='Audio/rumble.flac'></audio>")

        comet.first().css({
          'left': comet_posx + "px",
          'top': comet_posy + "px"
        });
      };
      com_loop();
    //random loop to spawn comet
      function com_loop(){
        var random = Math.round(Math.random()* com_spawn_rate);
        if (progRunning == true){
          com_timeout = setTimeout(function(){
            spawn_comet();
            com_loop();
          }, random);
        }
      };
    }
  }

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
  //check bullet_count for ammo_bar
    if (bullet_count == 100){
      ammo.css({
        content:'url(images/ammo_100.png)'
      })
    }else if (bullet_count == 90){
      ammo.css({
        content:'url(images/ammo_90.png)'
      })
    }else if (bullet_count == 80){
      ammo.css({
        content:'url(images/ammo_80.png)'
      })
    }else if (bullet_count == 70){
      ammo.css({
        content:'url(images/ammo_70.png)'
      })
    }else if (bullet_count == 60){
      ammo.css({
        content:'url(images/ammo_60.png)'
      })
    }else if (bullet_count == 50){
      ammo.css({
        content:'url(images/ammo_50.png)'
      })
    }else if (bullet_count == 40){
      ammo.css({
        content:'url(images/ammo_40.png)'
      })
    }else if (bullet_count == 30){
      ammo.css({
        content:'url(images/ammo_30.png)'
      })
    }else if (bullet_count == 20){
      ammo.css({
        content:'url(images/ammo_20.png)'
      })
    }else if (bullet_count == 10){
      ammo.css({
        content:'url(images/ammo_10.png)'
      })
    }else if (bullet_count == 0){
      ammo.css({
        content:'url(images/ammo_0.png)'
      })
    }
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
      $("#rocket").each(function(){
        rocket_left = rocket.offset().left
        rocket_right = rocket_left + rocket.width();
        rocket_top = rocket.offset().top;
        rocket_bottom = rocket_top + rocket.height();
      //rocket vs enemy collision
        if (rocket_top <= enemy_bottom && rocket_left <= enemy_right && rocket_right >= enemy_left && rocket_bottom >= enemy_top){
          if (enemy_hits < 1){
            enemy_hits++;
            lives--;
            if (lives == 2){
              life3.hide();
              ammo.css({
                marginLeft: 220
              })
            }
            if (lives == 1){
              life2.hide();
              ammo.css({
                marginLeft: 240
              })
            }
            death_anim(enemy);
        }
      }
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
  })
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
      comet = $(this);
      comet_top = $(this).offset().top;
      comet_bottom = $(this).offset().top + $(this).height();
      comet_left = $(this).offset().left;
      comet_right = $(this).offset().left + $(this).width();
      $("#rocket").each(function(){
        rocket_left = rocket.offset().left
        rocket_right = rocket_left + rocket.width();
        rocket_top = rocket.offset().top;
        rocket_bottom = rocket_top + rocket.height();
      //rocket vs enemy collision
        if (rocket_top <= comet_bottom && rocket_left <= comet_right && rocket_right >= comet_left && rocket_bottom >= comet_top){
          if (comet_hits < 1){
            comet_hits++;
            lives--;
            if (lives == 2){
              life3.hide();
              ammo.css({
                marginLeft: 220
              })
            }
            if (lives == 1){
              life2.hide();
              ammo.css({
                marginLeft: 240
              })
            }
            com_death_anim(comet);
        }
      }
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
            com_death_anim(comet);
          }
        }
      });
    });
  })
}
  function com_death_anim(comet){
    $("#explode").get(0).play();
    comet.css({
      content:'url(images/com_exp.gif)'
    });
    setTimeout(function(){
      comet.css({
        content:''
      });
      comet.remove();
      $("#explode").remove();
      comet_hits = 0;
    }, 150);
  }
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
  function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  function move_comet() {
    $(".comet").each(function(){
      comet_speed = randomIntFromInterval(73,79);
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
}
});
