// Main Application Controller
class CyberLegionApp {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'home';
        this.clans = [];
        this.tournaments = [];
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.checkAuthState();
        this.updateLiveStats();
        this.setupRealTimeUpdates();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Platform filters
        document.querySelectorAll('input[name="platform"], input[name="game"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.filterClans());
        });

        // Quick apply form
        document.getElementById('quickApplyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleQuickApply();
        });

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cyber-modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Platform cards interaction
        document.querySelectorAll('.platform-card').forEach(card => {
            card.addEventListener('click', () => {
                const platform = card.getAttribute('data-platform');
                this.filterByPlatform(platform);
            });
        });

        // Game cards interaction
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const game = card.getAttribute('data-game');
                this.filterByGame(game);
            });
        });
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Load section-specific data
        switch(sectionName) {
            case 'clans':
                this.loadClans();
                break;
            case 'tournaments':
                this.loadTournaments();
                break;
            case 'stats':
                this.loadStats();
                break;
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadSampleData() {
        // Sample clans data
        this.clans = [
            {
                id: 1,
                name: "NEON NINJAS",
                tag: "[NNJA]",
                game: "Valorant",
                platforms: ["pc"],
                members: 24,
                online: 8,
                rank: "Diamond",
                winRate: "68%",
                description: "Competitive Valorant team focusing on strategic gameplay",
                recruitment: "Open",
                created: "2024-01-15"
            },
            {
                id: 2,
                name: "CYBER STRIKERS",
                tag: "[CSTR]",
                game: "Call of Duty",
                platforms: ["pc", "playstation", "xbox"],
                members: 45,
                online: 22,
                rank: "Platinum",
                winRate: "72%",
                description: "Multi-platform COD clan with competitive and casual divisions",
                recruitment: "Open",
                created: "2023-11-20"
            },
            {
                id: 3,
                name: "APEX PREDATORS",
                tag: "[APEX]",
                game: "Apex Legends",
                platforms: ["pc", "playstation"],
                members: 32,
                online: 15,
                rank: "Master",
                winRate: "65%",
                description: "Apex Legends specialists pushing for Predator rank",
                recruitment: "Closed",
                created: "2024-02-10"
            },
            {
                id: 4,
                name: "DRAGON SLAYERS",
                tag: "[DRGN]",
                game: "League of Legends",
                platforms: ["pc"],
                members: 28,
                online: 12,
                rank: "Emerald",
                winRate: "58%",
                description: "LoL team focusing on coordinated team fights and objectives",
                recruitment: "Open",
                created: "2024-01-05"
            },
            {
                id: 5,
                name: "OVERWATCH ELITE",
                tag: "[OWE]",
                game: "Overwatch 2",
                platforms: ["pc", "xbox", "playstation"],
                members: 38,
                online: 18,
                rank: "Diamond",
                winRate: "71%",
                description: "Overwatch 2 competitive team with focus on team composition",
                recruitment: "Open",
                created: "2023-12-15"
            },
            {
                id: 6,
                name: "MOBILE STRIKERS",
                tag: "[MBL]",
                game: "Call of Duty Mobile",
                platforms: ["mobile"],
                members: 52,
                online: 25,
                rank: "Legendary",
                winRate: "75%",
                description: "Top-tier mobile gaming clan dominating COD Mobile",
                recruitment: "Open",
                created: "2024-03-01"
            }
        ];

        // Sample tournaments data
        this.tournaments = [
            {
                id: 1,
                name: "Weekly Valorant Showdown",
                game: "Valorant",
                platforms: ["pc"],
                prize: "$500",
                teams: 16,
                startDate: "2024-12-20",
                status: "registration",
                featured: false
            },
            {
                id: 2,
                name: "Cross-Platform COD War",
                game: "Call of Duty",
                platforms: ["pc", "playstation", "xbox"],
                prize: "$1,000",
                teams: 32,
                startDate: "2024-12-22",
                status: "registration",
                featured: false
            },
            {
                id: 3,
                name: "Apex Legends Trios Cup",
                game: "Apex Legends",
                platforms: ["pc", "playstation"],
                prize: "$750",
                teams: 48,
                startDate: "2024-12-18",
                status: "ongoing",
                featured: false
            }
        ];
    }

    loadClans() {
        const clansGrid = document.getElementById('clansGrid');
        clansGrid.innerHTML = '';

        this.clans.forEach(clan => {
            const clanCard = this.createClanCard(clan);
            clansGrid.appendChild(clanCard);
        });
    }

    createClanCard(clan) {
        const card = document.createElement('div');
        card.className = 'clan-card';
        card.innerHTML = `
            <div class="clan-header">
                <div class="clan-name">${clan.name}</div>
                <div class="clan-tag">${clan.tag}</div>
            </div>
            <div class="clan-info">
                <div class="clan-game">${clan.game}</div>
                <div class="clan-platforms">
                    ${clan.platforms.map(platform => 
                        `<span class="platform-tag">${platform.toUpperCase()}</span>`
                    ).join('')}
                </div>
                <div class="clan-description">${clan.description}</div>
            </div>
            <div class="clan-stats">
                <div class="clan-stat">
                    <div class="stat-value">${clan.members}</div>
                    <div class="stat-label">Members</div>
                </div>
                <div class="clan-stat">
                    <div class="stat-value">${clan.online}</div>
                    <div class="stat-label">Online</div>
                </div>
                <div class="clan-stat">
                    <div class="stat-value">${clan.winRate}</div>
                    <div class="stat-label">Win Rate</div>
                </div>
            </div>
            <div class="clan-actions">
                <button class="cyber-btn cyber-btn-primary" onclick="app.viewClan(${clan.id})">
                    <i class="fas fa-eye"></i>
                    View
                </button>
                <button class="cyber-btn cyber-btn-secondary" onclick="app.joinClan(${clan.id})" 
                    ${clan.recruitment === 'Closed' ? 'disabled' : ''}>
                    <i class="fas fa-user-plus"></i>
                    ${clan.recruitment === 'Open' ? 'Join' : 'Closed'}
                </button>
            </div>
        `;
        return card;
    }

    filterClans() {
        const selectedPlatforms = Array.from(document.querySelectorAll('input[name="platform"]:checked'))
            .map(cb => cb.value);
        const selectedGames = Array.from(document.querySelectorAll('input[name="game"]:checked'))
            .map(cb => cb.value);

        const filteredClans = this.clans.filter(clan => {
            const platformMatch = selectedPlatforms.some(platform => 
                clan.platforms.includes(platform));
            const gameMatch = selectedGames.includes(clan.game.toLowerCase().replace(' ', ''));
            
            return platformMatch && gameMatch;
        });

        this.displayFilteredClans(filteredClans);
    }

    displayFilteredClans(clans) {
        const clansGrid = document.getElementById('clansGrid');
        clansGrid.innerHTML = '';

        if (clans.length === 0) {
            clansGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No clans found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }

        clans.forEach(clan => {
            const clanCard = this.createClanCard(clan);
            clansGrid.appendChild(clanCard);
        });
    }

    filterByPlatform(platform) {
        document.querySelectorAll('input[name="platform"]').forEach(cb => {
            cb.checked = cb.value === platform;
        });
        this.filterClans();
        this.switchSection('clans');
    }

    filterByGame(game) {
        document.querySelectorAll('input[name="game"]').forEach(cb => {
            cb.checked = cb.value === game;
        });
        this.filterClans();
        this.switchSection('clans');
    }

    loadTournaments() {
        const tournamentsGrid = document.getElementById('tournamentsGrid');
        tournamentsGrid.innerHTML = '';

        this.tournaments.forEach(tournament => {
            const tournamentCard = this.createTournamentCard(tournament);
            tournamentsGrid.appendChild(tournamentCard);
        });
    }

    createTournamentCard(tournament) {
        const card = document.createElement('div');
        card.className = `tournament-card ${tournament.featured ? 'featured' : ''}`;
        card.innerHTML = `
            ${tournament.featured ? '<div class="tournament-badge">FEATURED</div>' : ''}
            <div class="tournament-header">
                <h3>${tournament.name}</h3>
                <div class="tournament-prize">
                    <i class="fas fa-trophy"></i>
                    ${tournament.prize} PRIZE POOL
                </div>
            </div>
            <div class="tournament-details">
                <div class="detail-item">
                    <i class="fas fa-gamepad"></i>
                    <span>${tournament.game}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>Starts: ${new Date(tournament.startDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span>${tournament.teams} Teams</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-plug"></i>
                    <span>${tournament.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</span>
                </div>
            </div>
            <div class="tournament-actions">
                <button class="cyber-btn cyber-btn-primary" onclick="app.registerForTournament(${tournament.id})">
                    REGISTER NOW
                </button>
                <button class="cyber-btn cyber-btn-secondary" onclick="app.viewTournament(${tournament.id})">
                    VIEW DETAILS
                </button>
            </div>
        `;
        return card;
    }

    loadStats() {
        this.updatePlatformChart();
        this.updateGameChart();
        this.updateGrowthChart();
        this.updateHeatmap();
        this.updateLeaderboard();
    }

    updatePlatformChart() {
        const ctx = document.getElementById('platformChart').getContext('2d');
        const platformData = {
            pc: 45,
            playstation: 25,
            xbox: 15,
            nintendo: 8,
            mobile: 7
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(platformData).map(p => p.toUpperCase()),
                datasets: [{
                    data: Object.values(platformData),
                    backgroundColor: [
                        '#00ff88',
                        '#0088ff',
                        '#ff0088',
                        '#ffaa00',
                        '#aa00ff'
                    ],
                    borderColor: '#0a0a12',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                family: 'Rajdhani',
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    updateGameChart() {
        const ctx = document.getElementById('gameChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Valorant', 'COD', 'Apex', 'LoL', 'Overwatch'],
                datasets: [{
                    label: 'Active Players',
                    data: [324, 587, 421, 289, 356],
                    backgroundColor: '#00ff88',
                    borderColor: '#00ff88',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#e0e0e0'
                        },
                        grid: {
                            color: '#1a1a2e'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#e0e0e0'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    updateGrowthChart() {
        const ctx = document.getElementById('growthChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Member Growth',
                    data: [1200, 1450, 1780, 2100, 2450, 2847],
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            color: '#e0e0e0'
                        },
                        grid: {
                            color: '#1a1a2e'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#e0e0e0'
                        },
                        grid: {
                            color: '#1a1a2e'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0'
                        }
                    }
                }
            }
        });
    }

    updateHeatmap() {
        const heatmap = document.getElementById('activityHeatmap');
        heatmap.innerHTML = '';

        for (let i = 0; i < 35; i++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            const intensity = Math.floor(Math.random() * 5);
            cell.style.backgroundColor = `rgba(0, 255, 136, ${intensity * 0.2})`;
            cell.title = `${intensity * 20}% activity`;
            heatmap.appendChild(cell);
        }
    }

    updateLeaderboard() {
        const leaderboard = document.getElementById('topClansList');
        leaderboard.innerHTML = '';

        const topClans = [...this.clans]
            .sort((a, b) => b.members - a.members)
            .slice(0, 5);

        topClans.forEach((clan, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="leaderboard-name">${clan.name}</div>
                <div class="leaderboard-score">${clan.members}</div>
            `;
            leaderboard.appendChild(item);
        });
    }

    updateLiveStats() {
        // Simulate live stat updates
        setInterval(() => {
            const onlineNow = document.getElementById('onlineNow');
            const current = parseInt(onlineNow.textContent);
            const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
            const newValue = Math.max(1000, current + change);
            onlineNow.textContent = newValue.toLocaleString();
        }, 5000);
    }

    setupRealTimeUpdates() {
        // Simulate real-time member joins
        setInterval(() => {
            const totalMembers = document.getElementById('totalMembers');
            const current = parseInt(totalMembers.textContent.replace(',', ''));
            if (Math.random() > 0.7) { // 30% chance of new member
                totalMembers.textContent = (current + 1).toLocaleString();
            }
        }, 10000);
    }

    handleQuickApply() {
        if (!this.currentUser) {
            this.showNotification('Please login to apply', 'warning');
            this.showAuthModal('login');
            return;
        }

        const game = document.getElementById('applyGame').value;
        const platform = document.getElementById('applyPlatform').value;
        const rank = document.getElementById('applyRank').value;
        const message = document.getElementById('applyMessage').value;

        // In a real app, this would send data to a backend
        this.showNotification('Application submitted! Clans will contact you soon.', 'success');
        document.getElementById('quickApplyForm').reset();
    }

    viewClan(clanId) {
        const clan = this.clans.find(c => c.id === clanId);
        this.showNotification(`Viewing ${clan.name} details`, 'info');
        // In a real app, this would open a detailed clan view
    }

    joinClan(clanId) {
        if (!this.currentUser) {
            this.showNotification('Please login to join a clan', 'warning');
            this.showAuthModal('login');
            return;
        }

        const clan = this.clans.find(c => c.id === clanId);
        this.showNotification(`Join request sent to ${clan.name}`, 'success');
    }

    registerForTournament(tournamentId) {
        if (!this.currentUser) {
            this.showNotification('Please login to register', 'warning');
            this.showAuthModal('login');
            return;
        }

        const tournament = this.tournaments.find(t => t.id === tournamentId);
        this.showNotification(`Registered for ${tournament.name}`, 'success');
    }

    viewTournament(tournamentId) {
        const tournament = this.tournaments.find(t => t.id === tournamentId);
        this.showNotification(`Viewing ${tournament.name} details`, 'info');
    }

    showAuthModal(type) {
        const modal = document.getElementById('authModal');
        modal.classList.add('active');

        if (type === 'login') {
            this.showLoginForm();
        } else {
            this.showRegisterForm();
        }
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
        document.getElementById('authModalTitle').textContent = 'ACCESS TERMINAL';
    }

    showRegisterForm() {
        document.getElementById('loginForm').classList.remove('active');
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('authModalTitle').textContent = 'CREATE ACCOUNT';
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');
        
        messageEl.textContent = message;
        
        // Set icon based on type
        const icon = notification.querySelector('i');
        icon.className = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-triangle',
            'warning': 'fas fa-exclamation-circle',
            'info': 'fas fa-info-circle'
        }[type] || 'fas fa-info-circle';

        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    checkAuthState() {
        // Check if user is logged in (in a real app, this would check localStorage/tokens)
        const userData = localStorage.getItem('cyberLegionUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUserInterface();
        }
    }

    updateUserInterface() {
        const authButtons = document.getElementById('authButtons');
        const userProfile = document.getElementById('userProfile');
        const username = document.getElementById('username');
        const userRank = document.getElementById('userRank');

        if (this.currentUser) {
            authButtons.style.display = 'none';
            userProfile.style.display = 'flex';
            username.textContent = this.currentUser.username;
            userRank.textContent = this.currentUser.rank || 'Recruit';
        } else {
            authButtons.style.display = 'flex';
            userProfile.style.display = 'none';
        }
    }
}

// Global functions for HTML onclick handlers
function switchSection(section) {
    app.switchSection(section);
}

function showAuthModal(type) {
    app.showAuthModal(type);
}

function showLoginForm() {
    app.showLoginForm();
}

function showRegisterForm() {
    app.showRegisterForm();
}

function closeModal(modalId) {
    app.closeModal(modalId);
}

function showClanBrowser() {
    app.switchSection('clans');
}

function showCreateClanModal() {
    app.showNotification('Clan creation feature coming soon!', 'info');
}

function showPlayerFinder() {
    app.showNotification('Player finder feature coming soon!', 'info');
}

// Initialize the application
const app = new CyberLegionApp();
