# 移动端video封装 兼容大部分手机


```html
<template>
  <div class="cus-video">
    <img class="cus-video-poster"
          v-show="!clicked"
        :src="poster"
        @click="onVideoClick"
        >
    <video ref="video"
          v-show="clicked"
          class="cus-video-video"
          muted playsinline loop
          preload="auto"
          webkit-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          x5-video-orientation="portraint"
          :src="src" controls></video>
  </div>
</template>
```

```js
export default {
  props: {
	  src: String
  }
  ,
  data() {
    return {
      number: 0,
      poster: 'https://oss.kaoyanvip.cn/attach/file1614391116428.png',
      clicked: false,
    }
  }
  ,
  methods: {
    onVideoClick() {
      this.clicked = true
      this.$refs.video.play()
    }
  }
}

```

scss
```scss
$TAGNAME: "cus-video";
.#{$TAGNAME} {
  position: relative;
  &-video {
    display: block;
    width: 100%;
    height: 100%;
  }
  &-poster {
  	position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
}
```