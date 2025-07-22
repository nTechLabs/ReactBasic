// React hooks를 위한 import
import { useState, useCallback, useEffect } from 'react'
// Ant Design UI 컴포넌트들을 import
import { Card, Button, Space, Typography, Row, Col, Input, Switch, Slider, ColorPicker, Alert, message, Select, Tag } from 'antd'
// Ant Design 아이콘들을 import
import { 
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined,
  BgColorsOutlined,
  DatabaseOutlined,
  ClearOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons'

// Typography 컴포넌트들을 구조 분해 할당으로 추출
const { Title, Paragraph, Text } = Typography
const { Option } = Select
const { TextArea } = Input

// =====================================
// 커스텀 useLocalStorage 훅 구현
// =====================================
const useLocalStorage = (key, initialValue) => {
  // 로컬스토리지에서 값을 읽어오는 함수
  const readValue = useCallback(() => {
    // 서버 사이드 렌더링 환경에서는 window가 없을 수 있음
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      // 값이 없으면 초기값 반환
      if (item === null) {
        return initialValue
      }
      // JSON 파싱 시도
      return JSON.parse(item)
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [initialValue, key])

  // 상태 초기화 - 함수형 초기 상태로 지연 초기화
  const [storedValue, setStoredValue] = useState(readValue)

  // 값을 설정하는 함수
  const setValue = useCallback((value) => {
    // 서버 사이드 렌더링 환경에서는 아무것도 하지 않음
    if (typeof window === 'undefined') {
      console.warn('Attempted to set localStorage in non-browser environment')
      return
    }

    try {
      // 함수인 경우 현재 상태를 인자로 전달하여 실행
      const newValue = value instanceof Function ? value(storedValue) : value

      // 상태 업데이트
      setStoredValue(newValue)

      // 로컬스토리지에 저장
      window.localStorage.setItem(key, JSON.stringify(newValue))

      // 다른 탭/창에 변경사항 알림
      window.dispatchEvent(new Event('localStorage'))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
      message.error('로컬스토리지 저장 중 오류가 발생했습니다.')
    }
  }, [key, storedValue])

  // 로컬스토리지에서 제거하는 함수
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
      window.dispatchEvent(new Event('localStorage'))
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
      message.error('로컬스토리지 삭제 중 오류가 발생했습니다.')
    }
  }, [key, initialValue])

  // 다른 탭/창에서의 변경사항 감지
  useEffect(() => {
    const handleStorageChange = (e) => {
      // storage 이벤트는 다른 탭에서만 발생
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn('Error parsing storage event data:', error)
        }
      }
    }

    // 커스텀 이벤트 처리 (같은 탭 내에서의 변경)
    const handleCustomStorageChange = () => {
      setStoredValue(readValue())
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorage', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorage', handleCustomStorageChange)
    }
  }, [key, readValue])

  return [storedValue, setValue, removeValue]
}

