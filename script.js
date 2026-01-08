        function filterSelection(category) {
            const horses = document.querySelectorAll('.horse-card-collapsible');
            const groups = document.querySelectorAll('.trainer-group');
            const buttons = document.querySelectorAll('.filter-btn');

            // 1. Handle Button Highlights
            buttons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('onclick').includes(`'${category}'`)) btn.classList.add('active');
            });

            // 2. Filter Logic
            groups.forEach(group => {
                const preview = group.querySelector('.trainer-roster-preview');
                
                if (category === 'all') {
                    group.classList.remove('hide');
                    group.classList.remove('active'); 
                    
                    // Show all horses
                    group.querySelectorAll('.horse-card-collapsible').forEach(h => h.classList.remove('hide'));
                    
                    // RESET PREVIEW: Show all names
                    const allNames = Array.from(group.querySelectorAll('h3')).map(h3 => h3.innerText).join(' • ');
                    preview.innerHTML = allNames;
                } else {
                    if (group.classList.contains(category)) {
                        group.classList.remove('hide');
                        group.classList.remove('active'); 

                        // Filter individual horses
                        const visibleNames = [];
                        group.querySelectorAll('.horse-card-collapsible').forEach(h => {
                            if (h.classList.contains(category)) {
                                h.classList.remove('hide');
                                // Collect name for preview
                                visibleNames.push(h.querySelector('h3').innerText);
                            } else {
                                h.classList.add('hide');
                            }
                        });

                        // UPDATE PREVIEW: Show only matching horse names
                        preview.innerHTML = visibleNames.join(' • ');
                    } else {
                        group.classList.add('hide');
                    }
                }
            });
        }
        function filterSchedule(category) {
            const rows = document.querySelectorAll('.race-row');
            const buttons = document.querySelectorAll('.s-filter-btn');

            // Update button visual state
            buttons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.innerText.toLowerCase().includes(category)) {
                    btn.classList.add('active');
                } else if (category === 'all' && btn.innerText.includes('All')) {
                    btn.classList.add('active');
                }
            });

            // Filter Table Rows
            rows.forEach(row => {
                if (category === 'all') {
                    row.classList.remove('hide');
                } else {
                    if (row.classList.contains(category)) {
                        row.classList.remove('hide');
                    } else {
                        row.classList.add('hide');
                    }
                }
            });
        }



        function updateStats(specificCard) {
            const bars = specificCard.querySelectorAll('.bar-fill');
            const numbers = specificCard.querySelectorAll('.current-val');

            // Resetting width to 0 first ensures the animation triggers every time
            bars.forEach(bar => {
                bar.style.width = "0%"; 
                
                // We use a small delay (100ms) so the 'open' animation starts first
                setTimeout(() => {
                    const val = parseInt(bar.getAttribute('data-value'));
                    const max = 1200;
                    const percentage = (val / max) * 100;
                    
                    // Set the calculated percentage
                    bar.style.width = percentage + "%";
                }, 150); 
            });

            // Number counting logic
            numbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-target'));
                let current = 0;
                const duration = 1500; // 1.5 seconds
                const steps = 50;
                const increment = target / steps;
                
                const updateCount = () => {
                    if (current < target) {
                        current += increment;
                        num.innerText = Math.ceil(current);
                        setTimeout(updateCount, duration / steps);
                    } else {
                        num.innerText = target;
                    }
                };
                updateCount();
            });
        }
        function toggleStats(btn) {
            // 1. Find the card that belongs to the clicked button
            const card = btn.closest('.horse-card-collapsible');
            
            // 2. Find the stats box ONLY inside that card
            const statsBox = card.querySelector('.stats-collapsible');
            
            // Toggle 'open' class
            statsBox.classList.toggle('open');
            
            if (statsBox.classList.contains('open')) {
                btn.innerText = "Hide Stats";
                // 3. Trigger animation ONLY for this specific card
                animateStats(card);
            } else {
                btn.innerText = "Show Stats";
                // Optional: Reset bars when closing
                const bars = card.querySelectorAll('.bar-fill');
                bars.forEach(bar => bar.style.width = "0%");
            }
        }

        function animateStats(card) {
            // IMPORTANT: Use card.querySelectorAll, NOT document.querySelectorAll
            const bars = card.querySelectorAll('.bar-fill');
            const numbers = card.querySelectorAll('.current-val');

            bars.forEach(bar => {
                const val = parseInt(bar.getAttribute('data-value'));
                const percentage = (val / 1200) * 100;
                
                // Timeout to allow the expansion to start first
                setTimeout(() => {
                    bar.style.width = percentage + "%";
                }, 300);
            });

            numbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-target'));
                let current = 0;
                const duration = 1000; // 1 second
                const steps = 30;
                const increment = target / steps;
                
                const countInterval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        num.innerText = target;
                        clearInterval(countInterval);
                    } else {
                        num.innerText = Math.floor(current);
                    }
                }, duration / steps);
            });
        }


        function toggleTrainerGroup(header) {
    const group = header.closest('.trainer-group');
    const preview = header.querySelector('.trainer-roster-preview');
    
    group.classList.toggle('active');

    // Toggle the horse name list visibility
    if (group.classList.contains('active')) {
        preview.style.opacity = "0"; // Hide names when horses are visible
    } else {
        preview.style.opacity = "1"; // Show names when collapsed
    }
}


        // 1. YOUR SHEETY CONFIGURATION
        const SHEETY_API_URL = 'https://api.sheety.co/4b7d2f10221a5c970b5a271824da927d/lavitarContenderList/sheet1';

        async function loadStableFromSheet() {
            try {
                const response = await fetch(SHEETY_API_URL);
                const data = await response.json();
                
                // Sheety usually wraps data in an object named after your sheet (e.g., data.sheet1)
                const horses = data.sheet1; 
                
                const container = document.getElementById('dynamic-horse-grid');
                container.innerHTML = ''; // Clear the "Loading" message

                // Grouping by Trainer using a simple reduce function
                const trainerGroups = horses.reduce((groups, horse) => {
                    const trainer = horse.trainer || 'Independent';
                    if (!groups[trainer]) groups[trainer] = [];
                    groups[trainer].push(horse);
                    return groups;
                }, {});

                // Build the HTML for each Trainer Group
                // Inside your loadStableFromSheet loop...
                for (const trainer in trainerGroups) {
                    // Collect all unique categories in this group to tag the parent
                    const groupCategories = [...new Set(trainerGroups[trainer].map(h => 
                        h.category ? h.category.toLowerCase().trim() : 'all'
                    ))].join(' ');

                    const horseNames = trainerGroups[trainer].map(h => h.horseName).join(' • ');

                    let groupHTML = `
                        <div class="trainer-group filter-item ${groupCategories}"> 
                            <div class="trainer-header" onclick="toggleTrainerGroup(this)">
                                <div class="trainer-info">
                                    <span class="trainer-tag">Official Trainer</span>
                                    <h2 class="trainer-name">${trainer}</h2>
                                </div>
                                <div class="trainer-roster-preview">${horseNames}</div>
                                <div class="expand-icon">▼</div>
                            </div>
                            <div class="trainer-roster-content">
                                <div class="horse-grid">
                                    ${trainerGroups[trainer].map(h => {
                                        const cat = h.category ? h.category.toLowerCase().trim() : 'all';
                                        return createHorseCard(h, cat); 
                                    }).join('')}
                                </div>
                            </div>
                        </div>`;
                    
                    container.innerHTML += groupHTML;
                }
            } catch (error) {
                console.error('Error loading Sheety data:', error);
                document.getElementById('dynamic-horse-grid').innerHTML = "<p>Failed to load stable data.</p>";
            }
        }

        // Function to generate the individual card HTML
        function createHorseCard(h, cat) {
            // Fallbacks for missing data
            const img = h.imageUrl || 'assets/default_horse.png';
            const name = h.horseName || 'Unnamed Horse';
            const trainer = h.trainer || 'Unknown Trainer';
            const strategy = h.strategy || 'Balanced';
            const vote = h.fanVote || '0';

            // IMPORTANT: Only ONE outer div here
            return `
            <div class="horse-card-collapsible filter-item ${cat}">
                <div class="card-content">
                    <div class="horse-portrait">
                        <img src="${img}" alt="${name}" onerror="this.src='assets/default_horse.png';">
                    </div>
                    <div class="basic-info">
                        <h3>${name}</h3>
                        <p class="owner-name">Trained by: <span>${trainer}</span></p>
                        <button class="toggle-stats-btn" onclick="toggleStats(this)">Show Stats</button>
                    </div>
                    <div class="stats-collapsible">
                        <div class="stats-padding">
                            ${renderStatRow('Speed', h.speed || 0)}
                            ${renderStatRow('Stamina', h.stamina || 0)}
                            ${renderStatRow('Power', h.power || 0)}
                            ${renderStatRow('Gut', h.gut || 0)}
                            ${renderStatRow('Wit', h.wit || 0)}
                            <div class="extra-details">
                                <p><strong>Strategy:</strong> ${strategy}</p>
                                <p><strong>Fan Vote:</strong> ${vote}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }

        function renderStatRow(label, value) {
            return `
            <div class="stat-row">
                <div class="stat-label-container">
                    <span class="stat-name">${label}</span>
                    <div class="stat-values">
                        <span class="current-val" data-target="${value}">0</span>
                        <span class="max-val">/ 1200</span>
                    </div>
                </div>
                <div class="stat-bar-bg">
                    <div class="bar-fill gold-gradient" data-value="${value}"></div>
                </div>
            </div>`;
        }

        // Initialize the roster on page load
        loadStableFromSheet();

// Ensure your existing toggleStats(this) still works for individual horses inside!
