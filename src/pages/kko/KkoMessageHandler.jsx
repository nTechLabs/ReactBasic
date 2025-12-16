// @pages/fcm/KkoMessageHandler.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';

/**
 * URL 스킴 호출용 커스텀 훅
 * - focus/blur/visibility로 앱 실행 시도 성공(blur) 여부를 추정
 * - mockNav=1이면 실제 이동 대신 콘솔로그만 + 미설치 플로우 강제 재현
 *
 * 제공 API:
 * - openAppOrStore(appScheme, storeScheme, options)
 */
const useUrlSchemeCaller = ({ mockNav = false } = {}) => {
  const windowStateRef = useRef('focus'); // 'focus' | 'blur'
  const lastBlurAtRef = useRef(0);
  const lastAttemptAtRef = useRef(0);

  useEffect(() => {
    const handleFocus = () => {
      windowStateRef.current = 'focus';
      console.log('[SCHEME] window focus');
    };
    const handleBlur = () => {
      windowStateRef.current = 'blur';
      lastBlurAtRef.current = Date.now();
      console.log('[SCHEME] window blur (likely app opened)');
    };
    const handleVisibility = () => {
      console.log('[SCHEME] visibility:', document.visibilityState);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const navigate = useCallback(
    (url, label = '') => {
      if (!url) return;
      if (mockNav) {
        console.log(`[MOCK NAV] ${label}`.trim(), '=>', url);
        return;
      }
      console.log(`[NAV] ${label}`.trim(), '=>', url);
      window.location.href = url;
    },
    [mockNav]
  );

  /**
   * 앱 스킴을 N회 재시도 후에도 blur가 안 오면 store로 이동
   *
   * options:
   * - retries: 재시도 횟수(기본 2)
   * - retryDelayMs: 재시도 간격(기본 250ms)
   * - installCheckMs: 설치여부 판단 시간(기본 350ms)
   * - onLikelyOpened: blur로 앱이 열린 것으로 추정될 때 콜백
   * - onGiveUpToStore: store로 최종 이동 직전 콜백
   */
  const openAppOrStore = useCallback(
    (appScheme, storeScheme, options = {}) => {
      const {
        retries = 2,
        retryDelayMs = 250,
        installCheckMs = 350,
        onLikelyOpened,
        onGiveUpToStore,
      } = options;

      // mockNav 모드면 플로우를 콘솔로 재현 (항상 미설치로 간주)
      if (mockNav) {
        navigate(appScheme, '[TRY APP] (mock)');
        console.log('[MOCK NAV] assume NOT installed -> go store');
        navigate(storeScheme, '[GO STORE] (mock)');
        return;
      }

      const attempt = (n) => {
        lastAttemptAtRef.current = Date.now();
        console.log(`[SCHEME] attempt ${n + 1}/${retries + 1}`);

        // 1) 앱 스킴 호출
        navigate(appScheme, '[TRY APP]');

        // 2) 일정 시간 후 blur 여부로 "열림" 추정
        setTimeout(() => {
          const now = Date.now();
          const blurredRecently =
            windowStateRef.current === 'blur' &&
            now - lastBlurAtRef.current < 2000; // 최근 2초 내 blur면 열린 걸로 추정

          if (blurredRecently) {
            console.log('[SCHEME] likely opened (blur detected). stop retry.');
            if (typeof onLikelyOpened === 'function') {
              onLikelyOpened({
                attempt: n + 1,
                lastBlurAt: lastBlurAtRef.current,
              });
            }
            return;
          }

          // 3) blur가 안 왔으면 재시도 or store
          if (n < retries) {
            console.log(
              `[SCHEME] no blur yet. retry after ${retryDelayMs}ms...`
            );
            setTimeout(() => attempt(n + 1), retryDelayMs);
          } else {
            console.log('[SCHEME] give up -> go store');
            if (typeof onGiveUpToStore === 'function') {
              onGiveUpToStore({ attempts: retries + 1 });
            }
            navigate(storeScheme, '[GO STORE]');
          }
        }, installCheckMs);
      };

      attempt(0);
    },
    [mockNav, navigate]
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

    const appScheme = `msds://open?url=${encodeURIComponent(deeplink)}`;

    const isAndroid = userAgent.includes('android');
    const isIOS =
      userAgent.includes('iphone') ||
      userAgent.includes('ipad') ||
      userAgent.includes('ipod');

    const timer = setTimeout(() => {
      if (isAndroid) {
        const storeScheme = 'hmpstore://detail?APP_ID=A000SHY147';

        openAppOrStore(appScheme, storeScheme, {
          retries: 2,          // 총 3회 시도(1 + 2)
          retryDelayMs: 250,
          installCheckMs: 350,
          onLikelyOpened: ({ attempt }) => {
            console.log(
              `[KkoMessageHandler] likely opened on attempt ${attempt}. deeplink was:`,
              deeplink
            );
            // ⚠️ 여기서 "화면까지 갔다"를 웹이 확인할 수는 없고,
            // "앱이 열렸다(blur)" 추정까지만 가능합니다.
          },
          onGiveUpToStore: ({ attempts }) => {
            console.log(
              `[KkoMessageHandler] no blur after ${attempts} attempts. go store.`
            );
          },
        });
      } else if (isIOS) {
        const storeScheme = 'I000SHY005://detail?appId=I000SHY019';

        openAppOrStore(appScheme, storeScheme, {
          retries: 2,
          retryDelayMs: 250,
          installCheckMs: 350,
          onLikelyOpened: ({ attempt }) => {
            console.log(
              `[KkoMessageHandler] likely opened on attempt ${attempt}. deeplink was:`,
              deeplink
            );
          },
          onGiveUpToStore: ({ attempts }) => {
            console.log(
              `[KkoMessageHandler] no blur after ${attempts} attempts. go store.`
            );
          },
        });
      } else {
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