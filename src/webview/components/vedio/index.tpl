<swan-video data-sanid="{{ __uid }}" class="swan-android-video" style="{{ videoWrapStyle }}" data-swan-same-layer="1" on-click="(onVideoWrapClick)">
  <video
    s-ref="video"
    on-timeupdate="(onTimeUpdate)"
    on-durationchange="(onDurationChange)"
    on-ended="(onPlayEnded)"
    on-pause="(onPlayPause)"
    on-play="(onPlayStart)"
    on-playing="(onPlaying)"
    on-error="(onPlayError)"
    on-loadedmetadata="(onLoadedMetaData)"
    on-waiting="(onPlayWaiting)"
    preload="{{ __preload }}"
    src="{{ __src }}"
    poster="{{ __poster }}"
    style="{{ videoStyle }}"
    t7-video-player-type="inline"
  ></video>
  <div s-ref="danmu" class="swan-video-danmu-wrap"></div>

  <div class="swan-video-voice-light-state" s-if="__isPageGestureUpVoiceLight">
    <i class="{{ voiceLightStateIconClass }}"></i>
  </div>
  <div class="swan-video-play-result-state" s-if="showCenterEndOrErrorButton">
    <div class="swan-video-circle-btn" on-click="(onRePlay)">
      <i class="swan-video-btn-icon {{ __isPlayError ? 'swan-video-i-refresh' : 'swan-video-i-replay' }}"></i>
    </div>
    <div class="swan-video-play-result-state-tip"></div>
  </div>
  <div class="swan-video-network-state" s-if="__hasNoWifiTip"></div>
  <div class="swan-video-back-btn {{ showVideoBackControl ? '' : 'swan-hide' }}">
    <i class="swan-video-i-back" on-click="(onFullscreenBack)"></i>
  </div>
  <div class="swan-video-slot" style="{{ slotStyle }}" id="slot_{{ __uid }}" s-ref="slot">
    <slot></slot>
  </div>
  <div class="swan-video-sidebar" s-if="__showSidebar" on-click="(onTapSidebar)">
    <div class="swan-video-sidebar-rate" s-if="__sidebarType === 'rate'">
      <div
        s-for="rate in __rateList"
        class="swan-video-sidebar-rate-text
                    {{ __currentRate === rate ? ' swan-video-sidebar-selected-rate-text' : '' }}"
        on-click="onSelectRate($event, rate)"
      >
        {{ rate }}X
      </div>
    </div>
    <div class="swan-video-sidebar-voice-and-light" s-if="__sidebarType === 'voiceAndLight'">
      <div class="swan-video-sidebar-section" s-for="ctrl in __sidebarControls">
        <div class="swan-video-sidebar-control">
          <i class="swan-video-bottom-op-btn {{ ctrl.lowerIcon }}"></i>
          <div
            class="swan-video-progress-bar-inner"
            on-touchstart="onSidebarProgressTouchStart($event, ctrl.key)"
            on-touchmove="onSidebarProgressTouchMove($event, ctrl.key)"
            on-touchend="onSidebarProgressTouchEnd($event, ctrl.key)"
            on-click="onSidebarProgressClick($event, ctrl.key)"
          >
            <div s-ref="{{ ctrl.key }}Slider" class="swan-video-progress-slider">
              <div
                class="swan-video-progress-slider-track"
                style="width:
                                    {{ctrl.key | getSliderPercent(__lightPercent, __voicePercent)}}%"
              ></div>
              <div
                class="swan-video-progress-slider-handler"
                style="left:
                                    {{ctrl.key | getSliderPercent(__lightPercent, __voicePercent)}}%"
              ></div>
            </div>
          </div>
          <i class="swan-video-bottom-op-btn {{ ctrl.opIcon }}"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="swan-video-rate-tips" s-if="__showRateTips">
    已为你开启<span class="swan-video-rate-tips-focus">{{ __currentRate }}倍速</span>播放
  </div>
  <div class="swan-video-silent-play-tips" s-if="__showSilentPlayTips">无声视频</div>
</swan-video>
