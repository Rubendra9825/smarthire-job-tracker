/* ============================================================
   resume-matcher.js — AI Resume Matcher (Stage 1 prototype)
   ============================================================
   In Stage 1, this shows a SIMULATED match result.
   In Stage 8, this will call a real Python/AI API.

   How it works (simulated):
   - Extracts "words" from both resume and job description
   - Checks which job keywords appear in the resume
   - Calculates a simple match percentage
   - Shows matched skills, missing skills, and suggestions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // Common tech keywords to look for (expanded in Stage 8 with NLP)
    const KNOWN_SKILLS = [
        'javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'go', 'rust', 'kotlin', 'swift',
        'react', 'angular', 'vue', 'nextjs', 'express', 'django', 'flask', 'fastapi', 'spring',
        'node', 'nodejs', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
        'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'ansible',
        'git', 'linux', 'rest', 'graphql', 'microservices', 'ci/cd', 'jenkins', 'github actions',
        'html', 'css', 'tailwind', 'bootstrap', 'sql', 'nosql', 'machine learning', 'deep learning',
        'tensorflow', 'pytorch', 'nlp', 'data structures', 'algorithms', 'oop', 'agile', 'scrum',
        'figma', 'jira', 'postman', 'swagger',
    ];

    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultBox = document.getElementById('resultBox');
    const resumeInput = document.getElementById('resumeText');
    const jdInput = document.getElementById('jdText');

    if (!analyzeBtn) return;

    analyzeBtn.addEventListener('click', () => {
        const resumeText = resumeInput.value.trim().toLowerCase();
        const jdText = jdInput.value.trim().toLowerCase();

        // ── VALIDATION ───────────────────────────────────────
        if (resumeText.length < 50) {
            showToast('Please enter your resume text (at least 50 characters).', 'error');
            return;
        }
        if (jdText.length < 50) {
            showToast('Please enter the job description (at least 50 characters).', 'error');
            return;
        }

        // ── EXTRACT KEYWORDS FROM JD ─────────────────────────
        // We look for known skill keywords that appear in the JD
        const jdKeywords = KNOWN_SKILLS.filter(skill => jdText.includes(skill));

        // Also grab capitalized words from the JD (likely technologies)
        const jdWordSet = new Set([
            ...jdKeywords,
            ...jdText.split(/\W+/).filter(w => w.length > 2 && KNOWN_SKILLS.includes(w)),
        ]);

        if (jdWordSet.size === 0) {
            showToast('Could not extract skills from the job description. Try adding more technical keywords.', 'error');
            return;
        }

        // ── CHECK WHICH KEYWORDS APPEAR IN RESUME ────────────
        const matched = [...jdWordSet].filter(kw => resumeText.includes(kw));
        const missing = [...jdWordSet].filter(kw => !resumeText.includes(kw));

        // ── CALCULATE MATCH % ─────────────────────────────────
        // Simple ratio: matched / total JD keywords
        const pct = Math.round((matched.length / jdWordSet.size) * 100);

        // ── GENERATE SUGGESTIONS ─────────────────────────────
        const suggestions = [];
        if (missing.length > 0) {
            suggestions.push(`Add these missing keywords naturally into your resume: <strong>${missing.slice(0, 5).join(', ')}</strong>.`);
        }
        if (pct < 50) {
            suggestions.push('Your resume matches less than 50% of the job requirements. Consider tailoring it more specifically to this role.');
        }
        if (!resumeText.includes('github') && !resumeText.includes('portfolio')) {
            suggestions.push('Include a link to your GitHub or portfolio to demonstrate your work.');
        }
        if (resumeText.split(/\n/).length < 10) {
            suggestions.push('Your resume seems short. Consider adding more detail about your projects and experience.');
        }
        suggestions.push('Use action verbs like "Built", "Developed", "Designed", "Optimized" at the start of bullet points.');

        // ── RENDER RESULT ─────────────────────────────────────

        // Set the CSS conic-gradient variable for the score circle
        const scoreCircle = document.getElementById('scoreCircle');
        const scoreNum = document.getElementById('scoreNum');
        if (scoreCircle) scoreCircle.style.setProperty('--pct', pct + '%');
        if (scoreNum) scoreNum.textContent = pct + '%';

        // Score label
        const scoreLabel = document.getElementById('scoreLabel');
        if (scoreLabel) {
            if (pct >= 75) scoreLabel.textContent = '🟢 Strong Match';
            else if (pct >= 50) scoreLabel.textContent = '🟡 Moderate Match';
            else scoreLabel.textContent = '🔴 Weak Match';
        }

        // Matched skills chips
        const matchedEl = document.getElementById('matchedSkills');
        if (matchedEl) {
            matchedEl.innerHTML = matched.length > 0
                ? matched.map(s => `<span class="skill-chip match"><i class="bi bi-check-lg"></i>${s}</span>`).join('')
                : '<p style="color:var(--color-muted);font-size:13px;">No matching skills found.</p>';
        }

        // Missing skills chips
        const missingEl = document.getElementById('missingSkills');
        if (missingEl) {
            missingEl.innerHTML = missing.length > 0
                ? missing.map(s => `<span class="skill-chip missing"><i class="bi bi-x-lg"></i>${s}</span>`).join('')
                : '<p style="color:var(--color-muted);font-size:13px;">Great — no missing skills detected!</p>';
        }

        // Suggestions list
        const suggestionsEl = document.getElementById('suggestions');
        if (suggestionsEl) {
            suggestionsEl.innerHTML = suggestions.map(s => `
        <li style="margin-bottom:8px;font-size:13.5px;">${s}</li>
      `).join('');
        }

        // Summary keyword count
        const summaryEl = document.getElementById('matchSummary');
        if (summaryEl) {
            summaryEl.textContent = `Found ${jdWordSet.size} keywords in JD — ${matched.length} matched, ${missing.length} missing.`;
        }

        // Show the result panel
        resultBox.classList.add('visible');
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Clear / reset button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            resumeInput.value = '';
            jdInput.value = '';
            resultBox.classList.remove('visible');
        });
    }

});
