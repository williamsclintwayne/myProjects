// script.js

let currentChart;
let csvData = [];

function addAppointment() {
    const appointmentInput = document.getElementById('new-appointment');
    const appointmentText = appointmentInput.value.trim();
    if (appointmentText) {
        const scheduleList = document.getElementById('schedule-list');
        const listItem = document.createElement('li');
        listItem.textContent = appointmentText;
        scheduleList.appendChild(listItem);
        appointmentInput.value = '';
    }
}

function uploadCSV() {
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                csvData = results.data;
                displayCSVData(csvData);
                populateCategoryFilter(csvData);
                generateFinancialOverview(csvData);
                updateChart(csvData);
            }
        });
    }
}

function displayCSVData(data) {
    const table = document.getElementById('csv-data-table');
    table.innerHTML = '';

    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

function populateCategoryFilter(data) {
    const categoryFilter = document.getElementById('filter-category');
    const categories = [...new Set(data.map(item => item['Category']))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterData() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;

    const filteredData = csvData.filter(row => {
        const matchesSearch = Object.values(row).some(value =>
            value.toLowerCase().includes(searchInput)
        );
        const matchesCategory = categoryFilter === '' || row['Category'] === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    displayCSVData(filteredData);
}

function updateChart(data) {
    const categories = {};
    data.forEach(entry => {
        const category = entry['Category'];
        const amount = parseFloat(entry['Money Out']) || 0;
        if (categories[category]) {
            categories[category] += amount;
        } else {
            categories[category] = amount;
        }
    });

    const ctx = document.getElementById('chart').getContext('2d');
    if (currentChart) {
        currentChart.destroy();
    }
    currentChart = new Chart(ctx, {
        type: 'bar', // Default chart type
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Expenses by Category',
                data: Object.values(categories),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Expenses by Category'
                }
            }
        }
    });
}

function changeChart() {
    const chartType = document.getElementById('chart-select').value;
    currentChart.config.type = chartType;
    currentChart.update();
}

function toggleView() {
    const tableContainer = document.getElementById('table-container');
    const chartContainer = document.getElementById('chart-container');
    if (tableContainer.style.display === 'none') {
        tableContainer.style.display = 'block';
        chartContainer.style.display = 'none';
    } else {
        tableContainer.style.display = 'none';
        chartContainer.style.display = 'block';
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('menu-toggle').addEventListener('click', function() {
    document.getElementById('wrapper').classList.toggle('toggled');
});

document.getElementById('search-input').addEventListener('input', filterData);
document.getElementById('filter-category').addEventListener('change', filterData);

document.addEventListener('DOMContentLoaded', () => {
    showSection('appointments');
});
