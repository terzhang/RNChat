import React from 'react';

const usePubnub = pubnubSDK => {
  React.useEffect(() => {
    /* pubnub.init(this); */

    pubnubSDK.subscribe({
      channels: ['channel1'], //withPresence: true });
      message: message => console.log('sub', message)
    });

    pubnubSDK.getStatus(st => {
      console.log(st);
      pubnubSDK.publish({
        message: 'hello world from react',
        channel: 'channel1'
      });
    });

    return pubnubSDK.unsubscribe({ channels: ['channel1'] });
  }, [pubnubSDK]);

  return pubnubSDK;
};

export default usePubnub;
