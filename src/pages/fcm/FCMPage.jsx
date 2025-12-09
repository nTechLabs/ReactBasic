import { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, List, Badge, notification, Alert, Divider } from 'antd';
import { BellOutlined, SendOutlined, ClearOutlined, NotificationOutlined } from '@ant-design/icons';
import { handleKkoAlarmMessage } from '../../utils/kkoAlarmMessageHandler';

const { Title, Text, Paragraph } = Typography;

const FCMPage = () => {
  const [messages, setMessages] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // 알림 권한 상태 확인
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      notification.error({
        message: '알림 지원 안 됨',
        description: '이 브라우저는 알림을 지원하지 않습니다.',
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        notification.success({
          message: '알림 권한 허용됨',
          description: '알림을 받을 수 있습니다.',
        });
      } else if (permission === 'denied') {
        notification.warning({
          message: '알림 권한 거부됨',
          description: '브라우저 설정에서 알림 권한을 허용해주세요.',
        });
      }
    } catch (error) {
      console.error('알림 권한 요청 오류:', error);
      notification.error({
        message: '오류 발생',
        description: '알림 권한 요청 중 오류가 발생했습니다.',
      });
    }
  };

  // 테스트 알림 메시지 전송
  const sendTestMessage = (messageType) => {
    const testMessages = {
      withApp: {
        title: '새로운 주문이 도착했습니다 🎉',
        body: '고객님의 주문을 확인해주세요.',
        deeplink: 'myapp://order/12345',
        hasApp: true,
      },
      withoutApp: {
        title: '특별 할인 이벤트! 💝',
        body: '지금 앱을 다운로드하고 혜택을 받으세요.',
        deeplink: 'myapp://promotion/special',
        hasApp: false,
        storeUrl: 'https://smartstore.naver.com/mystore',
      },
      product: {
        title: '상품 재입고 알림 📦',
        body: '찜하신 상품이 재입고 되었습니다.',
        deeplink: 'myapp://product/67890',
        hasApp: true,
      },
    };

    const message = testMessages[messageType];
    if (!message) return;

    // 메시지 목록에 추가
    const newMessage = {
      id: Date.now(),
      ...message,
      timestamp: new Date().toLocaleTimeString('ko-KR'),
    };
    setMessages((prev) => [newMessage, ...prev]);

    // 브라우저 알림 표시
    if (notificationPermission === 'granted') {
      showNotification(newMessage);
    } else {
      notification.info({
        message: '알림 권한 필요',
        description: '브라우저 알림을 보려면 권한을 허용해주세요.',
      });
    }
  };

  // 브라우저 알림 표시
  const showNotification = (message) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const notif = new Notification(message.title, {
      body: message.body,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: `fcm-${message.id}`,
      requireInteraction: true,
      data: {
        deeplink: message.deeplink,
        hasApp: message.hasApp,
        storeUrl: message.storeUrl,
      },
    });

    // 알림 클릭 이벤트 처리
    notif.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notif.close();

      // kkoAlarmMessageHandler를 통해 deeplink 처리
      handleKkoAlarmMessage({
        deeplink: message.deeplink,
        hasApp: message.hasApp,
        storeUrl: message.storeUrl || 'https://smartstore.naver.com/default',
      });
    };
  };

  // 메시지 클릭 핸들러
  const handleMessageClick = (message) => {
    handleKkoAlarmMessage({
      deeplink: message.deeplink,
      hasApp: message.hasApp,
      storeUrl: message.storeUrl || 'https://smartstore.naver.com/default',
    });
  };

  // 메시지 목록 초기화
  const clearMessages = () => {
    setMessages([]);
    notification.success({
      message: '메시지 초기화 완료',
      description: '모든 메시지가 삭제되었습니다.',
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <NotificationOutlined style={{ color: '#1890ff' }} /> FCM 알림 테스트
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#666' }}>
              Firebase Cloud Messaging 알림 기능을 테스트해보세요
            </Paragraph>
          </div>

          <Alert
            message="알림 권한 상태"
            description={
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text>
                  현재 상태:{' '}
                  <Badge
                    status={
                      notificationPermission === 'granted'
                        ? 'success'
                        : notificationPermission === 'denied'
                        ? 'error'
                        : 'warning'
                    }
                    text={
                      notificationPermission === 'granted'
                        ? '허용됨'
                        : notificationPermission === 'denied'
                        ? '거부됨'
                        : '미설정'
                    }
                  />
                </Text>
                {notificationPermission !== 'granted' && (
                  <Button
                    type="primary"
                    icon={<BellOutlined />}
                    onClick={requestNotificationPermission}
                  >
                    알림 권한 요청
                  </Button>
                )}
              </Space>
            }
            type={notificationPermission === 'granted' ? 'success' : 'warning'}
            showIcon
          />
        </Space>
      </Card>

      <Card title="테스트 메시지 전송">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph type="secondary">
            다양한 시나리오의 테스트 메시지를 전송할 수 있습니다.
          </Paragraph>

          <Space wrap>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => sendTestMessage('withApp')}
              size="large"
            >
              앱 있음 - 주문 알림
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => sendTestMessage('withoutApp')}
              size="large"
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              앱 없음 - 프로모션 알림
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => sendTestMessage('product')}
              size="large"
              style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
            >
              앱 있음 - 상품 재입고
            </Button>
          </Space>

          <Divider />

          <Alert
            message="동작 방식"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li>
                  <strong>앱이 있는 경우:</strong> 앱을 실행하고 deeplink로 특정 페이지로 이동합니다.
                </li>
                <li>
                  <strong>앱이 없는 경우:</strong> 스마트 스토어로 이동하여 앱을 다운로드할 수 있습니다.
                </li>
                <li>
                  <strong>알림 클릭:</strong> 브라우저 알림 또는 아래 메시지 목록을 클릭하여 동작을 테스트할 수
                  있습니다.
                </li>
              </ul>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Card
        title={
          <Space>
            <span>수신된 메시지</span>
            <Badge count={messages.length} />
          </Space>
        }
        extra={
          messages.length > 0 && (
            <Button icon={<ClearOutlined />} onClick={clearMessages}>
              초기화
            </Button>
          )
        }
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            <BellOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>아직 수신된 메시지가 없습니다.</div>
            <div>위의 버튼을 클릭하여 테스트 메시지를 전송해보세요.</div>
          </div>
        ) : (
          <List
            dataSource={messages}
            renderItem={(message) => (
              <List.Item
                key={message.id}
                onClick={() => handleMessageClick(message)}
                style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <List.Item.Meta
                  avatar={<NotificationOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                  title={
                    <Space>
                      <span>{message.title}</span>
                      <Badge
                        status={message.hasApp ? 'success' : 'warning'}
                        text={message.hasApp ? '앱 있음' : '앱 없음'}
                      />
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Text>{message.body}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Deeplink: {message.deeplink}
                      </Text>
                      {message.storeUrl && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Store: {message.storeUrl}
                        </Text>
                      )}
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        수신 시간: {message.timestamp}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Card>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Title level={4}>📝 구현 기능</Title>
          <ul style={{ marginBottom: 0 }}>
            <li>브라우저 Notification API를 이용한 알림 표시</li>
            <li>알림 클릭 시 deeplink 처리 (앱 실행 또는 특정 페이지 이동)</li>
            <li>앱이 없는 경우 스마트 스토어로 자동 이동</li>
            <li>kkoAlarmMessageHandler 모듈을 통한 메시지 처리 로직 분리</li>
            <li>다양한 시나리오의 테스트 메시지 지원</li>
          </ul>
        </Space>
      </Card>
    </Space>
  );
};

export default FCMPage;
