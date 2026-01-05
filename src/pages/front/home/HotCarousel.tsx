import React, { useState, useRef, useEffect } from 'react';
import { Button, Typography } from 'antd';
import { PlayCircleOutlined, RightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import VideoPlayer, { VideoPlayerRef } from '../../../components/business/video/VideoPlayer';
import './HotCarousel.css';

const { Title, Text } = Typography;

interface VideoItem {
  id: number;
  title: string;
  videoUrl: string;
  poster: string;
  detailUrl: string;
  duration: string;
  description: string;
}

const carouselData: VideoItem[] = [
  {
    id: 1,
    title: '剧场版 鬼灭之刃 无限城篇 第一章 猗窝座再袭',
    videoUrl: 'https://v16.toutiao50.com/1d166006a340edbfafdbd350e2892912/6948662e/video/tos/alisg/tos-alisg-v-90231e-sg/o4oodr9aZEY3KhqAi00wFKB5infgCAUBbECu1z/',
    poster: 'https://cdn.aqdstatic.com:966/age/20250250.jpg',
    detailUrl: '/video/1',
    duration: '02:34:29',
    description: '变成鬼的妹妹禰？为了将豆子变回人类而进行的捕鬼行动进入组织《鬼杀队》的灶门炭治郎。入伍后，与战友我妻善逸、嘴平伊之助一起与各种鬼战斗。'
  },
  {
    id: 2,
    title: '剧场版 链锯人 蕾塞篇',
    videoUrl: 'https://v16.toutiao50.com/d024f1885e8cbffdbd81c3dc29e96d49/695cb29d/video/tos/alisg/tos-alisg-v-0051c001-sg/o4BEgE2gNWUEpAhf3raNc4ZHDjjDDBFcQFxBme/',
    poster: 'https://cdn.aqdstatic.com:966/age/20250257.jpg',
    detailUrl: '/video/2',
    duration: '01:39:10',
    description: '少年电次因故变成了拥有恶魔心脏的“链锯人”，之后他成为了隶属于公安对魔特异4课的恶魔猎人。电次和暗恋的玛奇玛约会了，之后当电次回味约会时，天空突然下起了雨，避雨时他偶然遇到了名叫“蕾塞”的少女。在附近咖啡店工作的蕾塞对电次露出了温柔的微笑，二人的关系迅速亲密起来。从这次相遇开始，电次的日常生活逐渐发生变化……'
  },
  {
    id: 3,
    title: '最喜欢电影的彭波小姐',
    videoUrl: 'https://v19-cfc-unique.tiktokcdn.com/6cf39794040cddccad7e659d2469a6e3/69479af7/video/tos/alisg/tos-alisg-v-0000/o41IoUVlwAlBA6NLmftBKxzAFKvy1hBOqNmXc5/',
    poster: 'https://cdn.aqdstatic.com:966/age/20210366.jpg',
    detailUrl: '/video/3',
    duration: '01:30:00',
    description: '干练的电影制片人·彭波小姐手下担任制作助手的吉恩。完全被电影吸引的他，是个将看过的所有电影都完整记住的电影迷。他虽然也很憧憬拍摄电影的工作，却认为自己无法做到而每天过着卑微的生活。但他被彭波小姐委派制作15秒的CM，从而体会到埋头于制作电影的乐趣。某天，吉恩从彭波小姐那里拿到了下一次要制作的电影《MEISTER》的剧本。这是传说中演员的回归大作，是令人兴奋到大脑发麻的内容。虽然肯定是大热作品……但被指名为导演的竟然是CM大获好评的吉恩！被彭波小姐的法眼看中的新人女演员被选为女主角，波澜万丈的摄影即将开始。'
  }
];

const poems = [
  '书山有路勤为径，学海无涯苦作舟。',
  '黑发不知勤学早，白首方悔读书迟。',
  '纸上得来终觉浅，绝知此事要躬行。',
  '问渠那得清如许？为有源头活水来。'
];

const HotCarousel: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle item (index 1)
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRefs = useRef<(VideoPlayerRef | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter state
  const [displayText, setDisplayText] = useState('');
  const [poemIndex, setPoemIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Auto-play state
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentPoem = poems[poemIndex];
    
    const handleType = () => {
      if (!isDeleting) {
        // 正在打字
        if (displayText.length < currentPoem.length) {
          setDisplayText(prev => currentPoem.substring(0, prev.length + 1));
          setTypingSpeed(150);
        } else {
          // 打完了，准备删除
          setTypingSpeed(3000); // 停留3秒
          setIsDeleting(true);
        }
      } else {
        // 正在删除
        if (displayText.length > 0) {
          setDisplayText(prev => currentPoem.substring(0, prev.length - 1));
          setTypingSpeed(50); // 删除速度快一点
        } else {
          // 删除完了，换下一句
          setIsDeleting(false);
          setPoemIndex((prev) => (prev + 1) % poems.length);
          setTypingSpeed(500); // 换句间隙
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, poemIndex, typingSpeed]);

  // Auto-rotation logic
  useEffect(() => {
    const startAutoPlay = () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        handleSwipe('left');
      }, 5000);
    };

    if (isExpanded) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    } else {
      startAutoPlay();
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isExpanded, activeIndex]);
  
  // Drag state
  const dragStartRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  // Mouse Down: Start tracking
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return;
    dragStartRef.current = e.clientX;
    isDraggingRef.current = false;
  };

  // Mouse Move: Track movement (optional visual feedback could be added here)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartRef.current === null || isExpanded) return;
    
    // If moved more than 5px, consider it a drag
    if (Math.abs(e.clientX - dragStartRef.current) > 5) {
      isDraggingRef.current = true;
    }
  };

  // Mouse Up: Determine swipe direction
  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStartRef.current === null || isExpanded) return;

    const dragEnd = e.clientX;
    const dragDistance = dragEnd - dragStartRef.current;
    const threshold = 100; // Swipe threshold in pixels

    if (isDraggingRef.current && Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Swiped Right -> Go to Left item (Previous)
        handleSwipe('right');
      } else {
        // Swiped Left -> Go to Right item (Next)
        handleSwipe('left');
      }
    }

    dragStartRef.current = null;
    // Reset dragging flag after a short delay to prevent click events from firing immediately after drag
    setTimeout(() => {
        isDraggingRef.current = false;
    }, 0);
  };

  const handleMouseLeave = () => {
    dragStartRef.current = null;
    isDraggingRef.current = false;
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    // 3 items: 0, 1, 2
    // If active is 1:
    // Swipe Left (Next) -> 2
    // Swipe Right (Prev) -> 0
    
    // We need to find the index of the item that is visually to the left or right
    // Visual order relative to active(1): Left(0), Center(1), Right(2)
    // If active(0): Left(2), Center(0), Right(1)
    // If active(2): Left(1), Center(2), Right(0)
    
    // Simplification:
    // "Next" (Swipe Left gesture) means increment index (mod 3)
    // "Prev" (Swipe Right gesture) means decrement index (mod 3)
    
    if (direction === 'left') {
      setActiveIndex((prev) => (prev + 1) % 3);
    } else {
      setActiveIndex((prev) => (prev - 1 + 3) % 3);
    }
  };

  const handleCardClick = (index: number) => {
    if (isExpanded || isDraggingRef.current) return;
    
    // If clicking the active card, do nothing (wait for play button click)
    if (index === activeIndex) return;

    // If clicking side cards, rotate to them
    setActiveIndex(index);
  };

  const handlePlay = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (index !== activeIndex) return;

    setIsExpanded(true);
    setTimeout(() => {
      const video = videoRefs.current[index];
      if (video) {
        video.play().catch(console.error);
        // Controls handled by VideoPlayer prop
      }
    }, 300); // Wait for expansion animation
  };

  const handleBack = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setIsExpanded(false);
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
    }
  };

  const handleDetailClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    navigate(url);
  };

  const getCardStyle = (index: number) => {
    if (isExpanded && index !== activeIndex) {
      return { opacity: 0, pointerEvents: 'none' as const, transform: 'scale(0)' };
    }

    if (isExpanded && index === activeIndex) {
      return {
        position: 'absolute', // 保持在容器内
        transform: 'translate(-50%, -50%) scale(1)',
        left: '50%',
        top: '50%',
        width: '95%', // 在容器内放大
        maxWidth: '1200px',
        height: '85%',
        maxHeight: '700px',
        zIndex: 100,
        opacity: 1,
        borderRadius: '16px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'
      };
    }

    // Normal 3D carousel logic
    // Positions: Left (0), Center (1), Right (2) relative to visual order
    
    let position = 'center';
    let diff = index - activeIndex;
    
    if (diff === 0) position = 'center';
    else if (diff === -1 || diff === 2) position = 'left';
    else position = 'right';

    const styles: React.CSSProperties = {
      transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
      position: 'absolute',
      top: '50%',
      left: '50%',
      borderRadius: '16px',
      overflow: 'hidden'
    };

    switch (position) {
      case 'center':
        return {
          ...styles,
          transform: 'translate(-50%, -50%) scale(1)',
          zIndex: 10,
          opacity: 1,
          width: '900px',
          height: '500px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          cursor: 'default'
        };
      case 'left':
        return {
          ...styles,
          // 调整左侧卡片位置，让更多部分可见
          transform: 'translate(-80%, -50%) scale(0.85)', 
          zIndex: 5,
          opacity: 0.7,
          width: '900px',
          height: '500px',
          cursor: 'pointer',
          filter: 'brightness(0.7)'
        };
      case 'right':
        return {
          ...styles,
          // 调整右侧卡片位置，让更多部分可见
          transform: 'translate(-20%, -50%) scale(0.85)',
          zIndex: 5,
          opacity: 0.7,
          width: '900px',
          height: '500px',
          cursor: 'pointer',
          filter: 'brightness(0.7)'
        };
      default:
        return styles;
    }
  };

  return (
    <div 
      className={`hot-carousel-3d-container ${isExpanded ? 'expanded-mode' : ''}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {!isExpanded && (
        <div className="typewriter-container">
          <Title level={2} className="typewriter-text">
            {displayText}
            <span className="typewriter-cursor">|</span>
          </Title>
        </div>
      )}
      <div className="carousel-stage">
        {carouselData.map((item, index) => (
          <div 
            key={item.id}
            className="carousel-card-3d"
            style={getCardStyle(index)}
            onClick={() => handleCardClick(index)}
          >
            <div className="video-wrapper">
              <VideoPlayer
                ref={el => videoRefs.current[index] = el}
                src={item.videoUrl}
                poster={item.poster}
                controls={isExpanded && index === activeIndex}
                width="100%"
                height="100%"
              />
              
              {/* Overlay Content - Only visible when NOT expanded or playing */}
              {!isExpanded && (
                <div className="card-overlay">
                  {index === activeIndex && (
                    <div className="play-button-wrapper" onClick={(e) => handlePlay(e, index)}>
                      <PlayCircleOutlined className="play-icon" />
                    </div>
                  )}
                  <div className="card-info">
                    <Title level={4} style={{ color: '#fff', marginBottom: 4 }}>{item.title}</Title>
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{item.duration}</Text>
                  </div>
                </div>
              )}

              {/* Expanded Overlay - Top Right Link */}
              {isExpanded && index === activeIndex && (
                <>
                  <div 
                    className="expanded-back-button"
                    onClick={(e) => handleBack(e, index)}
                  >
                    <ArrowLeftOutlined style={{ fontSize: '24px', color: '#fff' }} />
                  </div>

                  <div 
                    className="expanded-detail-link"
                    onClick={(e) => handleDetailClick(e, item.detailUrl)}
                  >
                    前往详情页 <RightOutlined />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isExpanded && (
        <div className="description-container">
          <div className="description-text-wrapper" key={activeIndex}>
            <Title level={3} style={{ color: 'var(--primary-color)', marginBottom: 12 }}>
              {carouselData[activeIndex].title}
            </Title>
            <Text className="description-text">
              {carouselData[activeIndex].description}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotCarousel;
