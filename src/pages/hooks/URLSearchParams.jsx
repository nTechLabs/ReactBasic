import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	Card,
	Button,
	Input,
	Space,
	Typography,
	Row,
	Col,
	Tag,
	Alert,
	Switch,
	Select,
	Slider,
	Checkbox,
	Divider,
	Statistic
} from 'antd'
import {
	ApiOutlined,
	LinkOutlined,
	ReloadOutlined,
	SettingOutlined,
	FilterOutlined,
	SearchOutlined,
	CodeOutlined,
	ExperimentOutlined,
	ClearOutlined,
	PlusOutlined,
	MinusOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

// 공통 유틸: URLSearchParams -> 객체 변환
const paramsToObject = (params) => {
	const obj = {}
	params.forEach((value, key) => {
		if (obj[key] !== undefined) { // 다중 값 지원
			obj[key] = Array.isArray(obj[key]) ? [...obj[key], value] : [obj[key], value]
		} else {
			obj[key] = value
		}
	})
	return obj
}

// 커스텀 훅: 쿼리 파라미터 읽기 & 갱신
const useQueryParams = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const params = useMemo(() => new URLSearchParams(location.search), [location.search])
	const all = useMemo(() => paramsToObject(params), [params])

	const setParams = (updater, options = { replace: false, merge: true }) => {
		const current = new URLSearchParams(options.merge ? location.search : '')
		if (typeof updater === 'function') updater(current)
		else if (typeof updater === 'object') {
			Object.entries(updater).forEach(([k, v]) => {
				if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
					current.delete(k)
				} else if (Array.isArray(v)) {
					current.delete(k)
					v.forEach(item => current.append(k, item))
				} else {
					current.set(k, v)
				}
			})
		}
		const search = current.toString()
		navigate({ pathname: location.pathname, search: search ? `?${search}` : '' }, { replace: options.replace })
	}

	return { params, all, setParams }
}

// 1. 기본 읽기 & 표시
const BasicReadDemo = () => {
	const location = useLocation()
	const query = useMemo(() => new URLSearchParams(location.search), [location.search])
	const obj = useMemo(() => paramsToObject(query), [query])

	return (
		<Card title="기본 읽기 (URLSearchParams)" size="small">
			<Space direction="vertical" style={{ width: '100%' }}>
						<Alert
							type="info"
							showIcon
							message="기본 사용"
							description={
								<span>
									<Text code>new URLSearchParams(location.search)</Text> 로 쿼리 문자열을 파싱하여{' '}
									<Text code>get / forEach / entries</Text> 로 접근합니다.
								</span>
							}
						/>
				<Space wrap>
					<Tag color="blue">pathname: {location.pathname}</Tag>
					<Tag color="green">search: {location.search || '없음'}</Tag>
				</Space>
				<Card size="small" title="파싱 결과">
					{Object.keys(obj).length === 0 ? (
						<Text type="secondary">파라미터 없음</Text>
					) : (
						<Space wrap>
							{Object.entries(obj).map(([k,v]) => (
								Array.isArray(v) ? v.map((vv,i) => <Tag key={k + i} color="geekblue">{k}: {vv}</Tag>) : <Tag key={k} color="geekblue">{k}: {v}</Tag>
							))}
						</Space>
					)}
				</Card>
			</Space>
		</Card>
	)
}

