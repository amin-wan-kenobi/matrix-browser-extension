document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(null, (data) => {
        console.log("📤 Popup retrieved:", data);

        if (data.totalExpense) {
            document.getElementById("cost").innerHTML = `
                <strong>Fixed Monthly Costs:</strong> $${data.monthlyFixedCosts.toFixed(2)}<br>
                <strong>Mortgage Payment:</strong> $${data.mortgagePayment.toFixed(2)}<br>
                <strong>Total Monthly Cost:</strong> <span style="color: red;">$${data.totalExpense.toFixed(2)}</span>
            `;
        } else {
            document.getElementById("cost").textContent = "No data found.";
        }
    });
});
