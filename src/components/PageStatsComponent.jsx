import { Card, Typography, Space, Tag, Button, Divider, Row, Col, Progress, Statistic, Badge } from 'antd'
import { usePageStore } from '../store/pageStore'
import { 
  EyeOutlined, 
  ClockCircleOutlined, 
  LaptopOutlined, 
  GlobalOutlined,
  HistoryOutlined,
  ClearOutlined,
  HeartOutlined,
  BookOutlined,
  WifiOutlined,
  ExclamationCircleOutlined,
  RocketOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const PageStatsComponent = () => {
  const { 
    currentPage, 
    currentPath, 
    visitHistory, 
    browserInfo, 
    userPreferences,
    appState,
    userData,
    notifications,
    theme,
    getPageStats,
    clearHistory,
    getPreviousPage,
    getAppSummary,
    getSessionDuration,
    addToFavorites,
    removeFromFavorites,
    isFavoritePage
  } = usePageStore()

  const pageStats = getPageStats()
  const totalVisits = Object.values(pageStats).reduce((sum, count) => sum + count, 0)
  const mostVisitedPage = Object.entries(pageStats).reduce((a, b) => 
    pageStats[a[0]] > pageStats[b[0]] ? a : b
  )[0]
  const appSummary = getAppSummary()
  const sessionMinutes = Math.floor(getSessionDuration() / 1000 / 60)
  const isFavorite = isFavoritePage()

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(currentPath)
    } else {
      addToFavorites(currentPath)
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 현재 페이지 정보 */}
      <Card 
        title={
          <Space>
            <EyeOutlined />
            현재 페이지 정보
          </Space>
        }
        size="small"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>페이지 제목:</Text>
            <br />
            <Text>{currentPage.title}</Text>
          </Col>
          <Col span={12}>
            <Text strong>페이지 경로:</Text>
            <br />
            <Text code>{currentPath}</Text>
          </Col>
        </Row>
        <Divider />
        <Paragraph>
          <Text strong>설명:</Text> {currentPage.description}
        </Paragraph>
        <Button
          type={isFavorite ? "primary" : "default"}
          icon={<HeartOutlined />}
          size="small"
          onClick={handleToggleFavorite}
          style={{ color: isFavorite ? '#ff4d4f' : undefined }}
        >
          {isFavorite ? '즐겨찾기 제거' : '즐겨찾기 추가'}
        </Button>
      </Card>

      {/* 앱 상태 요약 */}
      <Card 
        title={
          <Space>
            <RocketOutlined />
            앱 상태 요약
          </Space>
        }
        size="small"
      >
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Statistic
              title="세션 시간"
              value={sessionMinutes}
              suffix="분"
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={6}>
            <Badge status={appState.isOnline ? "success" : "error"} text={appState.isOnline ? "온라인" : "오프라인"}>
              <Statistic
                title="연결 상태"
                value=""
                prefix={<WifiOutlined />}
              />
            </Badge>
          </Col>
          <Col span={6}>
            <Statistic
              title="오류 수"
              value={appState.errorCount}
              prefix={<ExclamationCircleOutlined style={{ color: appState.errorCount > 0 ? '#ff4d4f' : '#52c41a' }} />}
              valueStyle={{ color: appState.errorCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="알림"
              value={notifications.length}
              prefix={<BookOutlined />}
            />
          </Col>
        </Row>
        
        {/* 성능 메트릭 추가 */}
        <Divider />
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic
              title="로드 시간"
              value={appState.performanceMetrics.loadTime}
              suffix="초"
              precision={2}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="렌더 시간"
              value={appState.performanceMetrics.renderTime}
              suffix="초"
              precision={2}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="메모리 사용량"
              value={appState.performanceMetrics.memoryUsage}
              suffix="MB"
              precision={1}
            />
          </Col>
        </Row>
        
        <Divider />
        <Row gutter={16}>
          <Col span={8}>
            <Text strong>현재 테마:</Text>
            <br />
            <Tag color={theme === 'dark' ? 'blue' : 'orange'}>{theme === 'dark' ? '다크' : '라이트'}</Tag>
          </Col>
          <Col span={8}>
            <Text strong>즐겨찾기:</Text>
            <br />
            <Text>{userData.favoritePages.length}개 페이지</Text>
          </Col>
          <Col span={8}>
            <Text strong>북마크:</Text>
            <br />
            <Text>{userData.bookmarks.length}개 항목</Text>
          </Col>
        </Row>
      </Card>

      {/* 방문 통계 */}
      <Card 
        title={
          <Space>
            <HistoryOutlined />
            페이지 방문 통계
          </Space>
        }
        size="small"
        extra={
          <Button 
            size="small" 
            icon={<ClearOutlined />} 
            onClick={clearHistory}
            danger
          >
            기록 초기화
          </Button>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Text strong>총 방문 수:</Text>
              <br />
              <Text style={{ fontSize: '18px', color: '#1890ff' }}>{totalVisits}</Text>
            </Col>
            <Col span={8}>
              <Text strong>고유 페이지:</Text>
              <br />
              <Text style={{ fontSize: '18px', color: '#52c41a' }}>{Object.keys(pageStats).length}</Text>
            </Col>
            <Col span={8}>
              <Text strong>가장 많이 방문:</Text>
              <br />
              <Text style={{ fontSize: '18px', color: '#fa8c16' }}>{mostVisitedPage}</Text>
            </Col>
          </Row>
          
          <Divider />
          
          <Title level={5}>페이지별 방문 횟수:</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {Object.entries(pageStats).map(([path, count]) => {
              const percentage = (count / totalVisits) * 100
              return (
                <div key={path} style={{ width: '100%' }}>
                  <Row justify="space-between">
                    <Col>
                      <Text code>{path}</Text>
                    </Col>
                    <Col>
                      <Tag color={path === currentPath ? 'blue' : 'default'}>
                        {count}회
                      </Tag>
                    </Col>
                  </Row>
                  <Progress 
                    percent={percentage} 
                    size="small" 
                    showInfo={false}
                    strokeColor={path === currentPath ? '#1890ff' : '#d9d9d9'}
                  />
                </div>
              )
            })}
          </Space>
        </Space>
      </Card>

      {/* 방문 기록 */}
      <Card 
        title={
          <Space>
            <ClockCircleOutlined />
            최근 방문 기록
          </Space>
        }
        size="small"
      >
        <Space wrap>
          {visitHistory.slice(-10).reverse().map((path, index) => (
            <Tag 
              key={`${path}-${index}`}
              color={path === currentPath ? 'blue' : 'default'}
            >
              {path}
            </Tag>
          ))}
        </Space>
        <Divider />
        <Text strong>이전 페이지:</Text> <Text code>{getPreviousPage()}</Text>
      </Card>

      {/* 브라우저 정보 */}
      <Card 
        title={
          <Space>
            <LaptopOutlined />
            브라우저 정보
          </Space>
        }
        size="small"
      >
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Text strong>언어:</Text>
            <br />
            <Text>{browserInfo.language}</Text>
          </Col>
          <Col span={12}>
            <Text strong>플랫폼:</Text>
            <br />
            <Text>{browserInfo.platform}</Text>
          </Col>
          <Col span={12}>
            <Text strong>쿠키 사용:</Text>
            <br />
            <Tag color={browserInfo.cookieEnabled ? 'green' : 'red'}>
              {browserInfo.cookieEnabled ? '활성화' : '비활성화'}
            </Tag>
          </Col>
          <Col span={12}>
            <Text strong>User Agent:</Text>
            <br />
            <Text ellipsis style={{ width: '100%' }}>
              {browserInfo.userAgent.substring(0, 50)}...
            </Text>
          </Col>
        </Row>
      </Card>

      {/* 사용자 데이터 */}
      <Card 
        title={
          <Space>
            <StarOutlined />
            사용자 데이터
          </Space>
        }
        size="small"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>즐겨찾기 페이지:</Text>
            <br />
            <Space wrap style={{ marginTop: '8px' }}>
              {userData.favoritePages.length > 0 ? (
                userData.favoritePages.map(path => (
                  <Tag key={path} color="red" icon={<HeartOutlined />}>
                    {path}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">없음</Text>
              )}
            </Space>
          </Col>
          <Col span={12}>
            <Text strong>최근 검색:</Text>
            <br />
            <Space wrap style={{ marginTop: '8px' }}>
              {userData.searchHistory.length > 0 ? (
                userData.searchHistory.slice(-5).map((search, index) => (
                  <Tag key={index} icon={<SearchOutlined />}>
                    {search.term}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">없음</Text>
              )}
            </Space>
          </Col>
        </Row>
        
        {userData.bookmarks.length > 0 && (
          <>
            <Divider />
            <Text strong>북마크:</Text>
            <div style={{ marginTop: '8px' }}>
              {userData.bookmarks.slice(-3).map(bookmark => (
                <div key={bookmark.id} style={{ marginBottom: '4px' }}>
                  <Tag icon={<BookOutlined />}>
                    {bookmark.title || bookmark.url}
                  </Tag>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* 사용자 설정 (확장) */}
      <Card 
        title={
          <Space>
            <SettingOutlined />
            사용자 설정
          </Space>
        }
        size="small"
      >
        <Row gutter={[16, 8]}>
          <Col span={8}>
            <Text strong>언어:</Text>
            <br />
            <Tag color="blue">{userPreferences.language}</Tag>
          </Col>
          <Col span={8}>
            <Text strong>페이지당 항목:</Text>
            <br />
            <Text>{userPreferences.itemsPerPage}</Text>
          </Col>
          <Col span={8}>
            <Text strong>자동 저장:</Text>
            <br />
            <Tag color={userPreferences.autoSave ? 'green' : 'red'}>
              {userPreferences.autoSave ? 'ON' : 'OFF'}
            </Tag>
          </Col>
          <Col span={8}>
            <Text strong>폰트 크기:</Text>
            <br />
            <Text>{userPreferences.fontSize}</Text>
          </Col>
          <Col span={8}>
            <Text strong>애니메이션:</Text>
            <br />
            <Tag color={userPreferences.showAnimations ? 'green' : 'red'}>
              {userPreferences.showAnimations ? 'ON' : 'OFF'}
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* 기존 사용자 설정 카드를 위의 확장된 버전으로 대체했으므로 제거 */}
    </Space>
  )
}

export default PageStatsComponent
