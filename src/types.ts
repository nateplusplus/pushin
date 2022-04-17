export interface LayerOptions {
  inpoints: number[];
  outpoints: number[];
  speed: number;
}

export interface SceneOptions {
  breakpoints: number[];
  inpoints: number[];
}

export interface PushInOptions {
  debug?: boolean;
  layers?: LayerOptions[];
  scene?: SceneOptions;
}

export interface PushInLayer {
  element: HTMLElement;
  index: number;
  originalScale: number;
}

export interface LayerRef {
  inpoints: number[];
  outpoints: number[];
  speed: number;
}

export interface LayerParams {
  inpoint: number;
  outpoint: number;
  speed: number;
}
