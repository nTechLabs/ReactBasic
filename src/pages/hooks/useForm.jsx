// React hooks를 위한 import
import { useState, useCallback, useMemo } from 'react'
// Ant Design UI 컴포넌트들을 import
import { Card, Button, Space, Typography, Row, Col, Input, Form, Select, DatePicker, Checkbox, Radio, Alert, message } from 'antd'
// Ant Design 아이콘들을 import
import { 
  FormOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  SendOutlined
} from '@ant-design/icons'

// Typography 컴포넌트들을 구조 분해 할당으로 추출
const { Title, Paragraph, Text } = Typography
const { Option } = Select
const { TextArea } = Input

// =====================================
// 커스텀 useForm 훅 구현
// =====================================
const useForm = (initialValues = {}, validationRules = {}) => {
  // 폼 데이터 상태
  const [values, setValues] = useState(initialValues)
  // 에러 상태
  const [errors, setErrors] = useState({})
  // 터치된 필드 상태 (사용자가 한 번이라도 입력한 필드)
  const [touched, setTouched] = useState({})
  // 폼 제출 중 상태
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 필드 값 변경 핸들러
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 해당 필드의 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }, [errors])

  // 필드 블러 핸들러 (포커스를 잃을 때)
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
    
    // 유효성 검사 실행
    validateField(name, values[name])
  }, [values])

  // 개별 필드 유효성 검사
  const validateField = useCallback((name, value) => {
    const rule = validationRules[name]
    if (!rule) return true

    let error = ''

    // 필수 값 검사
    if (rule.required && (!value || value.toString().trim() === '')) {
      error = rule.message || `${name}은(는) 필수 입력 항목입니다.`
    }
    // 최소 길이 검사
    else if (rule.minLength && value && value.length < rule.minLength) {
      error = rule.message || `${name}은(는) 최소 ${rule.minLength}자 이상이어야 합니다.`
    }
    // 최대 길이 검사
    else if (rule.maxLength && value && value.length > rule.maxLength) {
      error = rule.message || `${name}은(는) 최대 ${rule.maxLength}자 이하여야 합니다.`
    }
    // 정규식 패턴 검사
    else if (rule.pattern && value && !rule.pattern.test(value)) {
      error = rule.message || `${name} 형식이 올바르지 않습니다.`
    }
    // 커스텀 유효성 검사 함수
    else if (rule.validator && value) {
      const validationResult = rule.validator(value, values)
      if (validationResult !== true) {
        error = validationResult
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }))

    return error === ''
  }, [validationRules, values])

  // 전체 폼 유효성 검사
  const validateForm = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(fieldName => {
      const fieldValue = values[fieldName]
      const isFieldValid = validateField(fieldName, fieldValue)
      if (!isFieldValid) {
        isValid = false
      }
    })

    return isValid
  }, [values, validationRules, validateField])

  // 폼 제출 핸들러
  const handleSubmit = useCallback(async (onSubmit) => {
    // 모든 필드를 터치된 것으로 표시
    const allFieldsTouched = {}
    Object.keys(validationRules).forEach(fieldName => {
      allFieldsTouched[fieldName] = true
    })
    setTouched(allFieldsTouched)

    // 유효성 검사
    const isValid = validateForm()
    
    if (!isValid) {
      message.error('입력값을 확인해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(values)
    } catch (error) {
      message.error('제출 중 오류가 발생했습니다.')
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validationRules, validateForm])

  // 폼 초기화
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  // 특정 필드 값 설정
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // 특정 필드 에러 설정
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [])

  // 폼이 유효한지 확인 (메모이제이션)
  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error) && 
           Object.keys(validationRules).every(key => values[key] !== undefined && values[key] !== '')
  }, [errors, values, validationRules])

  // 폼이 더티한지 확인 (초기값과 다른지)
  const isDirty = useMemo(() => {
    return Object.keys(values).some(key => values[key] !== initialValues[key])
  }, [values, initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validateField,
    validateForm
  }
}

