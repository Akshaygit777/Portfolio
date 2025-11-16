import * as THREE from 'three';
import vertexShader from '@/shaders/vertex.glsl';
import fragmentShader from '@/shaders/fragment.glsl';

interface MediaProps {
  element: HTMLElement;
  scene: THREE.Scene;
  screen: { height: number; width: number };
  viewport: { height: number; width: number };
  height: number;
  cardId: number;
}

interface Sizes {
  height?: number;
  screen?: { height: number; width: number };
  viewport?: { height: number; width: number };
}

interface Scroll {
  ease: number;
  current: number;
  target: number;
  last: number;
}

export default class Media {
  element: HTMLElement;
  // image: HTMLImageElement;
    mediaElement: HTMLImageElement | HTMLVideoElement;
  scene: THREE.Scene;
  screen: { height: number; width: number };
  viewport: { height: number; width: number };
  height: number;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null;
  bounds: DOMRect | null;
  extra: number;
  isBefore: boolean;
  isAfter: boolean;
  cardId: number;
    texture: THREE.Texture | null;


  constructor({ element, scene, screen, viewport, height, cardId }: MediaProps) {
    this.element = element;
    // this.image = element.querySelector('img')!;
    this.mediaElement = element.querySelector('img, video') as HTMLImageElement | HTMLVideoElement;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.height = height;
    this.cardId = cardId;
    this.extra = 0;
    this.isBefore = false;
    this.isAfter = false;
    this.mesh = null;
    this.bounds = null;
        this.texture = null;


    this.createMesh();
    this.createBounds();
  }

  createMesh() {
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    // const textureLoader = new THREE.TextureLoader();
    // const texture = textureLoader.load(this.image.src);
    if (this.mediaElement.tagName === 'VIDEO') {
      const video = this.mediaElement as HTMLVideoElement;
      // Ensure video plays
      video.muted = true; // Mute to allow autoplay in browsers
      video.loop = true;
      video.playsInline = true;
      video.play().catch((error) => console.error('Video play failed:', error));

      this.texture = new THREE.VideoTexture(video);
      this.texture.minFilter = THREE.LinearFilter;
      this.texture.magFilter = THREE.LinearFilter;
    } else {
      const textureLoader = new THREE.TextureLoader();
      this.texture = textureLoader.load((this.mediaElement as HTMLImageElement).src);
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        // tMap: { value: texture },
        tMap: { value: this.texture },
        uPlaneSizes: { value: new THREE.Vector2(0, 0) },
        uImageSizes: { value: new THREE.Vector2(0, 0) },
        uViewportSizes: { value: new THREE.Vector2(this.viewport.width, this.viewport.height) },
        uStrength: { value: 0 },
        uCornerRadius: { value: 0.05 },
        // uBorderThickness: { value: 0.02 }, // Border thickness (relative to plane size)
        // uBorderColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) }, // White border
        // uPadding: { value: 0.05 }, // Padding (relative to plane size)
      },
      transparent: true,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    // const img = new Image();
    // img.src = this.image.src;
    // img.onload = () => {
    //   if (this.mesh) {
    //     this.mesh.material.uniforms.uImageSizes.value.set(img.naturalWidth, img.naturalHeight);
    //   }
    // };
    if (this.mediaElement.tagName === 'VIDEO') {
      const video = this.mediaElement as HTMLVideoElement;
      if (video.videoWidth && video.videoHeight) {
        if (this.mesh) {
          this.mesh.material.uniforms.uImageSizes.value.set(video.videoWidth, video.videoHeight);
        }
      } else {
        video.onloadedmetadata = () => {
          if (this.mesh) {
            this.mesh.material.uniforms.uImageSizes.value.set(video.videoWidth, video.videoHeight);
          }
        };
      }
    } else {
      const img = new Image();
      img.src = (this.mediaElement as HTMLImageElement).src;
      img.onload = () => {
        if (this.mesh) {
          this.mesh.material.uniforms.uImageSizes.value.set(img.naturalWidth, img.naturalHeight);
        }
      };
    }
  }

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();
    this.updateScale();
    this.updateX();
    this.updateY();
    if (this.mesh && this.bounds) {
      this.mesh.material.uniforms.uPlaneSizes.value.set(this.mesh.scale.x, this.mesh.scale.y);
    }
  }

  updateScale() {
    if (this.mesh && this.bounds) {
      this.mesh.scale.x = (this.viewport.width * this.bounds.width) / this.screen.width;
      this.mesh.scale.y = (this.viewport.height * this.bounds.height) / this.screen.height;
    }
  }

  updateX(x: number = 0) {
    if (this.mesh && this.bounds) {
      const projectCardBounds = this.element.closest('.project-card-container')?.getBoundingClientRect();
      if (projectCardBounds) {
        this.mesh.position.x =
          -(this.viewport.width / 2) +
          this.mesh.scale.x / 2 +
          ((this.bounds.left - projectCardBounds.left - x) / this.screen.width) * this.viewport.width;
      }
    }
  }

  updateY(y: number = 0) {
    if (this.mesh && this.bounds) {
      const projectCardBounds = this.element.closest('.project-card-container')?.getBoundingClientRect();
      if (projectCardBounds) {
        this.mesh.position.y =
          this.viewport.height / 2 -
          this.mesh.scale.y / 2 -
          ((this.bounds.top - projectCardBounds.top - y) / this.screen.height) * this.viewport.height -
          this.extra;
      }
    }
  }

  update(scroll: Scroll, direction: 'up' | 'down') {
    this.updateY(scroll.current);
    if (this.mesh) {
      this.mesh.material.uniforms.uStrength.value = ((scroll.current - scroll.last) / this.screen.width) * 3;
      if (this.mediaElement.tagName === 'VIDEO' && this.texture) {
        this.texture.needsUpdate = true;
      }
    }

    if (this.mesh) {
      const planeOffset = this.mesh.scale.y / 2;
      const viewportOffset = this.viewport.height / 2;

      this.isBefore = this.mesh.position.y + planeOffset < -viewportOffset;
      this.isAfter = this.mesh.position.y - planeOffset > viewportOffset;

      if (direction === 'up' && this.isBefore) {
        this.extra -= this.height;
        this.isBefore = false;
        this.isAfter = false;
      }

      if (direction === 'down' && this.isAfter) {
        this.extra += this.height;
        this.isBefore = false;
        this.isAfter = false;
      }
    }
  }

  onResize(sizes: Sizes) {
    if (sizes) {
      if (sizes.height) this.height = sizes.height;
      if (sizes.screen) this.screen = sizes.screen;
      if (sizes.viewport) {
        this.viewport = sizes.viewport;
        if (this.mesh) {
          this.mesh.material.uniforms.uViewportSizes.value.set(this.viewport.width, this.viewport.height);
        }
      }
    }
    this.extra = 0;
    this.createBounds();
  }
}