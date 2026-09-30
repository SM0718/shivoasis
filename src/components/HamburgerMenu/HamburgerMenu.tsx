import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./HamburgerMenu.css";

export type HamburgerMenuItem = {
  label: string;
  href: string;
};

export type HamburgerMenuProps = {
  items?: HamburgerMenuItem[];
  logo?: string;
  tone?: "cream" | "ink";
};

type Point = [number, number];

type PaperScene = {
  getQuad: () => Point[] | null;
  destroy: () => void;
};

const YEAR = new Date().getFullYear();

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

function get2dContext(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("2d context unavailable");
  }

  return ctx;
}

function createPaperTexture() {
  const TW = 1400;
  const TH = 1932;

  const canvas = document.createElement("canvas");
  canvas.width = TW;
  canvas.height = TH;

  const ctx = get2dContext(canvas);

  function roundedRect(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  ctx.clearRect(0, 0, TW, TH);

  ctx.save();

  roundedRect(0, 0, TW, TH, 30);
  ctx.clip();

  /*
   * Subtle frosted glass / paper surface
   */
  ctx.fillStyle = "rgba(255,255,255,.03)";
  ctx.fillRect(0, 0, TW, TH);

  const frost = ctx.createLinearGradient(0, 240, 0, 880);

  frost.addColorStop(0, "rgba(255,255,255,0)");
  frost.addColorStop(0.26, "rgba(255,255,255,.06)");
  frost.addColorStop(0.74, "rgba(255,255,255,.06)");
  frost.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = frost;
  ctx.fillRect(40, 240, 1120, 640);

  /*
   * Outer glass border
   */
  ctx.strokeStyle = "rgba(255,255,255,.34)";
  ctx.lineWidth = 2;

  roundedRect(20, 20, 1160, 1616, 14);
  ctx.stroke();

  /*
   * Inner border
   */
  ctx.strokeStyle = "rgba(255,255,255,.12)";
  ctx.lineWidth = 1;

  roundedRect(36, 36, 1128, 1584, 10);
  ctx.stroke();

  /*
   * Warm paper cast
   */
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = "rgba(216,178,122,.17)";
  ctx.fillRect(0, 0, TW, TH);

  ctx.globalCompositeOperation = "source-over";

  /*
   * Halftone texture
   */
  const dot = document.createElement("canvas");
  dot.width = 4;
  dot.height = 4;

  const dotCtx = get2dContext(dot);

  dotCtx.fillStyle = "#000";
  dotCtx.fillRect(0, 0, 1.5, 1.5);

  ctx.globalAlpha = 0.11;
  ctx.fillStyle = ctx.createPattern(dot, "repeat") ?? "transparent";
  ctx.fillRect(0, 0, TW, TH);

  /*
   * Scan-line texture
   */
  const band = document.createElement("canvas");
  band.width = 1;
  band.height = 3;

  const bandCtx = get2dContext(band);

  bandCtx.fillStyle = "#000";
  bandCtx.fillRect(0, 0, 1, 1);

  ctx.globalAlpha = 0.06;
  ctx.fillStyle = ctx.createPattern(band, "repeat") ?? "transparent";
  ctx.fillRect(0, 0, TW, TH);

  ctx.globalAlpha = 1;

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
}

function createEnvironment() {
  const width = 1024;
  const height = 512;

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const ctx = get2dContext(canvas);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);

  gradient.addColorStop(0, "#3a3d47");
  gradient.addColorStop(0.46, "#171820");
  gradient.addColorStop(1, "#08080a");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  function blob(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    color: string,
    alpha: string,
  ) {
    const radial = ctx.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      Math.max(rx, ry),
    );

    radial.addColorStop(0, color.replace("A", alpha));

    radial.addColorStop(1, color.replace("A", "0"));

    ctx.save();

    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    ctx.translate(-cx, -cy);

    ctx.fillStyle = radial;

    ctx.beginPath();
    ctx.arc(cx, cy, rx, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  blob(width * 0.3, height * 0.24, 330, 240, "rgba(255,252,246,A)", "1");

  blob(width * 0.74, height * 0.34, 240, 200, "rgba(150,175,235,A)", ".42");

  blob(width * 0.52, height * 0.86, 420, 190, "rgba(255,170,120,A)", ".10");

  const texture = new THREE.CanvasTexture(canvas);

  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function createGrain(element: HTMLElement) {
  const size = 160;

  const canvas = document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const ctx = get2dContext(canvas);

  const imageData = ctx.createImageData(size, size);

  for (let i = 0; i < size * size; i++) {
    const value = 128 + (Math.random() - 0.5) * 168;

    imageData.data[i * 4] = value;
    imageData.data[i * 4 + 1] = value;
    imageData.data[i * 4 + 2] = value;
    imageData.data[i * 4 + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  element.style.backgroundImage = `url(${canvas.toDataURL()})`;
}

function createPaperScene(container: HTMLElement, isActive: () => boolean) {
  const canvas = container.querySelector<HTMLCanvasElement>(
    ".hamburger-paper-canvas",
  );

  if (!canvas) {
    throw new Error("paper canvas missing");
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);

  camera.position.set(0, 0, 8.2);

  /*
   * Environment
   */
  const pmrem = new THREE.PMREMGenerator(renderer);

  pmrem.compileEquirectangularShader();

  const environment = createEnvironment();

  const environmentTarget = pmrem.fromEquirectangular(environment);

  scene.environment = environmentTarget.texture;

  environment.dispose();
  pmrem.dispose();

  /*
   * Lighting
   */
  const key = new THREE.DirectionalLight(0xfff6ec, 1.42);

  key.position.set(-3.3, 2.1, 2);

  const fill = new THREE.DirectionalLight(0x9fb6ff, 0.13);

  fill.position.set(3.6, -1.8, 1.6);

  const rim = new THREE.DirectionalLight(0xffffff, 0.1);

  rim.position.set(1.6, 1.2, -2.6);

  scene.add(key, fill, rim, new THREE.AmbientLight(0xffffff, 0.16));

  /*
   * Pointer light
   */
  const touchLight = new THREE.PointLight(0xdfe8ff, 0, 7.5, 1.35);

  touchLight.position.set(0, 0, 1.7);

  scene.add(touchLight);

  /*
   * Paper
   */
  const SW = 2.3;
  const SH = 2.72;

  const geometry = new THREE.PlaneGeometry(SW, SH, 72, 96);

  const uniforms = {
    uTime: { value: 0 },

    uAmp: {
      value: 1.18,
    },

    uFreq: {
      value: 4.7,
    },

    uTwist: {
      value: 1.3,
    },

    uSize: {
      value: new THREE.Vector2(SW, SH),
    },

    uFlutter: {
      value: 0,
    },

    uPhase: {
      value: 0,
    },

    uRim: {
      value: 0.62,
    },

    uRimA: {
      value: 0.88,
    },

    uSpecA: {
      value: 0.14,
    },

    uRimCol: {
      value: new THREE.Color(0xeaf2ff),
    },
  };

  /*
   * Main bending shader.
   *
   * This is what gives the menu its
   * "floating sheet of glass/paper"
   * appearance.
   */
  const vertexShader = `
    uniform float uTime;
    uniform float uAmp;
    uniform float uFlutter;
    uniform float uPhase;
    uniform float uFreq;
    uniform float uTwist;

    uniform vec2 uSize;

    float sAmp(float u, float v) {
      return uAmp *
        (0.10 + pow(u, 1.35)) *
        (0.50 + 0.64 * v);
    }

    float sAmpV(float u) {
      return uAmp *
        (0.10 + pow(u, 1.35)) *
        0.64;
    }

    float sTheta(float u, float v) {

      float a = sAmp(u, v);

      float ph =
        uFreq * u +
        uTwist * v +
        uTime * 0.40 +
        uPhase;

      return
        a * sin(ph) +
        uFlutter *
        a *
        0.60 *
        sin(
          ph * 2.35 +
          uTime * 2.0
        );
    }

    float sThetaV(float u, float v) {

      float a = sAmp(u, v);

      float da = sAmpV(u);

      float ph =
        uFreq * u +
        uTwist * v +
        uTime * 0.40 +
        uPhase;

      float f =
        ph * 2.35 +
        uTime * 2.0;

      return
        da * sin(ph) +
        a * cos(ph) * uTwist +
        uFlutter *
        0.60 *
        (
          da * sin(f) +
          a *
          cos(f) *
          uTwist *
          2.35
        );
    }

    float sYoff(float u, float v) {

      float w =
        1.0 -
        0.55 * v;

      return
        0.021 *
        uSize.y *
        sin(
          2.05 * u +
          uTime * 0.47 +
          uPhase
        ) +

        0.013 *
        uSize.y *
        sin(
          3.35 * u -
          1.55 * v +
          uTime * 0.63 +
          uPhase
        ) *
        w;
    }

    float sYdU(float u, float v) {

      float w =
        1.0 -
        0.55 * v;

      return
        0.0431 *
        uSize.y *
        cos(
          2.05 * u +
          uTime * 0.47 +
          uPhase
        ) +

        0.0436 *
        uSize.y *
        cos(
          3.35 * u -
          1.55 * v +
          uTime * 0.63 +
          uPhase
        ) *
        w;
    }

    float sYdV(float u, float v) {

      float ph =
        3.35 * u -
        1.55 * v +
        uTime * 0.63 +
        uPhase;

      return
        0.013 *
        uSize.y *
        (
          -1.55 *
          cos(ph) *
          (1.0 - 0.55 * v)

          - 0.55 *
          sin(ph)
        );
    }

    void sheetPoint(
      vec2 q,
      out vec3 P,
      out vec3 NN
    ) {

      float u = q.x;
      float v = q.y;

      float x = 0.0;
      float z = 0.0;

      float xe = 0.0;
      float ze = 0.0;

      float dxv = 0.0;
      float dzv = 0.0;

      float dxe = 0.0;
      float dze = 0.0;

      const int NS = 20;

      float h =
        1.0 /
        float(NS);

      for (
        int i = 0;
        i < NS;
        i++
      ) {

        float uu =
          (
            float(i) +
            0.5
          ) * h;

        float w =
          clamp(
            (
              u -
              (
                uu -
                0.5 * h
              )
            ) / h,
            0.0,
            1.0
          );

        float th =
          sTheta(
            uu,
            v
          );

        float dt =
          sThetaV(
            uu,
            v
          );

        float c =
          cos(th);

        float sn =
          sin(th);

        xe += c * h;
        ze += sn * h;

        dxe +=
          -sn *
          dt *
          h;

        dze +=
          c *
          dt *
          h;

        x +=
          c *
          h *
          w;

        z +=
          sn *
          h *
          w;

        dxv +=
          -sn *
          dt *
          h *
          w;

        dzv +=
          c *
          dt *
          h *
          w;
      }

      float W = uSize.x;
      float H = uSize.y;

      float th0 =
        sTheta(u, v);

      P =
        vec3(
          (x - xe * 0.5) * W,

          (v - 0.5) * H +
          sYoff(u, v),

          (z - ze * 0.5) * W
        );

      vec3 Tu =
        vec3(
          W * cos(th0),
          sYdU(u, v),
          W * sin(th0)
        );

      vec3 Tv =
        vec3(
          (dxv - dxe * 0.5) * W,
          H + sYdV(u, v),
          (dzv - dze * 0.5) * W
        );

      NN =
        normalize(
          cross(Tu, Tv)
        );
    }
  `;

  const texture = createPaperTexture();

  const material = new THREE.MeshPhysicalMaterial({
    map: texture,

    color: new THREE.Color(0xd9dee7),

    side: THREE.DoubleSide,

    metalness: 0,

    roughness: 0.3,

    clearcoat: 1,

    clearcoatRoughness: 0.12,

    envMapIntensity: 0.8,

    specularIntensity: 0.85,

    ior: 1.46,

    transparent: true,

    alphaTest: 0.012,

    opacity: 1,
  });

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `
          #include <common>

          ${vertexShader}
          `,
      )
      .replace(
        "#include <beginnormal_vertex>",
        `
          vec3 sheetP;
          vec3 objectNormal;

          sheetPoint(
            uv,
            sheetP,
            objectNormal
          );
          `,
      )
      .replace(
        "#include <begin_vertex>",
        `
          vec3 transformed =
            sheetP;
          `,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `
          #include <common>

          uniform float uRim;
          uniform float uRimA;
          uniform float uSpecA;

          uniform vec3 uRimCol;
          `,
      )
      .replace(
        "#include <alphatest_fragment>",
        `
          if (
            diffuseColor.a /
            max(opacity, 1e-4)
            < alphaTest
          ) discard;
          `,
      )
      .replace(
        "#include <opaque_fragment>",
        `
          float fres =
            pow(
              1.0 -
              clamp(
                abs(
                  dot(
                    geometryNormal,
                    geometryViewDir
                  )
                ),
                0.0,
                1.0
              ),
              3.2
            );

          outgoingLight +=
            fres *
            uRim *
            uRimCol;

          float baseA =
            diffuseColor.a /
            max(opacity, 1e-4);

          float outA =
            clamp(
              baseA +
              fres * uRimA +
              uSpecA *
              dot(
                outgoingLight,
                vec3(
                  0.3333
                )
              ),
              0.0,
              1.0
            ) *
            opacity;

          gl_FragColor =
            vec4(
              outgoingLight,
              outA
            );
          `,
      );
  };

  const mesh = new THREE.Mesh(geometry, material);

  const group = new THREE.Group();

  group.add(mesh);

  scene.add(group);

  /*
   * Soft shadow / halo behind paper.
   */
  const haloCanvas = document.createElement("canvas");

  haloCanvas.width = 256;
  haloCanvas.height = 256;

  const haloCtx = get2dContext(haloCanvas);

  const haloGradient = haloCtx.createRadialGradient(128, 128, 0, 128, 128, 128);

  haloGradient.addColorStop(0, "rgba(0,0,0,.55)");

  haloGradient.addColorStop(0.45, "rgba(0,0,0,.28)");

  haloGradient.addColorStop(1, "rgba(0,0,0,0)");

  haloCtx.fillStyle = haloGradient;

  haloCtx.fillRect(0, 0, 256, 256);

  const haloTexture = new THREE.CanvasTexture(haloCanvas);

  const haloGeometry = new THREE.PlaneGeometry(3.9, 4.9);

  const haloMaterial = new THREE.MeshBasicMaterial({
    map: haloTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.3,
  });

  const halo = new THREE.Mesh(haloGeometry, haloMaterial);

  halo.position.z = -0.62;

  group.add(halo);

  /*
   * Interaction state.
   */
  let dragging = false;

  let dragYaw = 0;
  let dragPitch = 0;

  let velocityYaw = 0;
  let velocityPitch = 0;

  let previousYaw = 0;
  let previousPitch = 0;

  let lastPointerX = 0;
  let lastPointerY = 0;

  let hover = 0;
  let hoverTarget = 0;

  let quad: Point[] | null = null;

  const mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  };

  let vw = 1;
  let vh = 1;

  function cornerPoint(qx: number, qy: number) {
    const t = uniforms.uTime.value;

    const phase = uniforms.uPhase.value;

    const amplitude = uniforms.uAmp.value;

    const frequency = uniforms.uFreq.value;

    const twist = uniforms.uTwist.value;

    const u = qx;
    const v = qy;

    const theta = (uu: number) =>
      amplitude *
      (0.1 + Math.pow(uu, 1.35)) *
      (0.5 + 0.64 * v) *
      Math.sin(frequency * uu + twist * v + t * 0.4 + phase);

    let x = 0;
    let z = 0;

    let xe = 0;
    let ze = 0;

    const N = 20;
    const h = 1 / N;

    for (let i = 0; i < N; i++) {
      const uu = (i + 0.5) * h;

      const w = clamp((u - (uu - 0.5 * h)) / h, 0, 1);

      const th = theta(uu);

      const c = Math.cos(th);

      const s = Math.sin(th);

      xe += c * h;
      ze += s * h;

      x += c * h * w;
      z += s * h * w;
    }

    const yOffset =
      0.021 * SH * Math.sin(2.05 * u + t * 0.47 + phase) +
      0.013 *
        SH *
        Math.sin(3.35 * u - 1.55 * v + t * 0.63 + phase) *
        (1 - 0.55 * v);

    return new THREE.Vector3(
      (x - xe * 0.5) * SW,

      (v - 0.5) * SH + yOffset,

      (z - ze * 0.5) * SW,
    );
  }

  function buildQuad() {
    const points: Point[] = [];

    const corners: Point[] = [
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ];

    const vector = new THREE.Vector3();

    for (const [u, v] of corners) {
      vector
        .copy(cornerPoint(u, v))
        .applyMatrix4(group.matrixWorld)
        .project(camera);

      points.push([
        (vector.x * 0.5 + 0.5) * vw,
        (-vector.y * 0.5 + 0.5) * vh,
      ]);
    }

    const centerX = points.reduce((sum, p) => sum + p[0], 0) / 4;

    const centerY = points.reduce((sum, p) => sum + p[1], 0) / 4;

    quad = points.map(
      ([x, y]) =>
        [
          centerX + (x - centerX) * 1.07,

          centerY + (y - centerY) * 1.07,
        ] as Point,
    );
  }

  function pointInQuad(px: number, py: number) {
    if (!quad) {
      return false;
    }

    let sign = 0;

    for (let i = 0; i < 4; i++) {
      const [ax, ay] = quad[i];

      const [bx, by] = quad[(i + 1) % 4];

      const cross = (bx - ax) * (py - ay) - (by - ay) * (px - ax);

      if (cross !== 0) {
        const current = cross > 0 ? 1 : -1;

        if (sign === 0) {
          sign = current;
        } else if (sign !== current) {
          return false;
        }
      }
    }

    return true;
  }

  /*
   * Resize
   */
  function resize() {
    const rect = container.getBoundingClientRect();

    vw = Math.max(1, rect.width);

    vh = Math.max(1, rect.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    renderer.setSize(vw, vh, false);

    camera.aspect = vw / vh;

    camera.updateProjectionMatrix();

    const visibleHeight =
      2 *
      camera.position.z *
      Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);

    const visibleWidth = visibleHeight * camera.aspect;

    const widthCap = Math.min(
      0.88,
      0.6 + Math.max(0, 1.45 - camera.aspect) * 0.45,
    );

    group.scale.setScalar(
      Math.min(
        (visibleHeight * 0.735) / SH,

        (visibleWidth * widthCap) / SW,
      ),
    );
  }

  /*
   * Pointer movement
   */
  function onPointerMove(event: PointerEvent) {
    const rect = container.getBoundingClientRect();

    const px = event.clientX - rect.left;

    const py = event.clientY - rect.top;

    mouse.targetX = clamp((px / vw - 0.5) * 2, -1, 1);

    mouse.targetY = clamp((py / vh - 0.5) * 2, -1, 1);

    if (dragging) {
      const dx = px - lastPointerX;

      const dy = py - lastPointerY;

      lastPointerX = px;
      lastPointerY = py;

      dragYaw += dx * 0.006;

      dragPitch = clamp(dragPitch - dy * 0.0045, -0.6, 0.6);

      return;
    }

    hoverTarget = pointInQuad(px, py) ? 1 : 0;
  }

  function onPointerDown(event: PointerEvent) {
    const rect = container.getBoundingClientRect();

    const px = event.clientX - rect.left;

    const py = event.clientY - rect.top;

    if (pointInQuad(px, py)) {
      dragging = true;

      lastPointerX = px;
      lastPointerY = py;

      velocityYaw = 0;
      velocityPitch = 0;

      previousYaw = dragYaw;
      previousPitch = dragPitch;

      container.style.cursor = "grabbing";
    }
  }

  function onPointerUp() {
    if (!dragging) {
      return;
    }

    dragging = false;

    container.style.cursor = "";
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });

  window.addEventListener("pointerdown", onPointerDown);

  window.addEventListener("pointerup", onPointerUp);

  window.addEventListener("resize", resize);

  const resizeObserver = new ResizeObserver(resize);

  resizeObserver.observe(container);

  /*
   * Animation loop
   */
  const clock = new THREE.Clock();

  let intro = 0;

  let animationFrame = 0;

  function frame() {
    animationFrame = requestAnimationFrame(frame);

    const dt = Math.min(clock.getDelta(), 0.05);

    /*
     * Nothing is visible while the menu is
     * closed, so skip the simulation and the
     * render entirely instead of burning a
     * WebGL frame on every page.
     */
    if (!isActive()) {
      return;
    }

    const time = clock.elapsedTime;

    uniforms.uTime.value = REDUCED_MOTION ? 2.4 : time;

    intro += (1 - intro) * Math.min(1, dt * 1.9);

    material.opacity = intro;

    haloMaterial.opacity = intro * 0.3;

    /*
     * Drag velocity
     */
    if (dragging) {
      const smoothing = Math.min(1, dt * 14);

      velocityYaw +=
        ((dragYaw - previousYaw) / Math.max(dt, 0.001) - velocityYaw) *
        smoothing;

      velocityPitch +=
        ((dragPitch - previousPitch) / Math.max(dt, 0.001) - velocityPitch) *
        smoothing;

      velocityYaw = clamp(velocityYaw, -7, 7);

      velocityPitch = clamp(velocityPitch, -4, 4);
    } else {
      dragYaw += velocityYaw * dt;

      dragPitch = clamp(dragPitch + velocityPitch * dt, -0.6, 0.6);

      const decay = Math.pow(0.018, dt);

      velocityYaw *= decay;

      velocityPitch *= decay;
    }

    previousYaw = dragYaw;

    previousPitch = dragPitch;

    /*
     * Smooth pointer movement
     */
    mouse.x += (mouse.targetX - mouse.x) * Math.min(1, dt * 3);

    mouse.y += (mouse.targetY - mouse.y) * Math.min(1, dt * 3);

    const idle = REDUCED_MOTION ? 0 : 1;

    const rise = 1 - intro;

    /*
     * Paper movement
     */
    group.rotation.y =
      dragYaw + mouse.x * 0.16 + Math.sin(time * 0.23) * 0.045 * idle;

    group.rotation.x =
      dragPitch -
      mouse.y * 0.11 +
      Math.sin(time * 0.19) * 0.026 * idle +
      rise * 0.28;

    group.rotation.z = Math.sin(time * 0.27) * 0.018 * idle;

    group.position.y = Math.sin(time * 0.36) * 0.06 * idle - rise * 0.7;

    group.position.x = Math.sin(time * 0.21) * 0.05 * idle + mouse.x * 0.1;

    group.updateMatrixWorld();

    /*
     * Pointer light
     */
    hover += (hoverTarget - hover) * Math.min(1, dt * 4.5);

    touchLight.intensity = hover * 2.6 * intro;

    if (hover > 0.002) {
      const lightPosition = new THREE.Vector3(
        mouse.targetX,
        -mouse.targetY,
        0.5,
      )
        .unproject(camera)
        .sub(camera.position)
        .normalize();

      touchLight.position
        .copy(camera.position)
        .addScaledVector(
          lightPosition,
          (1.75 - camera.position.z) / lightPosition.z,
        );
    }

    /*
     * Important:
     * this gives the HTML menu card
     * the coordinates of the 3D paper.
     */
    buildQuad();

    renderer.render(scene, camera);
  }

  resize();

  /*
   * Start with the paper almost invisible,
   * then animate it into place.
   */
  material.opacity = 0.002;

  frame();

  return {
    getQuad() {
      return quad;
    },

    destroy() {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("pointermove", onPointerMove);

      window.removeEventListener("pointerdown", onPointerDown);

      window.removeEventListener("pointerup", onPointerUp);

      window.removeEventListener("resize", resize);

      resizeObserver.disconnect();

      scene.environment = null;

      environmentTarget.dispose();

      geometry.dispose();
      material.dispose();
      texture.dispose();

      haloGeometry.dispose();
      haloMaterial.dispose();
      haloTexture.dispose();

      renderer.dispose();
    },
  };
}