// 2. 파라미터 편집 & 적용
const EditParamsDemo = () => {
	const { all, setParams } = useQueryParams()
	const [foo, setFoo] = useState(all.foo || '')
	const [bar, setBar] = useState(all.bar || '')

	useEffect(() => { setFoo(all.foo || '') }, [all.foo])
	useEffect(() => { setBar(all.bar || '') }, [all.bar])

	return (
		<Card title="쿼리 파라미터 편집" size="small">
			<Space direction="vertical" style={{ width: '100%' }}>
						<Alert
							type="success"
							showIcon
							message="업데이트 패턴"
							description={<span><Text code>{"setParams({ foo, bar })"}</Text> 형태로 병합 업데이트. 빈 값은 자동 제거.</span>}
						/>
				<Space>
					<Input placeholder="foo" value={foo} onChange={e=>setFoo(e.target.value)} style={{ width: 140 }} />
					<Input placeholder="bar" value={bar} onChange={e=>setBar(e.target.value)} style={{ width: 140 }} />
					<Button type="primary" icon={<ReloadOutlined />} onClick={() => setParams({ foo, bar })}>적용</Button>
					<Button icon={<ClearOutlined />} onClick={() => setParams({ foo:'', bar:'' })}>초기화</Button>
				</Space>
				<Text type="secondary" style={{ fontSize: 12 }}>빈 문자열 / null / undefined / 빈 배열은 자동 삭제</Text>
			</Space>
		</Card>
	)
}

// 3. 필터 & 정렬 & 페이지네이션
const FilterPaginationDemo = () => {
	const { all, setParams } = useQueryParams()
	const page = Number(all.page || 1)
	const sort = all.sort || 'new'
	const categories = Array.isArray(all.category) ? all.category : all.category ? [all.category] : []
	const pageSize = 5
	const total = 42
	const totalPages = Math.ceil(total / pageSize)

	const toggleCategory = (cat) => {
		const next = categories.includes(cat) ? categories.filter(c=>c!==cat) : [...categories, cat]
		setParams({ category: next, page: 1 })
	}

	return (
		<Card title="필터 / 정렬 / 페이지네이션" size="small">
			<Space direction="vertical" style={{ width: '100%' }}>
				<Alert type="warning" showIcon message="URL 기반 상태" description="필터/정렬/페이지 값을 URL로 관리하여 공유 & 북마크 가능" />
				<Row gutter={12}>
					<Col xs={24} md={8}>
						<Card size="small" title={<><FilterOutlined /> 카테고리</>}>
							<Space wrap>
								{['frontend','backend','devops','design'].map(cat => (
									<Tag.CheckableTag
										key={cat}
										checked={categories.includes(cat)}
										onChange={() => toggleCategory(cat)}
									>{cat}</Tag.CheckableTag>
								))}
							</Space>
							<Divider style={{ margin: '12px 0' }} />
							<Text type="secondary" style={{ fontSize: 12 }}>다중 선택 지원 (category=frontend&category=devops)</Text>
						</Card>
					</Col>
					<Col xs={24} md={8}>
						<Card size="small" title="정렬">
							<Select
								value={sort}
								onChange={v => setParams({ sort: v })}
								options={[
									{ value: 'new', label: '최신순' },
									{ value: 'popular', label: '인기순' },
									{ value: 'priceAsc', label: '가격↑' },
									{ value: 'priceDesc', label: '가격↓' }
								]}
								style={{ width: '100%' }}
							/>
							<Divider style={{ margin: '12px 0' }} />
							<Space>
								<Button size="small" disabled={page<=1} icon={<MinusOutlined />} onClick={()=> setParams({ page: page - 1 })}>이전</Button>
								<Tag color="blue">{page} / {totalPages}</Tag>
								<Button size="small" disabled={page>=totalPages} icon={<PlusOutlined />} onClick={()=> setParams({ page: page + 1 })}>다음</Button>
							</Space>
						</Card>
					</Col>
					<Col xs={24} md={8}>
						<Card size="small" title="요약">
							<Space direction="vertical" size={4}>
								<Text>정렬: <Tag color="purple">{sort}</Tag></Text>
								<Text>카테고리: {categories.length ? categories.map(c=> <Tag key={c}>{c}</Tag>) : <Tag>전체</Tag>}</Text>
								<Text>페이지: <Tag color="geekblue">{page}</Tag></Text>
							</Space>
							<Divider style={{ margin: '12px 0' }} />
							<Button block onClick={()=> setParams({ sort:'new', page:1, category: [] })}>필터 초기화</Button>
						</Card>
					</Col>
				</Row>
			</Space>
		</Card>
	)
}

