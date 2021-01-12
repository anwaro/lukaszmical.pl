document.addEventListener("DOMContentLoaded", function(){
    var canvas = document.getElementById("jump");
    var ctx;
    var play = false;
    var img_path = "/images/projects/jump/";
    
    var images = {
        grand : new Image(),
        men   : new Image(),
        bird  : new Image(),
        box  : new Image()
    };
    
    set_src(images.grand, "grand.jpg");
    set_src(images.men,   "men.jpg"  );
    set_src(images.bird,  "bird.jpg" );
    set_src(images.box,  "box.jpg" );
    
    
    var loaded = 0;
    
    function set_src(image, src){
        image.load = load_image;
        image.src = img_path + src;
    }
    
    function load_image(){
        loaded++;
        if(loaded>3){
            document.getElementById("uil-ring").style.display = "none";
            document.getElementById("jump").style.display = "block";
            start();
        }
    }
    
    function start(){
        canvas.height = 600;
        canvas.width  = 150;
        
        
    }
    
    
});