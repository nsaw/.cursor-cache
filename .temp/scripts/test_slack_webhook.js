#!/usr/bin/env node

/**
 * Test Slack Webhook Connection
 * Verifies that the webhook URL is working correctly
 */

const axios = require('axios');
require('dotenv').config();

const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/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';
const CHANNEL = process.env.SLACK_CHANNEL || '#runner-control';
const USERNAME = process.env.SLACK_USERNAME || 'GPT-Cursor Runner';

async function testWebhook() {
  console.log('🧪 Testing Slack webhook connection...');
  console.log(`📡 Webhook URL: ${WEBHOOK_URL}`);
  console.log(`📺 Channel: ${CHANNEL}`);
  console.log(`👤 Username: ${USERNAME}`);
  console.log('');

  try {
    const testPayload = {
      text: `🧪 **Webhook Test**\n\n**Status:** Testing webhook connection\n**Timestamp:** ${new Date().toLocaleString()}\n**Environment:** ${process.env.NODE_ENV || 'development'}\n\n**Note:** This is a test message to verify webhook functionality.`,
      channel: CHANNEL,
      username: USERNAME,
      icon_emoji: ':test_tube:'
    };

    console.log('📤 Sending test message...');
    const response = await axios.post(WEBHOOK_URL, testPayload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.status === 200) {
      console.log('✅ Webhook test successful!');
      console.log(`📊 Response status: ${response.status}`);
      console.log(`📋 Response data: ${JSON.stringify(response.data)}`);
      
      // Test different message types
      await testMessageTypes();
      
    } else {
      console.log('❌ Webhook test failed');
      console.log(`📊 Response status: ${response.status}`);
      console.log(`📋 Response data: ${JSON.stringify(response.data)}`);
    }

  } catch (error) {
    console.error('❌ Webhook test error:', error.message);
    
    if (error.response) {
      console.error(`📊 Error status: ${error.response.status}`);
      console.error(`📋 Error data: ${JSON.stringify(error.response.data)}`);
    }
  }
}

async function testMessageTypes() {
  console.log('\n🧪 Testing different message types...');
  
  const testMessages = [
    {
      text: '✅ **Success Test**\nThis is a success message test.',
      icon_emoji: ':white_check_mark:'
    },
    {
      text: '⚠️ **Warning Test**\nThis is a warning message test.',
      icon_emoji: ':warning:'
    },
    {
      text: '❌ **Error Test**\nThis is an error message test.',
      icon_emoji: ':x:'
    },
    {
      text: '🔄 **Info Test**\nThis is an info message test.',
      icon_emoji: ':information_source:'
    }
  ];

  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    try {
      const payload = {
        text: message.text,
        channel: CHANNEL,
        username: USERNAME,
        icon_emoji: message.icon_emoji
      };

      await axios.post(WEBHOOK_URL, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      console.log(`   ✅ Message ${i + 1} sent successfully`);
      
      // Wait between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`   ❌ Message ${i + 1} failed: ${error.message}`);
    }
  }
}

async function testSlashCommandResponse() {
  console.log('\n🧪 Testing slash command response simulation...');
  
  try {
    const commandPayload = {
      text: `📋 **Slash Command Test**\n\n**Command:** /test-webhook\n**User:** test-user\n**Channel:** #runner-control\n**Timestamp:** ${  new Date().toLocaleString()  }\n\n**Status:** Simulating slash command response\n**Result:** Webhook is working correctly!`,
      channel: CHANNEL,
      username: USERNAME,
      icon_emoji: ':robot_face:',
      attachments: [
        {
          color: 'good',
          fields: [
            {
              title: 'Test Type',
              value: 'Slash Command Response',
              short: true
            },
            {
              title: 'Status',
              value: 'Success',
              short: true
            }
          ],
          footer: 'GPT-Cursor Runner Test',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    };

    await axios.post(WEBHOOK_URL, commandPayload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    console.log('✅ Slash command response test successful!');
    
  } catch (error) {
    console.log('❌ Slash command response test failed:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Slack webhook tests...\n');
  
  await testWebhook();
  await testSlashCommandResponse();
  
  console.log('\n📊 Webhook test summary:');
  console.log(`✅ Webhook URL: ${WEBHOOK_URL ? 'Configured' : 'Not configured'}`);
  console.log(`✅ Channel: ${CHANNEL}`);
  console.log(`✅ Username: ${USERNAME}`);
  console.log('\n🎉 Webhook tests completed!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testWebhook, testMessageTypes, testSlashCommandResponse }; 