import { useQuery } from '@tanstack/react-query'

// 예제 API 함수
const fetchTodos = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

// React Query 커스텀 훅
export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 5 * 60 * 1000, // 5분
  })
}
