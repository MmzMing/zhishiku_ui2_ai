/**
 * 视频播放器组件
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Button, 
  Slider, 
  Select, 
  Space, 
  Tooltip, 
  Modal, 
  message,
  Progress 
} from 'antd';
import {
  PlayCircleOutlined,
  PauseOutlined,
  SoundOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SettingOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

const { Option } = Select;

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  width?: number | string;
  height?: number | string;
  autoPlay?: boolean;
  controls?: boolean;
  needPoints?: number; // 需要的积分数
  onPointsDeduct?: (points: number) => Promise<boolean>; // 积分扣除回调
}

interface VideoState {
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  fullscreen: boolean;
  loading: boolean;
  buffered: number;
  playbackRate: number;
  quality: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  width = '100%',
  height = 'auto',
  autoPlay = false,
  controls = true,
  needPoints = 0,
  onPointsDeduct,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointsModalVisible, setPointsModalVisible] = useState(false);
  const [canPlay, setCanPlay] = useState(needPoints === 0);

  const [state, setState] = useState<VideoState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    fullscreen: false,
    loading: false,
    buffered: 0,
    playbackRate: 1,
    quality: 'auto',
  });

  // 播放速度选项
  const playbackRates = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1.0x', value: 1 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '1.75x', value: 1.75 },
    { label: '2.0x', value: 2 },
  ];

  // 清晰度选项
  const qualityOptions = [
    { label: '自动', value: 'auto' },
    { label: '标清 480P', value: '480p' },
    { label: '高清 720P', value: '720p' },
    { label: '超清 1080P', value: '1080p' },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setState(prev => ({
        ...prev,
        currentTime: video.currentTime,
        duration: video.duration || 0,
      }));
    };

    const updateBuffer = () => {
      if (video.buffered.length > 0) {
        const buffered = video.buffered.end(video.buffered.length - 1);
        setState(prev => ({ ...prev, buffered }));
      }
    };

    const handleLoadStart = () => setState(prev => ({ ...prev, loading: true }));
    const handleCanPlay = () => setState(prev => ({ ...prev, loading: false }));
    const handleWaiting = () => setState(prev => ({ ...prev, loading: true }));
    const handlePlaying = () => setState(prev => ({ ...prev, loading: false }));

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('progress', updateBuffer);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('progress', updateBuffer);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // 播放/暂停
  const togglePlay = async () => {
    if (!canPlay && needPoints > 0) {
      setPointsModalVisible(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (state.playing) {
      video.pause();
    } else {
      try {
        await video.play();
      } catch (error) {
        message.error('播放失败');
      }
    }

    setState(prev => ({ ...prev, playing: !prev.playing }));
  };

  // 处理积分扣除
  const handlePointsConfirm = async () => {
    if (onPointsDeduct) {
      try {
        const success = await onPointsDeduct(needPoints);
        if (success) {
          setCanPlay(true);
          setPointsModalVisible(false);
          message.success('积分扣除成功，开始播放');
          // 自动播放
          setTimeout(() => {
            togglePlay();
          }, 500);
        }
      } catch (error) {
        message.error('积分扣除失败');
      }
    }
  };

  // 跳转到指定时间
  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
    }
  };

  // 调整音量
  const changeVolume = (volume: number) => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      setState(prev => ({ ...prev, volume, muted: volume === 0 }));
    }
  };

  // 静音切换
  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !state.muted;
      setState(prev => ({ ...prev, muted: !prev.muted }));
    }
  };

  // 全屏切换
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!state.fullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    setState(prev => ({ ...prev, fullscreen: !prev.fullscreen }));
  };

  // 改变播放速度
  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
      setState(prev => ({ ...prev, playbackRate: rate }));
      message.success(`播放速度已调整为 ${rate}x`);
    }
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative', 
        width, 
        height,
        background: '#000',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      {/* 视频元素 */}
      <video
        ref={videoRef}
        src={canPlay ? src : undefined}
        poster={poster}
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'contain'
        }}
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (video) {
            setState(prev => ({ ...prev, duration: video.duration }));
          }
        }}
      />

      {/* 加载指示器 */}
      {state.loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '24px'
        }}>
          <LoadingOutlined spin />
        </div>
      )}

      {/* 播放按钮覆盖层 */}
      {!canPlay && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }} onClick={togglePlay}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <PlayCircleOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
            <div>需要 {needPoints} 积分观看</div>
          </div>
        </div>
      )}

      {/* 控制栏 */}
      {controls && canPlay && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          padding: '20px 16px 16px',
          color: 'white'
        }}>
          {/* 进度条 */}
          <div style={{ marginBottom: '12px' }}>
            <Slider
              value={state.currentTime}
              max={state.duration}
              onChange={seekTo}
              tooltip={{
                formatter: (value) => formatTime(value || 0)
              }}
              style={{ margin: 0 }}
            />
            {/* 缓冲进度 */}
            <Progress
              percent={(state.buffered / state.duration) * 100}
              showInfo={false}
              strokeColor="rgba(255,255,255,0.3)"
              trailColor="transparent"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* 控制按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              {/* 播放/暂停 */}
              <Button
                type="text"
                icon={state.playing ? <PauseOutlined /> : <PlayCircleOutlined />}
                onClick={togglePlay}
                style={{ color: 'white' }}
              />

              {/* 音量控制 */}
              <Space>
                <Button
                  type="text"
                  icon={<SoundOutlined />}
                  onClick={toggleMute}
                  style={{ color: 'white' }}
                />
                <Slider
                  value={state.muted ? 0 : state.volume}
                  max={1}
                  step={0.1}
                  onChange={changeVolume}
                  style={{ width: '80px' }}
                />
              </Space>

              {/* 时间显示 */}
              <span style={{ fontSize: '14px' }}>
                {formatTime(state.currentTime)} / {formatTime(state.duration)}
              </span>
            </Space>

            <Space>
              {/* 播放速度 */}
              <Select
                value={state.playbackRate}
                onChange={changePlaybackRate}
                size="small"
                style={{ width: '80px' }}
                dropdownStyle={{ background: 'rgba(0,0,0,0.8)' }}
              >
                {playbackRates.map(rate => (
                  <Option key={rate.value} value={rate.value}>
                    {rate.label}
                  </Option>
                ))}
              </Select>

              {/* 清晰度 */}
              <Select
                value={state.quality}
                size="small"
                style={{ width: '100px' }}
                dropdownStyle={{ background: 'rgba(0,0,0,0.8)' }}
              >
                {qualityOptions.map(quality => (
                  <Option key={quality.value} value={quality.value}>
                    {quality.label}
                  </Option>
                ))}
              </Select>

              {/* 全屏 */}
              <Button
                type="text"
                icon={state.fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
                style={{ color: 'white' }}
              />
            </Space>
          </div>
        </div>
      )}

      {/* 积分确认弹窗 */}
      <Modal
        title="观看需要积分"
        open={pointsModalVisible}
        onOk={handlePointsConfirm}
        onCancel={() => setPointsModalVisible(false)}
        okText="确认扣除"
        cancelText="取消"
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '18px', marginBottom: '16px' }}>
            观看此视频需要消耗 <strong style={{ color: '#faad14' }}>{needPoints}</strong> 积分
          </div>
          <div style={{ color: '#666' }}>
            积分扣除后不可恢复，是否确认？
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoPlayer;