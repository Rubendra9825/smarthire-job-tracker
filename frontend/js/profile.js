/* ============================================================
   profile.js — Profile page logic
   ============================================================
   Handles:
   - Loading and displaying user profile from localStorage
   - Saving profile changes
   - Skills tag management (add/remove)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── LOAD PROFILE ─────────────────────────────────────────
    // Try loading saved profile from localStorage, else use mock

    const defaultProfile = {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        phone: '+91 98765 43210',
        location: 'Bangalore, India',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
        preferredRoles: 'Full Stack Developer, Frontend Engineer',
        preferredLocations: 'Bangalore, Hyderabad, Remote',
        bio: 'Final year CS student passionate about building web applications. Looking for SDE / SWE roles.',
        resume: '',
        linkedin: 'https://linkedin.com/in/alexjohnson',
        github: 'https://github.com/alexjohnson',
    };

    let profile = JSON.parse(localStorage.getItem('sh_profile') || JSON.stringify(defaultProfile));

    // ── POPULATE FORM ─────────────────────────────────────────

    function populateForm() {
        document.getElementById('profileName').value = profile.name;
        document.getElementById('profileEmail').value = profile.email;
        document.getElementById('profilePhone').value = profile.phone;
        document.getElementById('profileLocation').value = profile.location;
        document.getElementById('profileBio').value = profile.bio;
        document.getElementById('profilePreferredRoles').value = profile.preferredRoles;
        document.getElementById('profilePreferredLocs').value = profile.preferredLocations;
        document.getElementById('profileResume').value = profile.resume;
        document.getElementById('profileLinkedIn').value = profile.linkedin;
        document.getElementById('profileGitHub').value = profile.github;
        renderSkills();
    }

    // ── SKILLS TAGS ───────────────────────────────────────────
    // Renders skill chips with remove buttons

    function renderSkills() {
        const container = document.getElementById('skillsContainer');
        if (!container) return;
        container.innerHTML = profile.skills.map(skill => `
      <span class="skill-tag">
        ${skill}
        <button onclick="removeSkill('${skill}')" title="Remove">×</button>
      </span>
    `).join('');
    }

    window.removeSkill = function (skill) {
        profile.skills = profile.skills.filter(s => s !== skill);
        renderSkills();
    };

    // Add skill on pressing Enter in the skill input
    const skillInput = document.getElementById('newSkillInput');
    if (skillInput) {
        skillInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = skillInput.value.trim();
                if (val && !profile.skills.includes(val)) {
                    profile.skills.push(val);
                    renderSkills();
                    skillInput.value = '';
                }
            }
        });
    }

    // ── SAVE PROFILE ──────────────────────────────────────────

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', e => {
            e.preventDefault();
            profile.name = document.getElementById('profileName').value.trim();
            profile.email = document.getElementById('profileEmail').value.trim();
            profile.phone = document.getElementById('profilePhone').value.trim();
            profile.location = document.getElementById('profileLocation').value.trim();
            profile.bio = document.getElementById('profileBio').value.trim();
            profile.preferredRoles = document.getElementById('profilePreferredRoles').value.trim();
            profile.preferredLocations = document.getElementById('profilePreferredLocs').value.trim();
            profile.resume = document.getElementById('profileResume').value.trim();
            profile.linkedin = document.getElementById('profileLinkedIn').value.trim();
            profile.github = document.getElementById('profileGitHub').value.trim();

            localStorage.setItem('sh_profile', JSON.stringify(profile));
            showToast('Profile saved!', 'success');
        });
    }

    // ── INIT ──────────────────────────────────────────────────
    populateForm();

});
