import { useState } from 'react'

export function PercentageCalculatorTool() {
  const [mode, setMode] = useState<'of' | 'is' | 'change'>('of')
  // Mode 1: What is X% of Y?
  const [val1A, setVal1A] = useState('15')
  const [val1B, setVal1B] = useState('250')
  // Mode 2: X is what % of Y?
  const [val2A, setVal2A] = useState('45')
  const [val2B, setVal2B] = useState('180')
  // Mode 3: Percentage increase / decrease from X to Y
  const [val3A, setVal3A] = useState('100')
  const [val3B, setVal3B] = useState('125')

  const res1 = (Number(val1A) / 100) * Number(val1B)
  const res2 = Number(val2B) !== 0 ? (Number(val2A) / Number(val2B)) * 100 : 0
  const res3 = Number(val3A) !== 0 ? ((Number(val3B) - Number(val3A)) / Number(val3A)) * 100 : 0

  return (
    <div className="calc-functional-card">
      <div className="calc-tab-strip">
        <button
          type="button"
          className={`calc-tab ${mode === 'of' ? 'active' : ''}`}
          onClick={() => setMode('of')}
        >
          What is X% of Y?
        </button>
        <button
          type="button"
          className={`calc-tab ${mode === 'is' ? 'active' : ''}`}
          onClick={() => setMode('is')}
        >
          X is what % of Y?
        </button>
        <button
          type="button"
          className={`calc-tab ${mode === 'change' ? 'active' : ''}`}
          onClick={() => setMode('change')}
        >
          % Increase / Decrease
        </button>
      </div>

      <div className="calc-body">
        {mode === 'of' && (
          <div className="calc-row-inputs">
            <span className="calc-txt">What is</span>
            <input
              type="number"
              className="calc-input"
              value={val1A}
              onChange={(e) => setVal1A(e.target.value)}
            />
            <span className="calc-txt">% of</span>
            <input
              type="number"
              className="calc-input"
              value={val1B}
              onChange={(e) => setVal1B(e.target.value)}
            />
            <span className="calc-txt">?</span>
            <div className="calc-result-pill">
              Result: <strong>{Number.isFinite(res1) ? res1.toFixed(2) : '0.00'}</strong>
            </div>
          </div>
        )}

        {mode === 'is' && (
          <div className="calc-row-inputs">
            <input
              type="number"
              className="calc-input"
              value={val2A}
              onChange={(e) => setVal2A(e.target.value)}
            />
            <span className="calc-txt">is what % of</span>
            <input
              type="number"
              className="calc-input"
              value={val2B}
              onChange={(e) => setVal2B(e.target.value)}
            />
            <span className="calc-txt">?</span>
            <div className="calc-result-pill">
              Result: <strong>{Number.isFinite(res2) ? res2.toFixed(2) : '0.00'}%</strong>
            </div>
          </div>
        )}

        {mode === 'change' && (
          <div className="calc-row-inputs">
            <span className="calc-txt">From</span>
            <input
              type="number"
              className="calc-input"
              value={val3A}
              onChange={(e) => setVal3A(e.target.value)}
            />
            <span className="calc-txt">to</span>
            <input
              type="number"
              className="calc-input"
              value={val3B}
              onChange={(e) => setVal3B(e.target.value)}
            />
            <span className="calc-txt">:</span>
            <div className="calc-result-pill">
              {res3 >= 0 ? '+' : ''}
              <strong>{Number.isFinite(res3) ? res3.toFixed(2) : '0.00'}%</strong>
              <small>({res3 >= 0 ? 'Increase' : 'Decrease'})</small>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = useState('2000-01-15')

  const calcAge = () => {
    if (!birthDate) return null
    const birth = new Date(birthDate)
    const now = new Date()
    if (isNaN(birth.getTime())) return null

    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()

    if (days < 0) {
      months -= 1
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years -= 1
      months += 12
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalHours = totalDays * 24

    // Next birthday
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate())
    }
    const daysToNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return { years, months, days, totalDays, totalHours, daysToNext }
  }

  const ageData = calcAge()

  return (
    <div className="calc-functional-card">
      <div className="form-field max-w-sm">
        <label>Select Date of Birth:</label>
        <input
          type="date"
          className="calc-date-input"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      {ageData && (
        <div className="age-results-grid">
          <div className="age-hero-card">
            <span className="age-hero-num">{ageData.years}</span>
            <span className="age-hero-lbl">Years Old</span>
            <p className="age-hero-sub">
              {ageData.months} months and {ageData.days} days
            </p>
          </div>

          <div className="age-stats-column">
            <div className="age-stat-card">
              <span className="stat-label">Next Birthday In:</span>
              <strong className="stat-value text-emerald">{ageData.daysToNext} Days</strong>
            </div>
            <div className="age-stat-card">
              <span className="stat-label">Total Days Lived:</span>
              <strong className="stat-value">{ageData.totalDays.toLocaleString()} Days</strong>
            </div>
            <div className="age-stat-card">
              <span className="stat-label">Total Hours:</span>
              <strong className="stat-value">{ageData.totalHours.toLocaleString()} Hours</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function BmiCalculatorTool() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [heightCm, setHeightCm] = useState('175')
  const [weightKg, setWeightKg] = useState('70')
  const [heightFt, setHeightFt] = useState('5')
  const [heightIn, setHeightIn] = useState('9')
  const [weightLbs, setWeightLbs] = useState('154')

  let bmi = 0
  if (unit === 'metric') {
    const hM = Number(heightCm) / 100
    const w = Number(weightKg)
    if (hM > 0 && w > 0) bmi = w / (hM * hM)
  } else {
    const totalInches = Number(heightFt) * 12 + Number(heightIn)
    const w = Number(weightLbs)
    if (totalInches > 0 && w > 0) bmi = (w / (totalInches * totalInches)) * 703
  }

  let category = 'Normal weight'
  let catColor = '#0b6950'
  if (bmi < 18.5) {
    category = 'Underweight'
    catColor = '#3b82f6'
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Overweight'
    catColor = '#f59e0b'
  } else if (bmi >= 30) {
    category = 'Obesity'
    catColor = '#ef4444'
  }

  return (
    <div className="calc-functional-card">
      <div className="calc-tab-strip">
        <button
          type="button"
          className={`calc-tab ${unit === 'metric' ? 'active' : ''}`}
          onClick={() => setUnit('metric')}
        >
          Metric (cm / kg)
        </button>
        <button
          type="button"
          className={`calc-tab ${unit === 'imperial' ? 'active' : ''}`}
          onClick={() => setUnit('imperial')}
        >
          Imperial (ft, in / lbs)
        </button>
      </div>

      <div className="form-grid-2">
        {unit === 'metric' ? (
          <>
            <div className="form-field">
              <label>Height (cm):</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Weight (kg):</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-field">
              <label>Height (feet & inches):</label>
              <div className="input-group-row">
                <input
                  type="number"
                  placeholder="ft"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="in"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                />
              </div>
            </div>
            <div className="form-field">
              <label>Weight (lbs):</label>
              <input
                type="number"
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {bmi > 0 && (
        <div className="bmi-gauge-card">
          <div className="bmi-score-box">
            <span className="bmi-score-val" style={{ color: catColor }}>
              {bmi.toFixed(1)}
            </span>
            <span className="bmi-score-lbl">BMI SCORE</span>
            <span className="bmi-cat-tag" style={{ background: catColor, color: '#fff' }}>
              {category}
            </span>
          </div>

          <div className="bmi-scale-bar">
            <div className="bar-segment seg-blue">Underweight (&lt;18.5)</div>
            <div className="bar-segment seg-green">Normal (18.5 - 24.9)</div>
            <div className="bar-segment seg-yellow">Overweight (25 - 29.9)</div>
            <div className="bar-segment seg-red">Obese (30+)</div>
          </div>
        </div>
      )}
    </div>
  )
}

export function DiscountCalculatorTool() {
  const [price, setPrice] = useState('120')
  const [discount, setDiscount] = useState('25')
  const [tax, setTax] = useState('5')

  const original = Number(price) || 0
  const discPercent = Number(discount) || 0
  const taxPercent = Number(tax) || 0

  const saved = (original * discPercent) / 100
  const afterDiscount = original - saved
  const taxAmount = (afterDiscount * taxPercent) / 100
  const finalTotal = afterDiscount + taxAmount

  return (
    <div className="calc-functional-card">
      <div className="form-grid-3">
        <div className="form-field">
          <label>Original Price ($):</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Discount (%):</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Sales Tax / GST (%):</label>
          <input type="number" value={tax} onChange={(e) => setTax(e.target.value)} />
        </div>
      </div>

      <div className="calc-summary-grid">
        <div className="summary-item highlight">
          <span className="sum-label">Final Price to Pay</span>
          <strong className="sum-val text-emerald">${finalTotal.toFixed(2)}</strong>
        </div>
        <div className="summary-item">
          <span className="sum-label">Total Savings</span>
          <strong className="sum-val text-lime">${saved.toFixed(2)}</strong>
        </div>
        <div className="summary-item">
          <span className="sum-label">Tax Amount</span>
          <strong className="sum-val">${taxAmount.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  )
}

export function GstCalculatorTool() {
  const [amount, setAmount] = useState('5000')
  const [rate, setRate] = useState('18')
  const [type, setType] = useState<'exclusive' | 'inclusive'>('exclusive')

  const amt = Number(amount) || 0
  const r = Number(rate) || 0

  let gstAmount = 0
  let netAmount = 0
  let totalAmount = 0

  if (type === 'exclusive') {
    gstAmount = (amt * r) / 100
    netAmount = amt
    totalAmount = amt + gstAmount
  } else {
    netAmount = amt / (1 + r / 100)
    gstAmount = amt - netAmount
    totalAmount = amt
  }

  return (
    <div className="calc-functional-card">
      <div className="calc-tab-strip">
        <button
          type="button"
          className={`calc-tab ${type === 'exclusive' ? 'active' : ''}`}
          onClick={() => setType('exclusive')}
        >
          Add GST (Exclusive)
        </button>
        <button
          type="button"
          className={`calc-tab ${type === 'inclusive' ? 'active' : ''}`}
          onClick={() => setType('inclusive')}
        >
          Remove GST (Inclusive)
        </button>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label>Base Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="form-field">
          <label>GST Rate (%):</label>
          <div className="rate-selector-row">
            {[5, 12, 18, 28].map((preset) => (
              <button
                key={preset}
                type="button"
                className={`rate-chip ${rate === String(preset) ? 'active' : ''}`}
                onClick={() => setRate(String(preset))}
              >
                {preset}%
              </button>
            ))}
            <input
              type="number"
              className="rate-custom-input"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Custom"
            />
          </div>
        </div>
      </div>

      <div className="calc-summary-grid">
        <div className="summary-item">
          <span className="sum-label">Net Amount</span>
          <strong className="sum-val">{netAmount.toFixed(2)}</strong>
        </div>
        <div className="summary-item">
          <span className="sum-label">GST ({rate}%)</span>
          <strong className="sum-val text-lime">{gstAmount.toFixed(2)}</strong>
        </div>
        <div className="summary-item highlight">
          <span className="sum-label">Total Amount</span>
          <strong className="sum-val text-emerald">{totalAmount.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  )
}

export function LoanCalculatorTool() {
  const [principal, setPrincipal] = useState('25000')
  const [rate, setRate] = useState('7.5')
  const [tenureYears, setTenureYears] = useState('5')

  const p = Number(principal) || 0
  const annualR = Number(rate) || 0
  const years = Number(tenureYears) || 0

  const monthlyRate = annualR / 12 / 100
  const totalMonths = years * 12

  let monthlyEmi = 0
  let totalPayment = 0
  let totalInterest = 0

  if (p > 0 && monthlyRate > 0 && totalMonths > 0) {
    monthlyEmi = (p * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    totalPayment = monthlyEmi * totalMonths
    totalInterest = totalPayment - p
  }

  return (
    <div className="calc-functional-card">
      <div className="form-grid-3">
        <div className="form-field">
          <label>Loan Amount ($):</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Annual Interest Rate (%):</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Tenure (Years):</label>
          <input type="number" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} />
        </div>
      </div>

      <div className="calc-summary-grid">
        <div className="summary-item highlight">
          <span className="sum-label">Monthly EMI Payment</span>
          <strong className="sum-val text-emerald">${monthlyEmi.toFixed(2)}</strong>
        </div>
        <div className="summary-item">
          <span className="sum-label">Total Interest</span>
          <strong className="sum-val text-lime">${totalInterest.toFixed(2)}</strong>
        </div>
        <div className="summary-item">
          <span className="sum-label">Total Payment</span>
          <strong className="sum-val">${totalPayment.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  )
}
