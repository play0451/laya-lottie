# laya-lottie
Laya适配Lottie-web

项目中遇到了使用lottie的需求,但是Laya好像没有封装,搜了一下也没找到解决方案,于是到lotti-web的github上找了一下如何在TypeScirpt中使用lottie,最后在前人的基础上进行了简单的封装,可以在laya里使用了

### 原理很简单
1. lottie使用canvas渲染
2. 找到渲染的canvas
3. 使用Laya.Texture2D的loadImageSource方法进行填充

###主要文件
1. libs/Lottie.d.ts
2. src/script/LottieAnimation.ts

## 基于Laya 2.10和lotti-web 5.7.8

# 本方法仅支持web环境,不支持小游戏和原生环境
# 没有经过大量测试,可能存在bug及性能问题