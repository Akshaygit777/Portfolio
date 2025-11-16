"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Media from './Media';
import { lerp } from '@/utils/math';
import NormalizeWheel from 'normalize-wheel';
import { useModalStore } from '@/store/modalStore';
import { Project } from '@/constants/contants';

interface ProjectGalleryProps {
  projects: Project[];
  galleryRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projects, galleryRef, containerRef }) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const screenRef = useRef<{ height: number; width: number }>({ height: 0, width: 0 });
  const viewportRef = useRef<{ height: number; width: number }>({ height: 0, width: 0 });
  const mediasRef = useRef<Media[]>([]);
  const galleryHeightRef = useRef<number>(0);
  const scrollRef = useRef<{ ease: number; current: number; target: number; last: number }>({
    ease: 0.1,
    current: 0,
    target: 0,
    last: 0,
  });
  const directionRef = useRef<'up' | 'down'>('down');
  const speedRef = useRef<number>(1.5);
  const isDownRef = useRef<boolean>(false);
  const startRef = useRef<number>(0);
  const scrollPositionRef = useRef<number>(0);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const animationFrameRef = useRef<number | null>(null);
  const { isModalOpen, setModalState } = useModalStore();
  const touchSensitivity = 0.02;
  const lastTouchRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const tapThreshold = 200;
  const moveThreshold = 10;

  useEffect(() => {
    const createRenderer = () => {
      rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current.domElement.style.position = 'absolute';
      rendererRef.current.domElement.style.top = '0';
      rendererRef.current.domElement.style.left = '0';
      rendererRef.current.domElement.style.width = '100%';
      rendererRef.current.domElement.style.height = '100%';
      rendererRef.current.domElement.style.touchAction = 'none';
      if (containerRef.current) {
        containerRef.current.appendChild(rendererRef.current.domElement);
      }
    };

    const createCamera = () => {
      cameraRef.current = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      cameraRef.current.position.z = 5;
    };

    const createScene = () => {
      sceneRef.current = new THREE.Scene();
    };

    const createMedias = () => {
      if (galleryRef.current) {
        const mediasElements = galleryRef.current.querySelectorAll('.demo-1__gallery__figure');
        mediasRef.current = Array.from(mediasElements).map((element, index) => {
          const project = projects[index];
          if (!project) {
            console.error(`No project data for index ${index}`);
            return null;
          }
          return new Media({
            element: element as HTMLElement,
            scene: sceneRef.current!,
            screen: screenRef.current,
            viewport: viewportRef.current,
            height: galleryHeightRef.current,
            cardId: project.id,
          });
        }).filter((media): media is Media => media !== null);
      }
    };

    const onResize = () => {
      if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        screenRef.current = {
          height: bounds.height,
          width: bounds.width,
        };

        rendererRef.current!.setSize(screenRef.current.width, screenRef.current.height);

        cameraRef.current!.aspect = screenRef.current.width / screenRef.current.height;
        cameraRef.current!.updateProjectionMatrix();

        const fov = cameraRef.current!.fov * (Math.PI / 180);
        const height = 2 * Math.tan(fov / 2) * cameraRef.current!.position.z;
        const width = height * cameraRef.current!.aspect;

        viewportRef.current = { height, width };

        if (galleryRef.current) {
          const galleryBounds = galleryRef.current.getBoundingClientRect();
          galleryHeightRef.current = viewportRef.current.height * galleryBounds.height / screenRef.current.height;
        }

        mediasRef.current.forEach((media) =>
          media.onResize({
            height: galleryHeightRef.current,
            screen: screenRef.current,
            viewport: viewportRef.current,
          })
        );
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (isModalOpen) return;
      const normalized = NormalizeWheel(event);
      const speed = normalized.pixelY;
      scrollRef.current.target += speed * 1;
      event.preventDefault();
    };

    const onTouchDown = (event: MouseEvent | TouchEvent) => {
      if (isModalOpen) return;
      isDownRef.current = true;
      scrollPositionRef.current = scrollRef.current.current;
      startRef.current = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
      if (event instanceof TouchEvent) {
        lastTouchRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          time: Date.now(),
        };
        event.preventDefault();
      }
    };

    const onTouchMove = (event: MouseEvent | TouchEvent) => {
      if (isModalOpen || !isDownRef.current) return;
      const y = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
      const distance = (startRef.current - y) * touchSensitivity * screenRef.current.height;
      scrollRef.current.target = scrollPositionRef.current + distance;
      if (event instanceof TouchEvent) {
        event.preventDefault();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (isModalOpen) return;
      isDownRef.current = false;
      if (event instanceof TouchEvent && lastTouchRef.current) {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const touchTime = Date.now();
        const deltaX = Math.abs(touchEndX - lastTouchRef.current.x);
        const deltaY = Math.abs(touchEndY - lastTouchRef.current.y);
        const deltaTime = touchTime - lastTouchRef.current.time;

        if (deltaTime < tapThreshold && deltaX < moveThreshold && deltaY < moveThreshold) {
          handleTap(touchEndX, touchEndY);
        }
      }
    };

    const onMouseUp = () => {
      if (isModalOpen) return;
      isDownRef.current = false;
    };

    const handleTap = (clientX: number, clientY: number) => {
      if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
        mouseRef.current.y = -((clientY - bounds.top) / bounds.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);
        const intersects = raycasterRef.current.intersectObjects(
          mediasRef.current.map((media) => media.mesh!).filter(Boolean)
        );

        if (intersects.length > 0) {
          const media = mediasRef.current.find((m) => m.mesh === intersects[0].object);
          if (media && media.cardId) {
            const clickedProject = projects.find((project) => project.id === media.cardId);
            if (clickedProject) {
              setModalState(true, clickedProject);
              speedRef.current = 1.5;
            }
          }
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      if (isModalOpen) return;
      if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);
        const intersects = raycasterRef.current.intersectObjects(
          mediasRef.current.map((media) => media.mesh!).filter(Boolean)
        );

        if (intersects.length > 0) {
          const media = mediasRef.current.find((m) => m.mesh === intersects[0].object);
          if (media && media.cardId) {
            const clickedProject = projects.find((project) => project.id === media.cardId);
            if (clickedProject) {
              setModalState(true, clickedProject);
              speedRef.current = 1.5;
            }
          }
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isModalOpen) return;
      if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);
        const intersects = raycasterRef.current.intersectObjects(
          mediasRef.current.map((media) => media.mesh!).filter(Boolean)
        );

        if (intersects.length > 0) {
          rendererRef.current!.domElement.style.cursor = 'pointer';
        } else {
          rendererRef.current!.domElement.style.cursor = 'auto';
        }
      }
    };

    const update = () => {
      if (isModalOpen) {
        if (rendererRef.current) {
          rendererRef.current.clear();
        }
        animationFrameRef.current = requestAnimationFrame(update);
        return;
      }

      scrollRef.current.target += speedRef.current;
      scrollRef.current.current = lerp(scrollRef.current.current, scrollRef.current.target, scrollRef.current.ease);

      if (scrollRef.current.current > scrollRef.current.last) {
        directionRef.current = 'down';
        speedRef.current = 1.5;
      } else if (scrollRef.current.current < scrollRef.current.last) {
        directionRef.current = 'up';
        speedRef.current = -1.5;
      }

      mediasRef.current.forEach((media) => media.update(scrollRef.current, directionRef.current));

      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);

      scrollRef.current.last = scrollRef.current.current;

      animationFrameRef.current = requestAnimationFrame(update);
    };

    const addEventListeners = () => {
      window.addEventListener('resize', onResize);
      if (containerRef.current) {
        containerRef.current.addEventListener('wheel', onWheel, { passive: false });
        containerRef.current.addEventListener('mousedown', onTouchDown);
        containerRef.current.addEventListener('mouseup', onMouseUp);
        containerRef.current.addEventListener('touchstart', onTouchDown, { passive: false });
        containerRef.current.addEventListener('touchmove', onTouchMove, { passive: false });
        containerRef.current.addEventListener('touchend', onTouchEnd);
        containerRef.current.addEventListener('click', onClick);
        containerRef.current.addEventListener('mousemove', onMouseMove);
      }
    };

    createRenderer();
    createCamera();
    createScene();
    createMedias();
    onResize();
    update();
    addEventListeners();

    return () => {
      window.removeEventListener('resize', onResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('wheel', onWheel);
        containerRef.current.removeEventListener('mousedown', onTouchDown);
        containerRef.current.removeEventListener('mouseup', onMouseUp);
        containerRef.current.removeEventListener('touchstart', onTouchDown);
        containerRef.current.removeEventListener('touchmove', onTouchMove);
        containerRef.current.removeEventListener('touchend', onTouchEnd);
        containerRef.current.removeEventListener('click', onClick);
        containerRef.current.removeEventListener('mousemove', onMouseMove);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [projects, galleryRef, containerRef, isModalOpen]);

  return null;
};

export default ProjectGallery;