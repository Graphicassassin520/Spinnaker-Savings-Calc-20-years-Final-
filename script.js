document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', calculateProjection);
    document.getElementById('printChart').addEventListener('click', function() {
        window.print();
    });
});

function calculateProjection() {
    const guestName = document.getElementById('guestName').value;
    const companyName = document.getElementById('companyName').value || 'Current Ownership Company';
    const maintenanceFee = parseFloat(document.getElementById('maintenanceFee').value) || 0;
    const maintenanceFee2 = parseFloat(document.getElementById('maintenanceFee2').value) || 0;
    const priceIncrease = parseFloat(document.getElementById('priceIncrease').value) / 100 || 0;

    let data = [], data2 = [], labels = [], savingsData = [], totalSavings = 0;
    let fee1 = maintenanceFee, fee2 = maintenanceFee2;

    for (let year = 1; year <= 20; year++) {
        fee1 *= (1 + priceIncrease);
        fee2 *= (1 + priceIncrease);
        data.push(fee1);
        data2.push(fee2);
        labels.push(`Year ${year}`);
        let annualSavings = fee1 - fee2;
        savingsData.push(annualSavings);
        totalSavings += annualSavings;
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: companyName,
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Spinnaker',
                data: data2,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    let tableHtml = '<table><tr><th>Year</th><th>' + companyName + ' Fee ($)</th><th>Spinnaker Fee ($)</th><th>Savings ($)</th></tr>';
    data.forEach((amount, index) => {
        tableHtml += `<tr><td>${index + 1}</td><td>${amount.toLocaleString()}</td><td>${data2[index].toLocaleString()}</td><td>${savingsData[index].toLocaleString()}</td></tr>`;
    });
    tableHtml += `<tr><td colspan="3">Total Savings over 20 Years:</td><td>${totalSavings.toLocaleString()}</td></tr></table>`;
    document.getElementById('financialTable').innerHTML = tableHtml;

    document.getElementById('savings').innerHTML = `20-Year Savings with Spinnaker: $${Math.abs(totalSavings).toLocaleString()}`;
}
