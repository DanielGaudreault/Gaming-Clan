// Tournament Management System
class TournamentManager {
    constructor(app) {
        this.app = app;
        this.tournaments = JSON.parse(localStorage.getItem('cyberLegionTournaments')) || app.tournaments;
        this.registrations = JSON.parse(localStorage.getItem('tournamentRegistrations')) || [];
        this.setupTournamentManagement();
    }

    setupTournamentManagement() {
        // Tournament creation and management logic
        this.setupTournamentFilters();
        this.setupRegistrationHandlers();
    }

    setupTournamentFilters() {
        // Filter tournaments by game, platform, status
        document.addEventListener('change', (e) => {
            if (e.target.matches('.tournament-filter')) {
                this.filterTournaments();
            }
        });
    }

    setupRegistrationHandlers() {
        // Handle tournament registration
        document.addEventListener('click', (e) => {
            if (e.target.closest('.register-tournament-btn')) {
                const tournamentId = parseInt(e.target.closest('.register-tournament-btn').dataset.tournamentId);
                this.registerForTournament(tournamentId);
            }
        });
    }

    createTournament(tournamentData) {
        const newTournament = {
            id: Date.now(),
            ...tournamentData,
            status: 'registration',
            registeredTeams: 0,
            maxTeams: tournamentData.maxTeams || 32,
            created: new Date().toISOString(),
            organizer: this.app.currentUser?.username || 'Cyber Legion'
        };

        this.tournaments.push(newTournament);
        localStorage.setItem('cyberLegionTournaments', JSON.stringify(this.tournaments));
        this.app.tournaments = this.tournaments;

        this.app.showNotification(`Tournament "${tournamentData.name}" created successfully!`, 'success');
        return newTournament;
    }

    registerForTournament(tournamentId) {
        if (!this.app.currentUser) {
            this.app.showNotification('Please login to register for tournaments', 'warning');
            this.app.showAuthModal('login');
            return false;
        }

        const tournament = this.tournaments.find(t => t.id === tournamentId);
        
        if (!tournament) {
            this.app.showNotification('Tournament not found', 'error');
            return false;
        }

        if (tournament.status !== 'registration') {
            this.app.showNotification('Registration is closed for this tournament', 'error');
            return false;
        }

        if (tournament.registeredTeams >= tournament.maxTeams) {
            this.app.showNotification('Tournament is full', 'error');
            return false;
        }

        // Check if already registered
        const existingRegistration = this.registrations.find(reg => 
            reg.tournamentId === tournamentId && reg.userId === this.app.currentUser.id
        );

        if (existingRegistration) {
            this.app.showNotification('You are already registered for this tournament', 'warning');
            return false;
        }

        // Register user
        const registration = {
            id: Date.now(),
            tournamentId,
            userId: this.app.currentUser.id,
            username: this.app.currentUser.username,
            teamName: `${this.app.currentUser.username}'s Team`,
            registeredAt: new Date().toISOString(),
            status: 'registered'
        };

        this.registrations.push(registration);
        tournament.registeredTeams += 1;

        localStorage.setItem('tournamentRegistrations', JSON.stringify(this.registrations));
        localStorage.setItem('cyberLegionTournaments', JSON.stringify(this.tournaments));

        this.app.showNotification(`Successfully registered for ${tournament.name}!`, 'success');
        return true;
    }

    filterTournaments() {
        const statusFilter = document.getElementById('tournamentStatusFilter')?.value || 'all';
        const gameFilter = document.getElementById('tournamentGameFilter')?.value || 'all';
        const platformFilter = document.getElementById('tournamentPlatformFilter')?.value || 'all';

        const filteredTournaments = this.tournaments.filter(tournament => {
            const statusMatch = statusFilter === 'all' || tournament.status === statusFilter;
            const gameMatch = gameFilter === 'all' || tournament.game.toLowerCase() === gameFilter;
            const platformMatch = platformFilter === 'all' || 
                tournament.platforms.some(platform => platform === platformFilter);

            return statusMatch && gameMatch && platformMatch;
        });

        this.displayTournaments(filteredTournaments);
    }

