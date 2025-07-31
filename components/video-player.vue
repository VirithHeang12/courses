<template>
  <div class="video-player-container">
    <VideoPlayer
      ref="videoPlayer"
      :src="src"
      :poster="poster"
      :options="playerOptions"
      @ready="onPlayerReady"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @error="onError"
    />
  </div>
</template>

<script setup lang="ts">
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

interface Props {
  src: string
  poster?: string
  width?: number | string
  height?: number | string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  preload?: 'auto' | 'metadata' | 'none'
  fluid?: boolean
  responsive?: boolean
  aspectRatio?: string
  playbackRates?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  poster: '',
  width: '100%',
  height: 400,
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
  preload: 'auto',
  fluid: true,
  responsive: true,
  aspectRatio: '16:9',
  playbackRates: () => [0.5, 1, 1.25, 1.5, 2]
})

const emit = defineEmits<{
  ready: [player: any]
  play: []
  pause: []
  ended: []
  timeupdate: [currentTime: number]
  error: [error: any]
}>()

const videoPlayer = ref()

const playerOptions = computed(() => ({
  width: props.width,
  height: props.height,
  autoplay: props.autoplay,
  controls: props.controls,
  loop: props.loop,
  muted: props.muted,
  preload: props.preload,
  fluid: props.fluid,
  responsive: props.responsive,
  aspectRatio: props.aspectRatio,
  playbackRates: props.playbackRates,
  sources: [{
    src: props.src,
    type: getVideoType(props.src)
  }],
  poster: props.poster
}))

function getVideoType(src: string): string {
  const extension = src.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'mp4':
      return 'video/mp4'
    case 'webm':
      return 'video/webm'
    case 'ogg':
      return 'video/ogg'
    case 'm3u8':
      return 'application/x-mpegURL'
    default:
      return 'video/mp4'
  }
}

function onPlayerReady(player: any) {
  emit('ready', player)
}

function onPlay() {
  emit('play')
}

function onPause() {
  emit('pause')
}

function onEnded() {
  emit('ended')
}

function onTimeUpdate(event: any) {
  const currentTime = event.target.currentTime()
  emit('timeupdate', currentTime)
}

function onError(error: any) {
  emit('error', error)
}

defineExpose({
  player: computed(() => videoPlayer.value?.player),
  play: () => videoPlayer.value?.player?.play(),
  pause: () => videoPlayer.value?.player?.pause(),
  currentTime: (time?: number) => {
    if (time !== undefined) {
      videoPlayer.value?.player?.currentTime(time)
    }
    return videoPlayer.value?.player?.currentTime()
  },
  duration: () => videoPlayer.value?.player?.duration(),
  volume: (vol?: number) => {
    if (vol !== undefined) {
      videoPlayer.value?.player?.volume(vol)
    }
    return videoPlayer.value?.player?.volume()
  },
  muted: (mute?: boolean) => {
    if (mute !== undefined) {
      videoPlayer.value?.player?.muted(mute)
    }
    return videoPlayer.value?.player?.muted()
  }
})
</script>

<style scoped>
.video-player-container {
  width: 100%;
  max-width: 100%;
}

.video-player-container :deep(.video-js) {
  font-family: inherit;
}

.video-player-container :deep(.vjs-big-play-button) {
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  transition: all 0.3s ease;
}

.video-player-container :deep(.vjs-big-play-button:hover) {
  background-color: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.video-player-container :deep(.vjs-control-bar) {
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}
</style>