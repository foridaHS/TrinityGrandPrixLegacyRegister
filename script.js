function filterSelection(category) {
            const items = document.getElementsByClassName('filter-item');
            const buttons = document.getElementsByClassName('filter-btn');

            // Update active button state
            for (let btn of buttons) {
                btn.classList.remove('active');
                if (btn.innerText.toLowerCase().includes(category)) {
                    btn.classList.add('active');
                } else if (category === 'all' && btn.innerText.includes('All')) {
                    btn.classList.add('active');
                }
            }

            // Filter cards
            for (let item of items) {
                if (category === 'all') {
                    item.classList.remove('hide');
                } else {
                    if (item.classList.contains(category)) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                }
            }
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

        function toggleStats(btn) {
            // Find the stats box relative to the button clicked
            const card = btn.closest('.horse-card-collapsible');
            const statsBox = card.querySelector('.stats-collapsible');

            // Toggle the 'open' class
            statsBox.classList.toggle('open');

            // Change button text
            if (statsBox.classList.contains('open')) {
                btn.innerText = "Hide Stats";
            } else {
                btn.innerText = "Show Stats";
            }
        }

        function updateStats() {
            const bars = document.querySelectorAll('.bar-fill');
            const numbers = document.querySelectorAll('.current-val');

            // 1. Calculate and set Bar Widths
            bars.forEach(bar => {
                const val = parseInt(bar.getAttribute('data-value'));
                const max = 1200;
                const percentage = (val / max) * 100;

                // Apply width after a tiny delay for smooth animation
                setTimeout(() => {
                    bar.style.width = percentage + "%";
                }, 300);
            });

            // 2. Animate the numbers counting up
            numbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-target'));
                let current = 0;
                const increment = target / 50; // Speed of counting

                const updateCount = () => {
                    if (current < target) {
                        current += increment;
                        num.innerText = Math.ceil(current);
                        setTimeout(updateCount, 20);
                    } else {
                        num.innerText = target;
                    }
                };
                updateCount();
            });
        }

        // Run the script when the "Show Stats" button is clicked
        function toggleStats(btn) {
            const card = btn.closest('.horse-card-collapsible');
            const statsBox = card.querySelector('.stats-collapsible');

            statsBox.classList.toggle('open');

            if (statsBox.classList.contains('open')) {
                btn.innerText = "Hide Stats";
                // Trigger the bar and number animation
                updateStats();
            } else {
                btn.innerText = "Show Stats";
            }
        }
