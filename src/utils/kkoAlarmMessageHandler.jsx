import { notification } from 'antd';

/**
 * KKO 알림 메시지 핸들러
 * FCM 알림 메시지를 받았을 때 deeplink를 처리하는 모듈
 * 
 * @param {Object} options - 메시지 처리 옵션
 * @param {string} options.deeplink - 딥링크 URL (예: myapp://order/12345)
 * @param {boolean} options.hasApp - 앱 설치 여부
 * @param {string} options.storeUrl - 앱이 없을 때 이동할 스토어 URL
 */
export const handleKkoAlarmMessage = ({ deeplink, hasApp, storeUrl }) => {
  console.log('📱 알림 메시지 처리 시작:', { deeplink, hasApp, storeUrl });

  // 앱이 설치되어 있는 경우
  if (hasApp) {
    handleAppInstalled(deeplink);
  } else {
    // 앱이 설치되어 있지 않은 경우
    handleAppNotInstalled(storeUrl);
  }
};

/**
 * 앱이 설치된 경우 처리
 * - 앱 실행 시도
 * - deeplink로 특정 페이지 이동
 */
const handleAppInstalled = (deeplink) => {
  console.log('✅ 앱이 설치되어 있음 - 앱 실행 시도:', deeplink);

  notification.info({
    message: '앱 실행 중...',
    description: `딥링크로 이동합니다: ${deeplink}`,
    duration: 3,
  });

  // 딥링크 파싱
  const deeplinkInfo = parseDeeplink(deeplink);
  console.log('🔗 파싱된 딥링크 정보:', deeplinkInfo);

  // 실제 앱이 설치되어 있을 때의 처리
  // Custom URL Scheme을 통한 앱 실행 시도
  try {
    // iframe을 사용한 앱 실행 시도 (iOS/Android 호환)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deeplink;
    document.body.appendChild(iframe);

    // 일정 시간 후 iframe 제거
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);

    // 앱 실행 실패 시 대체 처리 (앱이 실제로 없는 경우)
    let appOpenTimer = setTimeout(() => {
      console.warn('⚠️ 앱 실행 실패 - 앱이 설치되지 않았을 수 있음');
      notification.warning({
        message: '앱 실행 실패',
        description: '앱이 설치되지 않았거나 실행할 수 없습니다.',
        duration: 4,
      });

      // 웹 대체 페이지로 이동
      handleWebFallback(deeplinkInfo);
    }, 2000);

    // 페이지가 백그라운드로 이동하면 앱이 실행된 것으로 간주
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(appOpenTimer);
        console.log('✅ 앱이 성공적으로 실행됨');
        notification.success({
          message: '앱 실행 성공',
          description: '앱에서 해당 페이지가 열렸습니다.',
          duration: 2,
        });
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  } catch (error) {
    console.error('❌ 앱 실행 중 오류 발생:', error);
    notification.error({
      message: '오류 발생',
      description: '앱 실행 중 오류가 발생했습니다.',
      duration: 4,
    });
  }
};

/**
 * 앱이 설치되지 않은 경우 처리
 * - 스마트 스토어로 이동
 */
const handleAppNotInstalled = (storeUrl) => {
  console.log('📦 앱이 설치되지 않음 - 스토어로 이동:', storeUrl);

  notification.info({
    message: '스토어로 이동',
    description: '앱을 다운로드하려면 스토어로 이동합니다.',
    duration: 3,
  });

  // 스토어로 리다이렉트
  setTimeout(() => {
    window.open(storeUrl, '_blank');
    console.log('✅ 스토어 페이지 열림:', storeUrl);
  }, 500);
};

/**
 * 딥링크 파싱
 * 예: myapp://order/12345 -> { scheme: 'myapp', path: 'order', id: '12345' }
 */
const parseDeeplink = (deeplink) => {
  try {
    const url = new URL(deeplink);
    const pathParts = url.pathname.split('/').filter(Boolean);

    return {
      scheme: url.protocol.replace(':', ''),
      host: url.host || url.hostname,
      path: pathParts[0] || '',
      id: pathParts[1] || '',
      fullPath: url.pathname,
      searchParams: Object.fromEntries(url.searchParams),
    };
  } catch (error) {
    console.error('❌ 딥링크 파싱 오류:', error);
    return {
      scheme: '',
      host: '',
      path: '',
      id: '',
      fullPath: '',
      searchParams: {},
    };
  }
};

/**
 * 웹 대체 페이지로 이동
 * 앱 실행이 실패했을 때 웹 페이지로 대체
 */
const handleWebFallback = (deeplinkInfo) => {
  console.log('🌐 웹 대체 페이지로 이동:', deeplinkInfo);

  // 딥링크 경로에 따라 웹 페이지 매핑
  const webPageMapping = {
    order: `/web/order/${deeplinkInfo.id}`,
    product: `/web/product/${deeplinkInfo.id}`,
    promotion: `/web/promotion/${deeplinkInfo.id}`,
    default: '/web/home',
  };

  const webPath = webPageMapping[deeplinkInfo.path] || webPageMapping.default;

  notification.info({
    message: '웹 페이지로 이동',
    description: `앱 대신 웹 페이지로 이동합니다: ${webPath}`,
    duration: 4,
  });

  // 실제로는 웹 페이지로 이동하지만, 여기서는 시뮬레이션
  console.log('🌐 웹 페이지 경로:', webPath);
  // window.location.href = webPath; // 실제 환경에서는 주석 해제
};

/**
 * 테스트용 헬퍼 함수
 * 다양한 딥링크 시나리오를 테스트할 수 있음
 */
export const testDeeplinkScenarios = () => {
  console.log('🧪 딥링크 시나리오 테스트 시작');

  const scenarios = [
    {
      name: '주문 페이지 (앱 있음)',
      deeplink: 'myapp://order/12345',
      hasApp: true,
    },
    {
      name: '상품 페이지 (앱 있음)',
      deeplink: 'myapp://product/67890',
      hasApp: true,
    },
    {
      name: '프로모션 페이지 (앱 없음)',
      deeplink: 'myapp://promotion/special',
      hasApp: false,
      storeUrl: 'https://smartstore.naver.com/mystore',
    },
    {
      name: '검색 결과 (앱 있음, 쿼리 파라미터 포함)',
      deeplink: 'myapp://search?q=shoes&category=fashion',
      hasApp: true,
    },
  ];

  scenarios.forEach((scenario, index) => {
    console.log(`\n📋 시나리오 ${index + 1}: ${scenario.name}`);
    console.log('입력:', scenario);

    const deeplinkInfo = parseDeeplink(scenario.deeplink);
    console.log('파싱 결과:', deeplinkInfo);
  });

  console.log('\n✅ 딥링크 시나리오 테스트 완료');
};

// 개발 환경에서 테스트 함수 노출
if (process.env.NODE_ENV === 'development') {
  window.testDeeplinkScenarios = testDeeplinkScenarios;
  window.handleKkoAlarmMessage = handleKkoAlarmMessage;
  console.log('🛠️ 개발 모드: window.testDeeplinkScenarios() 및 window.handleKkoAlarmMessage() 사용 가능');
}

export default {
  handleKkoAlarmMessage,
  testDeeplinkScenarios,
};
