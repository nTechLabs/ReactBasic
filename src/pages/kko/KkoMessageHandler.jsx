// @pages/fcm/KkoMessageHandler.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';

/**
 * URL 스킴 호출용 커스텀 훅
 * - devTest=true 이면 어떤 이동도 하지 않고 로그만 남김
 */
const useUrlSchemeCaller = ({ devTest } = {}) => {
  const [windowState, setWindowState] = useState('focus');
  const windowStateRef = useRef('focus');

  useEffect(() => {
    const handleFocus = () => {
      setWindowState('focus');
      windowStateRef.current = 'focus';
    };
    const handleBlur = () => {
      setWindowState('blur');
      windowStateRef.current = 'blur';
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const call = useCallback(
    (ua, urlScheme, notInstalledCallback) => {
      // 🔹 PC 테스트 모드: 아무 데도 이동하지 않고 로그만 찍음
      if (devTest) {
        console.log('[DEV TEST][call] ua=', ua);
        console.log('[DEV TEST][call] try app scheme:', urlScheme);
        console.log(
          '[DEV TEST][call] would check focus and maybe call notInstalledCallback later'
        );
        return;
      }

      // 🔹 실제 모바일 동작: 앱 스킴 호출
      window.location.href = urlScheme;

      // 300ms 후 focus 상태로 앱 설치 여부 판단
      setTimeout(() => {
        if (windowStateRef.current === 'focus') {
          // 포커스 그대로 → 앱 미설치로 간주
          if (typeof notInstalledCallback === 'function') {
            notInstalledCallback();
          }
        } else {
          // 포커스가 blur → 앱이 열렸다고 보고 딥링크 한 번 더
          const code = new URLSearchParams(window.location.search).get('code');
          const deepLink = `msds://detail?code=${code || ''}`;
          window.location.href = deepLink;
        }
      }, 300);
    },
    [devTest]
  );

  return { call, windowState };
};

const KkoMessageHandler = () => {
  const [userAgent, setUserAgent] = useState('');
  const [code, setCode] = useState('');
  const [devTest, setDevTest] = useState(false);
  const [mockUa, setMockUa] = useState('');

  // 1) 쿼리 파라미터 파싱 (mockUa, devTest, code)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      const mockUaParam = params.get('mockUa'); // android / iphone 등
      const devTestParam = params.get('devTest'); // '1' 이면 테스트 모드

      setMockUa(mockUaParam || '');
      setDevTest(devTestParam === '1');

      const uaSource = (mockUaParam || navigator.userAgent || '').toLowerCase();
      setUserAgent(uaSource);

      const codeParam = params.get('code') || '';
      setCode(codeParam);
    } catch (e) {
      console.error('[KkoMessageHandler] URL 파싱 중 오류:', e);
    }
  }, []);

  const getQueryParam = (paramName) => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get(paramName);
    } catch (e) {
      console.error('[KkoMessageHandler] getQueryParam 에러:', e);
      return null;
    }
  };

  // 2) URL 스킴 호출 훅 (devTest 플래그 전달)
  const { call } = useUrlSchemeCaller({ devTest });

  // 3) UA / code 준비되면 딥링크 로직 실행
  useEffect(() => {
    if (!userAgent) return;

    const deepCode = code || getQueryParam('code') || '';
    const urlScheme = `msds://detail?code=${deepCode}`;

    // 조금 딜레이 줘서 내부 useEffect 등록 후 실행되도록 함
    const timer = setTimeout(() => {
      console.log('[KkoMessageHandler] userAgent =', userAgent);
      console.log('[KkoMessageHandler] code =', deepCode);
      console.log('[KkoMessageHandler] devTest =', devTest);
      console.log('[KkoMessageHandler] mockUa =', mockUa);

      if (userAgent.includes('android')) {
        // ✅ 안드로이드
        call('android', urlScheme, () => {
          if (devTest) {
            console.log(
              '[DEV TEST] would navigate to store:',
              'hmpstore://detail?APP_ID=A000SHY147'
            );
          } else {
            window.location.href = 'hmpstore://detail?APP_ID=A000SHY147';
          }
        });
      } else if (
        userAgent.includes('iphone') ||
        userAgent.includes('ipad') ||
        userAgent.includes('ipod')
      ) {
        // ✅ iOS
        call('iphone', urlScheme, () => {
          if (devTest) {
            console.log(
              '[DEV TEST] would navigate to store:',
              'I000SHY005://detail?appId=I000SHY019'
            );
          } else {
            window.location.href = 'I000SHY005://detail?appId=I000SHY019';
          }
        });
      } else {
        // ✅ PC, 기타 환경
        if (devTest) {
          console.log(
            '[DEV TEST] non-mobile UA. would show alert: SK Hynix App 환경...'
          );
        } else {
          alert('해당 페이지는 SK Hynix App 실행 환경에서만 동작합니다.');
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [userAgent, code, devTest, mockUa, call]);

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