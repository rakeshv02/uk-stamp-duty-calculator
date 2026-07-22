const { useState } = React;

const SDLT_STANDARD = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 925000, rate: 0.05 },
  { min: 925000, max: 1500000, rate: 0.10 },
  { min: 1500000, max: Infinity, rate: 0.12 },
];

const SDLT_FTB = [
  { min: 0, max: 425000, rate: 0 },
  { min: 425000, max: 625000, rate: 0.05 },
];

const LBTT_STANDARD = [
  { min: 0, max: 145000, rate: 0 },
  { min: 145000, max: 250000, rate: 0.02 },
  { min: 250000, max: 325000, rate: 0.05 },
  { min: 325000, max: 750000, rate: 0.10 },
  { min: 750000, max: Infinity, rate: 0.12 },
];

const LBTT_FTB = [
  { min: 0, max: 175000, rate: 0 },
  { min: 175000, max: 250000, rate: 0.02 },
  { min: 250000, max: 325000, rate: 0.05 },
  { min: 325000, max: 750000, rate: 0.10 },
  { min: 750000, max: Infinity, rate: 0.12 },
];

const LTT_STANDARD = [
  { min: 0, max: 225000, rate: 0 },
  { min: 225000, max: 400000, rate: 0.06 },
  { min: 400000, max: 750000, rate: 0.075 },
  { min: 750000, max: 1500000, rate: 0.10 },
  { min: 1500000, max: Infinity, rate: 0.12 },
];

function calcBrackets(price, brackets) {
  let tax = 0;
  for (const b of brackets) {
    if (price <= b.min) break;
    tax += (Math.min(price, b.max) - b.min) * b.rate;
  }
  return tax;
}

function calcWithSurcharge(price, brackets, surcharge) {
  let tax = 0;
  for (const b of brackets) {
    if (price <= b.min) break;
    tax += (Math.min(price, b.max) - b.min) * (b.rate + surcharge);
  }
  return tax;
}

function calcEnglandSDLT(price, buyerType) {
  if (buyerType === "additional") return calcWithSurcharge(price, SDLT_STANDARD, 0.03);
  if (buyerType === "firsttime") return price > 625000 ? calcBrackets(price, SDLT_STANDARD) : calcBrackets(price, SDLT_FTB);
  return calcBrackets(price, SDLT_STANDARD);
}

function calcScotlandLBTT(price, buyerType) {
  const brackets = buyerType === "firsttime" ? LBTT_FTB : LBTT_STANDARD;
  const base = calcBrackets(price, brackets);
  return base + (buyerType === "additional" ? price * 0.06 : 0);
}

function calcWalesLTT(price, buyerType) {
  return calcBrackets(price, LTT_STANDARD) + (buyerType === "additional" ? price * 0.04 : 0);
}

function getBandBreakdown(price, brackets, surcharge) {
  return brackets.map(b => {
    if (price <= b.min) return null;
    const portion = Math.min(price, b.max) - b.min;
    const effectiveRate = b.rate + (surcharge || 0);
    const tax = portion * effectiveRate;
    const label = b.max === Infinity
      ? `Over £${(b.min / 1000).toFixed(0)}k`
      : `£${(b.min / 1000).toFixed(0)}k – £${(b.max / 1000).toFixed(0)}k`;
    return { label, portion, rate: effectiveRate * 100, tax };
  }).filter(Boolean);
}

const fmt = n => "£" + Math.round(n).toLocaleString();
const pct = n => n.toFixed(2) + "%";

