// @pages/fcm/KkoMessageHandler.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';

/**
 * URL 스킴 호출용 커스텀 훅
 * - window focus / blur 상태를 감지해서 앱 설치 여부를 유추
 */
const useUrlSchemeCaller = () => {
  const windowStateRef = useRef('focus');

  useEffect(() => {
    const handleFocus = () => {
      windowStateRef.current = 'focus';
    };
    const handleBlur = () => {
      windowStateRef.current = 'blur';
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const call = useCallback((urlScheme, notInstalledCallback) => {
    // 1️⃣ 앱 스킴 호출
    window.location.href = urlScheme;

    // 2️⃣ 일정 시간 후 포커스 상태로 앱 설치 여부 판단
    setTimeout(() => {
      if (windowStateRef.current === 'focus') {
        // 앱 미설치로 판단
        if (typeof notInstalledCallback === 'function') {
          notInstalledCallback();
        }
      }
    }, 300);
  }, []);

  return { call };
};

const KkoMessageHandler = () => {
  const [userAgent, setUserAgent] = useState('');
  const [deeplink, setDeeplink] = useState('');

  // 1️⃣ 진입 시 UA, deeplink 파라미터 파싱
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      setUserAgent((navigator.userAgent || '').toLowerCase());
      setDeeplink(params.get('deeplink') || '');

      console.log('[KkoMessageHandler] deeplink =', params.get('deeplink'));
    } catch (e) {
      console.error('[KkoMessageHandler] URL 파싱 중 오류:', e);
    }
  }, []);

  const { call } = useUrlSchemeCaller();

  // 2️⃣ deeplink 있을 때만 딥링크 실행
  useEffect(() => {
    if (!userAgent) return;
    if (!deeplink) {
      console.warn('[KkoMessageHandler] deeplink 파라미터 없음 – 실행 안 함');
      return;
    }

    /**
     * 👉 FCM deeplink → 앱 스킴 변환
     * 예:
     * deeplink = http://mbod.skhynix.com/apps/bod-mobile/agenda/197111
     * →
     * msds://open?url=ENCODED_URL
     */
    const targetScheme = `msds://open?url=${encodeURIComponent(deeplink)}`;

    const timer = setTimeout(() => {
      if (userAgent.includes('android')) {
        call(targetScheme, () => {
          window.location.href = 'hmpstore://detail?APP_ID=A000SHY147';
        });
      } else if (
        userAgent.includes('iphone') ||
        userAgent.includes('ipad') ||
        userAgent.includes('ipod')
      ) {
        call(targetScheme, () => {
          window.location.href = 'I000SHY005://detail?appId=I000SHY019';
        });
      } else {
        alert('해당 페이지는 SK Hynix App 실행 환경에서만 동작합니다.');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [userAgent, deeplink, call]);

  // 3️⃣ UI
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
export default KkoMessageHandler;