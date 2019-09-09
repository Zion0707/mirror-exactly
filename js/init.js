var winWidth = $(window).width();
var winHeight = $(window).height();

var realCanvasHeight = (750/winWidth) * winHeight;
var app = new PIXI.Application({
    width:750, 
    height: realCanvasHeight,
    antialias: true,   
    transparent: false, 
    resolution: 1,      
    roundPixels: true
});
$('#app').append(app.view);

// 资源加载
app.loader.add([
    {name:'bg', url:'images/bg.jpg'},
    {name:'birds', url:'images/birds.json'},
]).on('progress',(loader, res)=>{
    console.log(loader.progress);
}).load(setup);

function setup(loader, res){
    // 添加背景
    var bg = new PIXI.Sprite(res.bg.texture);
    app.stage.addChild(bg);

    // 帧动画小鸟
	var birdsId = res.birds.textures;
	var birdsArr = [];
	for(var i=1;i<4;i++){
		birdsArr.push(birdsId[`b${i}.png`]);
	}
    var birds = new PIXI.extras.AnimatedSprite(birdsArr);
    birds.animationSpeed=0.1;
    birds.alpha = 0;
    app.stage.addChild(birds);

    // createjs.Tween.get(birds)
    // .to({x:100, y:100}, 1000);

    var setTime =null;
    var steptime =0;
    var timeline =0;
    var maxHeight = bg.height-realCanvasHeight; //以真实的背景高度减去屏幕高度就可以得出
    document.addEventListener('touchstart',function(e){
        clearInterval(setTime);
        touchstart = true;
        touchstartY = e.changedTouches[0].clientY;
        steptime = 0;
    });
    document.addEventListener('touchmove',function(e){
        if(!touchstart){return;}
        var touchmoveY = e.changedTouches[0].clientY;
        steptime = -(touchmoveY-touchstartY);
        var time = timeline+=steptime;
        if(time < 0) timeline = 0;
        if(time > maxHeight)timeline = maxHeight;
        range(timeline);
        touchstartY = touchmoveY;
    })
    document.addEventListener('touchend',function(){
        touchstart = false;
        setTime = setInterval(() => {
            steptime*=0.95;
            if(Math.abs(steptime)<1){
                clearInterval(setTime)
            }
            var time = timeline+=steptime;
            if(time < 0) timeline = 0;
            if(time > maxHeight)timeline = maxHeight;
            range(timeline);
        },10);
    })

    var birdsShowY = 500;
    var line1940 = 1940;
    function range(timeline){
        console.log(timeline);
        bg.y = -timeline;

        // 大于1000的高度的时候出现，并且需要减去展示的高度点，来触发动画
        if(timeline>birdsShowY){
            // 小鸟出现
            birds.alpha = (timeline-birdsShowY)/1000;
            // birds.alpha=1;
            birds.x = (timeline-birdsShowY)/2;
            birds.y = (timeline-birdsShowY)/2;
            // 指定帧动画播放第几帧
            var birdsFrame = parseInt(timeline/10)%3;
            birds.gotoAndStop(birdsFrame);
        }
        
        if(timeline>line1940){
            alert('到达1940px高度，并适配不同大小的屏幕');
        }
    }

}