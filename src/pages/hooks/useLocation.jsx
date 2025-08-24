import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Space, Typography, Tag, Button, Input, Row, Col, Alert, Breadcrumb, Tabs, Statistic } from 'antd'
import { ApiOutlined, LinkOutlined, PushpinOutlined, ReloadOutlined, CompassOutlined, PartitionOutlined, AimOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

// URL 정보 표시 데모
const LocationInfoDemo = () => {
  const location = useLocation()
  const parsedSearch = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const obj = {}
    params.forEach((v, k) => { obj[k] = v })
    return obj
  }, [location.search])

  return (
    <Card title="현재 Location 정보" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space wrap>
          <Tag color="blue">pathname: {location.pathname}</Tag>
          <Tag color="green">search: {location.search || '없음'}</Tag>
          <Tag color="orange">hash: {location.hash || '없음'}</Tag>
          <Tag color="purple">key: {location.key}</Tag>
        </Space>
        <Card size="small" title="쿼리 파라미터 파싱 결과">
          {Object.keys(parsedSearch).length === 0 ? (
            <Text type="secondary">파라미터 없음</Text>
          ) : (
            <Space wrap>
              {Object.entries(parsedSearch).map(([k, v]) => (
                <Tag key={k} color="geekblue">{k}: {v}</Tag>
              ))}
            </Space>
          )}
        </Card>
        <Alert type="info" showIcon message="location 객체는 불변" description="pathname/search/hash 변경 시 새 객체가 생성되므로 useEffect 의존성에 그대로 사용 가능" />
      </Space>
    </Card>
  )
}

// 탭 네비게이션 + URL 동기화 데모
const TabSyncDemo = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const activeKey = location.pathname.split('/').pop() || 'overview'

  const items = [
    { key: 'overview', label: 'Overview', children: <Text>개요 탭 내용</Text> },
    { key: 'spec', label: 'Spec', children: <Text>사양 탭 내용</Text> },
    { key: 'logs', label: 'Logs', children: <Text>로그 탭 내용</Text> }
  ]

  const onChange = (key) => {
    navigate(`/hooks/useLocation/${key}`)
  }

  return (
    <Card title="탭과 URL 동기화" size="small">
      <Tabs activeKey={activeKey} onChange={onChange} items={items} />
      <Alert style={{ marginTop: 12 }} type="success" showIcon message="현재 탭이 URL 마지막 세그먼트와 동기화됨" />
    </Card>
  )
}

// 브레드크럼 생성 데모
const BreadcrumbDemo = () => {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  const breadcrumbItems = [{ title: 'Home', href: '/' }]
  segments.forEach((seg, idx) => {
    const url = '/' + segments.slice(0, idx + 1).join('/')
    breadcrumbItems.push({ title: seg, href: url })
  })

  return (
    <Card title="Breadcrumb 생성" size="small">
      <Breadcrumb
        items={breadcrumbItems.map(b => ({ title: b.title }))}
      />
      <Paragraph style={{ marginTop: 12 }} type="secondary">
        pathname 세그먼트를 분해해 동적으로 Breadcrumb 구성
      </Paragraph>
    </Card>
  )
}

// 위치 변경 감시 + 로그 데모
const LocationWatcherDemo = () => {
  const location = useLocation()
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(h => [...h.slice(-9), { ts: Date.now(), path: location.pathname + location.search + location.hash }])
  }, [location])

  return (
    <Card title="위치 변경 감시" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text type="secondary">최근 이동 기록 (최신 10개)</Text>
        <Space direction="vertical" style={{ maxHeight: 160, overflowY: 'auto', width: '100%' }}>
          {history.slice().reverse().map((h, i) => (
            <Tag key={i} icon={<AimOutlined />}>{new Date(h.ts).toLocaleTimeString()} - {h.path}</Tag>
          ))}
        </Space>
      </Space>
    </Card>
  )
}

// 쿼리 파라미터 실시간 수정 데모
const QueryEditorDemo = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const [foo, setFoo] = useState(params.get('foo') || '')
  const [bar, setBar] = useState(params.get('bar') || '')

  const apply = () => {
    const next = new URLSearchParams()
    if (foo) next.set('foo', foo)
    if (bar) next.set('bar', bar)
    navigate({ pathname: location.pathname, search: next.toString() })
  }

  return (
    <Card title="쿼리 파라미터 편집" size="small">
      <Space>
        <Input placeholder="foo" value={foo} onChange={e => setFoo(e.target.value)} style={{ width: 120 }} />
        <Input placeholder="bar" value={bar} onChange={e => setBar(e.target.value)} style={{ width: 120 }} />
        <Button type="primary" onClick={apply} icon={<ReloadOutlined />}>적용</Button>
      </Space>
      <Paragraph style={{ marginTop: 12 }} type="secondary">URL을 새로고침 없이 업데이트</Paragraph>
    </Card>
  )
}

// 조건부 렌더링 데모
const ConditionalRenderDemo = () => {
  const location = useLocation()
  const isSettings = location.pathname.includes('settings')
  return (
    <Card title="조건부 렌더링 (pathname 검사)" size="small">
      {isSettings ? <Alert type="info" message="/settings 경로입니다" showIcon /> : <Alert type="warning" message="settings 경로가 아닙니다" showIcon />}
      <Paragraph style={{ marginTop: 12 }} type="secondary">pathname.includes("settings") 결과에 따라 UI 변경</Paragraph>
    </Card>
  )
}

// 메인 페이지
const UseLocationPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={1}><CompassOutlined style={{ color: '#13c2c2' }} /> useLocation Hook 예제</Title>
        <Paragraph style={{ fontSize: 16, color: '#666' }}>현재 URL 상태를 활용한 다양한 패턴을 학습하세요</Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <LocationInfoDemo />
        <QueryEditorDemo />
        <TabSyncDemo />
        <BreadcrumbDemo />
        <LocationWatcherDemo />
        <ConditionalRenderDemo />

        <Card title="useLocation 사용 가이드" style={{ background: '#e6fffb', border: '1px solid #87e8de' }}>
          <Row gutter={[16,16]}>
            <Col xs={24} md={12}>
              <Title level={5}>기본 사용</Title>
              <pre style={{ background: '#f6f6f6', padding: 12, fontSize: 12 }}>{`import { useLocation } from 'react-router-dom'

const location = useLocation()
console.log(location.pathname, location.search, location.hash)`}</pre>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>쿼리 파라미터 파싱</Title>
              <pre style={{ background: '#f6f6f6', padding: 12, fontSize: 12 }}>{`const params = new URLSearchParams(location.search)
const foo = params.get('foo')`}</pre>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>탭 동기화</Title>
              <pre style={{ background: '#f6f6f6', padding: 12, fontSize: 12 }}>{`const active = location.pathname.split('/').pop()`}</pre>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>효과 트리거</Title>
              <pre style={{ background: '#f6f6f6', padding: 12, fontSize: 12 }}>{`useEffect(() => {
  // 경로 변경 시 실행
}, [location.pathname])`}</pre>
            </Col>
          </Row>
          <Alert style={{ marginTop: 16 }} type="warning" showIcon message="주의" description="location 객체 자체는 매 변경마다 새로 생성되니 필요한 속성만 의존성 배열에 넣어 불필요한 useEffect 실행을 줄일 수 있음" />
        </Card>
      </Space>
    </div>
  )
}

export default UseLocationPage
