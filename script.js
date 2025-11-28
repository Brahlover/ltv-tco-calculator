document.getElementById('calculateBtn').addEventListener('click', calculateCampaignValue);

// Add event listeners to update range values display dynamically
document.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('input', function() {
        document.getElementById(this.id + 'Value').textContent = this.value;
    });
});

// --- CORE FINANCIAL LOGIC FUNCTIONS ---

// 1. LTV Calculation (Profit Margin Included)
function calculateLTV(aov, pfr, clr, gcMargin) {
    if (aov <= 0 || pfr <= 0 || clr <= 0 || gcMargin <= 0) {
        return 0;
    }
    // LTV = AOV * PFR * CLR * GC_Margin (converted to decimal)
    let ltv = aov * pfr * clr * (gcMargin / 100);
    return ltv;
}

// 2. TCO Calculation (Total Operational Costs)
function calculateTCO(adSpend, agencyFee, laborHours, laborRate, croCost) {
    // Labor Cost = Labor Hours * Labor Rate
    let laborCost = laborHours * laborRate;

    // TCO = Ad Spend + Agency Fee + Labor Cost + CRO Cost
    let tco = adSpend + agencyFee + laborCost + croCost;
    return tco;
}

// 3. Indirect Benefits (Vision) Scoring
function calculateVisionScore(brandLift, seoSignal, marketResearch) {
    let totalScore = brandLift + seoSignal + marketResearch;
    let message;

    if (totalScore >= 12) {
        message = "High Strategic Value 🚀: The campaign delivers strong, lasting benefits beyond sales.";
    } else if (totalScore >= 6) {
        message = "Medium Strategic Value ✨: Moderate indirect benefits contributing to overall business health.";
    } else {
        message = "Low Strategic Value 📉: Focus remains primarily on direct financial returns.";
    }

    return message;
}

// --- MAIN CALCULATION FUNCTION ---

function calculateCampaignValue() {
    // --- 1. Read Inputs from HTML ---

    // LTV Inputs (Parsing inputs as floating-point numbers)
    const aov = parseFloat(document.getElementById('aov').value);
    const gcMargin = parseFloat(document.getElementById('gcMargin').value);
    const pfr = parseFloat(document.getElementById('pfr').value);
    const clr = parseFloat(document.getElementById('clr').value);
    const newCustomers = parseFloat(document.getElementById('newCustomers').value);

    // TCO Inputs
    const adSpend = parseFloat(document.getElementById('adSpend').value);
    const agencyFee = parseFloat(document.getElementById('agencyFee').value);
    const croCost = parseFloat(document.getElementById('croCost').value);
    const laborHours = parseFloat(document.getElementById('laborHours').value);
    const laborRate = parseFloat(document.getElementById('laborRate').value);

    // Vision Inputs
    const brandLift = parseInt(document.getElementById('brandLift').value);
    const seoSignal = parseInt(document.getElementById('seoSignal').value);
    const marketResearch = parseInt(document.getElementById('marketResearch').value);


    // --- 2. Run Calculations ---

    const ltv = calculateLTV(aov, pfr, clr, gcMargin);
    const tco = calculateTCO(adSpend, agencyFee, laborHours, laborRate, croCost);

    // Calculate final financial metrics
    const totalBenefit = ltv * newCustomers;
    const netProfit = totalBenefit - tco;
    const cpa = tco / newCustomers;

    // Ensure TCO is not zero before calculating ROI
    const roi = (tco > 0) ? (netProfit / tco) * 100 : 0;

    const visionScore = calculateVisionScore(brandLift, seoSignal, marketResearch);

    // --- 3. Display Results in HTML ---

    // LTV, TCO, CPA
    document.getElementById('ltvResult').querySelector('.metric-value').textContent = ltv.toFixed(2);
    document.getElementById('tcoResult').querySelector('.metric-value').textContent = tco.toFixed(2);
    document.getElementById('cpaResult').querySelector('.metric-value').textContent = cpa.toFixed(2);

    // Final ROI and Net Profit
    const roiResultElement = document.getElementById('roiResult').querySelector('.metric-value');
    roiResultElement.textContent = `${roi.toFixed(2)}%`;

    // Update ROI metric box style based on profitability
    const roiBox = document.getElementById('roiResult');
    if (netProfit >= 0) {
        roiBox.style.borderLeftColor = '#28a745'; // Green for profit
        roiResultElement.style.color = '#28a745';
        roiBox.innerHTML = `Final LTV ROI: <span class="metric-value">${roi.toFixed(2)}%</span> <br> ($${netProfit.toFixed(2)} Net Profit)`;
    } else {
        roiBox.style.borderLeftColor = '#dc3545'; // Red for loss
        roiResultElement.style.color = '#dc3545';
        roiBox.innerHTML = `Final LTV ROI: <span class="metric-value">${roi.toFixed(2)}%</span> <br> ($${netProfit.toFixed(2)} Net Loss)`;
    }

    // Vision Score
    document.getElementById('visionScoreOutput').textContent = visionScore;
}