/**
 * Lottie动画,仅支持Web环境,小游戏及原生环境不支持
 */
export default class LottieAnimation extends Laya.Sprite
{
    public static readonly COMPLETE: string = "complete";
    public static readonly LOOP_COMPLETE: string = "loopComplete";
    public static readonly ENTER_FRAME: string = "enterFrame";
    public static readonly SEGMENT_START: string = "segmentStart";
    public static readonly DESTORY: string = "destroy";
    /**
     * when initial config is done
     */
    public static readonly CONFIG_READY: string = "config_ready";

    /**
     * when all parts of the animation have been loaded
     */
    public static readonly DATA_READY: string = "data_ready";

    /**
     * when part of the animation can not be loaded
     */
    public static readonly DATA_FAILED: string = "data_failed";

    /**
     * when all image loads have either succeeded or errored
     */
    public static readonly LOADED_IMAGES: string = "loaded_images";

    /**
     * when elements have been added to the DOM,这个事件表示Lottie初始化完毕
     */
    public static readonly DOM_LOADED: string = "DOMLoaded";

    /**
     * 是否循环,默认否
     */
    public loop: boolean = false;

    /**
     * 是否自动播放,默认否
     */
    public autoPlay: boolean = false;

    private _isPlaying: boolean = false;
    /**
     * 是否正在播放
     */
    public get isPlaying(): boolean { return this._isPlaying; }

    //Div容器
    private div: HTMLDivElement = null;
    //动画对象
    private animation: Lottie.AnimationItem = null;
    //canvasId
    private canvasId: string = null;
    //canvas对象
    private canvas: HTMLCanvasElement = null;
    //纹理对象
    private texture2d: Laya.Texture2D = null;

    constructor(width: number = 200, height: number = 200)
    {
        super();
        this.size(width, height);
        this.div = Laya.Browser.createElement("div");
        this.div.id = `lottie_div_${+ new Date().getTime()}`;
        this.div.style.opacity = "0";
        //源码中使用这个值计算了canvas的尺寸,所以这里逆向计算div的尺寸,方便把canvas的尺寸设为想要的尺寸
        let r: number = window.devicePixelRatio || 1;
        this.div.style.width = `${width / r}px`;
        this.div.style.height = `${height / r}px`;
        Laya.Browser.document.body.appendChild(this.div);
    }

    /**
     * 加载动画
     * @param path 数据文件路径
     */
    public loadAnimation(path: string): void
    {
        let config: Lottie.AnimationConfig = this.makeConfig(path, null);
        this.animation = lottie.loadAnimation(config);
        this.initEvents();
    }

    /**
     * 加载动画
     * @param data 数据对象
     */
    public loadAnimationByData(data: any): void
    {
        let config: Lottie.AnimationConfig = this.makeConfig(null, data);
        this.animation = lottie.loadAnimation(config);
        this.initEvents();
    }

    private makeConfig(path: string, data: any): Lottie.AnimationConfig
    {
        this.canvasId = `lottie_canvas_${+ new Date().getTime()}`;
        let config: Lottie.AnimationConfig = {
            animationData: data,
            loop: this.loop,
            autoplay: this.autoPlay,
            renderer: "canvas",
            container: this.div,
            rendererSettings: {
                id: this.canvasId
            }
        };
        if (path)
        {
            config.path = path;
        }
        if (data)
        {
            config.animationData = data;
        }
        return config;
    }

    private initEvents(): void
    {
        this.animation.addEventListener(LottieAnimation.COMPLETE, (args?: any) =>
        {
            this.event(LottieAnimation.COMPLETE, args);
        });
        this.animation.addEventListener(LottieAnimation.LOOP_COMPLETE, (args?: any) =>
        {
            this.event(LottieAnimation.LOOP_COMPLETE, args);
        });
        this.animation.addEventListener(LottieAnimation.DOM_LOADED, () =>
        {
            this.initCanvas();
            this.initLoop();
            this.event(LottieAnimation.DOM_LOADED);
        });
        this.animation.addEventListener(LottieAnimation.ENTER_FRAME, (args?: any) =>
        {
            this.event(LottieAnimation.ENTER_FRAME, args);
        });
        this.animation.addEventListener(LottieAnimation.SEGMENT_START, (args?: any) =>
        {
            this.event(LottieAnimation.SEGMENT_START, args);
        });
        this.animation.addEventListener(LottieAnimation.DESTORY, (args?: any) =>
        {
            this.event(LottieAnimation.DESTORY, args);
        });
        this.animation.addEventListener(LottieAnimation.CONFIG_READY, () =>
        {
            this.event(LottieAnimation.CONFIG_READY);
        });
        this.animation.addEventListener(LottieAnimation.DATA_READY, () =>
        {
            this.event(LottieAnimation.DATA_READY);
        });
        this.animation.addEventListener(LottieAnimation.DATA_FAILED, () =>
        {
            this.event(LottieAnimation.DATA_FAILED);
        });
        this.animation.addEventListener(LottieAnimation.LOADED_IMAGES, () =>
        {
            this.event(LottieAnimation.LOADED_IMAGES);
        });
    }

