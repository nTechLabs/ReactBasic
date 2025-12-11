// @pages/fcm/KkoMessageHandler.jsx
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';

/**
 * URL 스킴 호출용 커스텀 훅
 * - window focus / blur 상태를 감지해서 앱 설치 여부를 유추
 * - navigate 함수를 주입받아서, devTest 모드 등에서 실제 이동을 막을 수 있음
 */
const useUrlSchemeCaller = ({ navigate } = {}) => {
  const [windowState, setWindowState] = useState('focus');
  const windowStateRef = useRef('focus');

  const navigateFn = useCallback(
    (url) => {
      if (!url) return;
      if (navigate) {
        navigate(url);
      } else {
        window.location.href = url;
      }
    },
    [navigate]
  );

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

  /**
   * ua        : 'android' | 'iphone' 등 (현재는 분기용, 직접 쓰지는 않음)
   * urlScheme : 최초로 호출할 앱 스킴 (예: msds://detail?code=...)
   * notInstalledCallback : 앱이 설치되지 않았다고 판단될 때 호출
   */
  const call = useCallback(
    (ua, urlScheme, notInstalledCallback) => {
      // 1차로 앱 스킴 호출
      navigateFn(urlScheme);

      // 300ms 후에 포커스 상태를 보고 앱 설치 여부를 추정
      setTimeout(() => {
        if (windowStateRef.current === 'focus') {
          // 포커스가 그대로면 앱 미설치로 간주
          if (typeof notInstalledCallback === 'function') {
            notInstalledCallback();
          }
        } else {
          // 포커스가 한 번 나갔다 온 경우 등 → 앱이 실행된 것으로 간주
          const code = new URLSearchParams(window.location.search).get('code');
          const deepLink = `msds://detail?code=${code || ''}`;
          navigateFn(deepLink);
        }
      }, 300);
    },
    [navigateFn]
  );

  return { call, windowState };
};

/**
 * KkoMessageHandler 컴포넌트
 * - /apps/bod-mobile/fcm?code=HELLO123 형태로 진입
 * - 모바일(안드로이드/iOS)에서는 앱 딥링크 및 스토어 이동
 * - PC에서는 mockUa / devTest 쿼리로 테스트 가능
 */
const KkoMessageHandler = () => {
  const [userAgent, setUserAgent] = useState('');
  const [code, setCode] = useState('');

  // 쿼리 파라미터에서 mockUa / devTest 플래그 추출
  const { mockUa, devTest } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      mockUa: params.get('mockUa'), // 'android' | 'iphone' 등
      devTest: params.get('devTest') === '1', // devTest=1 이면 true
    };
  }, []);

  // 공통 navigate 함수 (devTest 모드일 때는 실제 이동 대신 로그만)
  const navigate = useCallback(
    (url) => {
      if (!url) return;

      if (devTest) {
        // PC에서 테스트할 때 실제로 스킴 이동하지 않고 콘솔로만 확인
        // 예: http://localhost:3100/apps/bod-mobile/fcm?code=HELLO123&mockUa=android&devTest=1
        // 콘솔에서 "[DEV TEST] navigate to: ..." 로그 확인
        // eslint-disable-next-line no-console
        console.log('[DEV TEST] navigate to:', url);
      } else {
        window.location.href = url;
      }
    },
    [devTest]
  );

  // 위에서 만든 navigate를 주입해서 훅 사용
  const { call } = useUrlSchemeCaller({ navigate });

  // UA 및 code 파라미터 초기 세팅
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // mockUa가 있으면 그것을 우선 사용 (PC에서 강제 테스트용)
    const uaSource = mockUa || navigator.userAgent;
    setUserAgent(uaSource.toLowerCase());

    const codeParam = params.get('code') || '';
    setCode(codeParam);
  }, [mockUa]);

  const getQueryParam = (paramName) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(paramName);
  };

  // UA / code 가 준비되면 딥링크 로직 실행
  useEffect(() => {
    if (!userAgent) return;

    const deepCode = code || getQueryParam('code') || '';
    const urlScheme = `msds://detail?code=${deepCode}`;

    // useUrlSchemeCaller 내부의 useEffect가 이벤트 리스너를 등록할 시간 확보를 위해
    // 약간의 딜레이 후에 call() 실행
    const timer = setTimeout(() => {
      if (userAgent.includes('android')) {
        // 안드로이드: 앱 딥링크 → 미설치 시 스토어로
        call('android', urlScheme, () => {
          navigate('hmpstore://detail?APP_ID=A000SHY147');
        });
      } else if (
        userAgent.includes('iphone') ||
        userAgent.includes('ipad') ||
        userAgent.includes('ipod')
      ) {
        // iOS: 앱 딥링크 → 미설치 시 스토어로
        call('iphone', urlScheme, () => {
          navigate('I000SHY005://detail?appId=I000SHY019');
        });
      } else {
        // 기타 환경 (PC 등)
        alert('해당 페이지는 SK Hynix App 실행 환경에서만 동작합니다.');
      }
    }, 100); // 100ms 정도 지연

    return () => clearTimeout(timer);
  }, [userAgent, code, call, navigate]);

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