 // ====================================
        // CONFIGURATION
        // ====================================
        
        const CONFIG = {
            // IMPORTANT: Replace with your Google Apps Script Web App URL
            SHEET_URL: 'https://script.google.com/macros/s/AKfycbwHD-8fLL5v5-Xsh22JPxEfG-HjB5wL19kK7CP1Lc4rmHCYpy4DEnmm9myC8ICXkg-H/exec',
            
            // Admin password (CHANGE THIS!)
            ADMIN_PASSWORD: 'johnandjane2025',
        };

        // Store all RSVP data
        let allRsvps = [];

        // ====================================
        // PASSWORD PROTECTION
        // ====================================
        
        function checkPassword() {
            const password = document.getElementById('passwordInput').value;
            const errorMessage = document.getElementById('errorMessage');
            
            if (password === CONFIG.ADMIN_PASSWORD) {
                document.getElementById('passwordScreen').style.display = 'none';
                document.getElementById('dashboardContent').classList.remove('hidden');
                loadRSVPData();
            } else {
                errorMessage.style.display = 'block';
                document.getElementById('passwordInput').value = '';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000);
            }
        }

        // Enter key support
        document.getElementById('passwordInput')?.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') checkPassword();
        });

        // ====================================
        // LOAD RSVP DATA
        // ====================================
        
        async function loadRSVPData() {
            try {
                const response = await fetch(CONFIG.SHEET_URL);
                const data = await response.json();
                
                allRsvps = data.rsvps || [];
                
                updateStats();
                displayTable(allRsvps);
                updateLastUpdated();
                
            } catch (error) {
                console.error('Error loading RSVP data:', error);
                document.getElementById('tableContent').innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">⚠️</div>
                        <div class="empty-text">Unable to load data</div>
                        <div class="empty-subtext">Please check your Google Apps Script URL</div>
                    </div>
                `;
            }
        }

        // ====================================
        // UPDATE STATISTICS
        // ====================================
        
        function updateStats() {
            const total = allRsvps.length;
            const attending = allRsvps.filter(r => r.attendance === 'Yes').length;
            const notAttending = allRsvps.filter(r => r.attendance === 'No').length;
            
            const totalGuests = allRsvps.reduce((sum, rsvp) => {
                if (rsvp.attendance === 'Yes') {
                    return sum + parseInt(rsvp.guestCount || 1);
                }
                return sum;
            }, 0);
            
            animateNumber('totalRsvps', total);
            animateNumber('attendingCount', attending);
            animateNumber('notAttendingCount', notAttending);
            animateNumber('totalGuests', totalGuests);
        }

        function animateNumber(elementId, targetValue) {
            const element = document.getElementById(elementId);
            const startValue = parseInt(element.textContent) || 0;
            const duration = 1000;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
                element.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }

        // ====================================
        // DISPLAY TABLE
        // ====================================
        
        function displayTable(rsvps) {
            const tableContent = document.getElementById('tableContent');
            const filteredCount = document.getElementById('filteredCount');
            
            if (rsvps.length === 0) {
                tableContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📭</div>
                        <div class="empty-text">No RSVPs yet</div>
                        <div class="empty-subtext">Responses will appear here as they come in</div>
                    </div>
                `;
                filteredCount.textContent = '0';
                return;
            }
            
            filteredCount.textContent = rsvps.length;
            
            let html = `
                <table class="rsvp-table">
                    <thead>
                        <tr>
                            <th>Guest Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Bringing Guests?</th>
                            <th>Guest Count</th>
                            <th>Message</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            rsvps.forEach(rsvp => {
                const statusClass = rsvp.attendance === 'Yes' ? 'status-attending' : 'status-not-attending';
                const statusIcon = rsvp.attendance === 'Yes' ? '✓' : '✗';
                const statusText = rsvp.attendance === 'Yes' ? 'Attending' : 'Not Attending';
                const message = rsvp.message || '<em style="opacity: 0.5;">No message</em>';
                
                html += `
                    <tr>
                        <td class="guest-name">${rsvp.name}</td>
                        <td>${rsvp.email}</td>
                        <td>
                            <span class="status-badge ${statusClass}">
                                ${statusIcon} ${statusText}
                            </span>
                        </td>
                        <td>${rsvp.bringingGuests}</td>
                        <td>
                            <span class="guest-count-badge">${rsvp.guestCount}</span>
                        </td>
                        <td class="message-cell">${message}</td>
                        <td>${rsvp.timestamp}</td>
                    </tr>
                `;
            });
            
            html += `</tbody></table>`;
            tableContent.innerHTML = html;
        }

        // ====================================
        // FILTER AND SEARCH
        // ====================================
        
        function filterTable() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const statusFilter = document.getElementById('filterStatus').value;
            const guestsFilter = document.getElementById('filterGuests').value;
            
            let filtered = allRsvps;
            
            // Filter by status
            if (statusFilter !== 'all') {
                filtered = filtered.filter(r => r.attendance === statusFilter);
            }
            
            // Filter by guest count
            if (guestsFilter === 'solo') {
                filtered = filtered.filter(r => parseInt(r.guestCount) === 1);
            } else if (guestsFilter === 'plus1') {
                filtered = filtered.filter(r => parseInt(r.guestCount) >= 2);
            }
            
            // Filter by search term
            if (searchTerm) {
                filtered = filtered.filter(r => 
                    r.name.toLowerCase().includes(searchTerm) ||
                    r.email.toLowerCase().includes(searchTerm)
                );
            }
            
            displayTable(filtered);
        }

        // ====================================
        // EXPORT TO CSV
        // ====================================
        
        function exportToCSV() {
            if (allRsvps.length === 0) {
                alert('No data to export');
                return;
            }
            
            let csv = 'Name,Email,Attendance,Bringing Guests,Guest Count,Message,Timestamp\n';
            
            allRsvps.forEach(rsvp => {
                const row = [
                    rsvp.name,
                    rsvp.email,
                    rsvp.attendance,
                    rsvp.bringingGuests,
                    rsvp.guestCount,
                    `"${(rsvp.message || '').replace(/"/g, '""')}"`,
                    rsvp.timestamp
                ].join(',');
                csv += row + '\n';
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wedding-rsvp-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }

        // ====================================
        // UPDATE TIMESTAMP
        // ====================================
        
        function updateLastUpdated() {
            const now = new Date();
            const options = { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit'
            };
            document.getElementById('updateTime').textContent = now.toLocaleString('en-US', options);
        }