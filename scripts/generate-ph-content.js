#!/usr/bin/env node

/**
 * Generate Product Hunt content using OpenAI GPT
 */

const https = require('https');
const fs = require('fs');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VERSION = process.env.VERSION || require('../package.json').version;

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

const prompt = `Generate a Product Hunt post for a habit tracking web app called "Acorn Activity Tracker" (version ${VERSION}).

Key Features:
- Add and customize habits with names, descriptions, icons, and colors
- Tile-based grid chart for visual progress tracking
- Streak tracking to monitor consistency
- Set custom frequency goals (daily/weekly)
- Reminder notifications at specified times
- Calendar view for managing past completions
- Archive habits without losing data
- Dark/Light mode with multiple themes
- Import/Export data as JSON
- PWA support with offline functionality
- 100% privacy - all data stored locally in browser
- No sign-up required

Target Audience: People who want to build better habits, track daily routines, and stay motivated with visual progress indicators.

Please generate:
1. A catchy name/title (max 60 chars, include the app name)
2. A compelling tagline (max 120 chars)
3. A detailed description (max 260 chars, focus on unique value)
4. 5 relevant hashtags (without # symbol)
5. 5 relevant topics/categories

Format the response as valid JSON with these exact keys: name, tagline, description, hashtags (array), topics (array).`;

const requestData = JSON.stringify({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'system',
      content: 'You are a Product Hunt marketing expert. Create compelling, authentic product descriptions that highlight unique value propositions.'
    },
    {
      role: 'user',
      content: prompt
    }
  ],
  temperature: 0.8,
  max_tokens: 800,
  response_format: { type: 'json_object' }
});

const options = {
  hostname: 'api.openai.com',
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Length': Buffer.byteLength(requestData)
  }
};

console.log('🤖 Generating Product Hunt content with GPT...\n');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.error) {
        console.error('❌ OpenAI API Error:', response.error.message);
        process.exit(1);
      }
      
      const content = JSON.parse(response.choices[0].message.content);
      
      // Validate and format content
      const phPost = {
        name: content.name || `Acorn Activity Tracker ${VERSION}`,
        tagline: content.tagline || 'Track your habits with a beautiful, privacy-first interface',
        description: content.description || 'Build better habits with visual progress tracking, streaks, reminders, and complete privacy. All your data stays in your browser.',
        hashtags: content.hashtags || ['habits', 'productivity', 'tracking', 'pwa', 'privacy'],
        topics: content.topics || ['productivity', 'health-fitness', 'self-improvement', 'web-app', 'open-source']
      };
      
      // Save to file
      fs.writeFileSync('ph_post.json', JSON.stringify(phPost, null, 2));
      
      console.log('✅ Generated Product Hunt content:\n');
      console.log('📝 Name:', phPost.name);
      console.log('💡 Tagline:', phPost.tagline);
      console.log('📄 Description:', phPost.description);
      console.log('🏷️  Hashtags:', phPost.hashtags.join(', '));
      console.log('📂 Topics:', phPost.topics.join(', '));
      console.log('\n💾 Saved to: ph_post.json');
      
    } catch (err) {
      console.error('❌ Failed to parse OpenAI response:', err.message);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request failed:', err.message);
  process.exit(1);
});

req.write(requestData);
req.end();