    displayTournaments(tournaments) {
        const container = document.getElementById('tournamentsGrid');
        if (!container) return;

        container.innerHTML = '';

        if (tournaments.length === 0) {
            container.innerHTML = `
                <div class="no-tournaments">
                    <i class="fas fa-trophy"></i>
                    <h3>No tournaments found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }

        tournaments.forEach(tournament => {
            const tournamentCard = this.createTournamentCard(tournament);
            container.appendChild(tournamentCard);
        });
    }

    createTournamentCard(tournament) {
        const card = document.createElement('div');
        card.className = `tournament-card ${tournament.featured ? 'featured' : ''}`;
        
        const statusBadge = this.getStatusBadge(tournament.status);
        const isRegistered = this.registrations.some(reg => 
            reg.tournamentId === tournament.id && reg.userId === this.app.currentUser?.id
        );

        card.innerHTML = `
            ${tournament.featured ? '<div class="tournament-badge">FEATURED</div>' : ''}
            ${statusBadge}
            
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
                    <span>${tournament.registeredTeams}/${tournament.maxTeams} Teams</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-plug"></i>
                    <span>${tournament.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</span>
                </div>
            </div>
            
            <div class="tournament-progress">
                <div class="progress-bar">
                    <div class="progress" style="width: ${(tournament.registeredTeams / tournament.maxTeams) * 100}%"></div>
                </div>
                <div class="progress-text">${Math.round((tournament.registeredTeams / tournament.maxTeams) * 100)}% Full</div>
            </div>
            
            <div class="tournament-actions">
                <button class="cyber-btn cyber-btn-primary register-tournament-btn" 
                    data-tournament-id="${tournament.id}"
                    ${tournament.status !== 'registration' || isRegistered ? 'disabled' : ''}>
                    <i class="fas fa-${isRegistered ? 'check' : 'user-plus'}"></i>
                    ${isRegistered ? 'Registered' : 'Register Now'}
                </button>
                <button class="cyber-btn cyber-btn-secondary" onclick="tournamentManager.viewTournamentDetails(${tournament.id})">
                    <i class="fas fa-info-circle"></i>
                    Details
                </button>
            </div>
        `;

        return card;
    }

    getStatusBadge(status) {
        const statusConfig = {
            'registration': { text: 'REGISTERING', class: 'status-open' },
            'ongoing': { text: 'LIVE', class: 'status-live' },
            'completed': { text: 'COMPLETED', class: 'status-completed' },
            'cancelled': { text: 'CANCELLED', class: 'status-cancelled' }
        };

        const config = statusConfig[status];
        if (!config) return '';

        return `<div class="tournament-status ${config.class}">${config.text}</div>`;
    }

    viewTournamentDetails(tournamentId) {
        const tournament = this.tournaments.find(t => t.id === tournamentId);
        if (!tournament) return;

        // Create and show tournament details modal
        this.showTournamentModal(tournament);
    }

    showTournamentModal(tournament) {
        const modal = document.createElement('div');
        modal.className = 'cyber-modal active';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>${tournament.name}</h2>
                    <button class="modal-close" onclick="this.closest('.cyber-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="tournament-detail">
                    <div class="detail-grid">
                        <div class="detail-section">
                            <h3>Tournament Info</h3>
                            <div class="info-grid">
                                <div class="info-item">
                                    <label>Game:</label>
                                    <span>${tournament.game}</span>
                                </div>
                                <div class="info-item">
                                    <label>Platforms:</label>
                                    <span>${tournament.platforms.join(', ')}</span>
                                </div>
                                <div class="info-item">
                                    <label>Start Date:</label>
                                    <span>${new Date(tournament.startDate).toLocaleString()}</span>
                                </div>
                                <div class="info-item">
                                    <label>Prize Pool:</label>
                                    <span class="prize-amount">${tournament.prize}</span>
                                </div>
                                <div class="info-item">
                                    <label>Teams Registered:</label>
                                    <span>${tournament.registeredTeams}/${tournament.maxTeams}</span>
                                </div>
                                <div class="info-item">
                                    <label>Organizer:</label>
                                    <span>${tournament.organizer}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Rules & Format</h3>
                            <div class="rules-content">
                                <p>• Double elimination bracket</p>
                                <p>• Best of 3 matches until finals</p>
                                <p>• Finals: Best of 5</p>
                                <p>• Check-in required 30 minutes before start</p>
                                <p>• Standard competitive rules apply</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="participants-section">
                        <h3>Registered Teams (${tournament.registeredTeams})</h3>
                        <div class="participants-list">
                            ${this.getParticipantsList(tournament.id)}
                        </div>
                    </div>
                    
                    <div class="tournament-actions modal-actions">
                        <button class="cyber-btn cyber-btn-large cyber-btn-primary register-tournament-btn" 
                            data-tournament-id="${tournament.id}"
                            ${tournament.status !== 'registration' ? 'disabled' : ''}>
                            <i class="fas fa-user-plus"></i>
                            Register Team
                        </button>
                        <button class="cyber-btn cyber-btn-large cyber-btn-secondary">
                            <i class="fas fa-share"></i>
                            Share Tournament
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    getParticipantsList(tournamentId) {
        const participants = this.registrations.filter(reg => reg.tournamentId === tournamentId);
        
        if (participants.length === 0) {
            return '<div class="no-participants">No teams registered yet</div>';
        }

        return participants.map(participant => `
            <div class="participant-item">
                <div class="participant-name">${participant.teamName}</div>
                <div class="participant-captain">${participant.username}</div>
            </div>
        `).join('');
    }

    updateTournamentStatus(tournamentId, newStatus) {
        const tournament = this.tournaments.find(t => t.id === tournamentId);
        if (tournament) {
            tournament.status = newStatus;
            localStorage.setItem('cyberLegionTournaments', JSON.stringify(this.tournaments));
            this.app.tournaments = this.tournaments;
            return true;
        }
        return false;
    }

    getUpcomingTournaments() {
        const now = new Date();
        return this.tournaments
            .filter(t => new Date(t.startDate) > now && t.status === 'registration')
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    getLiveTournaments() {
        return this.tournaments.filter(t => t.status === 'ongoing');
    }

    getTournamentStandings(tournamentId) {
        // This would fetch from backend in real application
        return [];
    }
}

// Initialize tournament manager
let tournamentManager;
document.addEventListener('DOMContentLoaded', () => {
    tournamentManager = new TournamentManager(app);
});
