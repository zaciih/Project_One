$(function(){

//refernce game area
  var container = $("#game_area");
//reference to enemies
  var enemy = $(".enemy");
//game_area collision
  var container_left = container.offset().left;
  var container_right = container_left + container.width();
  var container_top = container.offset().top;
  var container_bottom = container_top + container.height();
  var spawn_width = container.width() - 60;
  var spawn_height = 0;

//reference the rocket
  var rocket = $("#rocket");
//rocket position
  var rocket_posx = container.width()/2 - rocket.width()/2;
  var rocket_posy = container.height()-100 - rocket.height()/2;
//left arrow
  var left = false;
//right arrow
  var right = false;
//up arrow
  var up = false;
//down arrow
  var down = false;

//reference the lazers
  var lazers = $(".lazers");
//lazer position
  var lazer_posx = rocket_posx;
  var lazer_posy = rocket_posy;
//shoot
  var shoot = false;
//bullet count
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
          spawn_enemy();
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

  function spawn_enemy(){
    container.prepend("<div class='enemy'></div>");
    var enemy = $(".enemy");
    var enemy_posx = Math.floor(Math.random()* spawn_width);
    var enemy_posy = spawn_height;
    enemy.first().css({
      'left': enemy_posx + "px",
      'top': enemy_posy + "px"
    });
    console.log(enemy_posx);
  };
  function move_enemy() {
    $(".enemy").each(function(){
      y_pos = $(this).offset().top - 79;
      if (y_pos >= 600) {
        $(this).remove();
      } else {
        $(this).css({'top': y_pos + "px"})
      }
    })
  };
  enemy_interval = setInterval(function(){
    move_enemy();
  }, 10);

});
