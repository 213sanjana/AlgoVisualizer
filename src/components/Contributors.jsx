// cspell:words sandeepvashishtha Vashishtha rhythmpahwa Pahwa noopener noreferrer
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import "../styles/global-theme.css";

// Mock contributors data - moved outside component to avoid useEffect dependency issues
const mockContributors = [
  {
    id: 1,
    login: 'sandeepvashishtha',
    name: 'Sandeep Vashishtha',
    avatar_url: 'https://github.com/sandeepvashishtha.png',
    html_url: 'https://github.com/sandeepvashishtha',
    contributions: 125,
    role: 'Project Lead & Full Stack Developer',
    bio: 'Passionate about building scalable algorithm visualization applications and educational tools.'
  },
  {
    id: 2,
    login: 'rhythmpahwa14',
    name: 'Rhythm Pahwa',
    avatar_url: 'https://github.com/rhythmpahwa14.png',
    html_url: 'https://github.com/rhythmpahwa14',
    contributions: 50,
    role: 'Senior Contributor & Developer',
    bio: 'Experienced developer contributing to algorithm visualization and educational technology projects.'
  }
];

// Helper function to get commit badge styling based on contribution count
const getCommitBadgeStyle = (contributions) => {
  if (contributions >= 200) {
    return {
      backgroundColor: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000',
      border: '2px solid #FFD700',
      glow: '0 0 15px rgba(255, 215, 0, 0.5)',
      label: 'Legend'
    };
  } else if (contributions >= 51) {
    return {
      backgroundColor: 'linear-gradient(135deg, #16a34a, #22c55e)',
      color: '#fff',
      border: '2px solid #16a34a',
      glow: '0 0 12px rgba(34, 197, 94, 0.4)',
      label: 'Expert'
    };
  } else if (contributions >= 10) {
    return {
      backgroundColor: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
      color: '#fff',
      border: '2px solid #3b82f6',
      glow: '0 0 10px rgba(59, 130, 246, 0.4)',
      label: 'Active'
    };
  } else {
    return {
      backgroundColor: 'linear-gradient(135deg, #6b7280, #9ca3af)',
      color: '#fff',
      border: '2px solid #6b7280',
      glow: '0 0 8px rgba(107, 114, 128, 0.3)',
      label: 'New'
    };
  }
};

// Helper function to get avatar ring style based on activity level
const getAvatarRingStyle = (contributions) => {
  if (contributions >= 200) {
    return {
      background: 'conic-gradient(from 0deg, #FFD700, #FFA500, #FFD700)',
      animation: 'spin 3s linear infinite',
      filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))'
    };
  } else if (contributions >= 51) {
    return {
      background: 'conic-gradient(from 0deg, #16a34a, #22c55e, #16a34a)',
      animation: 'spin 4s linear infinite',
      filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))'
    };
  } else if (contributions >= 10) {
    return {
      background: 'conic-gradient(from 0deg, #3b82f6, #60a5fa, #3b82f6)',
      animation: 'spin 5s linear infinite',
      filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))'
    };
  } else {
    return {
      background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
      filter: 'drop-shadow(0 0 4px rgba(107, 114, 128, 0.3))'
    };
  }
};

// Helper function to get role badge icon
const getRoleBadgeIcon = (role) => {
  if (role.includes('Lead') || role.includes('Maintainer')) {
    return '👑';
  } else if (role.includes('Senior') || role.includes('Core')) {
    return '⭐';
  } else if (role.includes('Mentor')) {
    return '🎯';
  } else if (role.includes('Active')) {
    return '🔥';
  }
  return '💎';
};

