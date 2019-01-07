$(function(){

//refernce game area
  var container = $("game_area");
//game_area collision
  var container_left = container.offset().left
  var container_right = container_left + container.width();
  var container_top = container.offset().top;
  var container_bottom = container_top + container.height();
//reference the rocket
  var rocket = $("#rocket");
//rocket collision
  var rocket_left = rocket.offset().left
  var rocket_right = rocket_left + rocket.width();
  var rocket_top = rocket.offset().top;
  var rocket_bottom = rocket_top + rocket.height();
//rocket position
  var rocket_posx = 0;
//left arrow
  var left = false;
//right arrow
  var right = false;


//arrow key pressed
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
          left = true;
          rocket_moving = true;
          console.log(left);
        break;

        case 38: // up
        break;

        case 39: // right
          right = true;
          rocket_moving = true;
          console.log(right);
        break;

        case 40: // down
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
          console.log(left);
        break;

        case 38: // up
        break;

        case 39: // right
          right = false;
          console.log(right);
        break;

        case 40: // down
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
        'left': rocket_posx + "px"
      });

      if (left == true){
        if (rocket) {

        }
        rocket_posx -=2;
      }
      if (right == true){
        rocket_posx +=2;
      }

  }, 10);







})
