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
  ref: {
    inpoints: number[];
    outpoints: number[];
    speed: number;
  };
  params: {
    inpoint: number;
    outpoint: number;
    speed: number;
  };
}