// Helper function to assign roles based on GitHub activity and profile
const getRoleByGitHubActivity = (contributor) => {
  const { 
    contributions, 
    followers = 0, 
    public_repos = 0, 
    created_at,
    login 
  } = contributor;
  
  // Special role for project owner
  if (login === 'sandeepvashishtha') return 'Project Lead & Full Stack Developer';

  // Calculate account age in years
  const accountAge = created_at ? 
    (new Date() - new Date(created_at)) / (1000 * 60 * 60 * 24 * 365) : 0;
  
  // Advanced role assignment based on multiple factors
  if (contributions > 100 && followers > 50 && public_repos > 20) {
    return 'Core Maintainer';
  }
  
  if (contributions > 50 && (followers > 20 || public_repos > 10)) {
    return 'Senior Open Source Developer';
  }
  
  if (public_repos > 20 && contributions > 20) {
    return 'Open Source Advocate';
  }
  
  if (contributions > 50 && accountAge > 2) {
    return 'Veteran Developer';
  }
  
  if (contributions > 30 && followers > 10) {
    return 'Community Leader';
  }
  
  if (contributions > 20) {
    return 'Active Developer';
  }
  
  if (contributions > 10) {
    return 'Regular Contributor';
  }
  
  if (contributions > 5) {
    return 'Contributing Member';
  }
  
  return 'New Contributor';
};

