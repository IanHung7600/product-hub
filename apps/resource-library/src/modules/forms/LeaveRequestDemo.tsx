// 表單問卷 Module — live demo:請假申請單(realistic 員工面場景)
// 純前端可互動 demo(mock 送出,無真實 API)。消費 DS public 控件:
// Field / FieldGroup / FieldLabel / FieldDescription / FieldError / Input / Textarea / Select / DatePicker / Button / Steps
//
// 兩個變種對應 modules.ts forms.variants:
//   - single:單頁表單
//   - wizard:分步表單(Steps)

import { useState } from 'react'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
  Input,
  Textarea,
  Select,
  DatePicker,
  Button,
  Steps,
  StepItem,
  StepLabel,
  StepDescription,
  StepContent,
  toast,
} from '@qijenchen/design-system'

const LEAVE_TYPES = [
  { value: 'annual', label: '特休' },
  { value: 'sick', label: '病假' },
  { value: 'personal', label: '事假' },
  { value: 'marriage', label: '婚假' },
]

interface LeaveForm {
  type: string | null
  start: string
  end: string
  reason: string
}

const EMPTY: LeaveForm = { type: null, start: '', end: '', reason: '' }

function validate(form: LeaveForm) {
  return {
    type: form.type ? '' : '請選擇假別',
    start: form.start ? '' : '請選擇開始日期',
    end: form.end ? '' : '請選擇結束日期',
    reason: form.reason.trim().length >= 2 ? '' : '請填寫請假事由(至少 2 字)',
  }
}

function hasError(errors: Record<string, string>) {
  return Object.values(errors).some(Boolean)
}

// ── 變種 A:單頁表單 ────────────────────────────────────────────────
function SingleForm() {
  const [form, setForm] = useState<LeaveForm>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const errors = validate(form)
  const set = <K extends keyof LeaveForm>(k: K, v: LeaveForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const onSubmit = () => {
    setSubmitted(true)
    if (hasError(errors)) return
    toast({ variant: 'success', title: '請假申請已送出', description: '將進入主管簽核流程' })
    setForm(EMPTY)
    setSubmitted(false)
  }

  return (
    <div className="max-w-md">
      <FieldGroup>
        <Field required invalid={submitted && !!errors.type}>
          <FieldLabel>假別</FieldLabel>
          <Select
            options={LEAVE_TYPES}
            value={form.type}
            onChange={(v) => set('type', v)}
            aria-label="假別"
          />
          {submitted && errors.type && <FieldError>{errors.type}</FieldError>}
        </Field>

        <Field required invalid={submitted && !!errors.start}>
          <FieldLabel>開始日期</FieldLabel>
          <DatePicker value={form.start} onChange={(v) => set('start', v ?? '')} />
          {submitted && errors.start && <FieldError>{errors.start}</FieldError>}
        </Field>

        <Field required invalid={submitted && !!errors.end}>
          <FieldLabel>結束日期</FieldLabel>
          <DatePicker value={form.end} onChange={(v) => set('end', v ?? '')} />
          {submitted && errors.end && <FieldError>{errors.end}</FieldError>}
        </Field>

        <Field required invalid={submitted && !!errors.reason}>
          <FieldLabel>請假事由</FieldLabel>
          <Textarea
            rows={3}
            placeholder="簡述請假原因"
            value={form.reason}
            onChange={(e) => set('reason', e.target.value)}
          />
          <FieldDescription>主管會依事由核准</FieldDescription>
          {submitted && errors.reason && <FieldError>{errors.reason}</FieldError>}
        </Field>
      </FieldGroup>

      <div className="mt-[var(--layout-space-loose)] flex gap-[var(--layout-space-tight)]">
        <Button variant="primary" onClick={onSubmit}>送出申請</Button>
        <Button variant="secondary" onClick={() => { setForm(EMPTY); setSubmitted(false) }}>清除</Button>
      </div>
    </div>
  )
}

// ── 變種 B:分步表單(Wizard)──────────────────────────────────────
const STEPS = ['type', 'dates', 'reason'] as const
type StepId = (typeof STEPS)[number]

function WizardForm() {
  const [form, setForm] = useState<LeaveForm>(EMPTY)
  const [step, setStep] = useState<StepId>('type')
  const [completed, setCompleted] = useState<StepId[]>([])
  const errors = validate(form)
  const set = <K extends keyof LeaveForm>(k: K, v: LeaveForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const advance = (from: StepId, next: StepId, valid: boolean) => {
    if (!valid) return
    setCompleted((c) => (c.includes(from) ? c : [...c, from]))
    setStep(next)
  }

  return (
    <div className="max-w-md">
      <Steps value={step} onValueChange={(v) => setStep(v as StepId)} completedValues={completed}>
        <StepItem value="type">
          <StepLabel>假別</StepLabel>
          <StepDescription>選擇要申請的假別</StepDescription>
          <StepContent>
            <div className="flex flex-col gap-[var(--layout-space-loose)]">
              <Select options={LEAVE_TYPES} value={form.type} onChange={(v) => set('type', v)} aria-label="假別" />
              <div className="flex gap-[var(--layout-space-tight)]">
                <Button variant="primary" onClick={() => advance('type', 'dates', !errors.type)}>下一步</Button>
              </div>
            </div>
          </StepContent>
        </StepItem>

        <StepItem value="dates">
          <StepLabel>請假日期</StepLabel>
          <StepDescription>選擇起訖日期</StepDescription>
          <StepContent>
            <div className="flex flex-col gap-[var(--layout-space-loose)]">
              <DatePicker value={form.start} onChange={(v) => set('start', v ?? '')} />
              <DatePicker value={form.end} onChange={(v) => set('end', v ?? '')} />
              <div className="flex gap-[var(--layout-space-tight)]">
                <Button variant="primary" onClick={() => advance('dates', 'reason', !errors.start && !errors.end)}>下一步</Button>
                <Button variant="secondary" onClick={() => setStep('type')}>上一步</Button>
              </div>
            </div>
          </StepContent>
        </StepItem>

        <StepItem value="reason">
          <StepLabel>事由並送出</StepLabel>
          <StepDescription>填寫請假事由</StepDescription>
          <StepContent>
            <div className="flex flex-col gap-[var(--layout-space-loose)]">
              <Textarea
                rows={3}
                placeholder="簡述請假原因"
                value={form.reason}
                onChange={(e) => set('reason', e.target.value)}
              />
              <div className="flex gap-[var(--layout-space-tight)]">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (errors.reason) return
                    toast({ variant: 'success', title: '請假申請已送出', description: '將進入主管簽核流程' })
                    setForm(EMPTY)
                    setStep('type')
                    setCompleted([])
                  }}
                >
                  送出申請
                </Button>
                <Button variant="secondary" onClick={() => setStep('dates')}>上一步</Button>
              </div>
            </div>
          </StepContent>
        </StepItem>
      </Steps>
    </div>
  )
}

export function LeaveRequestDemo({ variant }: { variant: string }) {
  return variant === 'wizard' ? <WizardForm /> : <SingleForm />
}
