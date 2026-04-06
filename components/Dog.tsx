'use client';
import React, { useEffect, useRef } from 'react';
import './Dog.css';

export default function Dog() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const elements = {
      body: window,
      wrapper: wrapperRef.current,
      dog: wrapperRef.current.querySelector('.dog') as HTMLElement,
      marker: wrapperRef.current.querySelectorAll('.marker') as NodeListOf<HTMLElement>,
    };

    const animationFrames = {
      rotate: [[0], [1], [2], [3], [5], [3, 'f'], [2, 'f'], [1, 'f']]
    };

    const directionConversions: Record<number, string> = {
      360: 'up', 45: 'upright', 90: 'right', 135: 'downright',
      180: 'down', 225: 'downleft', 270: 'left', 315: 'upleft',
    };

    const angles = [360, 45, 90, 135, 180, 225, 270, 315];
    const defaultEnd = 4;

    const partPositions = [
      { leg1: { x: 26, y: 43 }, leg2: { x: 54, y: 43 }, leg3: { x: 26, y: 75 }, leg4: { x: 54, y: 75 }, tail: { x: 40, y: 70, z: 1 } },
      { leg1: { x: 33, y: 56 }, leg2: { x: 55, y: 56 }, leg3: { x: 12, y: 72 }, leg4: { x: 32, y: 74 }, tail: { x: 20, y: 64, z: 1 } },
      { leg1: { x: 59, y: 62 }, leg2: { x: 44, y: 60 }, leg3: { x: 25, y: 64 }, leg4: { x: 11, y: 61 }, tail: { x: 4, y: 44, z: 1 } },
      { leg1: { x: 39, y: 63 }, leg2: { x: 60, y: 56 }, leg3: { x: 12, y: 52 }, leg4: { x: 28, y: 50 }, tail: { x: 7, y: 21, z: 0 } },
      { leg1: { x: 23, y: 54 }, leg2: { x: 56, y: 54 }, leg3: { x: 24, y: 25 }, leg4: { x: 54, y: 25 }, tail: { x: 38, y: 2, z: 0 } },
      { leg1: { x: 21, y: 58 }, leg2: { x: 41, y: 64 }, leg3: { x: 53, y: 50 }, leg4: { x: 69, y: 53 }, tail: { x: 72, y: 22, z: 0 } },
      { leg1: { x: 22, y: 59 }, leg2: { x: 30, y: 64 }, leg3: { x: 56, y: 60 }, leg4: { x: 68, y: 62 }, tail: { x: 78, y: 40, z: 0 } },
      { leg1: { x: 47, y: 45 }, leg2: { x: 24, y: 53 }, leg3: { x: 68, y: 68 }, leg4: { x: 47, y: 73 }, tail: { x: 65, y: 65, z: 1 } },
    ];

    const control = { x: window.innerWidth / 2, y: window.innerHeight / 2, angle: null as number | null };
    const distance = 30;
    const nearestN = (x: number, n: number) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n);
    const px = (num: number) => `${num}px`;
    const radToDeg = (rad: number) => Math.round(rad * (180 / Math.PI));
    const degToRad = (deg: number) => deg / (180 / Math.PI);
    const overlap = (a: number, b: number) => Math.abs(a - b) < 20;

    const rotateCoord = ({ angle, origin, x, y }: { angle: number; origin: { x: number; y: number }; x: number; y: number }) => {
      const a = degToRad(angle);
      const aX = x - origin.x;
      const aY = y - origin.y;
      return { x: (aX * Math.cos(a)) - (aY * Math.sin(a)) + origin.x, y: (aX * Math.sin(a)) + (aY * Math.cos(a)) + origin.y };
    };

    const setStyles = ({ target, x, y }: any) => {
      target.style.transform = `translate(${x || 0}, ${y || 0})`;
    };

    const targetAngle = (dog: any) => {
      if (!dog) return 360;
      const angle = radToDeg(Math.atan2(dog.pos.y - control.y, dog.pos.x - control.x)) - 90;
      const adjustedAngle = angle < 0 ? angle + 360 : angle;
      const res = nearestN(adjustedAngle, 45);
      return res === 0 ? 360 : res;
    };

    const reachedTheGoalYeah = (x: number, y: number) => overlap(control.x, x) && overlap(control.y, y);

    const positionLegs = (dog: HTMLElement, frame: number) => {
      [2, 3, 4, 5].forEach((n, i) => {
        const key = `leg${i + 1}` as keyof typeof partPositions[0];
        const pos = partPositions[frame][key] as { x: number; y: number };
        setStyles({ target: dog.children[n], x: px(pos.x), y: px(pos.y) });
      });
    };

    const moveLegs = (dog: HTMLElement) => {
      [2, 5].forEach(i => (dog.children[i].children[0] as HTMLElement).classList.add('walk-1'));
      [3, 4].forEach(i => (dog.children[i].children[0] as HTMLElement).classList.add('walk-2'));
    };

    const stopLegs = (dog: HTMLElement) => {
      [2, 5].forEach(i => (dog.children[i].children[0] as HTMLElement).classList.remove('walk-1'));
      [3, 4].forEach(i => (dog.children[i].children[0] as HTMLElement).classList.remove('walk-2'));
    };

    const positionTail = (dog: HTMLElement, frame: number) => {
      setStyles({ target: dog.children[6], x: px(partPositions[frame].tail.x), y: px(partPositions[frame].tail.y) });
      (dog.children[6] as HTMLElement).style.zIndex = partPositions[frame].tail.z.toString();
      (dog.children[6].children[0] as HTMLElement).classList.add('wag');
    };

    const animateDog = ({ target, frameW, currentFrame, end, data, part, speed, direction }: any) => {
      const offset = direction === 'clockwise' ? 1 : -1;
      target.style.transform = `translateX(${px(data.animation[currentFrame][0] * -frameW)})`;
      if (part === 'body') {
        positionLegs(data.dog, currentFrame);
        moveLegs(data.dog);
        positionTail(data.dog, currentFrame);
      } else {
        target.parentNode.classList.add('happy');
      }
      data.angle = angles[currentFrame];
      data.index = currentFrame;
      target.parentNode.classList[data.animation[currentFrame][1] === 'f' ? 'add' : 'remove']('flip');

      let nextFrame = currentFrame + offset;
      nextFrame = nextFrame === -1 ? data.animation.length - 1 : nextFrame === data.animation.length ? 0 : nextFrame;

      if (currentFrame !== end) {
        data.timer[part] = setTimeout(() => animateDog({ target, data, part, frameW, currentFrame: nextFrame, end, direction, speed }), speed || 150);
      } else if (part === 'body') {
        control.angle = angles[end];
        data.walk = true;
        setTimeout(() => stopLegs(data.dog), 200);
        setTimeout(() => wrapperRef.current?.querySelector('.happy')?.classList.remove('happy'), 5000);
      }
    };

    const triggerDogAnimation = ({ target, frameW, start, end, data, speed, part, direction }: any) => {
      clearTimeout(data.timer[part]);
      data.timer[part] = setTimeout(() => animateDog({ target, data, part, frameW, currentFrame: start, end, direction, speed }), speed || 150);
    };

    const getDirection = ({ pos, facing, target }: any) => {
      const dx2 = facing.x - pos.x;
      const dy1 = pos.y - target.y;
      const dx1 = target.x - pos.x;
      const dy2 = pos.y - facing.y;
      return dx2 * dy1 > dx1 * dy2 ? 'anti-clockwise' : 'clockwise';
    };

    const turnDog = ({ dog, start, end, direction }: any) => {
      triggerDogAnimation({ target: dog.dog.children[1].children[0], frameW: 31 * 2, start, end, data: dog, speed: 100, direction, part: 'head' });
      setTimeout(() => {
        triggerDogAnimation({ target: dog.dog.children[0].children[0], frameW: 48 * 2, start, end, data: dog, speed: 100, direction, part: 'body' });
      }, 200);
    };

    let dogData: any = null;

    const createDog = () => {
      const { dog } = elements;
      const { width, height, left, top } = dog.getBoundingClientRect();
      dog.style.left = px(left);
      dog.style.top = px(top);
      positionLegs(dog, 0);
      dogData = {
        timer: { head: null, body: null, all: null },
        pos: { x: left + (width / 2), y: top + (height / 2) },
        actualPos: { x: left, y: top },
        facing: { x: left + (width / 2), y: top + (height / 2) + 30 },
        animation: animationFrames.rotate,
        angle: 360, index: 0, dog,
      };
      turnDog({ dog: dogData, start: 0, end: defaultEnd, direction: 'clockwise' });
      positionTail(dog, 0);
    };

    const checkBoundaryAndUpdateDogPos = (x: number, y: number, dog: HTMLElement, data: any) => {
      if (x > -40 && x < (window.innerWidth - 40)) { data.pos.x = x + 48; data.actualPos.x = x; }
      if (y > -40 && y < (window.innerHeight - 40)) { data.pos.y = y + 48; data.actualPos.y = y; }
      dog.style.left = px(x);
      dog.style.top = px(y);
    };

    const positionMarker = (i: number, pos: { x: number; y: number }) => {
      elements.marker[i].style.left = px(pos.x);
      elements.marker[i].style.top = px(pos.y);
    };

    const moveDog = () => {
      if (!dogData) return;
      clearInterval(dogData.timer.all);
      const { dog } = dogData;
      dogData.timer.all = setInterval(() => {
        const { left, top } = dog.getBoundingClientRect();
        const start = angles.indexOf(dogData.angle);
        const end = angles.indexOf(targetAngle(dogData));
        if (reachedTheGoalYeah(left + 48, top + 48)) {
          clearInterval(dogData.timer.all);
          dog.style.left = px(dogData.actualPos.x);
          dog.style.top = px(dogData.actualPos.y);
          stopLegs(dog);
          turnDog({ dog: dogData, start, end: defaultEnd, direction: 'clockwise' });
          return;
        }
        let { x, y } = dogData.actualPos;
        const dir = directionConversions[targetAngle(dogData)];
        if (dir !== 'up' && dir !== 'down') x += dir.includes('left') ? -distance : distance;
        if (dir !== 'left' && dir !== 'right') y += dir.includes('up') ? -distance : distance;
        positionMarker(0, dogData.pos);
        positionMarker(1, control);
        const { x: x2, y: y2 } = rotateCoord({ angle: dogData.angle, origin: dogData.pos, x: dogData.pos.x, y: dogData.pos.y - 100 });
        dogData.facing.x = x2; dogData.facing.y = y2;
        positionMarker(2, dogData.facing);
        if (start === end) dogData.turning = false;
        if (!dogData.turning && dogData.walk) {
          if (start !== end) {
            dogData.turning = true;
            turnDog({ dog: dogData, start, end, direction: getDirection({ pos: dogData.pos, facing: dogData.facing, target: control }) });
          } else {
            checkBoundaryAndUpdateDogPos(x, y, dog, dogData);
            moveLegs(dog);
          }
        }
      }, 200);
    };

    createDog();

    const triggerTurnDog = () => {
      if (!dogData) return;
      const direction = getDirection({ pos: dogData.pos, facing: dogData.facing, target: control });
      dogData.walk = false;
      control.angle = null;
      const start = angles.indexOf(dogData.angle);
      const end = angles.indexOf(targetAngle(dogData));
      turnDog({ dog: dogData, start, end, direction });
    };

    const handleMouseMove = (e: MouseEvent) => { control.x = e.clientX; control.y = e.clientY; triggerTurnDog(); };
    const handleClick = () => moveDog();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      clearInterval(dogData?.timer?.all);
      clearTimeout(dogData?.timer?.head);
      clearTimeout(dogData?.timer?.body);
    };
  }, []);

  return (
    <div className="dog-wrapper" ref={wrapperRef}>
      <div className="marker red d-none" />
      <div className="marker green d-none" />
      <div className="marker blue d-none" />
      <div className="dog">
        <div className="body-wrapper"><div className="body img-bg" /></div>
        <div className="head-wrapper"><div className="head img-bg" /></div>
        <div className="leg-wrapper"><div className="leg one img-bg" /></div>
        <div className="leg-wrapper"><div className="leg two img-bg" /></div>
        <div className="leg-wrapper"><div className="leg three img-bg" /></div>
        <div className="leg-wrapper"><div className="leg four img-bg" /></div>
        <div className="tail-wrapper"><div className="tail img-bg" /></div>
      </div>
    </div>
  );
}