// 4. 실시간 검색 (디바운스 흉내)
const LiveSearchDemo = () => {
	const { all, setParams } = useQueryParams()
	const [input, setInput] = useState(all.q || '')
	const [typing, setTyping] = useState(false)

	useEffect(() => {
		const id = setTimeout(() => {
			setParams({ q: input || '' })
			setTyping(false)
		}, 500)
		return () => clearTimeout(id)
	}, [input])

	return (
		<Card title="실시간 검색 (디바운스)" size="small">
			<Space direction="vertical" style={{ width: '100%' }}>
				<Input
					prefix={<SearchOutlined />}
					placeholder="검색어 입력"
					value={input}
					onChange={e => { setInput(e.target.value); setTyping(true) }}
					allowClear
				/>
				<Text type="secondary" style={{ fontSize: 12 }}>500ms 정지 시 URL에 q 파라미터 반영</Text>
				<Space>
					<Tag color={typing ? 'orange' : 'blue'}>{typing ? '입력 중...' : `현재 q: ${all.q || '없음'}`}</Tag>
				</Space>
			</Space>
		</Card>
	)
}

// 5. 토글 & 슬라이더 & Boolean 파라미터
const ToggleDemo = () => {
	const { all, setParams } = useQueryParams()
	const dark = all.dark === 'true'
	const [price, setPrice] = useState(Number(all.price || 50))

	return (
		<Card title="Boolean & 숫자 파라미터" size="small">
			<Space direction="vertical" style={{ width: '100%' }}>
				<Space>
					<Switch checked={dark} onChange={v => setParams({ dark: v ? 'true':'', })} />
					<Text>dark 모드: <Tag color={dark ? 'geekblue' : 'default'}>{dark ? 'ON' : 'OFF'}</Tag></Text>
				</Space>
				<div>
					<Text strong>최대 가격: {price}</Text>
					<Slider min={0} max={100} value={price} onChange={v => { setPrice(v); setParams({ price: v }) }} />
				</div>
				<Alert type="info" showIcon message="Boolean 값은 presence/값 조합" description="dark=true 나 삭제로 표현. 빈 문자열 전달 시 제거." />
			</Space>
		</Card>
	)
}

// 6. 커스텀 훅 사용 예 (useQueryParams)
const CustomHookDemo = () => {
	const { all, setParams } = useQueryParams()
	const [localNote, setLocalNote] = useState(all.note || '')
	return (
		<Card title="커스텀 훅 (useQueryParams)" size="small">
			<Space direction="vertical" style={{ width: '100%' }}>
				<Alert type="success" showIcon message="커스텀 훅 장점" description="읽기/쓰기 로직을 재사용하여 여러 컴포넌트에서 일관성 유지" />
				<Input.TextArea rows={3} value={localNote} onChange={e=> setLocalNote(e.target.value)} placeholder="메모 -> URL note 파라미터" />
				<Space>
					<Button type="primary" onClick={()=> setParams({ note: localNote })}>저장</Button>
					<Button onClick={()=> { setLocalNote(''); setParams({ note:'' }) }}>삭제</Button>
				</Space>
				<Text type="secondary" style={{ fontSize: 12 }}>현재 note: {all.note || '없음'}</Text>
			</Space>
		</Card>
	)
}

// 7. 다중 값 & 체크박스 그룹
const MultiValueDemo = () => {
	const { all, setParams } = useQueryParams()
	const selected = Array.isArray(all.tag) ? all.tag : all.tag ? [all.tag] : []
	const toggle = (val) => {
		const next = selected.includes(val) ? selected.filter(v=>v!==val) : [...selected, val]
		setParams({ tag: next })
	}
	return (
		<Card title="다중 값 (append)" size="small">
			<Space direction="vertical" style={{ width: '100%' }}>
				<Space wrap>
					{['react','hook','query','router','ui'].map(t => (
						<Tag.CheckableTag key={t} checked={selected.includes(t)} onChange={()=> toggle(t)}>{t}</Tag.CheckableTag>
					))}
				</Space>
				<Text type="secondary" style={{ fontSize: 12 }}>tag=react&tag=hook 형태로 직렬화</Text>
			</Space>
		</Card>
	)
}