    private initCanvas(): void
    {
        this.canvas = Laya.Browser.document.getElementById(this.canvasId);
        //this.size(this.canvas.width, this.canvas.height);
        //this.graphics.drawRect(0, 0, this.width, this.height, "#666666");
    }

    private initLoop(): void
    {
        this.texture2d = new Laya.Texture2D();
        this.texture = Laya.Texture.create(this.texture2d, 0, 0, this.texture2d.width, this.texture2d.height);
        if (this.autoPlay)
        {
            this._isPlaying = true;
        }
        Laya.timer.frameLoop(1, this, this.onFrame);
    }

    private onFrame(): void
    {
        if (!this.isPlaying || this.canvas == null)
        {
            return;
        }
        //填充纹理
        this.texture2d.loadImageSource(this.canvas, true);
        this.texture.setTo(this.texture2d);
    }

    /**
     * 播放
     * @returns 
     */
    public play(): void
    {
        if (this.animation == null)
        {
            return;
        }
        this._isPlaying = true;
        this.animation.play();
    }

    /**
     * 暂停
     * @returns 
     */
    public pause(): void
    {
        if (this.animation == null)
        {
            return;
        }
        this._isPlaying = false;
        this.animation.pause();
    }

    /**
     * 停止
     * @returns 
     */
    public stop(): void
    {
        if (this.animation == null)
        {
            return;
        }
        this._isPlaying = false;
        this.animation.stop();
    }

    /**
     * 设置速度
     * @param speed 默认1
     * @returns 
     */
    public setSpeed(speed: number): void
    {
        if (this.animation == null)
        {
            return;
        }
        this.animation.setSpeed(speed);
    }

    /**
     * 设置方向
     * @param direction 1正向,-1反向
     * @returns 
     */
    public setDirection(direction: number): void
    {
        if (this.animation == null)
        {
            return;
        }
        this.animation.setDirection(direction);
    }

    /**
     * 是否使用子帧,true将使用requestAnimationFrame更新动画,否则将使用AE导出的帧率
     * @param bo 默认true
     * @returns 
     */
    public setSubframe(bo: boolean): void
    {
        if (this.animation == null)
        {
            return;
        }
        this.animation.setSubframe(bo);
    }

    /**
     * 跳转并播放
     * @param value 
     * @param isFrame true表示时间,false表示帧数
     * @returns 
     */
    public goToAndPlay(value: number, isFrame: boolean = false): void
    {
        if (this.animation == null)
        {
            return;
        }
        this.animation.goToAndPlay(value, isFrame);
    }

    /**
     * 跳转并停止
     * @param value 
     * @param isFrame true表示时间,false表示帧数
     * @returns 
     */
    public goToAndStop(value: number, isFrame: boolean = false): void
    {
        if (this.animation == null)
        {
            return;
        }
        this.animation.goToAndStop(value, isFrame);
    }

    /**
     * 播放片段
     * @param segments 一个数组两个值,表示开始帧和结束帧,或者二维数组表示一些片段
     * @param forceFlag true立即播放,false等当前片段结束后再播放
     * @returns 
     */
    public playSegments(segments: number[] | number[][], forceFlag: boolean): void
    {
        if (this.animation == null)
        {
            return;
        }
        this.animation.playSegments(segments, forceFlag);
    }

    onDestroy(): void
    {
        if (this.animation != null)
        {
            this.animation.stop();
            this.animation.destroy();
        }
        if (this.texture2d != null)
        {
            this.texture2d.destroy();
        }
        if (this.div != null)
        {
            Laya.Browser.document.body.removeChild(this.div);
        }
        Laya.timer.clearAll(this);
    }
}