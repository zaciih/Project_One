$(function(){



//refernce game area
  var container = $("#game_area");
//game_area collision
  var container_left = container.offset().left
  var container_right = container_left + container.width();
  var container_top = container.offset().top;
  var container_bottom = container_top + container.height();

//reference the rocket
  var rocket = $("#rocket");

  var rocket_top = rocket.offset().top;
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



//arrow key pressed
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
          left = true;
        break;

        case 38: // up
          up = true;
        break;

        case 39: // right
          right = true;
        break;

        case 40: // down
          down = true;
        break;

        case 32: //spacebar
          shoot = true;
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });
//arrow key released
  $(document).keyup(function(e) {
    switch(e.which) {
        case 37: // left
          left = false;
        break;

        case 38: // up
          up = false;
        break;

        case 39: // right
          right = false;
        break;

        case 40: // down
          down = false;
        break;

        case 32: //spacebar
          shoot = false;
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });

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

  // //lazer movement
  //   lazers.css({
  //     'left': lazer_posx + "px",
  //     'top': lazer_posy + "px"
  //   });
    //spacebar to shoot
    if (shoot == true){
      fireBullet();

    }

  }, 10);

  function fireBullet() {
    container.prepend("<div class='lazers'></div>");
  //reference the lazers
    var lazers = $(".lazers");
  //lazer position
    var lazer_posx = rocket_posx;
    var lazer_posy = rocket_posy;
    //lazer movement
      lazers.css({
        'left': lazer_posx + "px",
        'top': lazer_posy + "px"
      });
  };



})