const Contributors = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastCommitSha, setLastCommitSha] = useState(null);

  // Function to get the latest commit SHA
  const getLatestCommitSha = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/RhythmPahwa14/AlgoVisualizer/commits?per_page=1');
      if (response.ok) {
        const commits = await response.json();
        return commits.length > 0 ? commits[0].sha : null;
      }
    } catch (error) {
      console.error('Error fetching latest commit:', error);
    }
    return null;
  };

  // Function to fetch additional GitHub profile data
  const fetchGitHubProfile = async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.ok) {
        const profile = await response.json();
        return {
          followers: profile.followers || 0,
          public_repos: profile.public_repos || 0,
          created_at: profile.created_at,
          name: profile.name || username,
          bio: profile.bio || `Dedicated contributor with expertise in software development.`
        };
      }
    } catch (error) {
      console.error(`Error fetching profile for ${username}:`, error);
    }
    return {
      followers: 0,
      public_repos: 0,
      created_at: null,
      name: username,
      bio: `Dedicated contributor with expertise in software development.`
    };
  };

  // Function to fetch contributors
  const fetchContributors = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch real contributors from GitHub API
      try {
        const response = await fetch('https://api.github.com/repos/RhythmPahwa14/AlgoVisualizer/contributors');
        if (response.ok) {
          const githubContributors = await response.json();
          
          // Enhance GitHub data with additional profile info
          const enhancedContributors = await Promise.all(
            githubContributors.map(async (contributor) => {
              const profileData = await fetchGitHubProfile(contributor.login);

              // Determine bio without nested ternaries (readability)
              let bio = profileData.bio;
              if (contributor.login === 'rhythmpahwa14') {
                bio = 'Passionate about building scalable algorithm visualization applications and educational tools.';
              } else if (contributor.login === 'sandeepvashishtha') {
                bio = 'Experienced developer contributing to algorithm visualization and educational technology projects.';
              }

              const enhancedContributor = {
                ...contributor,
                ...profileData,
                id: contributor.id,
                role: getRoleByGitHubActivity({
                  ...contributor,
                  ...profileData
                }),
                bio
              };

              return enhancedContributor;
            })
          );
          setContributors(enhancedContributors);
        } else {
          throw new Error('GitHub API request failed');
        }
      } catch (apiError) {
        console.warn('GitHub API not available, using mock data', apiError);
        setContributors(mockContributors);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contributors:', error);
      setContributors(mockContributors);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    const initializeData = async () => {
      await fetchContributors();
      const initialSha = await getLatestCommitSha();
      setLastCommitSha(initialSha);
    };
    
    initializeData();

    // Set up polling for new commits every 30 seconds
    const commitCheckInterval = setInterval(async () => {
      const latestSha = await getLatestCommitSha();
      
      if (latestSha && lastCommitSha && latestSha !== lastCommitSha) {
        console.log('New commit detected, refreshing contributors...');
        await fetchContributors();
        setLastCommitSha(latestSha);
      } else if (latestSha && !lastCommitSha) {
        setLastCommitSha(latestSha);
      }
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(commitCheckInterval);
  }, [lastCommitSha, fetchContributors]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="theme-container">
        <div className="loading-state">
          <motion.div
            className="bouncing-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loader-dot" />
            <div className="loader-dot" />
            <div className="loader-dot" />
          </motion.div>
          <p>Loading our amazing contributors...</p>
        </div>
      </div>
    );
  }



  return (
    // ✅ MODIFIED: The main container now uses our global theme class.
    <div className="theme-container contributors-section">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="contributors-header"
      >
        {/* ✅ MODIFIED: The header now uses our global theme class. */}
        <h1 className="theme-title">Our Amazing Contributors</h1>
        <p className="contributors-subtitle">Building Together, Growing Together</p>
      </motion.div>

      {/* ✅ MODIFIED: The grid now uses our new global class. */}
      <motion.div
        className="contributors-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {contributors.map((contributor) => {
          const badgeStyle = getCommitBadgeStyle(contributor.contributions);
          const avatarRingStyle = getAvatarRingStyle(contributor.contributions);
          const roleIcon = getRoleBadgeIcon(contributor.role);
          
          return (
          // ✅ MODIFIED: The card now uses our new global class.
          <motion.div
            key={contributor.id}
            className="contributor-card enhanced-card"
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              transition: { duration: 0.3 }
            }}
          >
            <div className="card-glow"></div>
            
            <div className="contributor-avatar">
              {/* Enhanced avatar with animated ring */}
              <div className="avatar-container">
                <div className="avatar-ring" style={avatarRingStyle}></div>
                <img
                  src={contributor.avatar_url}
                  alt={contributor.name || contributor.login}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${contributor.name || contributor.login}&background=6366f1&color=ffffff&size=120`;
                  }}
                />
                {/* Role badge overlay */}
                <div className="role-badge-overlay" title={contributor.role}>
                  <span>{roleIcon}</span>
                </div>
              </div>
              
              {/* Enhanced commit badge */}
              <div 
                className="contribution-badge enhanced-badge"
                style={{
                  background: badgeStyle.backgroundColor,
                  color: badgeStyle.color,
                  border: badgeStyle.border,
                  boxShadow: badgeStyle.glow
                }}
              >
                <div className="badge-content">
                  <span className="contribution-count">{contributor.contributions}</span>
                  <span className="contribution-label">commits</span>
                  <span className="contribution-level">{badgeStyle.label}</span>
                </div>
              </div>
            </div>
            
            {/* ✅ MODIFIED: All child elements now use our new global classes. */}
            <div className="contributor-info enhanced-info">
              <h3 className="contributor-name">{contributor.name || contributor.login}</h3>
              <p className="contributor-role">
                <span className="role-icon">{roleIcon}</span>
                {contributor.role}
              </p>
              <p className="contributor-bio">{contributor.bio}</p>
              
              {/* Contribution stats section */}
              <div className="contribution-stats">
                <div className="stat-item">
                  <span className="stat-icon">📊</span>
                  <span className="stat-value">{contributor.contributions}</span>
                  <span className="stat-label">Commits</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🔧</span>
                  <span className="stat-value">{Math.floor(contributor.contributions / 3)}</span>
                  <span className="stat-label">PRs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🐛</span>
                  <span className="stat-value">{Math.floor(contributor.contributions / 5)}</span>
                  <span className="stat-label">Issues</span>
                </div>
              </div>
              
              {/* Enhanced action buttons */}
              <div className="contributor-actions">
                <a
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary enhanced-btn" 
                >
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View Profile
                </a>
                <button 
                  className="btn btn-secondary enhanced-btn"
                  onClick={() => {
                    // Could open a modal or navigate to a appreciation page
                    alert(`Thanks for appreciating ${contributor.name || contributor.login}! 🎉`);
                  }}
                >
                  <span>💝</span>
                  Send Appreciation
                </button>
              </div>
            </div>
          </motion.div>
        )}
      )}
      </motion.div>

      {/* ✅ REFACTORED: The CTA is now a standard theme-card */}
      <motion.div
        className="theme-card"
        style={{ textAlign: 'center' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3 className="theme-card-header">Join Our Community</h3>
        <p style={{ color: "var(--theme-text-secondary)", maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
          Want to contribute to AlgoVisualizer? We welcome developers of all skill levels! 
          Help us improve algorithm education and build amazing visualizations together.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/RhythmPahwa14/AlgoVisualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary" // ✅ MODIFIED
          >
            Contribute on GitHub
          </a>
          <a
            href="https://github.com/RhythmPahwa14/AlgoVisualizer/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary" // ✅ MODIFIED
          >
            Report Issues
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Contributors;