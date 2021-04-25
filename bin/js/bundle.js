(function () {
    'use strict';

    class LottieAnimation extends Laya.Sprite {
        constructor(width = 200, height = 200) {
            super();
            this.loop = false;
            this.autoPlay = false;
            this._isPlaying = false;
            this.div = null;
            this.animation = null;
            this.canvasId = null;
            this.canvas = null;
            this.texture2d = null;
            this.size(width, height);
            this.div = Laya.Browser.createElement("div");
            this.div.id = `lottie_div_${+new Date().getTime()}`;
            this.div.style.opacity = "0";
            let r = window.devicePixelRatio || 1;
            this.div.style.width = `${width / r}px`;
            this.div.style.height = `${height / r}px`;
            Laya.Browser.document.body.appendChild(this.div);
        }
        get isPlaying() { return this._isPlaying; }
        loadAnimation(path) {
            let config = this.makeConfig(path, null);
            this.animation = lottie.loadAnimation(config);
            this.initEvents();
        }
        loadAnimationByData(data) {
            let config = this.makeConfig(null, data);
            this.animation = lottie.loadAnimation(config);
            this.initEvents();
        }
        makeConfig(path, data) {
            this.canvasId = `lottie_canvas_${+new Date().getTime()}`;
            let config = {
                animationData: data,
                loop: this.loop,
                autoplay: this.autoPlay,
                renderer: "canvas",
                container: this.div,
                rendererSettings: {
                    id: this.canvasId
                }
            };
            if (path) {
                config.path = path;
            }
            if (data) {
                config.animationData = data;
            }
            return config;
        }
        initEvents() {
            this.animation.addEventListener(LottieAnimation.COMPLETE, (args) => {
                this.event(LottieAnimation.COMPLETE, args);
            });
            this.animation.addEventListener(LottieAnimation.LOOP_COMPLETE, (args) => {
                this.event(LottieAnimation.LOOP_COMPLETE, args);
            });
            this.animation.addEventListener(LottieAnimation.DOM_LOADED, () => {
                this.initCanvas();
                this.initLoop();
                this.event(LottieAnimation.DOM_LOADED);
            });
            this.animation.addEventListener(LottieAnimation.ENTER_FRAME, (args) => {
                this.event(LottieAnimation.ENTER_FRAME, args);
            });
            this.animation.addEventListener(LottieAnimation.SEGMENT_START, (args) => {
                this.event(LottieAnimation.SEGMENT_START, args);
            });
            this.animation.addEventListener(LottieAnimation.DESTORY, (args) => {
                this.event(LottieAnimation.DESTORY, args);
            });
            this.animation.addEventListener(LottieAnimation.CONFIG_READY, () => {
                this.event(LottieAnimation.CONFIG_READY);
            });
            this.animation.addEventListener(LottieAnimation.DATA_READY, () => {
                this.event(LottieAnimation.DATA_READY);
            });
            this.animation.addEventListener(LottieAnimation.DATA_FAILED, () => {
                this.event(LottieAnimation.DATA_FAILED);
            });
            this.animation.addEventListener(LottieAnimation.LOADED_IMAGES, () => {
                this.event(LottieAnimation.LOADED_IMAGES);
            });
        }
        initCanvas() {
            this.canvas = Laya.Browser.document.getElementById(this.canvasId);
        }
        initLoop() {
            this.texture2d = new Laya.Texture2D();
            this.texture = Laya.Texture.create(this.texture2d, 0, 0, this.texture2d.width, this.texture2d.height);
            if (this.autoPlay) {
                this._isPlaying = true;
            }
            Laya.timer.frameLoop(1, this, this.onFrame);
        }
        onFrame() {
            if (!this.isPlaying || this.canvas == null) {
                return;
            }
            this.texture2d.loadImageSource(this.canvas, true);
            this.texture.setTo(this.texture2d);
        }
        play() {
            if (this.animation == null) {
                return;
            }
            this._isPlaying = true;
            this.animation.play();
        }
        pause() {
            if (this.animation == null) {
                return;
            }
            this._isPlaying = false;
            this.animation.pause();
        }
        stop() {
            if (this.animation == null) {
                return;
            }
            this._isPlaying = false;
            this.animation.stop();
        }
        setSpeed(speed) {
            if (this.animation == null) {
                return;
            }
            this.animation.setSpeed(speed);
        }
        setDirection(direction) {
            if (this.animation == null) {
                return;
            }
            this.animation.setDirection(direction);
        }
        setSubframe(bo) {
            if (this.animation == null) {
                return;
            }
            this.animation.setSubframe(bo);
        }
        goToAndPlay(value, isFrame = false) {
            if (this.animation == null) {
                return;
            }
            this.animation.goToAndPlay(value, isFrame);
        }
        goToAndStop(value, isFrame = false) {
            if (this.animation == null) {
                return;
            }
            this.animation.goToAndStop(value, isFrame);
        }
        playSegments(segments, forceFlag) {
            if (this.animation == null) {
                return;
            }
            this.animation.playSegments(segments, forceFlag);
        }
        onDestroy() {
            if (this.animation != null) {
                this.animation.stop();
                this.animation.destroy();
            }
            if (this.texture2d != null) {
                this.texture2d.destroy();
            }
            if (this.div != null) {
                Laya.Browser.document.body.removeChild(this.div);
            }
            Laya.timer.clearAll(this);
        }
    }
    LottieAnimation.COMPLETE = "complete";
    LottieAnimation.LOOP_COMPLETE = "loopComplete";
    LottieAnimation.ENTER_FRAME = "enterFrame";
    LottieAnimation.SEGMENT_START = "segmentStart";
    LottieAnimation.DESTORY = "destroy";
    LottieAnimation.CONFIG_READY = "config_ready";
    LottieAnimation.DATA_READY = "data_ready";
    LottieAnimation.DATA_FAILED = "data_failed";
    LottieAnimation.LOADED_IMAGES = "loaded_images";
    LottieAnimation.DOM_LOADED = "DOMLoaded";

    class LottieTest extends Laya.Script {
        constructor() {
            super(...arguments);
            this.aniList = [];
            this.aniSize = 200;
            this.currentDirection = 1;
            this.currentSpeed = 1;
            this.maxSpeed = 5;
        }
        onStart() {
            this.scene = this.owner;
            this.scene.graphics.drawRect(0, 0, this.scene.width, this.scene.height, "#FFFFFF");
            this.buttonAdd = new Laya.Sprite();
            this.buttonAdd.size(100, 40);
            this.buttonAdd.graphics.drawRect(0, 0, 100, 40, "#000000");
            this.buttonAdd.on(Laya.Event.CLICK, this, () => {
                this.addAni();
            });
            let text = new Laya.Text();
            text.text = "增加";
            text.color = "#FFFFFF";
            text.fontSize = 40;
            this.buttonAdd.addChild(text);
            this.buttonAdd.pos(this.scene.width - this.buttonAdd.width * 2 - 10, 0);
            this.scene.addChild(this.buttonAdd);
            this.buttonRemove = new Laya.Sprite();
            this.buttonRemove.size(100, 40);
            this.buttonRemove.graphics.drawRect(0, 0, 100, 40, "#00000");
            this.buttonRemove.on(Laya.Event.CLICK, this, () => {
                this.removeAni();
            });
            text = new Laya.Text();
            text.text = "删除";
            text.color = "#FFFFFF";
            text.fontSize = 40;
            this.buttonRemove.addChild(text);
            this.buttonRemove.pos(this.scene.width - this.buttonRemove.width, 0);
            this.scene.addChild(this.buttonRemove);
            this.buttonPlayPause = new Laya.Sprite();
            this.buttonPlayPause.size(100, 40);
            this.buttonPlayPause.graphics.drawRect(0, 0, 100, 40, "#000000");
            this.buttonPlayPause.on(Laya.Event.CLICK, this, () => {
                this.playPause();
            });
            text = new Laya.Text();
            text.text = "播放/暂停";
            text.color = "#FFFFFF";
            text.fontSize = 20;
            this.buttonPlayPause.addChild(text);
            this.buttonPlayPause.pos(this.scene.width - this.buttonPlayPause.width * 2 - 10, this.buttonPlayPause.height + 10);
            this.scene.addChild(this.buttonPlayPause);
            this.buttonSpeed = new Laya.Sprite();
            this.buttonSpeed.size(100, 40);
            this.buttonSpeed.graphics.drawRect(0, 0, 100, 40, "#00000");
            this.buttonSpeed.on(Laya.Event.CLICK, this, () => {
                this.changeSpeed();
            });
            text = new Laya.Text();
            text.text = "变速";
            text.color = "#FFFFFF";
            text.fontSize = 40;
            this.buttonSpeed.addChild(text);
            this.buttonSpeed.pos(this.scene.width - this.buttonSpeed.width, this.buttonSpeed.height + 10);
            this.scene.addChild(this.buttonSpeed);
            this.buttonDirection = new Laya.Sprite();
            this.buttonDirection.size(100, 40);
            this.buttonDirection.graphics.drawRect(0, 0, 100, 40, "#000000");
            this.buttonDirection.on(Laya.Event.CLICK, this, () => {
                this.changeDirection();
            });
            text = new Laya.Text();
            text.text = "变向";
            text.color = "#FFFFFF";
            text.fontSize = 40;
            this.buttonDirection.addChild(text);
            this.buttonDirection.pos(this.scene.width - this.buttonDirection.width * 2 - 10, this.buttonDirection.height * 2 + 20);
            this.scene.addChild(this.buttonDirection);
        }
        addAni() {
            let ani = new LottieAnimation(this.aniSize, this.aniSize);
            ani.autoPlay = true;
            ani.loop = true;
            let x = this.aniList.length % 2 * this.aniSize + 10;
            let y = Math.floor(this.aniList.length / 2) * this.aniSize + 10 + this.aniSize;
            ani.pos(x, y);
            this.scene.addChild(ani);
            let str = `ani_${this.randomAB(0, 3)}.json`;
            ani.loadAnimation(str);
            this.aniList.push(ani);
        }
        removeAni() {
            let ani = this.aniList.pop();
            if (!ani) {
                return;
            }
            ani.destroy(true);
        }
        playPause() {
            if (this.aniList.length <= 0) {
                return;
            }
            let isPlaying = this.aniList[0].isPlaying;
            for (let i = 0; i < this.aniList.length; i++) {
                const ani = this.aniList[i];
                if (isPlaying) {
                    ani.pause();
                }
                else {
                    ani.play();
                }
            }
        }
        changeSpeed() {
            this.currentSpeed++;
            if (this.currentSpeed > this.maxSpeed) {
                this.currentSpeed = 1;
            }
            for (let i = 0; i < this.aniList.length; i++) {
                const ani = this.aniList[i];
                ani.setSpeed(this.currentSpeed);
            }
        }
        changeDirection() {
            this.currentDirection *= -1;
            for (let i = 0; i < this.aniList.length; i++) {
                const ani = this.aniList[i];
                ani.setDirection(this.currentDirection);
            }
        }
        randomAB(min, max) {
            return parseInt((Math.random() * (max - min + 1) + min) + "", 10);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/LottieTest.ts", LottieTest);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = true;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
//# sourceMappingURL=bundle.js.map
