import { useEffect } from 'react'
import { usePageStore } from '../store/pageStore'

// 온라인/오프라인 상태 및 기타 브라우저 이벤트를 감지하는 훅
export const useAppStatus = () => {
  const { 
    setOnlineStatus, 
    updateLastActivity, 
    updateAppState,
    incrementErrorCount
  } = usePageStore()

  useEffect(() => {
    // 온라인/오프라인 상태 감지
    const handleOnline = () => setOnlineStatus(true)
    const handleOffline = () => setOnlineStatus(false)

    // 사용자 활동 감지
    const handleActivity = () => updateLastActivity()

    // 에러 처리
    const handleError = (event) => {
      console.error('앱 에러 발생:', event.error)
      incrementErrorCount()
    }

    // 페이지 가시성 변경 감지
    const handleVisibilityChange = () => {
      updateAppState({
        isVisible: !document.hidden,
        lastVisibilityChange: new Date()
      })
    }

    // 메모리 사용량 업데이트 (가능한 경우)
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        updateAppState({
          performanceMetrics: {
            memoryUsage: performance.memory.usedJSHeapSize / 1024 / 1024 // MB
          }
        })
      }
    }

    // 이벤트 리스너 등록
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('click', handleActivity)
    window.addEventListener('keypress', handleActivity)
    window.addEventListener('scroll', handleActivity)
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('error', handleError)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 메모리 정보 주기적 업데이트 (30초마다)
    const memoryInterval = setInterval(updateMemoryInfo, 30000)

    // 초기 상태 설정
    setOnlineStatus(navigator.onLine)
    updateLastActivity()
    updateMemoryInfo()

    // 클린업
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('keypress', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('error', handleError)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(memoryInterval)
    }
  }, [setOnlineStatus, updateLastActivity, updateAppState, incrementErrorCount])
}

// 로컬 스토리지에 상태를 저장하는 훅
export const usePersistentState = () => {
  const store = usePageStore()

  useEffect(() => {
    // 앱 시작 시 저장된 상태 로드
    const savedState = localStorage.getItem('reactBasicAppState')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        // 일부 상태만 복원 (보안상 민감한 정보 제외)
        if (parsedState.userPreferences) {
          store.updateUserPreferences(parsedState.userPreferences)
        }
        if (parsedState.userData) {
          // 사용자 데이터 복원
          const { userData } = store
          userData.favoritePages = parsedState.userData.favoritePages || []
          userData.bookmarks = parsedState.userData.bookmarks || []
          userData.customSettings = parsedState.userData.customSettings || {}
        }
        if (parsedState.theme) {
          store.setTheme(parsedState.theme)
        }
      } catch (error) {
        console.error('저장된 상태 로드 실패:', error)
      }
    }
  }, [])

  useEffect(() => {
    // 상태 변경 시 로컬 스토리지에 저장
    const saveState = () => {
      const state = store.getState ? store.getState() : store
      const stateToSave = {
        userPreferences: state.userPreferences,
        userData: state.userData,
        theme: state.theme,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem('reactBasicAppState', JSON.stringify(stateToSave))
    }

    // 5초마다 자동 저장
    const saveInterval = setInterval(saveState, 5000)

    return () => clearInterval(saveInterval)
  }, [store])
}

// 성능 모니터링 훅
export const usePerformanceMonitor = () => {
  const { updatePerformanceMetrics } = usePageStore()

  useEffect(() => {
    // 페이지 로드 성능 측정
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing
      const loadTime = timing.loadEventEnd - timing.navigationStart
      const renderTime = timing.domContentLoadedEventEnd - timing.navigationStart

      updatePerformanceMetrics({
        loadTime: Math.round(loadTime / 1000 * 100) / 100, // 초 단위, 소수점 2자리
        renderTime: Math.round(renderTime / 1000 * 100) / 100
      })
    }

    // 현대적인 Performance Observer 사용 (지원되는 경우)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              updatePerformanceMetrics({
                loadTime: Math.round(entry.loadEventEnd / 1000 * 100) / 100,
                renderTime: Math.round(entry.domContentLoadedEventEnd / 1000 * 100) / 100
              })
            }
          })
        })
        observer.observe({ entryTypes: ['navigation'] })

        return () => observer.disconnect()
      } catch (error) {
        console.warn('Performance Observer를 사용할 수 없습니다:', error)
      }
    }
  }, [updatePerformanceMetrics])
}