// =====================================
// 1. 기본 회원가입 폼 예제
// =====================================
const RegistrationForm = () => {
  // useForm 훅 사용 - 초기값과 유효성 검사 규칙 정의
  const form = useForm(
    // 초기값
    {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      agreeTerms: false
    },
    // 유효성 검사 규칙
    {
      username: {
        required: true,
        minLength: 3,
        maxLength: 20,
        message: '사용자명은 3-20자 사이여야 합니다.'
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '올바른 이메일 주소를 입력하세요.'
      },
      password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: '비밀번호는 8자 이상, 대소문자와 숫자를 포함해야 합니다.'
      },
      confirmPassword: {
        required: true,
        validator: (value, allValues) => {
          if (value !== allValues.password) {
            return '비밀번호가 일치하지 않습니다.'
          }
          return true
        }
      },
      phone: {
        required: true,
        pattern: /^\d{3}-\d{4}-\d{4}$/,
        message: '전화번호는 000-0000-0000 형식으로 입력하세요.'
      },
      agreeTerms: {
        required: true,
        validator: (value) => {
          if (!value) {
            return '이용약관에 동의해주세요.'
          }
          return true
        }
      }
    }
  )

  // 폼 제출 핸들러
  const handleSubmit = async (formData) => {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('회원가입이 완료되었습니다!')
    console.log('제출된 데이터:', formData)
  }

  return (
    <Card title="회원가입 폼 (커스텀 useForm 훅)">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            {/* 사용자명 */}
            <div>
              <Text>사용자명 *</Text>
              <Input
                prefix={<UserOutlined />}
                placeholder="사용자명을 입력하세요"
                value={form.values.username}
                onChange={(e) => form.handleChange('username', e.target.value)}
                onBlur={() => form.handleBlur('username')}
                status={form.touched.username && form.errors.username ? 'error' : ''}
              />
              {form.touched.username && form.errors.username && (
                <Text type="danger" style={{ fontSize: '12px' }}>
                  {form.errors.username}
                </Text>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <Text>이메일 *</Text>
              <Input
                prefix={<MailOutlined />}
                placeholder="이메일을 입력하세요"
                value={form.values.email}
                onChange={(e) => form.handleChange('email', e.target.value)}
                onBlur={() => form.handleBlur('email')}
                status={form.touched.email && form.errors.email ? 'error' : ''}
              />
              {form.touched.email && form.errors.email && (
                <Text type="danger" style={{ fontSize: '12px' }}>
                  {form.errors.email}
                </Text>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <Text>전화번호 *</Text>
              <Input
                prefix={<PhoneOutlined />}
                placeholder="000-0000-0000"
                value={form.values.phone}
                onChange={(e) => form.handleChange('phone', e.target.value)}
                onBlur={() => form.handleBlur('phone')}
                status={form.touched.phone && form.errors.phone ? 'error' : ''}
              />
              {form.touched.phone && form.errors.phone && (
                <Text type="danger" style={{ fontSize: '12px' }}>
                  {form.errors.phone}
                </Text>
              )}
            </div>
          </Col>

          <Col xs={24} md={12}>
            {/* 비밀번호 */}
            <div>
              <Text>비밀번호 *</Text>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="비밀번호를 입력하세요"
                value={form.values.password}
                onChange={(e) => form.handleChange('password', e.target.value)}
                onBlur={() => form.handleBlur('password')}
                status={form.touched.password && form.errors.password ? 'error' : ''}
              />
              {form.touched.password && form.errors.password && (
                <Text type="danger" style={{ fontSize: '12px' }}>
                  {form.errors.password}
                </Text>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <Text>비밀번호 확인 *</Text>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="비밀번호를 다시 입력하세요"
                value={form.values.confirmPassword}
                onChange={(e) => form.handleChange('confirmPassword', e.target.value)}
                onBlur={() => form.handleBlur('confirmPassword')}
                status={form.touched.confirmPassword && form.errors.confirmPassword ? 'error' : ''}
              />
              {form.touched.confirmPassword && form.errors.confirmPassword && (
                <Text type="danger" style={{ fontSize: '12px' }}>
                  {form.errors.confirmPassword}
                </Text>
              )}
            </div>

            {/* 이용약관 동의 */}
            <div style={{ marginTop: 16 }}>
              <Checkbox
                checked={form.values.agreeTerms}
                onChange={(e) => form.handleChange('agreeTerms', e.target.checked)}
                onBlur={() => form.handleBlur('agreeTerms')}
              >
                이용약관에 동의합니다 *
              </Checkbox>
              {form.touched.agreeTerms && form.errors.agreeTerms && (
                <div>
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {form.errors.agreeTerms}
                  </Text>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* 폼 상태 표시 */}
        <Card size="small" style={{ backgroundColor: '#f6f6f6' }}>
          <Space>
            <Text type="secondary">폼 상태:</Text>
            <Text type={form.isValid ? 'success' : 'danger'}>
              {form.isValid ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
              {form.isValid ? ' 유효함' : ' 유효하지 않음'}
            </Text>
            <Text type="secondary">|</Text>
            <Text type={form.isDirty ? 'warning' : 'secondary'}>
              {form.isDirty ? '변경됨' : '변경되지 않음'}
            </Text>
          </Space>
        </Card>

        {/* 버튼들 */}
        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={form.isSubmitting}
            onClick={() => form.handleSubmit(handleSubmit)}
            disabled={!form.isValid}
            size="large"
          >
            회원가입
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={form.resetForm}
            disabled={form.isSubmitting}
            size="large"
          >
            초기화
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

// =====================================
// 2. 동적 폼 예제
// =====================================
const DynamicForm = () => {
  const [formFields, setFormFields] = useState([
    { name: 'name', label: '이름', type: 'text', required: true },
    { name: 'email', label: '이메일', type: 'email', required: true },
    { name: 'age', label: '나이', type: 'number', required: false }
  ])

  // 동적 초기값 생성
  const initialValues = useMemo(() => {
    const values = {}
    formFields.forEach(field => {
      values[field.name] = ''
    })
    return values
  }, [formFields])

  // 동적 유효성 검사 규칙 생성
  const validationRules = useMemo(() => {
    const rules = {}
    formFields.forEach(field => {
      if (field.required) {
        rules[field.name] = {
          required: true,
          message: `${field.label}은(는) 필수 입력 항목입니다.`
        }
      }
      if (field.type === 'email') {
        rules[field.name] = {
          ...rules[field.name],
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '올바른 이메일 주소를 입력하세요.'
        }
      }
    })
    return rules
  }, [formFields])

  const form = useForm(initialValues, validationRules)

  // 필드 추가
  const addField = () => {
    const fieldName = `field_${Date.now()}`
    setFormFields(prev => [...prev, {
      name: fieldName,
      label: `새 필드 ${prev.length + 1}`,
      type: 'text',
      required: false
    }])
  }

  // 필드 삭제
  const removeField = (fieldName) => {
    setFormFields(prev => prev.filter(field => field.name !== fieldName))
  }

  // 필드 타입 변경
  const changeFieldType = (fieldName, newType) => {
    setFormFields(prev => prev.map(field => 
      field.name === fieldName ? { ...field, type: newType } : field
    ))
  }

  const handleSubmit = async (formData) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    message.success('동적 폼이 제출되었습니다!')
    console.log('동적 폼 데이터:', formData)
  }

  const renderField = (field) => {
    const commonProps = {
      value: form.values[field.name] || '',
      onChange: (e) => form.handleChange(field.name, e.target.value),
      onBlur: () => form.handleBlur(field.name),
      status: form.touched[field.name] && form.errors[field.name] ? 'error' : '',
      placeholder: `${field.label}을 입력하세요`
    }

    switch (field.type) {
      case 'email':
        return <Input {...commonProps} type="email" />
      case 'number':
        return <Input {...commonProps} type="number" />
      case 'textarea':
        return <TextArea {...commonProps} rows={3} />
      default:
        return <Input {...commonProps} />
    }
  }

  return (
    <Card title="동적 폼 생성 예제">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* 폼 필드 설정 */}
        <Card size="small" title="폼 필드 관리">
          <Space direction="vertical" style={{ width: '100%' }}>
            {formFields.map((field, index) => (
              <div key={field.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text style={{ minWidth: 60 }}>{field.label}</Text>
                <Select
                  value={field.type}
                  onChange={(value) => changeFieldType(field.name, value)}
                  style={{ width: 100 }}
                  size="small"
                >
                  <Option value="text">텍스트</Option>
                  <Option value="email">이메일</Option>
                  <Option value="number">숫자</Option>
                  <Option value="textarea">긴 텍스트</Option>
                </Select>
                <Checkbox
                  checked={field.required}
                  onChange={(e) => {
                    setFormFields(prev => prev.map(f => 
                      f.name === field.name ? { ...f, required: e.target.checked } : f
                    ))
                  }}
                >
                  필수
                </Checkbox>
                {formFields.length > 1 && (
                  <Button size="small" danger onClick={() => removeField(field.name)}>
                    삭제
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addField} size="small" type="dashed">
              필드 추가
            </Button>
          </Space>
        </Card>

        {/* 동적 생성된 폼 */}
        <Row gutter={[16, 16]}>
          {formFields.map((field) => (
            <Col xs={24} md={12} key={field.name}>
              <div>
                <Text>
                  {field.label} {field.required && <Text type="danger">*</Text>}
                </Text>
                {renderField(field)}
                {form.touched[field.name] && form.errors[field.name] && (
                  <Text type="danger" style={{ fontSize: '12px' }}>
                    {form.errors[field.name]}
                  </Text>
                )}
              </div>
            </Col>
          ))}
        </Row>

        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Button
            type="primary"
            loading={form.isSubmitting}
            onClick={() => form.handleSubmit(handleSubmit)}
            disabled={!form.isValid}
          >
            동적 폼 제출
          </Button>
          <Button onClick={form.resetForm}>
            초기화
          </Button>
        </Space>
      </Space>
    </Card>
  )
}

// =====================================
// 메인 페이지 컴포넌트
// =====================================
const UseFormPage = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* 페이지 제목과 설명 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <FormOutlined style={{ color: '#722ed1' }} /> 
          useForm 커스텀 훅 예제
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          커스텀 useForm 훅을 사용한 폼 상태 관리와 유효성 검사를 학습해보세요
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 1. 회원가입 폼 */}
        <RegistrationForm />
        
        {/* 2. 동적 폼 */}
        <DynamicForm />

        {/* useForm 사용법 가이드 */}
        <Card 
          title="커스텀 useForm 훅 가이드" 
          style={{ backgroundColor: '#f9f0ff', border: '1px solid #d3adf7' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={5}>1. 기본 사용법</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const form = useForm(
  { username: '', email: '' }, // 초기값
  { 
    username: { required: true },
    email: { required: true, pattern: /.../ }
  } // 유효성 검사 규칙
);`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>2. 폼 제출 처리</Title>
              <div style={{ backgroundColor: '#f6f6f6', padding: '12px', borderRadius: '4px', fontSize: '12px' }}>
                <pre>{`const handleSubmit = async (data) => {
  // API 호출 또는 데이터 처리
  console.log(data);
};

<Button onClick={() => form.handleSubmit(handleSubmit)}>
  제출
</Button>`}</pre>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>3. 유효성 검사 규칙</Title>
              <ul style={{ fontSize: '12px', margin: 0 }}>
                <li><code>required</code>: 필수 입력</li>
                <li><code>minLength/maxLength</code>: 길이 제한</li>
                <li><code>pattern</code>: 정규식 패턴</li>
                <li><code>validator</code>: 커스텀 검증 함수</li>
              </ul>
            </Col>
            <Col xs={24} md={12}>
              <Title level={5}>4. 제공되는 기능</Title>
              <ul style={{ fontSize: '12px', margin: 0 }}>
                <li>실시간 유효성 검사</li>
                <li>폼 상태 관리 (dirty, valid, submitting)</li>
                <li>에러 메시지 표시</li>
                <li>필드별 터치 상태 추적</li>
              </ul>
            </Col>
          </Row>
          
          <Alert
            message="커스텀 훅의 장점"
            description="useForm 커스텀 훅을 사용하면 폼 로직을 재사용할 수 있고, 컴포넌트를 깔끔하게 유지할 수 있습니다. 복잡한 폼 상태 관리와 유효성 검사를 쉽게 처리할 수 있습니다."
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Card>
      </Space>
    </div>
  )
}

// 컴포넌트를 기본 내보내기로 설정
export default UseFormPage