function solveHomography(
  destination: Point[],
  width: number,
  height: number,
): number[] | null {
  const source: Point[] = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];

  const A: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 4; i++) {
    const [x, y] = source[i];

    const [X, Y] = destination[i];

    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]);

    b.push(X);

    A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]);

    b.push(Y);
  }

  /*
   * Gaussian elimination
   */
  for (let column = 0; column < 8; column++) {
    let pivot = column;

    for (let row = column + 1; row < 8; row++) {
      if (Math.abs(A[row][column]) > Math.abs(A[pivot][column])) {
        pivot = row;
      }
    }

    if (Math.abs(A[pivot][column]) < 1e-9) {
      return null;
    }

    [A[column], A[pivot]] = [A[pivot], A[column]];

    [b[column], b[pivot]] = [b[pivot], b[column]];

    for (let row = 0; row < 8; row++) {
      if (row === column) {
        continue;
      }

      const factor = A[row][column] / A[column][column];

      for (let k = column; k < 8; k++) {
        A[row][k] -= factor * A[column][k];
      }

      b[row] -= factor * b[column];
    }
  }

  return b.map((value, index) => value / A[index][index]);
}

export default function HamburgerMenu({
  items = [
    {
      label: "Projects",
      href: "#projects",
    },
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Services",
      href: "#services",
    },
    {
      label: "Contact",
      href: "#contact",
    },
  ],

  logo = "yourstudio.",

  tone = "cream",
}: HamburgerMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<PaperScene | null>(null);

  const menuCardRef = useRef<HTMLElement>(null);

  const openRef = useRef(false);

  const [open, setOpen] = useState(false);

  /*
   * Three.js scene.
   *
   * Built on the first open so a closed menu
   * costs nothing, then kept alive.
   */
  useEffect(() => {
    openRef.current = open;

    if (!open || sceneRef.current || !rootRef.current) {
      return;
    }

    sceneRef.current = createPaperScene(rootRef.current, () =>
      openRef.current,
    );
  }, [open]);

  useEffect(
    () => () => {
      sceneRef.current?.destroy();

      sceneRef.current = null;
    },
    []
  );

  /*
   * Project the HTML menu
   * onto the 3D paper.
   */
  useEffect(() => {
    if (!open || !sceneRef.current || !menuCardRef.current) {
      return;
    }

    const card = menuCardRef.current;

    const WIDTH = 560;
    const HEIGHT = 790;

    let animationFrame = 0;

    function update() {
      animationFrame = requestAnimationFrame(update);

      const quad = sceneRef.current?.getQuad();

      if (!quad) {
        return;
      }

      /*
       * Recover the actual
       * paper face from the
       * expanded hit-test quad.
       */
      const centerX = quad.reduce((sum, p) => sum + p[0], 0) / 4;

      const centerY = quad.reduce((sum, p) => sum + p[1], 0) / 4;

      const face = quad.map(
        ([x, y]) =>
          [
            centerX + (x - centerX) / 1.07,

            centerY + (y - centerY) / 1.07,
          ] as Point,
      );

      /*
       * Calculate signed area.
       *
       * When the paper turns away
       * from the viewer the winding
       * reverses, so hide the menu.
       */
      let area = 0;

      for (let i = 0; i < 4; i++) {
        const [x1, y1] = face[i];

        const [x2, y2] = face[(i + 1) % 4];

        area += x1 * y2 - x2 * y1;
      }

      area /= 2;

      if (area <= 0) {
        card.style.visibility = "hidden";

        return;
      }

      card.style.visibility = "visible";

      /*
       * Fade near edge-on angles.
       */
      const faceOn = Math.min(1, Math.abs(area) / (WIDTH * HEIGHT * 0.16));

      card.style.opacity = faceOn.toFixed(3);

      const matrix = solveHomography(face, WIDTH, HEIGHT);

      if (!matrix) {
        return;
      }

      const [a, b, c, d, e, f, g, h] = matrix;

      /*
       * Convert the homography into
       * CSS matrix3d().
       */
      card.style.transform = `matrix3d(
          ${a},${d},0,${g},
          ${b},${e},0,${h},
          0,0,1,0,
          ${c},${f},0,1
        )`;
    }

    update();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [open]);

  /*
   * Open / close
   */
  function toggleMenu() {
    setOpen((current) => !current);
  }

  function closeMenu() {
    setOpen(false);
  }

  /*
   * Lock body scrolling.
   */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /*
   * ESC
   */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        closeMenu();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* =====================================
          HAMBURGER BUTTON
      ====================================== */}

      <button
        type="button"
        data-tone={tone}
        className={`hamburger-button ${open ? "is-open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={toggleMenu}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <rect x="3" y="5" width="14" height="1.6" rx=".8" />

          <rect x="3" y="9.2" width="14" height="1.6" rx=".8" />

          <rect x="3" y="13.4" width="14" height="1.6" rx=".8" />
        </svg>
      </button>

      {/* =====================================
          FULLSCREEN MENU
      ====================================== */}

      <div
        ref={rootRef}
        className={`hamburger-menu ${open ? "is-visible" : ""}`}
        aria-hidden={!open}
      >
        {/* Three.js paper */}
        <div className="paper-stage">
          <canvas className="hamburger-paper-canvas" />

          {/* Grain */}
          <div
            className="paper-grain paper-grain-primary"
            ref={(element) => {
              if (element) {
                createGrain(element);
              }
            }}
          />

          <div className="paper-grain paper-grain-secondary" />

          {/* Vignette */}
          <div className="paper-vignette" />

          {/* Hint */}
          <div className="paper-hint">
            <b>Drag</b> to turn
            <span>
              ·<b>Hover</b> to light it
            </span>
          </div>
        </div>

        {/* =================================
            CLOSE BUTTON
        ================================== */}

        <button
          type="button"
          className="menu-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <span>{logo}</span>
        </button>

        {/* =================================
            HTML MENU CARD
        ================================== */}

        <nav
          ref={menuCardRef}
          className="menu-card"
          aria-label="Main navigation"
        >
          <div className="menu-card-inner">
            <div className="menu-navigation">
              {items.map((item, index) => (
                <a
                  href={item.href}
                  key={item.href || index}
                  onClick={closeMenu}
                >
                  <span>{item.label}</span>
                </a>
              ))}
            </div>

            <div className="menu-footer">
              <span>MENU</span>

              <span>{YEAR}</span>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