// =====================================
// 1. 사용자 설정 관리 예제
// =====================================
const UserSettingsExample = () => {
  // 사용자 설정을 로컬스토리지에 저장
  const [settings, setSettings, removeSettings] = useLocalStorage('userSettings', {
    username: '',
    theme: 'light',
    fontSize: 14,
    notifications: true,
    language: 'ko',
    autoSave: false
  })

  // 개별 설정 업데이트 함수들
  const updateUsername = (username) => {
    setSettings(prev => ({ ...prev, username }))
  }

  const updateTheme = (theme) => {
    setSettings(prev => ({ ...prev, theme }))
  }

  const updateFontSize = (fontSize) => {
    setSettings(prev => ({ ...prev, fontSize }))
  }

  const updateNotifications = (notifications) => {
    setSettings(prev => ({ ...prev, notifications }))
  }

  const updateLanguage = (language) => {
    setSettings(prev => ({ ...prev, language }))
  }

  const updateAutoSave = (autoSave) => {
    setSettings(prev => ({ ...prev, autoSave }))
  }

  const resetSettings = () => {
    removeSettings()
    message.success('설정이 초기화되었습니다!')
  }

  return (
    <Card title="사용자 설정 관리 (useLocalStorage)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            {/* 사용자명 */}
            <div>
              <Text>사용자명</Text>
              <Input
                prefix={<UserOutlined />}
                placeholder="사용자명을 입력하세요"
                value={settings.username}
                onChange={(e) => updateUsername(e.target.value)}
              />
            </div>

            {/* 테마 선택 */}
            <div>
              <Text>테마 설정</Text>
              <Select
                value={settings.theme}
                onChange={updateTheme}
                style={{ width: '100%' }}
              >
                <Option value="light">라이트 테마</Option>
                <Option value="dark">다크 테마</Option>
                <Option value="auto">자동</Option>
              </Select>
            </div>

            {/* 언어 선택 */}
            <div>
              <Text>언어 설정</Text>
              <Select
                value={settings.language}
                onChange={updateLanguage}
                style={{ width: '100%' }}
              >
                <Option value="ko">한국어</Option>
                <Option value="en">English</Option>
                <Option value="ja">日本語</Option>
              </Select>
            </div>
          </Col>

          <Col xs={24} md={12}>
            {/* 폰트 크기 */}
            <div>
              <Text>폰트 크기: {settings.fontSize}px</Text>
              <Slider
                min={12}
                max={24}
                value={settings.fontSize}
                onChange={updateFontSize}
                marks={{
                  12: '12px',
                  16: '16px',
                  20: '20px',
                  24: '24px'
                }}
              />
            </div>

            {/* 알림 설정 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>알림 받기</Text>
              <Switch
                checked={settings.notifications}
                onChange={updateNotifications}
              />
            </div>

            {/* 자동 저장 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>자동 저장</Text>
              <Switch
                checked={settings.autoSave}
                onChange={updateAutoSave}
              />
            </div>
          </Col>
        </Row>

        {/* 설정 미리보기 */}
        <Card size="small" style={{ backgroundColor: '#f6f6f6' }}>
          <Title level={5}>현재 설정 상태</Title>
          <div style={{ fontSize: settings.fontSize }}>
            <Space wrap>
              <Tag color="blue">사용자: {settings.username || '미설정'}</Tag>
              <Tag color="green">테마: {settings.theme}</Tag>
              <Tag color="purple">언어: {settings.language}</Tag>
              <Tag color="orange">폰트: {settings.fontSize}px</Tag>
              <Tag color={settings.notifications ? 'success' : 'default'}>
                알림: {settings.notifications ? 'ON' : 'OFF'}
              </Tag>
              <Tag color={settings.autoSave ? 'success' : 'default'}>
                자동저장: {settings.autoSave ? 'ON' : 'OFF'}
              </Tag>
            </Space>
          </div>
        </Card>

        <Button
          type="primary"
          danger
          icon={<ClearOutlined />}
          onClick={resetSettings}
        >
          설정 초기화
        </Button>
      </Space>
    </Card>
  )
}

