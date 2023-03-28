import React, { useRef, useLayoutEffect } from 'react';
import { PushIn } from '../dist/esm/pushin';

export const Modes = ({ mode }) => {
  const pushInContainer = useRef();

  useLayoutEffect(() => {
    const pushIn = new PushIn(pushInContainer.current, { mode });
    pushIn.start();

    return () => pushIn.destroy();
  });

  return (
    <div className="pushin" ref={pushInContainer}>
      <div className="pushin-scene">
        <div key="layer1" className="pushin-layer">
          <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</span>
        </div>
        <div key="layer2" className="pushin-layer">
          <span>
            Mollitia hic non, at tempora saepe doloremque, voluptatem provident.
          </span>
        </div>
        <div key="layer3" className="pushin-layer">
          <span>
            Reprehenderit nisi perspiciatis facilis sint repudiandae totam
            praesentium dignissimos consequuntur tenetur.
          </span>
        </div>
      </div>
    </div>
  );
};
