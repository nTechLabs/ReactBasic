// React hooks와 라우터를 위한 import
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// Ant Design UI 컴포넌트들을 import
import {
  Card,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Input,
  List,
  Tag,
  Alert,
  Descriptions,
  Breadcrumb,
  Steps,
} from 'antd';
// Ant Design 아이콘들을 import
import {
  LinkOutlined,
  UserOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  SearchOutlined,
  HomeOutlined,
  BookOutlined,
  SettingOutlined,
} from '@ant-design/icons';

// Typography 컴포넌트들을 구조 분해 할당으로 추출
const { Title, Paragraph, Text } = Typography;

// =====================================
// 1. 기본 useParams 예제 - URL 파라미터 읽기
// =====================================
const BasicParamsDemo = () => {
  // useParams로 현재 URL의 파라미터들을 가져옴
  const params = useParams();
  const navigate = useNavigate();
  const [customId, setCustomId] = useState('');

  // 샘플 라우트로 이동하는 함수
  const navigateToSample = (id, name) => {
    navigate(`/hooks/useParams/user/${id}/${name}`);
  };

  return (
    <Card title="기본 useParams 사용법">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useParams 패턴 설명 */}
        <Alert
          message="🔗 useParams 패턴: URL 파라미터 추출하기"
          description={
            <div>
              <Text strong style={{ color: '#1890ff' }}>
                이 예제에서 useParams가 사용되는 방식:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>
                  <Text code>const params = useParams()</Text> - 현재 URL의 모든 파라미터 객체 반환
                </li>
                <li>
                  <Text code>params.id</Text> - 특정 파라미터 값 접근
                </li>
                <li>
                  라우트 패턴: <Text code>/user/:id/:name</Text>
                </li>
                <li>실시간으로 URL 변경 시 자동 업데이트</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: URL 경로에서 동적 파라미터를 추출하여 컴포넌트에서 활용할 수 있습니다.
                페이지 새로고침 없이도 URL 변경에 따라 컴포넌트가 자동으로 업데이트됩니다.
              </Text>
            </div>
          }
          type="info"
          showIcon
          style={{ backgroundColor: '#e6f7ff', border: '1px solid #1890ff' }}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="현재 URL 파라미터">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Descriptions size="small" column={1} bordered>
                  <Descriptions.Item label="전체 params 객체">
                    <Text code>{JSON.stringify(params, null, 2)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="params.id">
                    <Text strong>{params.id || '없음'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="params.name">
                    <Text strong>{params.name || '없음'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="현재 URL">
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {window.location.pathname}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card size="small" title="네비게이션 테스트">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>샘플 라우트로 이동:</Text>
                <Space wrap>
                  <Button
                    onClick={() => navigateToSample('123', 'john')}
                    type="primary"
                    size="small"
                  >
                    User 123 (John)
                  </Button>
                  <Button onClick={() => navigateToSample('456', 'jane')} size="small">
                    User 456 (Jane)
                  </Button>
                  <Button onClick={() => navigateToSample('789', 'admin')} size="small">
                    User 789 (Admin)
                  </Button>
                </Space>

                <div style={{ marginTop: 16 }}>
                  <Text>커스텀 ID로 이동:</Text>
                  <Input.Group compact style={{ marginTop: 8 }}>
                    <Input
                      style={{ width: '60%' }}
                      placeholder="사용자 ID 입력"
                      value={customId}
                      onChange={(e) => setCustomId(e.target.value)}
                    />
                    <Button
                      type="primary"
                      onClick={() => navigateToSample(customId, 'custom')}
                      disabled={!customId}
                    >
                      이동
                    </Button>
                  </Input.Group>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Alert
          message="🔍 URL 파라미터 동작 원리"
          description="라우트 패턴에서 :id, :name과 같은 동적 세그먼트가 useParams 객체의 키가 됩니다. URL이 변경되면 컴포넌트가 자동으로 리렌더링되어 새로운 파라미터 값을 반영합니다."
          type="success"
          showIcon
        />
      </Space>
    </Card>
  );
};

// =====================================
// 2. 사용자 프로필 페이지 예제
// =====================================
const UserProfileDemo = () => {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // URL 파라미터가 변경될 때마다 사용자 데이터 로드
  useEffect(() => {
    if (id) {
      setLoading(true);
      // API 호출 시뮬레이션
      setTimeout(() => {
        const sampleUsers = {
          123: {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Developer',
            department: 'Engineering',
          },
          456: {
            id: '456',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'Designer',
            department: 'Design',
          },
          789: {
            id: '789',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'Administrator',
            department: 'IT',
          },
        };
        const user = sampleUsers[id] || {
          id,
          name: name || 'Unknown User',
          email: `${name || 'user'}@example.com`,
          role: 'User',
          department: 'General',
        };
        setUserData(user);
        setLoading(false);
      }, 500);
    }
  }, [id, name]); // useParams 값이 변경될 때마다 실행

  return (
    <Card title="사용자 프로필 페이지 (useParams + useEffect)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* useParams + useEffect 패턴 설명 */}
        <Alert
          message="👤 useParams + useEffect 패턴: 동적 데이터 로딩"
          description={
            <div>
              <Text strong style={{ color: '#52c41a' }}>
                이 예제에서 사용되는 패턴:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>
                  <Text code>{'const {id, name} = useParams()'}</Text> - 구조 분해로 특정 파라미터
                  추출
                </li>
                <li>
                  <Text code>{'useEffect(() => {...}, [id, name])'}</Text> - 파라미터 변경 시 데이터
                  로드
                </li>
                <li>URL 파라미터 기반으로 API 호출 시뮬레이션</li>
                <li>로딩 상태 관리 및 에러 처리</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: URL 파라미터가 변경될 때마다 해당 사용자의 데이터를 새로 불러오는 실제 웹
                애플리케이션에서 자주 사용되는 패턴입니다.
              </Text>
            </div>
          }
          type="success"
          showIcon
          style={{ backgroundColor: '#f6ffed', border: '1px solid #52c41a' }}
        />

        {/* 브레드크럼 네비게이션 */}
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/hooks">
              <HomeOutlined /> Hooks
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/hooks/useParams">useParams</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <UserOutlined /> 사용자 {id}
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* 사용자 정보 표시 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Card
              size="small"
              title={
                <Space>
                  <UserOutlined />
                  사용자 정보
                </Space>
              }
              loading={loading}
            >
              {userData && (
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="사용자 ID">
                    <Tag color="blue">{userData.id}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="이름">
                    <Text strong>{userData.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="이메일">{userData.email}</Descriptions.Item>
                  <Descriptions.Item label="역할">
                    <Tag color="green">{userData.role}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="부서">{userData.department}</Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card size="small" title="액션">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  block
                  onClick={() => alert(`${userData?.name} 편집 페이지로 이동`)}
                >
                  프로필 편집
                </Button>
                <Button
                  icon={<SettingOutlined />}
                  block
                  onClick={() => alert(`${userData?.name} 설정 페이지로 이동`)}
                >
                  계정 설정
                </Button>
                <Button
                  icon={<ArrowLeftOutlined />}
                  block
                  onClick={() => navigate('/hooks/useParams')}
                >
                  목록으로 돌아가기
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        <Alert
          message="🔄 실시간 파라미터 추적"
          description={`현재 URL 파라미터: id=${id}, name=${name}. 다른 사용자 버튼을 클릭하면 URL과 데이터가 즉시 변경됩니다.`}
          type="info"
          showIcon
        />
      </Space>
    </Card>
  );
};

// =====================================
// 3. 다중 파라미터와 중첩 라우팅 예제
// =====================================
const NestedRoutingDemo = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState([]);

  // 파라미터 기반 네비게이션 함수들
  const navigateToCategory = (category) => {
    navigate(`/hooks/useParams/shop/${category}`);
    setSearchHistory((prev) => [
      ...prev,
      { type: 'category', value: category, time: new Date().toLocaleTimeString() },
    ]);
  };

  const navigateToProduct = (category, productId) => {
    navigate(`/hooks/useParams/shop/${category}/product/${productId}`);
    setSearchHistory((prev) => [
      ...prev,
      { type: 'product', value: `${category}/${productId}`, time: new Date().toLocaleTimeString() },
    ]);
  };

  const categories = ['electronics', 'books', 'clothing', 'home', 'sports'];
  const products = {
    electronics: ['laptop', 'phone', 'tablet'],
    books: ['novel', 'science', 'history'],
    clothing: ['shirt', 'pants', 'shoes'],
    home: ['furniture', 'kitchen', 'decor'],
    sports: ['fitness', 'outdoor', 'team'],
  };

  return (
    <Card title="다중 파라미터와 중첩 라우팅 (useParams)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* 다중 파라미터 패턴 설명 */}
        <Alert
          message="🏪 다중 파라미터 패턴: 복잡한 URL 구조 처리"
          description={
            <div>
              <Text strong style={{ color: '#722ed1' }}>
                이 예제에서 다중 useParams 사용법:
              </Text>
              <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                <li>
                  <Text code>/shop/:category</Text> - 카테고리 파라미터
                </li>
                <li>
                  <Text code>/shop/:category/product/:productId</Text> - 중첩된 파라미터
                </li>
                <li>
                  <Text code>params.category, params.productId</Text> - 여러 파라미터 동시 접근
                </li>
                <li>조건부 렌더링으로 URL 깊이에 따른 다른 UI 표시</li>
              </ul>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 핵심: 쇼핑몰이나 블로그 같은 복잡한 애플리케이션에서 사용되는 계층적 URL 구조를
                useParams로 효과적으로 처리할 수 있습니다.
              </Text>
            </div>
          }
          type="warning"
          showIcon
          style={{ backgroundColor: '#f9f0ff', border: '1px solid #722ed1' }}
        />

        {/* 현재 URL 상태 표시 */}
        <Card size="small" title="현재 URL 분석">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Descriptions size="small" column={1}>
                <Descriptions.Item label="전체 파라미터">
                  <Text code style={{ fontSize: '11px' }}>
                    {JSON.stringify(params, null, 2)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="카테고리">
                  {params.category ? (
                    <Tag color="blue">{params.category}</Tag>
                  ) : (
                    <Text type="secondary">없음</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="상품 ID">
                  {params.productId ? (
                    <Tag color="green">{params.productId}</Tag>
                  ) : (
                    <Text type="secondary">없음</Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={12}>
              <div>
                <Text strong>URL 깊이 분석:</Text>
                <Steps
                  current={params.productId ? 2 : params.category ? 1 : 0}
                  size="small"
                  style={{ marginTop: 8 }}
                >
                  <Steps.Step title="홈" description="/hooks/useParams" />
                  <Steps.Step title="카테고리" description={params.category || '미선택'} />
                  <Steps.Step title="상품" description={params.productId || '미선택'} />
                </Steps>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 네비게이션 컨트롤 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" title="카테고리 선택">
              <Space wrap>
                {categories.map((category) => (
                  <Button
                    key={category}
                    type={params.category === category ? 'primary' : 'default'}
                    size="small"
                    onClick={() => navigateToCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card size="small" title="상품 선택 (카테고리 필요)">
              {params.category ? (
                <Space wrap>
                  {products[params.category]?.map((product) => (
                    <Button
                      key={product}
                      type={params.productId === product ? 'primary' : 'default'}
                      size="small"
                      onClick={() => navigateToProduct(params.category, product)}
                    >
                      {product}
                    </Button>
                  ))}
                </Space>
              ) : (
                <Text type="secondary">먼저 카테고리를 선택하세요</Text>
              )}
            </Card>
          </Col>
        </Row>

        {/* 검색 히스토리 */}
        <Card size="small" title="네비게이션 히스토리">
          <List
            size="small"
            dataSource={searchHistory.slice(-5)}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <Tag color={item.type === 'category' ? 'blue' : 'green'}>{item.type}</Tag>
                  <Text>{item.value}</Text>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    {item.time}
                  </Text>
                </Space>
              </List.Item>
            )}
            locale={{ emptyText: '네비게이션 기록이 없습니다' }}
          />
        </Card>

        <Alert
          message="🎯 중첩 라우팅의 장점"
          description="URL 구조가 명확하고 사용자가 현재 위치를 쉽게 파악할 수 있습니다. 북마크나 뒤로가기 버튼도 자연스럽게 작동합니다."
          type="success"
          showIcon
        />
      </Space>
    </Card>
  );
};

// =====================================
// 메인 페이지 컴포넌트
// =====================================
const UseParamsPage = () => {
  const params = useParams();

  // URL 파라미터에 따라 다른 컴포넌트 렌더링
  const renderContent = () => {
    if (params.id && params.name) {
      return <UserProfileDemo />;
    } else if (params.category || params.productId) {
      return <NestedRoutingDemo />;
    } else {
      return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <BasicParamsDemo />
          <NestedRoutingDemo />
        </Space>
      );
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 페이지 제목과 설명 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <LinkOutlined style={{ color: '#1890ff' }} />
          useParams Hook 예제
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          React Router의 useParams를 사용한 URL 파라미터 추출 패턴을 학습해보세요
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* useParams 기본 개념 도식화 */}
        <Card
          title="📚 useParams 기본 개념"
          style={{
            backgroundColor: '#e6f7ff',
            border: '2px solid #1890ff',
            borderRadius: '12px',
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 기본 설명 */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Title level={4} style={{ color: '#1890ff', marginBottom: '8px' }}>
                🎯 useParams는 React Router에서 URL 경로의 동적 파라미터를 추출하는 Hook입니다
              </Title>
              <Text type="secondary">
                라우트 패턴에서 정의한 동적 세그먼트(:id, :name 등)의 실제 값을 컴포넌트에서 사용할
                수 있게 해줍니다
              </Text>
            </div>

            {/* 구조 도식화 */}
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} lg={20}>
                <div
                  style={{
                    padding: '20px',
                    backgroundColor: '#fff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    position: 'relative',
                  }}
                >
                  {/* 코드 구조 */}
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '16px',
                      textAlign: 'center',
                      marginBottom: '20px',
                      padding: '12px',
                      backgroundColor: '#f6f6f6',
                      borderRadius: '6px',
                      border: '1px solid #d9d9d9',
                    }}
                  >
                    <Text code style={{ fontSize: '16px' }}>
                      const params = useParams()
                    </Text>
                  </div>

                  {/* 라우팅 패턴 비교 */}
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12}>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '16px',
                          backgroundColor: '#fff2e8',
                          borderRadius: '8px',
                          border: '2px solid #fa8c16',
                        }}
                      >
                        <Title level={5} style={{ color: '#fa8c16', margin: '0 0 8px 0' }}>
                          📍 라우트 패턴
                        </Title>
                        <Text style={{ fontSize: '13px' }}>
                          • <Text code>/user/:id</Text>
                          <br />• <Text code>/user/:id/:name</Text>
                          <br />• <Text code>/shop/:category/product/:productId</Text>
                          <br />• 동적 세그먼트 정의
                        </Text>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '16px',
                          backgroundColor: '#e6f7ff',
                          borderRadius: '8px',
                          border: '2px solid #1890ff',
                        }}
                      >
                        <Title level={5} style={{ color: '#1890ff', margin: '0 0 8px 0' }}>
                          🔗 실제 URL
                        </Title>
                        <Text style={{ fontSize: '13px' }}>
                          • <Text code>/user/123</Text>
                          <br />• <Text code>/user/123/john</Text>
                          <br />• <Text code>/shop/electronics/product/laptop</Text>
                          <br />• 실제 파라미터 값
                        </Text>
                      </div>
                    </Col>
                  </Row>

                  {/* useParams 작동 원리 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '16px', color: '#722ed1' }}
                    >
                      🔍 useParams 작동 원리
                    </Title>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#1890ff',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          1️⃣
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>URL 매칭</strong>
                          <br />
                          라우터가 현재 URL을
                          <br />
                          패턴과 매칭
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#fa8c16',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          2️⃣
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>파라미터 추출</strong>
                          <br />
                          동적 세그먼트에서
                          <br />
                          실제 값 추출
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#52c41a',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          3️⃣
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>객체 생성</strong>
                          <br />
                          파라미터 이름을 키로
                          <br />
                          객체 생성
                        </Text>
                      </div>

                      <div style={{ color: '#bfbfbf', fontSize: '18px' }}>→</div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '150px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#722ed1',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          4️⃣
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>컴포넌트 사용</strong>
                          <br />
                          useParams()로
                          <br />
                          파라미터 객체 반환
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* 주요 사용 사례 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '16px', color: '#eb2f96' }}
                    >
                      💡 주요 사용 사례
                    </Title>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#1890ff',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          👤
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>사용자 프로필</strong>
                          <br />
                          사용자 ID로
                          <br />
                          프로필 페이지
                        </Text>
                      </div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#52c41a',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          📝
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>게시글 상세</strong>
                          <br />
                          게시글 ID로
                          <br />
                          상세 페이지
                        </Text>
                      </div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#fa8c16',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          🛍️
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>상품 페이지</strong>
                          <br />
                          카테고리/상품ID로
                          <br />
                          상품 상세
                        </Text>
                      </div>

                      <div style={{ flex: 1, textAlign: 'center', minWidth: '140px' }}>
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#722ed1',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px',
                            fontSize: '20px',
                          }}
                        >
                          ⚙️
                        </div>
                        <Text style={{ fontSize: '12px', display: 'block' }}>
                          <strong>설정 페이지</strong>
                          <br />
                          섹션별로
                          <br />
                          설정 관리
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* 실제 사용 예제 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '12px', color: '#13c2c2' }}
                    >
                      💡 실제 사용 예제
                    </Title>

                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <div
                          style={{
                            padding: '12px',
                            backgroundColor: '#f6f6f6',
                            borderRadius: '6px',
                            border: '1px solid #d9d9d9',
                          }}
                        >
                          <Text
                            strong
                            style={{
                              fontSize: '12px',
                              color: '#666',
                              display: 'block',
                              marginBottom: '8px',
                            }}
                          >
                            📝 기본 파라미터 추출
                          </Text>
                          <pre
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '10px',
                              lineHeight: '1.4',
                              fontFamily: 'monospace',
                            }}
                          >
                            {`// 라우트: /user/:id
const UserProfile = () => {
  const { id } = useParams()
  
  useEffect(() => {
    fetchUser(id)
  }, [id])
  
  return <div>사용자 {id}</div>
}`}
                          </pre>
                          <div
                            style={{
                              padding: '6px',
                              backgroundColor: '#e8f4fd',
                              borderRadius: '4px',
                              fontSize: '9px',
                              color: '#1890ff',
                              lineHeight: '1.3',
                            }}
                          >
                            <Text strong style={{ fontSize: '9px', color: '#1890ff' }}>
                              💡 장점:
                            </Text>
                            URL에서 사용자 ID를 직접 추출하여 해당 사용자 데이터를 로드. URL 변경 시
                            자동으로 새로운 사용자 정보 표시.
                          </div>
                        </div>
                      </Col>

                      <Col xs={24} md={12}>
                        <div
                          style={{
                            padding: '12px',
                            backgroundColor: '#f0f6ff',
                            borderRadius: '6px',
                            border: '1px solid #d6e4ff',
                          }}
                        >
                          <Text
                            strong
                            style={{
                              fontSize: '12px',
                              color: '#1890ff',
                              display: 'block',
                              marginBottom: '8px',
                            }}
                          >
                            📋 다중 파라미터 처리
                          </Text>
                          <pre
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '10px',
                              lineHeight: '1.4',
                              fontFamily: 'monospace',
                            }}
                          >
                            {`// 라우트: /shop/:category/:productId
const ProductDetail = () => {
  const { category, productId } = useParams()
  
  useEffect(() => {
    fetchProduct(category, productId)
  }, [category, productId])
  
  return <div>{category} - {productId}</div>
}`}
                          </pre>
                          <div
                            style={{
                              padding: '6px',
                              backgroundColor: '#e6f7ff',
                              borderRadius: '4px',
                              fontSize: '9px',
                              color: '#1890ff',
                              lineHeight: '1.3',
                            }}
                          >
                            <Text strong style={{ fontSize: '9px', color: '#1890ff' }}>
                              💡 장점:
                            </Text>
                            여러 파라미터를 동시에 추출하여 복잡한 URL 구조 처리. 카테고리와
                            상품ID로 정확한 상품 정보 로드 가능.
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* 주의사항 */}
                  <div style={{ marginTop: '24px' }}>
                    <Title
                      level={5}
                      style={{ textAlign: 'center', marginBottom: '12px', color: '#fa541c' }}
                    >
                      ⚠️ useParams 사용 시 주의사항
                    </Title>

                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#fff2e8',
                        borderRadius: '8px',
                        border: '2px solid #fa541c',
                      }}
                    >
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Text
                            strong
                            style={{ color: '#fa541c', display: 'block', marginBottom: '8px' }}
                          >
                            🚨 타입 안정성
                          </Text>
                          <ul
                            style={{
                              margin: '8px 0',
                              paddingLeft: '16px',
                              fontSize: '11px',
                              lineHeight: '1.6',
                              color: '#666',
                            }}
                          >
                            <li>모든 파라미터는 문자열 타입</li>
                            <li>숫자 필요시 Number() 변환</li>
                            <li>undefined 체크 필수</li>
                            <li>잘못된 파라미터 검증 필요</li>
                          </ul>
                        </Col>

                        <Col xs={24} md={12}>
                          <Text
                            strong
                            style={{ color: '#fa541c', display: 'block', marginBottom: '8px' }}
                          >
                            💡 올바른 사용법
                          </Text>
                          <ul
                            style={{
                              margin: '8px 0',
                              paddingLeft: '16px',
                              fontSize: '11px',
                              lineHeight: '1.6',
                              color: '#666',
                            }}
                          >
                            <li>라우트 패턴과 일치하는 컴포넌트에서만 사용</li>
                            <li>파라미터 존재 여부 체크</li>
                            <li>에러 처리 및 fallback UI 제공</li>
                            <li>useEffect 의존성 배열에 포함</li>
                          </ul>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* 컨텐츠 렌더링 */}
        {renderContent()}

        {/* useParams 사용법 가이드 */}
        <Card
          title="useParams 사용법 가이드"
          style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={5}>1. 기본 사용법</Title>
              <div
                style={{
                  backgroundColor: '#f6f6f6',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <pre>{`// 라우트 설정
<Route path="/user/:id" element={<UserPage />} />

// 컴포넌트에서 사용
const UserPage = () => {
  const { id } = useParams()
  return <div>사용자 ID: {id}</div>
}`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>2. 다중 파라미터</Title>
              <div
                style={{
                  backgroundColor: '#f6f6f6',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <pre>{`// 라우트 설정
<Route path="/shop/:category/:id" element={<Product />} />

// 컴포넌트에서 사용
const Product = () => {
  const { category, id } = useParams()
  return <div>{category} - {id}</div>
}`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>3. 타입 변환</Title>
              <div
                style={{
                  backgroundColor: '#f6f6f6',
                  padding: '12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <pre>{`const DetailPage = () => {
  const { id } = useParams()
  const numericId = Number(id)
  
  if (isNaN(numericId)) {
    return <div>잘못된 ID</div>
  }
  
  return <div>ID: {numericId}</div>
}`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>4. 주의사항</Title>
              <ul style={{ fontSize: '12px', margin: 0 }}>
                <li>React Router 환경에서만 동작</li>
                <li>모든 파라미터는 문자열 타입</li>
                <li>파라미터 존재 여부 확인 필요</li>
                <li>URL 변경 시 컴포넌트 자동 리렌더링</li>
              </ul>
            </Col>
          </Row>

          <Alert
            message="useParams vs useSearchParams"
            description="useParams는 경로 파라미터(/user/:id)를, useSearchParams는 쿼리 문자열(?name=value)을 처리합니다. 둘 다 URL 기반 상태 관리에 사용됩니다."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Card>
      </Space>
    </div>
  );
};

// 컴포넌트를 기본 내보내기로 설정
export default UseParamsPage;