// =====================================
// 2. 할일 목록 관리 예제
// =====================================
const TodoListExample = () => {
  const [todos, setTodos, removeTodos] = useLocalStorage('todoList', [])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useLocalStorage('todoFilter', 'all')

  // 할일 추가
  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toLocaleString()
      }
      setTodos(prev => [...prev, todo])
      setNewTodo('')
      message.success('할일이 추가되었습니다!')
    }
  }

  // 할일 완료 토글
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // 할일 삭제
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
    message.success('할일이 삭제되었습니다!')
  }

  // 완료된 할일 모두 삭제
  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed))
    message.success('완료된 할일이 모두 삭제되었습니다!')
  }

  // 필터링된 할일 목록
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // 통계
  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const activeTodos = totalTodos - completedTodos

  return (
    <Card title="할일 목록 관리 (LocalStorage)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* 할일 추가 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder="새로운 할일을 입력하세요"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onPressEnter={addTodo}
          />
          <Button type="primary" icon={<SaveOutlined />} onClick={addTodo}>
            추가
          </Button>
        </div>

        {/* 통계 및 필터 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small">
              <Space>
                <Text>전체: <Text type="secondary">{totalTodos}</Text></Text>
                <Text>진행중: <Text type="warning">{activeTodos}</Text></Text>
                <Text>완료: <Text type="success">{completedTodos}</Text></Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Select
              value={filter}
              onChange={setFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">전체 보기</Option>
              <Option value="active">진행중만</Option>
              <Option value="completed">완료됨만</Option>
            </Select>
          </Col>
        </Row>

        {/* 할일 목록 */}
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {filteredTodos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              {filter === 'all' ? '할일이 없습니다.' : 
               filter === 'active' ? '진행중인 할일이 없습니다.' : 
               '완료된 할일이 없습니다.'}
            </div>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              {filteredTodos.map((todo) => (
                <Card 
                  key={todo.id} 
                  size="small"
                  style={{
                    opacity: todo.completed ? 0.6 : 1,
                    backgroundColor: todo.completed ? '#f6ffed' : '#fff'
                  }}
                  actions={[
                    <Button
                      type="text"
                      size="small"
                      onClick={() => toggleTodo(todo.id)}
                    >
                      {todo.completed ? '취소' : '완료'}
                    </Button>,
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteTodo(todo.id)}
                    >
                      삭제
                    </Button>
                  ]}
                >
                  <div>
                    <Text 
                      delete={todo.completed}
                      style={{ fontSize: '16px' }}
                    >
                      {todo.text}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      생성일: {todo.createdAt}
                    </Text>
                  </div>
                </Card>
              ))}
            </Space>
          )}
        </div>

        {/* 액션 버튼들 */}
        <Space style={{ width: '100%', justifyContent: 'center' }}>
          {completedTodos > 0 && (
            <Button onClick={clearCompleted}>
              완료된 할일 정리
            </Button>
          )}
          <Button danger onClick={removeTodos}>
            전체 삭제
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

// =====================================
// 3. 사용자 노트 관리 예제
// =====================================
const NotesExample = () => {
  const [notes, setNotes, removeNotes] = useLocalStorage('userNotes', [])
  const [currentNote, setCurrentNote] = useState('')
  const [currentTitle, setCurrentTitle] = useState('')
  const [editingId, setEditingId] = useState(null)

  // 노트 저장
  const saveNote = () => {
    if (currentTitle.trim() && currentNote.trim()) {
      if (editingId) {
        // 수정 모드
        setNotes(prev => prev.map(note => 
          note.id === editingId 
            ? { ...note, title: currentTitle, content: currentNote, updatedAt: new Date().toLocaleString() }
            : note
        ))
        setEditingId(null)
        message.success('노트가 수정되었습니다!')
      } else {
        // 새 노트 추가
        const note = {
          id: Date.now(),
          title: currentTitle,
          content: currentNote,
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString()
        }
        setNotes(prev => [note, ...prev])
        message.success('노트가 저장되었습니다!')
      }
      setCurrentTitle('')
      setCurrentNote('')
    } else {
      message.warning('제목과 내용을 모두 입력해주세요!')
    }
  }

  // 노트 수정 시작
  const startEdit = (note) => {
    setCurrentTitle(note.title)
    setCurrentNote(note.content)
    setEditingId(note.id)
  }

  // 노트 삭제
  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id))
    message.success('노트가 삭제되었습니다!')
  }

  // 편집 취소
  const cancelEdit = () => {
    setEditingId(null)
    setCurrentTitle('')
    setCurrentNote('')
  }

  return (
    <Card title="사용자 노트 관리">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            {/* 노트 작성/수정 폼 */}
            <Card 
              size="small" 
              title={editingId ? "노트 수정" : "새 노트 작성"}
              extra={
                editingId && (
                  <Button size="small" onClick={cancelEdit}>
                    취소
                  </Button>
                )
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  placeholder="노트 제목을 입력하세요"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                />
                <TextArea
                  rows={6}
                  placeholder="노트 내용을 입력하세요"
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                />
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={saveNote}
                  block
                >
                  {editingId ? '수정 완료' : '노트 저장'}
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            {/* 노트 목록 */}
            <Card 
              size="small" 
              title={`저장된 노트 (${notes.length}개)`}
              extra={
                notes.length > 0 && (
                  <Button size="small" danger onClick={removeNotes}>
                    전체 삭제
                  </Button>
                )
              }
            >
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    저장된 노트가 없습니다.
                  </div>
                ) : (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {notes.map((note) => (
                      <Card 
                        key={note.id}
                        size="small"
                        style={{ marginBottom: 8 }}
                        actions={[
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => startEdit(note)}
                          >
                            수정
                          </Button>,
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => deleteNote(note.id)}
                          >
                            삭제
                          </Button>
                        ]}
                      >
                        <div>
                          <Text strong>{note.title}</Text>
                          <br />
                          <Text 
                            type="secondary" 
                            style={{ fontSize: '12px' }}
                          >
                            {note.content.length > 50 
                              ? note.content.substring(0, 50) + '...'
                              : note.content
                            }
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '10px' }}>
                            {note.updatedAt}
                          </Text>
                        </div>
                      </Card>
                    ))}
                  </Space>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Space>
    </Card>
  )
}

