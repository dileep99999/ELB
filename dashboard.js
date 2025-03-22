document.addEventListener('DOMContentLoaded', function() {
    const filterDateInput = document.getElementById('filterDate');
    const refreshBtn = document.getElementById('refreshBtn');
    const downloadPdfBtn = document.getElementById('downloadPdf');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookingsTable = document.getElementById('bookingsTable');
    const noBookings = document.getElementById('noBookings');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const totalBookingsEl = document.getElementById('totalBookings');
    const totalDepartmentsEl = document.getElementById('totalDepartments');
    const deptBreakdownEl = document.getElementById('deptBreakdown');
    
    // Check authentication status
    checkAuthStatus();
    
    // Set default filter date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    filterDateInput.value = `${year}-${month}-${day}`;
    
    // Load bookings on page load
    loadBookings();
    
    // Event listeners
    filterDateInput.addEventListener('change', loadBookings);
    refreshBtn.addEventListener('click', loadBookings);
    downloadPdfBtn.addEventListener('click', generatePDF);
    logoutBtn.addEventListener('click', logout);
    
    // Function to check authentication status
    function checkAuthStatus() {
        const token = localStorage.getItem('elbsAuthToken');
        
        if (!token) {
            // Redirect to login page if not logged in
            window.location.href = 'admin.html';
            return;
        }
        
        // Verify token with backend
        verifyToken(token);
    }
    
    // Function to verify token with backend
    async function verifyToken(token) {
        try {
            const response = await fetch('https://elbs-api.netlify.app/.netlify/functions/verifyToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                // Token is invalid, redirect to login
                localStorage.removeItem('elbsAuthToken');
                window.location.href = 'admin.html';
            }
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    }
    
    // Function to load bookings
    async function loadBookings() {
        showLoading(true);
        
        try {
            const token = localStorage.getItem('elbsAuthToken');
            const date = filterDateInput.value;
            
            const response = await fetch(`https://elbs-api.netlify.app/.netlify/functions/getBookings?date=${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                displayBookings(data.bookings);
                updateStatistics(data.bookings);
            } else {
                console.error('Error loading bookings:', data.message);
                showNoBookings(true);
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
            showNoBookings(true);
        } finally {
            showLoading(false);
        }
    }
    
    // Function to display bookings
    function displayBookings(bookings) {
        bookingsTable.innerHTML = '';
        
        if (bookings.length === 0) {
            showNoBookings(true);
            return;
        }
        
        showNoBookings(false);
        
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            
            // Format date for display
            const bookingDate = new Date(booking.bookingDate);
            const formattedDate = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}-${String(bookingDate.getDate()).padStart(2, '0')}`;
            
            // Format timestamp for display
            const timestamp = new Date(booking.timestamp);
            const formattedTime = timestamp.toLocaleTimeString();
            
            row.innerHTML = `
                <td>${booking.name}</td>
                <td>${booking.psNumber}</td>
                <td>${booking.deptCode}</td>
                <td>${formattedDate}</td>
                <td>${formattedTime}</td>
            `;
            
            bookingsTable.appendChild(row);
        });
    }
    
    // Function to update statistics
    function updateStatistics(bookings) {
        // Total bookings
        totalBookingsEl.textContent = bookings.length;
        
        // Department statistics
        const departments = {};
        bookings.forEach(booking => {
            if (departments[booking.deptCode]) {
                departments[booking.deptCode]++;
            } else {
                departments[booking.deptCode] = 1;
            }
        });
        
        // Total departments
        totalDepartmentsEl.textContent = Object.keys(departments).length;
        
        // Department breakdown
        deptBreakdownEl.innerHTML = '';
        
        Object.entries(departments)
            .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
            .forEach(([dept, count]) => {
                const item = document.createElement('li');
                item.className = 'list-group-item d-flex justify-content-between align-items-center';
                item.innerHTML = `
                    ${dept}
                    <span class="badge bg-primary rounded-pill">${count}</span>
                `;
                deptBreakdownEl.appendChild(item);
            });
    }
    
    // Function to generate PDF
    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set title
        const date = filterDateInput.value;
        doc.setFontSize(16);
        doc.text(`Lunch Bookings - ${date}`, 14, 20);
        
        // Get table data
        const tableData = [];
        const rows = bookingsTable.querySelectorAll('tr');
        
        if (rows.length === 0) {
            doc.setFontSize(12);
            doc.text('No bookings found for this date.', 14, 40);
            doc.save(`lunch-bookings-${date}.pdf`);
            return;
        }
        
        // Add table headers
        tableData.push(['Name', 'PS Number', 'Department', 'Date', 'Booking Time']);
        
        // Add table rows
        Array.from(rows).forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('td');
            
            Array.from(cells).forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            
            if (rowData.length > 0) {
                tableData.push(rowData);
            }
        });
        
        // Generate table
        doc.autoTable({
            head: [tableData[0]],
            body: tableData.slice(1),
            startY: 30,
            margin: { top: 25 },
            styles: { overflow: 'linebreak' },
            headStyles: { fillColor: [41, 128, 185] }
        });
        
        // Add statistics
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text('Booking Statistics', 14, finalY);
        doc.setFontSize(12);
        doc.text(`Total Bookings: ${totalBookingsEl.textContent}`, 14, finalY + 10);
        doc.text(`Total Departments: ${totalDepartmentsEl.textContent}`, 14, finalY + 20);
        
        // Save PDF
        doc.save(`lunch-bookings-${date}.pdf`);
    }
    
    // Function to show/hide loading spinner
    function showLoading(show) {
        if (show) {
            loadingSpinner.classList.remove('d-none');
        } else {
            loadingSpinner.classList.add('d-none');
        }
    }
    
    // Function to show/hide no bookings message
    function showNoBookings(show) {
        if (show) {
            noBookings.classList.remove('d-none');
        } else {
            noBookings.classList.add('d-none');
        }
    }
    
    // Function to logout
    function logout() {
        localStorage.removeItem('elbsAuthToken');
        window.location.href = 'admin.html';
    }
});