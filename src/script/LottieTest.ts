import LottieAnimation from "./LottieAnimation";

export default class LottieTest extends Laya.Script
{
    private animation: LottieAnimation;
    private scene: Laya.Scene;
    private buttonAdd: Laya.Sprite;
    private buttonRemove: Laya.Sprite;
    private buttonPlayPause: Laya.Sprite;
    private buttonSpeed: Laya.Sprite;
    private buttonDirection: Laya.Sprite;
    private aniList: Array<LottieAnimation> = [];
    private aniSize: number = 200;
    private currentDirection: number = 1;
    private currentSpeed: number = 1;
    private maxSpeed: number = 5;

    onStart(): void
    {
        this.scene = this.owner as Laya.Scene;
        this.scene.graphics.drawRect(0, 0, this.scene.width, this.scene.height, "#FFFFFF");

        this.buttonAdd = new Laya.Sprite();
        this.buttonAdd.size(100, 40);
        this.buttonAdd.graphics.drawRect(0, 0, 100, 40, "#000000");
        this.buttonAdd.on(Laya.Event.CLICK, this, () =>
        {
            this.addAni();
        });
        let text: Laya.Text = new Laya.Text();
        text.text = "增加";
        text.color = "#FFFFFF";
        text.fontSize = 40;
        this.buttonAdd.addChild(text);
        this.buttonAdd.pos(this.scene.width - this.buttonAdd.width * 2 - 10, 0);
        this.scene.addChild(this.buttonAdd);

        this.buttonRemove = new Laya.Sprite();
        this.buttonRemove.size(100, 40);
        this.buttonRemove.graphics.drawRect(0, 0, 100, 40, "#00000");
        this.buttonRemove.on(Laya.Event.CLICK, this, () =>
        {
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
        this.buttonPlayPause.on(Laya.Event.CLICK, this, () =>
        {
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
        this.buttonSpeed.on(Laya.Event.CLICK, this, () =>
        {
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
        this.buttonDirection.on(Laya.Event.CLICK, this, () =>
        {
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

    private addAni(): void
    {
        let ani: LottieAnimation = new LottieAnimation(this.aniSize, this.aniSize);
        ani.autoPlay = true;
        ani.loop = true;
        let x: number = this.aniList.length % 2 * this.aniSize + 10;
        let y: number = Math.floor(this.aniList.length / 2) * this.aniSize + 10 + this.aniSize;
        ani.pos(x, y)
        this.scene.addChild(ani);
        let str: string = `ani_${this.randomAB(0, 3)}.json`;
        ani.loadAnimation(str);
        this.aniList.push(ani);
    }

    private removeAni(): void
    {
        let ani: LottieAnimation = this.aniList.pop();
        if (!ani)
        {
            return;
        }
        ani.destroy(true);
    }

    private playPause(): void
    {
        if (this.aniList.length <= 0)
        {
            return;
        }
        let isPlaying = this.aniList[0].isPlaying;
        for (let i = 0; i < this.aniList.length; i++)
        {
            const ani: LottieAnimation = this.aniList[i];
            if (isPlaying)
            {
                ani.pause();
            }
            else
            {
                ani.play();
            }
        }
    }

    private changeSpeed(): void
    {
        this.currentSpeed++;
        if (this.currentSpeed > this.maxSpeed)
        {
            this.currentSpeed = 1;
        }
        for (let i = 0; i < this.aniList.length; i++)
        {
            const ani: LottieAnimation = this.aniList[i];
            ani.setSpeed(this.currentSpeed);
        }
    }

    private changeDirection(): void
    {
        this.currentDirection *= -1;
        for (let i = 0; i < this.aniList.length; i++)
        {
            const ani: LottieAnimation = this.aniList[i];
            ani.setDirection(this.currentDirection);
        }
    }

    private randomAB(min: number, max: number): number
    {
        return parseInt((Math.random() * (max - min + 1) + min) + "", 10);
    }
}