// =====================================
// 메인 페이지 컴포넌트
// =====================================
const UseLocalStoragePage = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* 페이지 제목과 설명 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <DatabaseOutlined style={{ color: '#1890ff' }} /> 
          useLocalStorage 커스텀 훅 예제
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          커스텀 useLocalStorage 훅을 사용한 로컬 데이터 저장과 관리를 학습해보세요
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 1. 사용자 설정 관리 */}
        <UserSettingsExample />
        
        {/* 2. 할일 목록 관리 */}
        <TodoListExample />

        {/* 3. 사용자 노트 관리 */}
        <NotesExample />

        {/* useLocalStorage 사용법 가이드 */}
        <Card 
          title="커스텀 useLocalStorage 훅 가이드" 
          style={{ backgroundColor: '#f0f8ff', border: '1px solid #91d5ff' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={5}>1. 기본 사용법</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const [value, setValue, removeValue] = useLocalStorage(
  'storageKey', // 로컬스토리지 키
  defaultValue  // 기본값
);`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>2. 값 설정과 업데이트</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`// 직접 값 설정
setValue('새로운 값');

// 함수형 업데이트
setValue(prev => ({ ...prev, newField: 'value' }));`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>3. 주요 특징</Title>
              <ul style={{ fontSize: '12px', margin: 0 }}>
                <li>자동 JSON 직렬화/역직렬화</li>
                <li>SSR 환경 지원</li>
                <li>다른 탭 간 동기화</li>
                <li>에러 처리 및 예외 상황 대응</li>
              </ul>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>4. 사용 사례</Title>
              <ul style={{ fontSize: '12px', margin: 0 }}>
                <li>사용자 설정 저장</li>
                <li>폼 데이터 임시 저장</li>
                <li>테마 설정 관리</li>
                <li>장바구니 상태 유지</li>
              </ul>
            </Col>
          </Row>
          
          <Alert
            message="로컬스토리지 사용 시 주의사항"
            description="로컬스토리지는 도메인별로 저장되며, 브라우저 설정에 따라 삭제될 수 있습니다. 중요한 데이터는 서버에 별도로 백업하는 것을 권장합니다. 또한 저장 용량에 제한이 있으므로 대용량 데이터 저장 시 주의가 필요합니다."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Card>
      </Space>
    </div>
  )
}

// 컴포넌트를 기본 내보내기로 설정
export default UseLocalStoragePage
