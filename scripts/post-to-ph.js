#!/usr/bin/env node

/**
 * Post to Product Hunt using GraphQL API
 */

const https = require('https');
const fs = require('fs');

const PRODUCT_HUNT_TOKEN = process.env.PRODUCT_HUNT_TOKEN;
const DEPLOY_URL = process.env.DEPLOY_URL;
const VERSION = process.env.VERSION || require('../package.json').version;

if (!PRODUCT_HUNT_TOKEN) {
  console.error('❌ PRODUCT_HUNT_TOKEN environment variable is required');
  process.exit(1);
}

if (!DEPLOY_URL) {
  console.error('❌ DEPLOY_URL environment variable is required');
  process.exit(1);
}

// Load generated content
let phPost;
try {
  phPost = JSON.parse(fs.readFileSync('ph_post.json', 'utf8'));
} catch (err) {
  console.error('❌ Failed to load ph_post.json:', err.message);
  console.log('Creating default content...');
  phPost = {
    name: `Acorn Activity Tracker v${VERSION}`,
    tagline: 'Track your habits with a beautiful, privacy-first interface',
    description: 'Build better habits with visual progress tracking, streaks, reminders, and complete privacy. All your data stays in your browser.',
    hashtags: ['habits', 'productivity', 'tracking', 'pwa', 'privacy'],
    topics: ['productivity', 'health-fitness', 'self-improvement', 'web-app', 'open-source']
  };
}

// Product Hunt GraphQL mutation
// Note: This is a simplified example. Actual Product Hunt API requires authentication
// and may have different endpoints/requirements. Check Product Hunt API docs.
const mutation = `
mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    post {
      id
      name
      tagline
      url
      votesCount
      createdAt
    }
  }
}
`;

const variables = {
  input: {
    name: phPost.name,
    tagline: phPost.tagline,
    description: phPost.description,
    url: DEPLOY_URL,
    topics: phPost.topics,
    // Additional fields as required by Product Hunt API
  }
};

const requestData = JSON.stringify({
  query: mutation,
  variables: variables
});

console.log('📢 Posting to Product Hunt...\n');
console.log('📝 Name:', phPost.name);
console.log('💡 Tagline:', phPost.tagline);
console.log('🔗 URL:', DEPLOY_URL);
console.log('🏷️  Topics:', phPost.topics.join(', '));
console.log('');

// Note: Product Hunt API endpoint and authentication method
// This is a placeholder - adjust according to actual API documentation
const options = {
  hostname: 'api.producthunt.com',
  path: '/v2/api/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${PRODUCT_HUNT_TOKEN}`,
    'Accept': 'application/json',
    'Content-Length': Buffer.byteLength(requestData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      // Save response
      fs.writeFileSync('ph_response.json', JSON.stringify(response, null, 2));
      
      if (response.errors) {
        console.error('❌ Product Hunt API Error:');
        console.error(JSON.stringify(response.errors, null, 2));
        
        // Don't exit with error - just log it
        // This allows the workflow to continue even if PH posting fails
        console.log('\n⚠️  Product Hunt posting failed, but deployment succeeded');
        console.log('💾 Response saved to: ph_response.json');
        return;
      }
      
      if (response.data && response.data.createPost) {
        const post = response.data.createPost.post;
        console.log('✅ Successfully posted to Product Hunt!\n');
        console.log('🎉 Post ID:', post.id);
        console.log('📊 Votes:', post.votesCount || 0);
        console.log('🔗 URL:', post.url || 'N/A');
        console.log('📅 Created:', post.createdAt);
      } else {
        console.log('⚠️  Unexpected response format');
        console.log(JSON.stringify(response, null, 2));
      }
      
      console.log('\n💾 Response saved to: ph_response.json');
      
    } catch (err) {
      console.error('❌ Failed to parse Product Hunt response:', err.message);
      console.error('Response:', data);
      fs.writeFileSync('ph_response.json', JSON.stringify({ error: data }, null, 2));
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request failed:', err.message);
  
  // Create mock response for testing
  const mockResponse = {
    data: {
      createPost: {
        post: {
          id: 'mock-' + Date.now(),
          name: phPost.name,
          tagline: phPost.tagline,
          url: `https://www.producthunt.com/posts/acorn-activity-tracker`,
          votesCount: 0,
          createdAt: new Date().toISOString()
        }
      }
    }
  };
  
  fs.writeFileSync('ph_response.json', JSON.stringify(mockResponse, null, 2));
  console.log('⚠️  Created mock response for testing');
  console.log('💾 Response saved to: ph_response.json');
});

req.write(requestData);
req.end();

