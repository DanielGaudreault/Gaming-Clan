// Profile Management System
class ProfileManager {
    constructor(app) {
        this.app = app;
        this.userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || {};
        this.setupProfileManagement();
    }

    setupProfileManagement() {
        this.setupProfileView();
        this.setupEditHandlers();
        this.setupGameStats();
    }

    setupProfileView() {
        // Update profile display when user logs in
        if (this.app.currentUser) {
            this.displayUserProfile(this.app.currentUser);
        }
    }

    displayUserProfile(user) {
        const profileContainer = document.getElementById('profileContainer');
        if (!profileContainer) return;

        const profile = this.getUserProfile(user.id) || this.createDefaultProfile(user);

        profileContainer.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">
                    <div class="avatar-image">${user.username.charAt(0).toUpperCase()}</div>
                    <div class="online-status ${this.getRandomStatus()}"></div>
                </div>
                <div class="profile-info">
                    <h1 class="profile-username">${user.username}</h1>
                    <div class="profile-rank">${profile.rank}</div>
                    <div class="profile-platform">
                        <i class="fab fa-${this.getPlatformIcon(user.platform)}"></i>
                        ${user.platform.toUpperCase()}
                    </div>
                </div>
                <div class="profile-stats">
                    <div class="stat-item">
                        <div class="stat-value">${profile.stats.gamesPlayed}</div>
                        <div class="stat-label">Games</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${profile.stats.wins}</div>
                        <div class="stat-label">Wins</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${profile.stats.winRate}%</div>
                        <div class="stat-label">Win Rate</div>
                    </div>
                </div>
            </div>

            <div class="profile-content">
                <div class="profile-section">
                    <h3>Game Statistics</h3>
                    <div class="games-stats" id="gamesStats">
                        ${this.renderGamesStats(profile.games)}
                    </div>
                </div>

                <div class="profile-section">
                    <h3>Clan Membership</h3>
                    <div class="clan-membership">
                        ${profile.clan ? this.renderClanInfo(profile.clan) : this.renderNoClan()}
                    </div>
                </div>

                <div class="profile-section">
                    <h3>Achievements</h3>
                    <div class="achievements-grid">
                        ${this.renderAchievements(profile.achievements)}
                    </div>
                </div>

                <div class="profile-section">
                    <h3>Recent Activity</h3>
                    <div class="activity-feed">
                        ${this.renderActivityFeed(profile.recentActivity)}
                    </div>
                </div>
            </div>

            <div class="profile-actions">
                <button class="cyber-btn cyber-btn-primary" onclick="profileManager.editProfile()">
                    <i class="fas fa-edit"></i>
                    Edit Profile
                </button>
                <button class="cyber-btn cyber-btn-secondary" onclick="profileManager.viewMatchHistory()">
                    <i class="fas fa-history"></i>
                    Match History
                </button>
            </div>
        `;
    }

    getUserProfile(userId) {
        return this.userProfiles[userId];
    }

    createDefaultProfile(user) {
        const defaultProfile = {
            userId: user.id,
            rank: 'Recruit',
            stats: {
                gamesPlayed: 0,
                wins: 0,
                losses: 0,
                winRate: 0
            },
            games: {},
            clan: null,
            achievements: [],
            recentActivity: [],
            settings: {
                notifications: true,
                privacy: 'public',
                theme: 'cyber'
            }
        };

        this.userProfiles[user.id] = defaultProfile;
        this.saveProfiles();
        return defaultProfile;
    }

    renderGamesStats(games) {
        if (Object.keys(games).length === 0) {
            return '<div class="no-stats">No game statistics yet</div>';
        }

        return Object.entries(games).map(([game, stats]) => `
            <div class="game-stat-card">
                <div class="game-icon">
                    <i class="${this.getGameIcon(game)}"></i>
                </div>
                <div class="game-info">
                    <h4>${this.formatGameName(game)}</h4>
                    <div class="game-stats">
                        <span>${stats.wins}W - ${stats.losses}L</span>
                        <span>${stats.winRate}% WR</span>
                    </div>
                </div>
                <div class="game-rank">
                    ${stats.rank || 'Unranked'}
                </div>
            </div>
        `).join('');
    }

    renderClanInfo(clan) {
        return `
            <div class="clan-info-card">
                <div class="clan-header">
                    <span class="clan-name">${clan.name}</span>
                    <span class="clan-tag">${clan.tag}</span>
                </div>
                <div class="clan-role">${clan.role}</div>
                <div class="clan-join-date">Member since ${new Date(clan.joinDate).toLocaleDateString()}</div>
            </div>
        `;
    }

    renderNoClan() {
        return `
            <div class="no-clan">
                <i class="fas fa-users"></i>
                <p>Not in a clan</p>
                <button class="cyber-btn cyber-btn-primary" onclick="app.switchSection('recruitment')">
                    Find a Clan
                </button>
            </div>
        `;
    }

    renderAchievements(achievements) {
        if (achievements.length === 0) {
            return '<div class="no-achievements">No achievements yet</div>';
        }

        return achievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">
                    <i class="fas fa-${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                </div>
                <div class="achievement-date">
                    ${achievement.unlocked ? new Date(achievement.unlockedAt).toLocaleDateString() : 'Locked'}
                </div>
            </div>
        `).join('');
    }

    renderActivityFeed(activities) {
        if (activities.length === 0) {
            return '<div class="no-activity">No recent activity</div>';
        }

        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <span class="activity-time">${this.formatTimeAgo(activity.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    getPlatformIcon(platform) {
        const icons = {
            'pc': 'windows',
            'playstation': 'playstation',
            'xbox': 'xbox',
            'nintendo': 'gamepad',
            'mobile': 'mobile-alt'
        };
        return icons[platform] || 'gamepad';
    }

    getGameIcon(game) {
        const icons = {
            'valorant': 'crosshairs',
            'cod': 'gun',
            'apex': 'running',
            'lol': 'dragon',
            'overwatch': 'shield-alt'
        };
        return icons[game] || 'gamepad';
    }

    formatGameName(game) {
        const names = {
            'valorant': 'Valorant',
            'cod': 'Call of Duty',
            'apex': 'Apex Legends',
            'lol': 'League of Legends',
            'overwatch': 'Overwatch 2'
        };
        return names[game] || game;
    }

    getRandomStatus() {
        const statuses = ['online', 'away', 'in-game'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    editProfile() {
        this.showEditProfileModal();
    }

    showEditProfileModal() {
        const user = this.app.currentUser;
        const profile = this.getUserProfile(user.id);

        const modal = document.createElement('div');
        modal.className = 'cyber-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Profile</h2>
                    <button class="modal-close" onclick="this.closest('.cyber-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form class="cyber-form" id="editProfileForm">
                    <div class="form-group">
                        <label for="editUsername">Username</label>
                        <input type="text" id="editUsername" value="${user.username}" required>
                    </div>

                    <div class="form-group">
                        <label for="editEmail">Email</label>
                        <input type="email" id="editEmail" value="${user.email}" required>
                    </div>

                    <div class="form-group">
                        <label for="editPlatform">Main Platform</label>
                        <select id="editPlatform" required>
                            <option value="pc" ${user.platform === 'pc' ? 'selected' : ''}>PC</option>
                            <option value="playstation" ${user.platform === 'playstation' ? 'selected' : ''}>PlayStation</option>
                            <option value="xbox" ${user.platform === 'xbox' ? 'selected' : ''}>Xbox</option>
                            <option value="nintendo" ${user.platform === 'nintendo' ? 'selected' : ''}>Nintendo Switch</option>
                            <option value="mobile" ${user.platform === 'mobile' ? 'selected' : ''}>Mobile</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="editBio">Bio</label>
                        <textarea id="editBio" placeholder="Tell us about yourself...">${profile.bio || ''}</textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="cyber-btn cyber-btn-primary">
                            <i class="fas fa-save"></i>
                            Save Changes
                        </button>
                        <button type="button" class="cyber-btn cyber-btn-secondary" onclick="this.closest('.cyber-modal').remove()">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        document.getElementById('editProfileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfileChanges();
        });
    }

    saveProfileChanges() {
        const form = document.getElementById('editProfileForm');
        const formData = new FormData(form);

        // Update user data
        this.app.currentUser.username = document.getElementById('editUsername').value;
        this.app.currentUser.email = document.getElementById('editEmail').value;
        this.app.currentUser.platform = document.getElementById('editPlatform').value;

        // Update profile data
        const profile = this.getUserProfile(this.app.currentUser.id);
        profile.bio = document.getElementById('editBio').value;

        // Save changes
        localStorage.setItem('cyberLegionUser', JSON.stringify(this.app.currentUser));
        this.saveProfiles();

        // Update UI
        this.app.updateUserInterface();
        this.displayUserProfile(this.app.currentUser);

        // Close modal
        document.querySelector('.cyber-modal').remove();

        this.app.showNotification('Profile updated successfully!', 'success');
    }

    saveProfiles() {
        localStorage.setItem('userProfiles', JSON.stringify(this.userProfiles));
    }

    viewMatchHistory() {
        this.app.showNotification('Match history feature coming soon!', 'info');
    }

    addGameStat(userId, game, result) {
        const profile = this.getUserProfile(userId);
        if (!profile.games[game]) {
            profile.games[game] = { wins: 0, losses: 0, rank: 'Unranked' };
        }

        const gameStat = profile.games[game];
        if (result === 'win') {
            gameStat.wins++;
        } else {
            gameStat.losses++;
        }

        gameStat.winRate = Math.round((gameStat.wins / (gameStat.wins + gameStat.losses)) * 100) || 0;

        // Update overall stats
        profile.stats.gamesPlayed++;
        if (result === 'win') profile.stats.wins++;
        else profile.stats.losses++;
        profile.stats.winRate = Math.round((profile.stats.wins / profile.stats.gamesPlayed) * 100) || 0;

        this.saveProfiles();
        return profile;
    }

    addAchievement(userId, achievement) {
        const profile = this.getUserProfile(userId);
        const existingAchievement = profile.achievements.find(a => a.id === achievement.id);

        if (!existingAchievement) {
            profile.achievements.push({
                ...achievement,
                unlocked: true,
                unlockedAt: new Date().toISOString()
            });
            this.saveProfiles();

            this.app.showNotification(`Achievement unlocked: ${achievement.name}`, 'success');
            return true;
        }

        return false;
    }

    addActivity(userId, activity) {
        const profile = this.getUserProfile(userId);
        profile.recentActivity.unshift({
            ...activity,
            timestamp: new Date().toISOString()
        });

        // Keep only last 10 activities
        profile.recentActivity = profile.recentActivity.slice(0, 10);
        this.saveProfiles();
    }
}

// Initialize profile manager
let profileManager;
document.addEventListener('DOMContentLoaded', () => {
    profileManager = new ProfileManager(app);
});
