// Real-time Updates and WebSocket Simulation
class RealTimeUpdates {
    constructor(app) {
        this.app = app;
        this.connections = new Map();
        this.setupRealTimeFeatures();
    }

    setupRealTimeFeatures() {
        this.setupOnlineStatus();
        this.setupLiveNotifications();
        this.setupActivityStream();
        this.simulateRealTimeData();
    }

    setupOnlineStatus() {
        // Update online status for current user
        if (this.app.currentUser) {
            this.setUserOnline(this.app.currentUser.id);
        }

        // Simulate other users coming online/offline
        setInterval(() => {
            this.updateOnlineUsers();
        }, 10000);
    }

    setUserOnline(userId) {
        // In a real app, this would send to WebSocket server
        localStorage.setItem(`user_${userId}_status`, 'online');
        localStorage.setItem(`user_${userId}_lastSeen`, new Date().toISOString());
    }

    setUserOffline(userId) {
        localStorage.setItem(`user_${userId}_status`, 'offline');
        localStorage.setItem(`user_${userId}_lastSeen`, new Date().toISOString());
    }

    updateOnlineUsers() {
        // Simulate online users count changes
        const onlineNow = document.getElementById('onlineNow');
        if (onlineNow) {
            const current = parseInt(onlineNow.textContent.replace(',', ''));
            const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
            const newValue = Math.max(800, current + change);
            onlineNow.textContent = newValue.toLocaleString();
        }
    }

