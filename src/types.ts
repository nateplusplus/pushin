export interface PushInOptions {
  debug?: boolean;
}

export interface PushInLayer {
  element: HTMLElement;
  index: number;
  originalScale: number;
  ref: {
    inpoints: number[];
    outpoints: number[];
  };
  params: {
    inpoint: number;
    outpoint: number;
    speed: number;
  };
}
