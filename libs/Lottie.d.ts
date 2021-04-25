declare namespace Lottie
{
    export interface AnimationItem
    {
        /**
         * Play
         */
        play();

        /**
         * Stop
         */
        stop();

        /**
         * Pause
         */
        pause();

        /**
         * 
         * @param speed one param speed (1 is normal speed) 
         */
        setSpeed(speed: number);

        /**
         * 
         * @param direction 1 is forward, -1 is reverse.
         */
        setDirection(direction: number);

        /**
         * 
         * @param flag  If false, it will respect the original AE fps. If true, it will update on every requestAnimationFrame with intermediate values. Default is true.
         */
        setSubframe(flag: boolean);

        // first param is a numeric value. second param is a boolean that defines time or frames for first param    
        /**
         * 
         * @param value numeric value.
         * @param isFrame defines if first argument is a time based value or a frame based (default false).
         */
        goToAndPlay(value: number, isFrame: boolean);

        /**
         * 
         * @param value numeric value.
         * @param isFrame defines if first argument is a time based value or a frame based (default false).
         */
        goToAndStop(value: number, isFrame: boolean);

        // first param is a single array or multiple arrays of two values each(fromFrame,toFrame), second param is a boolean for forcing the new segment right away
        /**
         * 
         * @param segments array. Can contain 2 numeric values that will be used as first and last frame of the animation. 
         * Or can contain a sequence of arrays each with 2 numeric values.
         * @param forceFlag boolean. If set to false, it will wait until the current segment is complete. If true, it will update values immediately.
         */
        playSegments(segments: number[] | number[][], forceFlag: boolean);

        /**
         * To destroy and release resources.
         */
        destroy();

        addEventListener(eventName:string,callback?:(args?:any)=>void);

        removeEventListener(eventName:string,callback?:(args?:any)=>void);
    }

    export interface AnimationConfig
    {
        /**
         * an Object with the exported animation data.
         */
        animationData?: any;

        /**
         * the relative path to the animation object. (animationData and path are mutually exclusive)
         */
        path?: string;

        /**
         * true / false / number
         */
        loop?: boolean | number;

        /**
         * true / false it will start playing as soon as it is ready
         */
        autoplay?: boolean;

        /**
         * you can pass a name to the animation instance to refer to it later through lottie commands.
         * This feature is not useful if you already have stored a direct reference to the animation instance returned by loadAnimation.
         */
        name?: string;

        /**
         * 'svg' / 'canvas' / 'html' to set the renderer,default is svg
         */
        renderer?: string;

        /**
         * The HTMLelement that will contain the animation. Make sure the element exists on the page when calling loadAnimation.
         */
        container?: any;

        /**
         * you can specify a different root path for external assets path instead of the images folder
         */
        assetsPath?: string;

        /**
         * Renderer Settings are some specific settings you can pass the the renderer instance.
         */
        rendererSettings?: RendererSettings;

        /**
         * expects an array of length 2. 
         * First value is the initial frame, second value is the final frame. 
         * If this is set, the animation will start at this position in time instead of the exported value from AE.
         */
        initialSegment?: Array<number>;

        /**
         * if set to true, elements will get added instantiated and added to the DOM only when the play cursor reaches that frame.
         * It might not work correctly if track matte masks are not layer aligned with the masked elements.
         */
        progressiveLoad?: boolean;
    }

    export interface RendererSettings
    {
        /**
         * for svg and canvas renderer it simulates the behavior of the preserveAspectRatio property on svgs. 
         * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
         */
        preserveAspectRatio?: string;

        /**
         * if set to true, the svg renderer will add rendering elements to the svg markup progressively instead of all at the beginning.
         * Useful if you have a very long animation and the initial loading is slow.
         */
        progressiveLoad?: boolean;

        /**
         * for the canvas renderer, if you want to pass a shared canvas context.
         */
        context?: any;

        /**
         * if set to false, canvas will not be erased between frames. Useful when the canvas context is shared with the rest of the application
         */
        clearCanvas?: boolean;

        /**
         * will add a class to the root element of the animation.Useful for styling via CSS or referencing via Javascript.
         */
        className?: string;

        /**
         * will add an id to the root element of the animation.
         * Useful for styling via CSS or referencing via Javascript.
         */
        id?: string;

        /**
         * if true will set display to hidden when element has opacity set to 0. Default is true.
         */
        hideOnTransparent?: boolean;

        /**
         * (svg renderer),if true will not add width, height and transform properties to root element
         */
        viewBoxOnly?: boolean;

        /**
         * (svg renderer),if passed it will override the viewBox set by default on the animation
         */
        viewBoxSize?: boolean;

        /**
         * supports all presetAspectRatio values from image elements. Defaults to xMidYMid slice
         */
        imagePreserveAspectRatio?: string;

        /**
         * (svg renderer),sets the focusable attribute to svg elements
         */
        focusable?: boolean;

        /**
         * (svg renderer),In order to render drop shadows, 
         * the filter size needs to be set to increase the render surface of the element. 
         * You can set the x, y, width and height of filters manually.
         * {width: '200%',height: '200%',x: '-50%',y: '-50%'}
         */
        filterSize?: any;
    }
}

declare class LottyPlayer
{
    /**
     * 
     * @param name optional parameter name to target a specific animation
     */
    play(name?: string);

    /**
     * 
     * @param name optional parameter name to target a specific animation
     */
    stop(name?: string);

    /**
     * 
     * @param speed 1 is normal speed
     * @param name optional parameter name to target a specific animation
     */
    setSpeed(speed: number, name?: string);

    /**
     * 
     * @param direction 1 is forward, -1 is reverse.
     * @param name optional parameter name to target a specific animation
     */
    setDirection(direction: number, name?: string);

    /**
     * default 'high', set 'high','medium','low', or a number > 1 to improve player performance. In some animations as low as 2 won't show any difference.
     * @param quality 
     */
    setQuality(quality: string | number);

    /**
     * param usually pass as location.href. Its useful when you experience mask issue in safari where your url does not have # symbol.
     * @param href 
     */
    setLocationHref(href: string);

    /**
     * returns an animation instance to control individually.
     * @param params 
     */
    loadAnimation(params: Lottie.AnimationConfig): Lottie.AnimationItem;

    /**
     * you can register an element directly with registerAnimation. It must have the "data-animation-path" attribute pointing at the data.json url
     * @param element 
     * @param animationData 
     */
    registerAnimation(element: any, animationData?: any);

    /**
     * looks for elements with class "lottie"
     * @param animationData 
     * @param standalone 
     * @param renderer 
     */
    searchAnimations(animationData: any, standalone: boolean, renderer?: string);

    /**
     * To destroy and release resources. The DOM element will be emptied.
     * @param name 
     */
    destroy(name?: string);
}

declare const lottie: LottyPlayer;

declare module "lottie-web" {
    export = lottie;
    //export as namespace Lottie;
}