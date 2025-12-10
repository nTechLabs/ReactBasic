// src/KkoMessageHandler.jsx
import React, { useEffect, useState } from 'react';

const useUrlSchemeCaller = () => {
  const [windowState, setWindowState] = useState('focus');

  useEffect(() => {
    const handleFocus = () => setWindowState('focus');
    const handleBlur = () => setWindowState('blur');

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const call = (ua, urlScheme, notInstalledCallback) => {
    window.location.href = urlScheme;

    setTimeout(() => {
      if (windowState === 'focus') {
        notInstalledCallback();
      } else {
        const code = new URLSearchParams(window.location.search).get('code');
        const deepLink = `msds://detail?code=${code || ''}`;
        window.location.href = deepLink;
      }
    }, 300);
  };

  return { call };
};

const KkoMessageHandler = () => {
  const [userAgent, setUserAgent] = useState('');
  const [code, setCode] = useState('');
  const { call } = useUrlSchemeCaller();

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setUserAgent(ua);

    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code') || '';
    setCode(codeParam);
  }, []);

  const handleUrlSchemeCall = (ua, urlScheme, notInstalledCallback) => {
    call(ua, urlScheme, notInstalledCallback);
  };

  const getQueryParam = (paramName) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  };

  useEffect(() => {
    if (!userAgent) return;

    const deepCode = code || getQueryParam('code') || '';
    const urlScheme = `msds://detail?code=${deepCode}`;

    if (userAgent.includes('android')) {
      handleUrlSchemeCall('android', urlScheme, () => {
        window.location.href = 'hmpstore://detail?APP_ID=A000SHY147';
      });
    } else if (
      userAgent.includes('iphone') ||
      userAgent.includes('ipad') ||
      userAgent.includes('ipod')
    ) {
      handleUrlSchemeCall('iphone', urlScheme, () => {
        window.location.href = 'I000SHY005://detail?appId=I000SHY019';
      });
    } else {
      alert('해당 페이지는 SK Hynix App 실행 환경에서만 동작합니다.');
    }
  }, [userAgent, code]);

  return (
    <div>
      <div>
        스토어가 설치되지 않았습니다. <br />
        링크 클릭하여 스토어 설치 후 재실행 부탁드립니다.
        <br />
        <br />
        <a id="a1" href="hmpstore://main">
          스토어앱 실행
        </a>
        <br />
        <br />
        <a id="a2" href="hmpstore://detail?APPID=A000SHY047">
          스토어앱 : 상세화면으로 진입
        </a>
      </div>
    </div>
  );
};

export { KkoMessageHandler };
