# 📈 Mood Score System for Economic Wellbeing

This document defines how to assign a simple mood score to economic metrics tracked via FRED to help users intuitively understand financial health across common life concerns. Each metric receives a mood score: **Yay** (positive), **Meh** (neutral), or **Nay** (negative). These scores can then be aggregated per question/topic to summarize consumer sentiment.

---

## 🎯 Scoring Key

| Mood | Meaning                 | Icon     | Score |
|------|--------------------------|----------|-------|
| Yay  | Favorable for consumers | 🟢 🎉    | +1    |
| Meh  | Neutral or mixed        | 🟡 😐    | 0     |
| Nay  | Unfavorable for consumers | 🔴 😞  | -1    |

---

## 🏠 1. Can I afford to buy a home or keep up with rent?

| Metric | Yay | Meh | Nay |
|--------|-----|-----|-----|
| MORTGAGE30US | ↓ > 0.5pp | ±0.5pp | ↑ > 0.5pp |
| CSUSHPINSA | ↓ YoY | ±2% YoY | ↑ > 2% YoY |
| CUSR0000SEHA | ↓ YoY | ±2% YoY | ↑ > 2% YoY |
| HOUST | ↑ > 5% YoY | ±5% | ↓ > 5% YoY |
| MEHOINUSA672N | ↑ > 3% YoY | ±3% | ↓ > 3% |

---

## 🚗 2. Is buying or maintaining a car affordable?

| Metric | Yay | Meh | Nay |
|--------|-----|-----|-----|
| CUSR0000SETA01 | ↓ YoY | ±2% | ↑ > 2% YoY |
| CUSR0000SETA02 | ↓ YoY | ±3% | ↑ > 3% |
| CUSR0000SETB | ↓ > 5% YoY | ±5% | ↑ > 5% |
| TERMCBAUTO48NS | ↓ > 0.5pp | ±0.5pp | ↑ > 0.5pp |
| DMOTRC1 | ↓ YoY | Flat | ↑ YoY |

---

## 💼 3. Will I lose my job or find a better one?

| Metric | Yay | Meh | Nay |
|--------|-----|-----|-----|
| UNRATE | ↓ > 0.3pp | ±0.3pp | ↑ > 0.3pp |
| PAYEMS | ↑ > 200k/month | ±100k | < 100k |
| JTSJOL | ↑ > 5% YoY | Flat | ↓ > 5% |
| JTSQUR | ↑ > 2.5% | 2%–2.5% | < 2% |
| CES0500000003 | ↑ > 3.5% YoY | ±1% | ↓ YoY |

---

## 🛒 4. Can I afford groceries, gas, or other daily expenses?

| Metric | Yay | Meh | Nay |
|--------|-----|-----|-----|
| CUSR0000SAF11 | ↓ YoY | ±2% | ↑ > 2% |
| CUSR0000SETB | ↓ > 5% | Flat | ↑ > 5% |
| CPILFESL | < 2% | 2–3% | > 3% |
| PCEPI | < 2% | 2–3% | > 3% |
| DSPIC96 | ↑ > 3% YoY | Flat | ↓ YoY |

---

## 🏥 5. Will healthcare or prescription drugs be affordable?

| Metric | Yay | Meh | Nay |
|--------|-----|-----|-----|
| CPIMEDSL | ↓ YoY | ±2% | ↑ > 2% |
| CUSR0000SEMF | ↓ YoY | ±2% | ↑ > 2% |
| DHLCRC1 | ↓ YoY | Flat | ↑ YoY |
| ECI_BENEFITS | ↑ > 3% YoY | ±2% | ↓ YoY |
| CUSR0000SEMD | ↓ YoY | ±3% | ↑ > 3% |

---

## 🎓 6. Is college or trade school affordable?

| Metric | Yay | Meh | Nay |
|--------|-----|-----|-----|
| CUSR0000SEEB01 | ↓ YoY | Flat | ↑ > 2% YoY |
| SLOAS | ↓ YoY | Flat | ↑ YoY |
| CUSR0000SEEA | ↓ YoY | ±2% | ↑ > 2% |

| PSAVERT | > 6% | 4–6% | < 4% |

---

## 🧓 7. Will I be able to retire comfortably?

| Metric | Yay | Meh | Nay |
|--------|-----|-----|-----|
| PSAVERT | > 6% | 4–6% | < 4% |
| SP500 | ↑ > 5% YoY | Flat | ↓ YoY |
| DGS10 | 3–4% | 2–3% | <2% or >4% |
| CPIAUCSL | < 2% | 2–3% | > 3% |
| DSPIC96 | ↑ > 3% | ±1% | ↓ YoY |

---

## 🧒 8. Can I keep up with utility bills or childcare costs?

| Metric | Yay | Meh | Nay |
|--------|-----|-----|-----|
| CUSR0000SEHF01 | ↓ YoY | ±2% | ↑ > 2% |
| CUSR0000SEEB03 | ↓ YoY | ±2% | ↑ > 2% |
| CUSR0000SEHF02 | ↓ YoY | ±2% | ↑ > 2% |
| DSERRG3 | ↓ YoY | Flat | ↑ YoY |
| DSPIC96 | ↑ > 3% | Flat | ↓ YoY |

---

## 💰 9. Will my wages or savings keep up with rising prices?

| Metric | Yay | Meh | Nay |
|--------|-----|-----|-----|
| CES0500000003 | ↑ > 3.5% | ±1% | ↓ YoY |
| CPIAUCSL | < 2% | 2–3% | > 3% |
| PSAVERT | > 6% | 4–6% | < 4% |
| PPIACO | ↓ YoY | Flat | ↑ YoY |
| DSPIC96 | ↑ > 3% | ±1% | ↓ YoY |

---

## 🔧 10. Can I handle unexpected expenses like medical bills or repairs?

| Metric | Yay | Meh | Nay |
|--------|-----|-----|-----|
| PSAVERT | > 6% | 4–6% | < 4% |
| CPIMEDSL | ↓ YoY | ±2% | ↑ > 2% |
| CUSR0000SETD | ↓ YoY | ±2% | ↑ > 2% |
| HDTGPDUSQ163N | ↓ YoY | Flat | ↑ YoY |
| DSPIC96 | ↑ > 3% | Flat | ↓ YoY |

---

## 📊 Aggregating to a Question Mood

To get a mood for each life question:

- Compute the average of the metric mood scores (Yay = +1, Meh = 0, Nay = -1).
- Interpret the average score:
  - **+0.5 or more** → Yay 🟢
  - **-0.5 to +0.5** → Meh 🟡
  - **Less than -0.5** → Nay 🔴

