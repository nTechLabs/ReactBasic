import { create } from 'zustand'

// 페이지 정보 데이터
export const pageData = {
  '/': {
    key: 'dashboard',
    title: '대시보드',
    description: 'React 프로젝트 대시보드'
  },
  '/counter': {
    key: 'counter',
    title: '카운터 페이지',
    description: 'Zustand를 사용한 상태 관리 예제'
  },
  '/todos': {
    key: 'todos',
    title: '할 일 목록',
    description: 'React Query를 사용한 데이터 페칭 예제'
  },
  '/hooks': {
    key: 'hooks',
    title: 'React Hooks',
    description: 'React Hooks 사용법과 예제 모음'
  },
  '/hooks/useState': {
    key: 'useState',
    title: 'useState Hook',
    description: 'useState 훅 사용법과 예제'
  },
  '/hooks/useEffect': {
    key: 'useEffect',
    title: 'useEffect Hook',
    description: 'useEffect 훅 사용법과 예제'
  },
  '/hooks/useContext': {
    key: 'useContext',
    title: 'useContext Hook',
    description: 'useContext 훅 사용법과 예제'
  },
  '/hooks/useCallback': {
    key: 'useCallback',
    title: 'useCallback Hook',
    description: 'useCallback 훅 사용법과 예제'
  },
  '/hooks/useMemo': {
    key: 'useMemo',
    title: 'useMemo Hook',
    description: 'useMemo 훅 사용법과 예제'
  },
  '/hooks/useForm': {
    key: 'useForm',
    title: 'useForm Hook',
    description: 'useForm 훅 사용법과 예제'
  },
  '/hooks/useLocalStorage': {
    key: 'useLocalStorage',
    title: 'useLocalStorage Hook',
    description: 'useLocalStorage 훅 사용법과 예제'
  },
  '/about': {
    key: 'about',
    title: '프로젝트 소개',
    description: '기술 스택 및 프로젝트 정보'
  }
}