    setupLiveNotifications() {
        // Simulate live notifications for tournaments, messages, etc.
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance
                this.generateRandomNotification();
            }
        }, 30000);
    }

    generateRandomNotification() {
        if (!this.app.currentUser) return;

        const notifications = [
            {
                type: 'tournament',
                message: 'New tournament starting soon: Weekly Showdown',
                action: () => this.app.switchSection('tournaments')
            },
            {
                type: 'clan',
                message: 'Your clan has been challenged to a match!',
                action: () => this.app.switchSection('clans')
            },
            {
                type: 'message',
                message: 'New message from Clan Leader',
                action: () => console.log('Open messages')
            },
            {
                type: 'achievement',
                message: 'Achievement unlocked: First Blood!',
                action: () => profileManager.viewAchievements()
            }
        ];

        const notification = notifications[Math.floor(Math.random() * notifications.length)];
        this.showLiveNotification(notification);
    }

    showLiveNotification(notification) {
        // Create floating notification
        const notificationEl = document.createElement('div');
        notificationEl.className = `live-notification ${notification.type}`;
        notificationEl.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <p>${notification.message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notificationEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notificationEl.parentElement) {
                notificationEl.remove();
            }
        }, 5000);

        // Make notification clickable
        notificationEl.addEventListener('click', () => {
            notification.action();
            notificationEl.remove();
        });
    }

    getNotificationIcon(type) {
        const icons = {
            'tournament': 'trophy',
            'clan': 'users',
            'message': 'envelope',
            'achievement': 'star'
        };
        return icons[type] || 'bell';
    }

    setupActivityStream() {
        // Simulate real-time activity feed updates
        setInterval(() => {
            this.updateActivityStream();
        }, 15000);
    }

    updateActivityStream() {
        const activities = [
            'Neon Ninjas clan just won a tournament!',
            'New member joined Cyber Strikers',
            'Apex Predators reached Master rank',
            'Weekly Valorant tournament starting in 1 hour',
            'New clan "Digital Dragons" created'
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.addToActivityStream(randomActivity);
    }

    addToActivityStream(activity) {
        const activityStream = document.getElementById('activityStream');
        if (!activityStream) return;

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-bolt"></i>
            </div>
            <div class="activity-content">
                <p>${activity}</p>
                <span class="activity-time">just now</span>
            </div>
        `;

        activityStream.insertBefore(activityItem, activityStream.firstChild);

        // Limit to 10 activities
        if (activityStream.children.length > 10) {
            activityStream.removeChild(activityStream.lastChild);
        }
    }

    simulateRealTimeData() {
        // Simulate various real-time data updates
        this.simulateClanActivity();
        this.simulateTournamentUpdates();
        this.simulateUserStats();
    }

    simulateClanActivity() {
        setInterval(() => {
            // Randomly update clan member counts
            this.app.clans.forEach(clan => {
                const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                clan.online = Math.max(0, Math.min(clan.members, clan.online + change));
            });

            // Update display if on clans section
            if (this.app.currentSection === 'clans') {
                this.app.loadClans();
            }
        }, 8000);
    }

    simulateTournamentUpdates() {
        setInterval(() => {
            if (this.app.currentSection === 'tournaments' && tournamentManager) {
                // Randomly update tournament registrations
                tournamentManager.tournaments.forEach(tournament => {
                    if (tournament.status === 'registration' && Math.random() > 0.8) {
                        if (tournament.registeredTeams < tournament.maxTeams) {
                            tournament.registeredTeams += 1;
                        }
                    }
                });

                tournamentManager.displayTournaments(tournamentManager.tournaments);
            }
        }, 12000);
    }

    simulateUserStats() {
        setInterval(() => {
            if (this.app.currentUser && profileManager) {
                // Occasionally update user stats
                if (Math.random() > 0.9) {
                    const games = ['valorant', 'cod', 'apex', 'lol'];
                    const randomGame = games[Math.floor(Math.random() * games.length)];
                    const result = Math.random() > 0.5 ? 'win' : 'loss';

                    profileManager.addGameStat(this.app.currentUser.id, randomGame, result);

                    // Add activity
                    profileManager.addActivity(this.app.currentUser.id, {
                        icon: 'gamepad',
                        message: `Played ${profileManager.formatGameName(randomGame)} - ${result === 'win' ? 'Victory!' : 'Defeat'}`
                    });
                }
            }
        }, 30000);
    }

    // WebSocket simulation for real chat
    setupChatSystem() {
        this.chatMessages = JSON.parse(localStorage.getItem('clanChat')) || [];
        this.setupChatInterface();
    }

    setupChatInterface() {
        // This would create a real-time chat interface
        // For now, we'll just simulate some functionality
        setInterval(() => {
            if (Math.random() > 0.8) {
                this.simulateChatMessage();
            }
        }, 20000);
    }

    simulateChatMessage() {
        const users = ['CyberNinja', 'NeonGhost', 'DigitalWolf', 'ByteHunter'];
        const messages = [
            'Anyone for some ranked games?',
            'Great match everyone!',
            'Tournament practice starting in 30 mins',
            'New strategy discussion in #tactics',
            'Welcome to our new members!'
        ];

        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        this.addChatMessage(randomUser, randomMessage);
    }

    addChatMessage(user, message) {
        this.chatMessages.push({
            user,
            message,
            timestamp: new Date().toISOString(),
            type: 'message'
        });

        // Keep only last 100 messages
        this.chatMessages = this.chatMessages.slice(-100);
        localStorage.setItem('clanChat', JSON.stringify(this.chatMessages));

        // Update chat display if visible
        this.updateChatDisplay();
    }

    updateChatDisplay() {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;

        chatContainer.innerHTML = this.chatMessages.map(msg => `
            <div class="chat-message">
                <div class="message-user">${msg.user}:</div>
                <div class="message-content">${msg.message}</div>
                <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</div>
            </div>
        `).join('');

        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Voice channel simulation
    setupVoiceChannels() {
        this.voiceChannels = new Map();
        this.setupVoiceInterface();
    }

    setupVoiceInterface() {
        // Simulate voice channel activity
        setInterval(() => {
            this.updateVoiceChannels();
        }, 15000);
    }

    updateVoiceChannels() {
        const channels = ['General', 'Competitive', 'Casual', 'Tournament'];
        channels.forEach(channel => {
            const userCount = Math.floor(Math.random() * 8);
            this.voiceChannels.set(channel, userCount);
        });

        this.updateVoiceDisplay();
    }

    updateVoiceDisplay() {
        const voiceContainer = document.getElementById('voiceChannels');
        if (!voiceContainer) return;

        voiceContainer.innerHTML = Array.from(this.voiceChannels.entries()).map(([channel, users]) => `
            <div class="voice-channel">
                <div class="channel-name">
                    <i class="fas fa-volume-up"></i>
                    ${channel}
                </div>
                <div class="channel-users">
                    ${users} user${users !== 1 ? 's' : ''}
                </div>
            </div>
        `).join('');
    }
}

// Initialize real-time updates
let realTimeUpdates;
document.addEventListener('DOMContentLoaded', () => {
    realTimeUpdates = new RealTimeUpdates(app);
});
