import React, { useRef, useLayoutEffect } from 'react';
import { PushIn } from '../dist/esm/pushin';
import './pushin.css';

type PushInArgs = {
  target: string;
  scrollTarget?: string;
};

export const Target = ({ scrollTarget }) => {
  const pushInContainer = useRef();

  useLayoutEffect(() => {
    const args: PushInArgs = { target: '#target' };

    if (scrollTarget) {
      args.scrollTarget = scrollTarget;
    }

    const pushIn = new PushIn(pushInContainer.current, args);
    pushIn.start();

    return () => pushIn.destroy();
  });

  return (
    <div>
      <h2>Target</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus esse
        ducimus libero tempora officiis, temporibus totam magnam laboriosam
        facilis quod dignissimos deleniti unde dolor sunt earum accusantium qui
        voluptate mollitia?
      </p>
      <div
        id="target"
        style={{
          position: 'relative',
          width: '70%',
          margin: '1rem auto',
          height: scrollTarget === 'window' ? 'auto' : '300px',
          backgroundColor: 'lightgray',
          borderRadius: '8px',
        }}
      >
        <div className="pushin" ref={pushInContainer}>
          <div className="pushin-scene">
            <div key="layer1" className="pushin-layer">
              <p>Lorem ipsum dolor sit amet consectetur.</p>
            </div>
            <div key="layer2" className="pushin-layer">
              <p>
                Adipisicing elit. Numquam nulla maiores suscipit, odio ad dolor.
              </p>
            </div>
            <div key="layer3" className="pushin-layer">
              <p>
                In recusandae culpa error beatae itaque et obcaecati sequi
                dolorem voluptates minima. Iure, sit non.
              </p>
            </div>
          </div>
        </div>
      </div>
      <h2>Lorem ipsum, dolor sit amet consectetur adipisicing elit</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur ex
        nihil minus odit magnam neque fuga dicta debitis quidem qui hic, autem
        eligendi repellendus. Rerum placeat deleniti tempora commodi odio.
      </p>
    </div>
  );
};
