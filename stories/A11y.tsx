import React, { useRef, useLayoutEffect } from 'react';
import { PushIn } from '../dist/esm/pushin';

export const A11y = ({ settings = {}, attrs = [] }) => {
  const pushInContainer = useRef();

  useLayoutEffect(() => {
    const pushIn = new PushIn(pushInContainer.current, settings);
    pushIn.start();

    return () => pushIn.destroy();
  });

  const layer1Attr = attrs.length > 0 ? attrs[0] : {};
  const layer2Attr = attrs.length > 1 ? attrs[1] : {};
  const layer3Attr = attrs.length > 2 ? attrs[2] : {};

  return (
    <div className="pushin" ref={pushInContainer}>
      <div className="pushin-scene">
        <div key="layer1" className="pushin-layer" {...layer1Attr}>
          <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</span>
        </div>
        <div key="layer2" className="pushin-layer" {...layer2Attr}>
          <span>
            Mollitia hic non, at tempora saepe doloremque, voluptatem provident.
          </span>
        </div>
        <div key="layer3" className="pushin-layer" {...layer3Attr}>
          <span>
            Reprehenderit nisi perspiciatis facilis sint repudiandae totam
            praesentium dignissimos consequuntur tenetur.
          </span>
        </div>
      </div>
    </div>
  );
};
