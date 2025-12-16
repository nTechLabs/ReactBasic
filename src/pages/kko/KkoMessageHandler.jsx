// @pages/fcm/KkoMessageHandler.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';

/**
 * URL 스킴 호출용 커스텀 훅
 * - focus/blur로 앱 설치 여부를 유추
 * - mockNav=1이면 실제 이동 대신 콘솔로그만 + 미설치 플로우 강제 재현
 *
 * 제공 API:
 * - openAppOrStore(appScheme, storeScheme)
 */
const useUrlSchemeCaller = ({ mockNav = false } = {}) => {
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

  const navigate = useCallback(
    (url) => {
      if (!url) return;
      if (mockNav) {
        console.log('[MOCK NAV] would navigate to:', url);
        return;
      }
      window.location.href = url;
    },
    [mockNav]
  );

  /**
   * appScheme 실행 후, focus 변화가 없으면 storeScheme으로 이동
   * - 실제 환경: focus stays focus => store 이동
   * - mockNav=1: 항상 미설치로 간주하여 store 이동 로그까지 재현
   */
  const openAppOrStore = useCallback(
    (appScheme, storeScheme) => {
      // 1) 앱 스킴 호출
      navigate(appScheme);

      setTimeout(() => {
        if (mockNav) {
          console.log('[MOCK NAV] assume NOT installed (focus stays focus)');
          navigate(storeScheme);
          return;
        }

        // 2) 실제 환경: 일정 시간 후 포커스 상태로 앱 설치 여부 판단
        if (windowStateRef.current === 'focus') {
          navigate(storeScheme);
        }
      }, 300);
    },
    [navigate, mockNav]
  );

  return { openAppOrStore };
};

const KkoMessageHandler = () => {
  const [userAgent, setUserAgent] = useState('');
  const [deeplink, setDeeplink] = useState('');
  const [mockNav, setMockNav] = useState(false);

  // 1) 진입 시 파라미터 파싱 (deeplink, mockUa, mockNav)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      const deeplinkParam = params.get('deeplink') || '';
      const mockUaParam = (params.get('mockUa') || '').toLowerCase(); // android | iphone | ipad | ipod
      const mockNavParam = params.get('mockNav') === '1';

      // UA 결정: mockUa가 있으면 그것을 우선 사용
      // - 'android', 'iphone' 같은 키워드만 넣어도 includes 체크가 되도록 함
      const uaSource = mockUaParam
        ? mockUaParam
        : (navigator.userAgent || '').toLowerCase();

      setUserAgent(uaSource);
      setDeeplink(deeplinkParam);
      setMockNav(mockNavParam);

      console.log('[KkoMessageHandler] ua =', uaSource);
      console.log('[KkoMessageHandler] deeplink =', deeplinkParam);
      console.log('[KkoMessageHandler] mockUa =', mockUaParam || '(none)');
      console.log('[KkoMessageHandler] mockNav =', mockNavParam);
    } catch (e) {
      console.error('[KkoMessageHandler] URL 파싱 중 오류:', e);
    }
  }, []);

  const { openAppOrStore } = useUrlSchemeCaller({ mockNav });

  // 2) deeplink 있을 때만 실행
  useEffect(() => {
    if (!userAgent) return;

    if (!deeplink) {
      console.warn('[KkoMessageHandler] deeplink 파라미터 없음 – 실행 안 함');
      return;
    }

    // deeplink -> 앱 스킴 변환
    // 예: msds://open?url=http%3A%2F%2Fmbod....
    const appScheme = `msds://open?url=${encodeURIComponent(deeplink)}`;

    const isAndroid = userAgent.includes('android');
    const isIOS =
      userAgent.includes('iphone') ||
      userAgent.includes('ipad') ||
      userAgent.includes('ipod');

    // 훅 내부 이벤트 등록 시간 확보
    const timer = setTimeout(() => {
      if (isAndroid) {
        const storeScheme = 'hmpstore://detail?APP_ID=A000SHY147';
        openAppOrStore(appScheme, storeScheme);
      } else if (isIOS) {
        const storeScheme = 'I000SHY005://detail?appId=I000SHY019';
        openAppOrStore(appScheme, storeScheme);
      } else {
        // PC에서 mockUa 없이 접근하면 여기로 옴
        alert('해당 페이지는 SK Hynix App 실행 환경에서만 동작합니다.');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [userAgent, deeplink, openAppOrStore]);

  // 3) UI
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