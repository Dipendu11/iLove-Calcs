document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elements ---
    const btnCalc = document.getElementById('calcBtn');
    const btnClear = document.getElementById('clearBtn');
    
    // Toggles
    const toggleAdv = document.getElementById('advToggle');
    const advSection = document.getElementById('advSection');
    const subBaseCheck = document.getElementById('subBaseCheck');
    const subBaseSection = document.getElementById('subBaseSection');

    // Inputs
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const depthInput = document.getElementById('depth');
    const wasteInput = document.getElementById('waste');
    
    // Advanced Inputs
    const priceInput = document.getElementById('price');
    const laborInput = document.getElementById('laborPrice');
    const densityInput = document.getElementById('density');
    const compactionInput = document.getElementById('compaction');
    
    // Sub-Base Input
    const baseDepthInput = document.getElementById('baseDepth');
    const baseDensityInput = document.getElementById('baseDensity');

    // Units
    const lUnit = document.getElementById('lengthUnit');
    const wUnit = document.getElementById('widthUnit');
    const dUnit = document.getElementById('depthUnit');

    // Results
    const resultBox = document.getElementById('resultBox');
    const resTons = document.getElementById('resTons');
    const resBaseTons = document.getElementById('resBaseTons');
    const baseResultBox = document.getElementById('baseResultBox');
    const costResultBox = document.getElementById('costResultBox');
    const resTotalCost = document.getElementById('resTotalCost');
    const resArea = document.getElementById('resArea');
    const resVol = document.getElementById('resVol');

    // Chart Elements
    const costBarWrapper = document.getElementById('costBarWrapper');
    const barMaterial = document.getElementById('barMaterial');
    const barLabor = document.getElementById('barLabor');

    // --- Toggle Logic ---
    toggleAdv.addEventListener('click', () => {
        advSection.classList.toggle('show');
        toggleAdv.textContent = advSection.classList.contains('show') 
            ? "Hide Cost & Compaction Settings ▲" 
            : "Show Cost & Compaction Settings ▼";
    });

    subBaseCheck.addEventListener('change', () => {
        subBaseSection.classList.toggle('show', subBaseCheck.checked);
        if(!subBaseCheck.checked) {
            baseResultBox.style.display = 'none';
        }
    });

    // --- Conversion Helper ---
    function toFeet(value, unit) {
        if (!value) return 0;
        switch (unit) {
            case 'ft': return value;
            case 'm': return value * 3.28084;
            case 'yd': return value * 3;
            case 'in': return value / 12;
            case 'cm': return value / 30.48;
            default: return value;
        }
    }

    // --- Calculation Logic ---
    btnCalc.addEventListener('click', () => {
        const L = parseFloat(lengthInput.value);
        const W = parseFloat(widthInput.value);
        const D = parseFloat(depthInput.value);
        
        if (!L || !W || !D) {
            alert("Please enter Length, Width, and Thickness.");
            return;
        }

        // 1. Normalize All Dimensions to Feet
        const feetL = toFeet(L, lUnit.value);
        const feetW = toFeet(W, wUnit.value);
        const feetD = toFeet(D, dUnit.value);

        // 2. Core Math
        const areaSqFt = feetL * feetW;
        const volumeCuFt = areaSqFt * feetD;

        // 3. Asphalt Tonnage
        const density = parseFloat(densityInput.value) || 145; 
        const compaction = parseFloat(compactionInput.value) || 1.15;
        const waste = parseFloat(wasteInput.value) || 0.05;

        // Formula: Vol * Density * Compaction * Waste
        const rawLbs = volumeCuFt * density;
        const compactedLbs = rawLbs * compaction;
        const finalLbs = compactedLbs * (1 + waste);
        const finalTons = finalLbs / 2000;

        // 4. Sub-Base Tonnage
        let baseTons = 0;
        if (subBaseCheck.checked) {
            const baseD = parseFloat(baseDepthInput.value) || 0;
            const baseDens = parseFloat(baseDensityInput.value) || 110;
            // Base input is strictly in Inches in HTML, so convert /12
            const baseVol = areaSqFt * (baseD / 12);
            baseTons = (baseVol * baseDens * 1.10) / 2000;
        }

        // 5. Cost Calculations
        const pricePerTon = parseFloat(priceInput.value) || 0;
        const laborRate = parseFloat(laborInput.value) || 0;
        
        let matCost = finalTons * pricePerTon;
        let laborCost = areaSqFt * laborRate;
        
        if (baseTons > 0 && pricePerTon > 0) {
            matCost += (baseTons * 30); // Est base cost
        }

        const totalCost = matCost + laborCost;

        // 6. Display Results
        resTons.textContent = finalTons.toFixed(2);
        resArea.textContent = areaSqFt.toFixed(0);
        resVol.textContent = volumeCuFt.toFixed(1);

        // Sub Base
        if (subBaseCheck.checked && baseTons > 0) {
            baseResultBox.style.display = 'block';
            resBaseTons.textContent = baseTons.toFixed(2);
        } else {
            baseResultBox.style.display = 'none';
        }

        // Cost Section & Visualizer
        if (totalCost > 0) {
            costResultBox.style.display = 'block';
            resTotalCost.textContent = "$" + totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
            // Visual Bar Logic (CSS Width)
            costBarWrapper.style.display = 'block';
            const total = matCost + laborCost;
            // Prevent divide by zero if user enters 0 price
            let matPercent = total > 0 ? (matCost / total) * 100 : 0;
            let laborPercent = total > 0 ? (laborCost / total) * 100 : 0;
            
            // Cap at 100% just in case of rounding
            if(matPercent + laborPercent > 100) laborPercent = 100 - matPercent;
            
            barMaterial.style.width = matPercent + "%";
            barLabor.style.width = laborPercent + "%";
        } else {
            costResultBox.style.display = 'none';
        }

        // Reveal
        resultBox.classList.add('visible');
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // --- Reset Logic ---
    btnClear.addEventListener('click', () => {
        lengthInput.value = '';
        widthInput.value = '';
        depthInput.value = '';
        priceInput.value = '';
        laborInput.value = '';
        baseDepthInput.value = '';
        
        subBaseCheck.checked = false;
        subBaseSection.classList.remove('show');
        
        resultBox.classList.remove('visible');
        costResultBox.style.display = 'none';
        baseResultBox.style.display = 'none';
    });
});