// 페이지 상태 관리를 위한 Zustand 스토어
export const usePageStore = create((set, get) => ({
  // 현재 페이지 정보
  currentPage: pageData['/'],
  currentPath: '/',
  
  // 브라우저 정보
  browserInfo: {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    language: typeof navigator !== 'undefined' ? navigator.language : 'ko-KR',
    platform: typeof navigator !== 'undefined' ? navigator.platform : '',
    cookieEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : false
  },
  
  // 페이지 방문 기록
  visitHistory: ['/'],
  
  // UI 상태
  isLoading: false,
  sidebarCollapsed: false,
  theme: 'light',
  
  // 사용자 설정
  userPreferences: {
    language: 'ko',
    itemsPerPage: 10,
    autoSave: true,
    fontSize: 'medium',
    showAnimations: true
  },
  
  // 앱 상태
  appState: {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastActivity: new Date(),
    sessionStartTime: new Date(),
    errorCount: 0,
    performanceMetrics: {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0
    }
  },
  
  // 사용자 데이터
  userData: {
    favoritePages: [],
    bookmarks: [],
    searchHistory: [],
    customSettings: {}
  },
  
  // 알림 상태
  notifications: [],
  
  // Actions
  setCurrentPage: (path) => {
    const pageInfo = pageData[path] || {
      key: 'unknown',
      title: '알 수 없는 페이지',
      description: ''
    }
    
    set((state) => ({
      currentPage: pageInfo,
      currentPath: path,
      visitHistory: [...new Set([...state.visitHistory, path])] // 중복 제거
    }))
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  toggleSidebar: () => set((state) => ({ 
    sidebarCollapsed: !state.sidebarCollapsed 
  })),
  
  setTheme: (theme) => set({ theme }),
  
  updateUserPreferences: (preferences) => set((state) => ({
    userPreferences: { ...state.userPreferences, ...preferences }
  })),
  
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, {
      id: Date.now(),
      timestamp: new Date(),
      ...notification
    }]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] }),
  
  // 앱 상태 관리
  updateAppState: (updates) => set((state) => ({
    appState: { ...state.appState, ...updates }
  })),
  
  setOnlineStatus: (isOnline) => set((state) => ({
    appState: { ...state.appState, isOnline }
  })),
  
  updateLastActivity: () => set((state) => ({
    appState: { ...state.appState, lastActivity: new Date() }
  })),
  
  incrementErrorCount: () => set((state) => ({
    appState: { ...state.appState, errorCount: state.appState.errorCount + 1 }
  })),
  
  resetErrorCount: () => set((state) => ({
    appState: { ...state.appState, errorCount: 0 }
  })),
  
  updatePerformanceMetrics: (metrics) => set((state) => ({
    appState: {
      ...state.appState,
      performanceMetrics: { ...state.appState.performanceMetrics, ...metrics }
    }
  })),
  
  // 사용자 데이터 관리
  addToFavorites: (pagePath) => set((state) => ({
    userData: {
      ...state.userData,
      favoritePages: [...new Set([...state.userData.favoritePages, pagePath])]
    }
  })),
  
  removeFromFavorites: (pagePath) => set((state) => ({
    userData: {
      ...state.userData,
      favoritePages: state.userData.favoritePages.filter(p => p !== pagePath)
    }
  })),
  
  addBookmark: (bookmark) => set((state) => ({
    userData: {
      ...state.userData,
      bookmarks: [...state.userData.bookmarks, {
        id: Date.now(),
        timestamp: new Date(),
        ...bookmark
      }]
    }
  })),
  
  removeBookmark: (id) => set((state) => ({
    userData: {
      ...state.userData,
      bookmarks: state.userData.bookmarks.filter(b => b.id !== id)
    }
  })),
  
  addSearchHistory: (searchTerm) => set((state) => ({
    userData: {
      ...state.userData,
      searchHistory: [...state.userData.searchHistory.slice(-9), {
        term: searchTerm,
        timestamp: new Date()
      }]
    }
  })),
  
  clearSearchHistory: () => set((state) => ({
    userData: { ...state.userData, searchHistory: [] }
  })),
  
  updateCustomSettings: (settings) => set((state) => ({
    userData: {
      ...state.userData,
      customSettings: { ...state.userData.customSettings, ...settings }
    }
  })),
  
  // 방문 기록 관리
  clearHistory: () => set({ visitHistory: ['/'] }),
  
  // 이전 페이지로 이동
  getPreviousPage: () => {
    const { visitHistory, currentPath } = get()
    const currentIndex = visitHistory.indexOf(currentPath)
    return currentIndex > 0 ? visitHistory[currentIndex - 1] : '/'
  },
  
  // 페이지 통계
  getPageStats: () => {
    const { visitHistory } = get()
    const stats = {}
    
    visitHistory.forEach(path => {
      stats[path] = (stats[path] || 0) + 1
    })
    
    return stats
  },
  
  // 현재 페이지가 특정 경로의 하위 페이지인지 확인
  isSubPageOf: (parentPath) => {
    const { currentPath } = get()
    return currentPath.startsWith(parentPath) && currentPath !== parentPath
  },
  
  // 즐겨찾기 확인
  isFavoritePage: (path) => {
    const { userData } = get()
    return userData.favoritePages.includes(path || get().currentPath)
  },
  
  // 세션 시간 계산
  getSessionDuration: () => {
    const { appState } = get()
    return new Date() - appState.sessionStartTime
  },
  
  // 활성 시간 계산 (분 단위)
  getActiveTime: () => {
    const { appState } = get()
    return Math.floor((new Date() - appState.lastActivity) / 1000 / 60)
  },
  
  // 앱 상태 요약
  getAppSummary: () => {
    const state = get()
    return {
      currentPage: state.currentPage.title,
      totalPages: Object.keys(pageData).length,
      visitedPages: state.visitHistory.length,
      favoritePages: state.userData.favoritePages.length,
      bookmarks: state.userData.bookmarks.length,
      notifications: state.notifications.length,
      errors: state.appState.errorCount,
      sessionTime: Math.floor((new Date() - state.appState.sessionStartTime) / 1000 / 60),
      isOnline: state.appState.isOnline,
      theme: state.theme
    }
  }
}))

// 페이지 정보 헬퍼 함수들
export const getPageInfo = (path) => {
  return pageData[path] || {
    key: 'unknown',
    title: '알 수 없는 페이지',
    description: ''
  }
}

export const getAllPages = () => {
  return Object.entries(pageData).map(([path, info]) => ({
    path,
    ...info
  }))
}

export const getMainPages = () => {
  return Object.entries(pageData)
    .filter(([path]) => !path.includes('/hooks/') || path === '/hooks')
    .map(([path, info]) => ({
      path,
      ...info
    }))
}

export const getHookPages = () => {
  return Object.entries(pageData)
    .filter(([path]) => path.startsWith('/hooks/'))
    .map(([path, info]) => ({
      path,
      ...info
    }))
}