export default function UKStampDutyCalculator() {
  const [price, setPrice] = useState("350000");
  const [buyerType, setBuyerType] = useState("movinghome");
  const [region, setRegion] = useState("england");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const p = parseFloat(price) || 0;
    let tax = 0, bands = [], taxName = "";

    if (region === "england") {
      taxName = "SDLT";
      tax = calcEnglandSDLT(p, buyerType);
      const effectiveBrackets = buyerType === "firsttime" && p <= 625000 ? SDLT_FTB : SDLT_STANDARD;
      const surcharge = buyerType === "additional" ? 0.03 : 0;
      bands = getBandBreakdown(p, effectiveBrackets, surcharge);
    } else if (region === "scotland") {
      taxName = "LBTT";
      const brackets = buyerType === "firsttime" ? LBTT_FTB : LBTT_STANDARD;
      tax = calcScotlandLBTT(p, buyerType);
      bands = getBandBreakdown(p, brackets, 0);
      if (buyerType === "additional") bands.push({ label: "ADS surcharge (6%)", portion: p, rate: 6, tax: p * 0.06 });
    } else {
      taxName = "LTT";
      tax = calcWalesLTT(p, buyerType);
      bands = getBandBreakdown(p, LTT_STANDARD, 0);
      if (buyerType === "additional") bands.push({ label: "Additional surcharge (4%)", portion: p, rate: 4, tax: p * 0.04 });
    }

    const effectiveRate = p > 0 ? (tax / p) * 100 : 0;
    setResult({ p, tax, effectiveRate, bands, taxName });
  };

  const inputStyle = { width: "100%", padding: "12px", border: "2px solid #e9d5ff", borderRadius: 10, fontSize: 16, boxSizing: "border-box", outline: "none" };
  const labelStyle = { display: "block", fontWeight: 600, marginBottom: 6, color: "#333" };
  const buyerLabel = { firsttime: "First-Time Buyer", movinghome: "Moving Home", additional: "Additional / Buy-to-Let" }[buyerType];
  const regionLabel = { england: "England & NI (SDLT)", scotland: "Scotland (LBTT)", wales: "Wales (LTT)" }[region];

  return (
    <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", background: "#faf5ff", minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏡</div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#1a1a2e" }}>UK Stamp Duty Calculator</h1>
          <p style={{ margin: "8px 0 0", color: "#555", fontSize: 16 }}>SDLT (England & NI) · LBTT (Scotland) · LTT (Wales) — 2024</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
            <div>
              <label style={labelStyle}>Property Price</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#666", fontWeight: 700 }}>£</span>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={{ ...inputStyle, paddingLeft: 28 }} placeholder="350000" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Region</label>
              <select value={region} onChange={e => setRegion(e.target.value)} style={inputStyle}>
                <option value="england">England & Northern Ireland</option>
                <option value="scotland">Scotland</option>
                <option value="wales">Wales</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Buyer Type</label>
              <select value={buyerType} onChange={e => setBuyerType(e.target.value)} style={inputStyle}>
                <option value="firsttime">First-Time Buyer</option>
                <option value="movinghome">Moving Home (replacing main residence)</option>
                <option value="additional">Additional Property / Buy-to-Let</option>
              </select>
            </div>
          </div>
          <button onClick={calculate} style={{ width: "100%", marginTop: 24, padding: "16px", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", border: "none", borderRadius: 12, fontSize: 18, fontWeight: 700, cursor: "pointer" }}>
            Calculate Stamp Duty
          </button>
        </div>

        {result && (
          <>
            <div style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", borderRadius: 16, padding: 28, marginBottom: 24, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>{buyerLabel} · {regionLabel}</div>
                <div style={{ fontSize: 42, fontWeight: 900 }}>{fmt(result.tax)}</div>
                <div style={{ fontSize: 16, opacity: 0.9 }}>{result.taxName} due on {fmt(result.p)} property</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Effective rate</div>
                <div style={{ fontSize: 32, fontWeight: 800 }}>{pct(result.effectiveRate)}</div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Total incl. duty: {fmt(result.p + result.tax)}</div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Tax Band Breakdown</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#faf5ff" }}>
                      {["Band", "Portion in This Band", "Rate", `${result.taxName} Due`].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#333", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.bands.map((band, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f3f5", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "11px 14px", color: "#333" }}>{band.label}</td>
                        <td style={{ padding: "11px 14px", color: "#555" }}>{fmt(band.portion)}</td>
                        <td style={{ padding: "11px 14px", color: band.rate === 0 ? "#059669" : "#7c3aed", fontWeight: 600 }}>{band.rate.toFixed(1)}%</td>
                        <td style={{ padding: "11px 14px", color: band.tax === 0 ? "#059669" : "#1a1a2e", fontWeight: band.tax > 0 ? 600 : 400 }}>{band.tax === 0 ? "£0 ✓" : fmt(band.tax)}</td>
                      </tr>
                    ))}
                    <tr style={{ background: "#faf5ff", fontWeight: 700 }}>
                      <td colSpan={3} style={{ padding: "12px 14px", color: "#1a1a2e" }}>Total {result.taxName}</td>
                      <td style={{ padding: "12px 14px", color: "#7c3aed", fontSize: 16 }}>{fmt(result.tax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Cost Breakdown</h3>
              <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ width: `${(result.p / (result.p + result.tax)) * 100}%`, background: "#7c3aed", opacity: 0.15 }} />
                <div style={{ width: `${(result.tax / (result.p + result.tax)) * 100}%`, background: "#7c3aed" }} />
              </div>
              <div style={{ display: "flex", gap: 24, fontSize: 13, flexWrap: "wrap" }}>
                <div><span style={{ display: "inline-block", width: 12, height: 12, background: "#7c3aed", opacity: 0.25, borderRadius: 2, marginRight: 6 }} />Property: {fmt(result.p)}</div>
                <div><span style={{ display: "inline-block", width: 12, height: 12, background: "#7c3aed", borderRadius: 2, marginRight: 6 }} />{result.taxName}: {fmt(result.tax)}</div>
                <div style={{ marginLeft: "auto", fontWeight: 700 }}>Total: {fmt(result.p + result.tax)}</div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 24 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>Compare by Buyer Type</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                {[
                  { label: "First-Time Buyer", key: "firsttime" },
                  { label: "Moving Home", key: "movinghome" },
                  { label: "Additional Property", key: "additional" },
                ].map((item) => {
                  const p = parseFloat(price) || 0;
                  const t = region === "england" ? calcEnglandSDLT(p, item.key) : region === "scotland" ? calcScotlandLBTT(p, item.key) : calcWalesLTT(p, item.key);
                  const isCurrent = item.key === buyerType;
                  return (
                    <div key={item.key} style={{ padding: 16, borderRadius: 12, border: `2px solid ${isCurrent ? "#7c3aed" : "#e9d5ff"}`, background: isCurrent ? "#faf5ff" : "#fff", textAlign: "center" }}>
                      <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>{item.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: isCurrent ? "#7c3aed" : "#333" }}>{fmt(t)}</div>
                      {isCurrent && <div style={{ fontSize: 11, color: "#7c3aed", marginTop: 4, fontWeight: 600 }}>← Your selection</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 12, padding: 16, fontSize: 13, color: "#664d03", marginBottom: 24 }}>
              <strong>Important:</strong> SDLT rates shown use the thresholds in force from September 2022 (£250k nil-rate). From <strong>1 April 2025</strong> the nil-rate threshold reverts to £125,000 (£300,000 for first-time buyers). Always confirm with HMRC or a solicitor before exchange.
            </div>
          </>
        )}

        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>📊 SDLT Rate Tables (England & NI)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { title: "Standard / Moving Home", rows: [["Up to £250,000","0%"],["£250,001–£925,000","5%"],["£925,001–£1.5m","10%"],["Over £1.5m","12%"]] },
              { title: "First-Time Buyer Relief", rows: [["Up to £425,000","0%"],["£425,001–£625,000","5%"],["Over £625,000","Standard rates (no relief)"]], note: "Only on properties up to £625,000" },
            ].map((tbl, ti) => (
              <div key={ti}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: "#7c3aed" }}>{tbl.title}</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {tbl.rows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f3f5" }}>
                        <td style={{ padding: "8px 0", color: "#444" }}>{row[0]}</td>
                        <td style={{ padding: "8px 0", fontWeight: 600, color: row[1] === "0%" ? "#059669" : "#7c3aed", textAlign: "right" }}>{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tbl.note && <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>{tbl.note}</p>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 12, background: "#faf5ff", borderRadius: 10, fontSize: 13, color: "#555" }}>
            <strong>Additional property surcharge:</strong> +3% on every band (England/NI) · +6% ADS (Scotland) · +4% (Wales)
          </div>
        </div>
      </div>
    </div>
  );
}
