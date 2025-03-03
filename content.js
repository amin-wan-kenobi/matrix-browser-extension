console.log("✅ Content script is running! Extracting values...");

function extractValues() {
    console.log("🔍 Extracting values from the page...");

    function getValueByLabel(label) {
        const elements = [...document.querySelectorAll("*")]; // Get all elements
        for (let i = 0; i < elements.length; i++) {
            const text = elements[i].innerText.trim();
            if (text.startsWith(label)) {  // Match labels dynamically
                const nextElement = elements[i].nextElementSibling; // For values in the next column
                if (nextElement) {
                    return extractNumberFromText(nextElement.innerText);
                }
                return extractNumberFromText(text); // Handles inline values
            }
        }
        return 0; // Default if not found
    }

    function getCondoFees() {
        const elements = [...document.querySelectorAll("*")]; // Get all elements
        for (let i = 0; i < elements.length; i++) {
            const text = elements[i].innerText.trim();
            if (text.startsWith("Condo Fees")) {  // Condo Fees may have price inside
                return extractNumberFromText(text);
            }
        }
        return 0; // Default if not found
    }

    const munTaxes = getValueByLabel("Mun. Taxes");
    console.log("🏡 Mun. Taxes:", munTaxes);

    const schoolTaxes = getValueByLabel("School Taxes");
    console.log("🏫 School Taxes:", schoolTaxes);

    const condoFees = getCondoFees();  // Special handling for Condo Fees
    console.log("🏢 Condo Fees:", condoFees);

    const commonExp = getValueByLabel("Common Exp.");
    console.log("💰 Common Expenses:", commonExp);

    const { monthlyFixedCosts, mortgagePayment, totalExpense } = calculateMonthlyCost(munTaxes, schoolTaxes, condoFees, commonExp);

    chrome.runtime.sendMessage({
        monthlyFixedCosts,
        mortgagePayment,
        totalExpense
    });
}

function getPropertyPrice() {
    // Find all elements that contain "$" (prices)
    const priceElements = [...document.querySelectorAll("*")].filter(el => el.innerText.includes("$"));

    for (let el of priceElements) {
        const match = el.innerText.match(/\$([\d,]+)/);  // Extract number from text
        if (match) {
            const price = parseFloat(match[1].replace(/,/g, ""));
            if (price > 50000) {  // Ensure it's a reasonable property price
                return price;
            }
        }
    }
    return 0;  // Default if not found
}


function extractNumberFromText(text) {
    const match = text.match(/\$([\d,\.]+)/);  // Finds the first dollar amount in text
    return match ? parseFloat(match[1].replace(/,/g, "")) : 0;
}

function calculateMonthlyCost(munTaxes, schoolTaxes, condoFees, commonExp) {
    const annualTaxes = munTaxes + schoolTaxes;
    const monthlyFixedCosts = (annualTaxes / 12) + condoFees + commonExp;

    // Get property price from page
    const propertyPrice = getPropertyPrice();
    console.log("🏠 Property Price:", propertyPrice);

    // Mortgage calculations
    const downPayment = propertyPrice * 0.05;  // 5% down payment
    const loanAmount = propertyPrice - downPayment;  // Loan amount after down payment
    const interestRate = 4.75 / 100 / 12;  // Monthly interest rate
    const loanTermMonths = 25 * 12;  // 25 years mortgage term in months

    const mortgagePayment = loanAmount * (interestRate * Math.pow(1 + interestRate, loanTermMonths)) /
        (Math.pow(1 + interestRate, loanTermMonths) - 1);

    console.log("💰 Down Payment:", downPayment);
    console.log("🏦 Mortgage Payment:", mortgagePayment);

    const totalExpense = monthlyFixedCosts + mortgagePayment;
    console.log("📊 Total Monthly Cost with Mortgage:", totalExpense);

    return { monthlyFixedCosts, mortgagePayment, totalExpense };
}

// Run extraction
setTimeout(extractValues, 2000);