// 8. replace vs push
const HistoryModeDemo = () => {
	const { all, setParams } = useQueryParams()
	const navigateType = all.mode === 'replace' ? 'replace' : 'push'
	const count = Number(all.histCount || 0)
	const add = () => {
		const next = count + 1
		setParams({ histCount: next, mode: navigateType === 'replace' ? 'replace':'push' }, { replace: navigateType === 'replace' })
	}
	return (
		<Card title="History 모드 (push vs replace)" size="small">
			<Space direction="vertical" style={{ width: '100%' }}>
				<Space>
					<Switch checked={navigateType==='replace'} onChange={v => setParams({ mode: v ? 'replace':'push' })} />
					<Text>replace 모드</Text>
				</Space>
				<Button onClick={add} icon={<PlusOutlined />}>카운트 증가 (history 기록)</Button>
				<Tag color="blue">histCount = {count}</Tag>
				<Alert type="info" showIcon message="설명" description={navigateType==='replace' ? 'replace: 뒤로가기에 기록이 쌓이지 않음' : 'push: 매 변경마다 기록이 추가'} />
			</Space>
		</Card>
	)
}

// 메인 페이지 컴포넌트
const URLSearchParamsPage = () => {
	return (
		<Space direction="vertical" size="large" style={{ width: '100%' }}>
			<div style={{ textAlign: 'center' }}>
				<Title level={2}><LinkOutlined style={{ color: '#0958d9' }} /> URLSearchParams 예제</Title>
				<Paragraph style={{ maxWidth: 760, margin: '0 auto', color: '#666' }}>
					브라우저 내장 <Text code>URLSearchParams</Text> 와 React Router <Text code>useLocation</Text>, <Text code>useNavigate</Text> 를 조합하여
					검색/필터/페이지네이션 등 URL 기반 상태 관리를 구현하는 다양한 패턴을 살펴봅니다.
				</Paragraph>
			</div>

			{/* 개념 섹션 */}
			<Card title="📚 URLSearchParams 기본 개념" style={{ backgroundColor: '#e6f4ff', border: '2px solid #1677ff', borderRadius: 12 }}>
				<Space direction="vertical" size="middle" style={{ width: '100%' }}>
					<div style={{ textAlign: 'center' }}>
						<Title level={4} style={{ color: '#1677ff', marginBottom: 8 }}>🎯 쿼리 문자열을 읽고/쓰기 위한 표준 Web API</Title>
						<Text type="secondary">키-값 쌍 검색 파라미터를 다루며 여러 동일 키(다중 값)도 지원합니다</Text>
					</div>
					<Row gutter={[16,16]} justify="center">
						<Col xs={24} lg={20}>
							<div style={{ background: '#fff', border: '1px solid #d9d9d9', borderRadius: 8, padding: 20 }}>
								<div style={{ fontFamily: 'monospace', fontSize: 15, textAlign: 'center', background: '#f6f6f6', border: '1px solid #d9d9d9', padding: 12, borderRadius: 6 }}>
									<Text code style={{ fontSize: 15 }}>const params = new URLSearchParams(location.search)</Text>
								</div>
								<Row gutter={16} style={{ marginTop: 24 }}>
									<Col xs={24} md={8}>
										<Card size="small" title="읽기" style={{ height: '100%' }}>
											<pre style={{ margin:0, fontSize:11 }}>{`params.get('q')\nparams.has('page')\n[...params.entries()]`}</pre>
										</Card>
									</Col>
									<Col xs={24} md={8}>
										<Card size="small" title="쓰기" style={{ height: '100%' }}>
											<pre style={{ margin:0, fontSize:11 }}>{`params.set('q','react')\nparams.append('tag','ui')\nparams.delete('page')`}</pre>
										</Card>
									</Col>
									<Col xs={24} md={8}>
										<Card size="small" title="네비게이션" style={{ height: '100%' }}>
											<pre style={{ margin:0, fontSize:11 }}>{`navigate({\n  pathname,\n  search: '?' + params.toString()\n})`}</pre>
										</Card>
									</Col>
								</Row>
								<Divider />
								<Row gutter={16}>
									<Col xs={24} md={12}>
										<Card size="small" title="주요 사용 사례" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
											<ul style={{ margin:0, paddingLeft:18, fontSize:12, lineHeight:1.6 }}>
												<li>검색 (q=react)</li>
												<li>필터 (category=frontend&category=devops)</li>
												<li>페이지네이션 (page=2)</li>
												<li>정렬 (sort=popular)</li>
												<li>상태 공유 & 북마크</li>
											</ul>
										</Card>
									</Col>
									<Col xs={24} md={12}>
										<Card size="small" title="주의사항" style={{ background: '#fff7e6', border: '1px solid #ffd591' }}>
											<ul style={{ margin:0, paddingLeft:18, fontSize:12, lineHeight:1.6 }}>
												<li>모든 값은 문자열</li>
												<li>숫자 변환 필요시 Number()</li>
												<li>빈 값 정리 전략 필요</li>
												<li>대량 업데이트 시 merge 여부 결정</li>
											</ul>
										</Card>
									</Col>
								</Row>
							</div>
						</Col>
					</Row>
				</Space>
			</Card>

			{/* 예제 그리드 */}
			<Row gutter={[16,16]}>
				<Col xs={24} md={12} lg={8}><BasicReadDemo /></Col>
				<Col xs={24} md={12} lg={8}><EditParamsDemo /></Col>
				<Col xs={24} md={24} lg={8}><LiveSearchDemo /></Col>
				<Col xs={24} md={24}><FilterPaginationDemo /></Col>
				<Col xs={24} md={12}><ToggleDemo /></Col>
				<Col xs={24} md={12}><MultiValueDemo /></Col>
				<Col xs={24} md={12}><CustomHookDemo /></Col>
				<Col xs={24} md={12}><HistoryModeDemo /></Col>
			</Row>

			{/* 가이드 */}
			<Card title="📘 URLSearchParams 패턴 가이드" style={{ background: '#f6f6f6' }}>
				<Row gutter={[16,16]}>
					<Col xs={24} sm={12} md={6}>
						<Card size="small">
							<Text strong>단일 값</Text>
							<Paragraph style={{ fontSize:12, margin: '8px 0 0 0' }}>params.get('q')</Paragraph>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card size="small">
							<Text strong>다중 값</Text>
							<Paragraph style={{ fontSize:12, margin: '8px 0 0 0' }}>params.append('tag','react')</Paragraph>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card size="small">
							<Text strong>병합 업데이트</Text>
							<Paragraph style={{ fontSize:12, margin: '8px 0 0 0' }}>기존 + 변경 항목만</Paragraph>
						</Card>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Card size="small">
							<Text strong>replace 네비게이션</Text>
							<Paragraph style={{ fontSize:12, margin: '8px 0 0 0' }}>뒤로가기 기록 최소화</Paragraph>
						</Card>
					</Col>
				</Row>
				<div style={{ marginTop: 16, padding: 12, background: '#fff0f6', border: '1px solid #ffadd2', borderRadius: 6 }}>
					<Text strong style={{ color: '#eb2f96' }}>⚠️ 성능 Tip:</Text>
					<Paragraph style={{ margin: '4px 0 0 0', fontSize: 12 }}>useMemo로 location.search 파싱 결과를 메모이제이션 하고, setParams 호출을 최소화하여 불필요한 리렌더를 줄입니다.</Paragraph>
				</div>
			</Card>
		</Space>
	)
}

export default URLSearchParamsPage

