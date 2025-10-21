import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Tuya API configuration
const ACCESS_ID = Deno.env.get('SMART_HOME_ACCESS_ID');
const ACCESS_SECRET = Deno.env.get('SMART_HOME_ACCESS_SECRET');
const API_BASE_URL = 'https://openapi.tuyaus.com';

// Generate signature for Tuya API
async function generateSignature(
  method: string,
  path: string,
  params: Record<string, any>,
  body: string,
  timestamp: string,
  nonce: string,
  accessToken: string = ''
): Promise<string> {
  const stringToSign = [
    method,
    await hashSHA256(body),
    '',
    path
  ].join('\n');

  const signStr = ACCESS_ID + accessToken + timestamp + nonce + stringToSign;
  const signature = await hmacSHA256(signStr, ACCESS_SECRET!);
  return signature.toUpperCase();
}

async function hashSHA256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSHA256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const messageData = encoder.encode(message);
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Get access token
async function getAccessToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const nonce = Math.random().toString(36).substring(7);
  const path = '/v1.0/token?grant_type=1';
  
  const signature = await generateSignature('GET', path, {}, '', timestamp, nonce);
  
  const headers = {
    'client_id': ACCESS_ID!,
    'sign': signature,
    't': timestamp,
    'sign_method': 'HMAC-SHA256',
    'nonce': nonce,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers,
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(`Failed to get access token: ${data.msg}`);
  }

  return data.result.access_token;
}

// Make authenticated API request
async function makeAuthenticatedRequest(
  method: string,
  path: string,
  body: any = null,
  accessToken: string
): Promise<any> {
  const timestamp = Date.now().toString();
  const nonce = Math.random().toString(36).substring(7);
  const bodyStr = body ? JSON.stringify(body) : '';
  
  const signature = await generateSignature(
    method,
    path,
    {},
    bodyStr,
    timestamp,
    nonce,
    accessToken
  );
  
  const headers = {
    'client_id': ACCESS_ID!,
    'access_token': accessToken,
    'sign': signature,
    't': timestamp,
    'sign_method': 'HMAC-SHA256',
    'nonce': nonce,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = bodyStr;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await response.json();
  
  if (!data.success) {
    console.error('API Error:', data);
    throw new Error(`API request failed: ${data.msg || 'Unknown error'}`);
  }

  return data.result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, deviceId, commands } = await req.json();
    console.log('Smart Home request:', { action, deviceId });

    // Get access token first
    const accessToken = await getAccessToken();
    console.log('Access token obtained');

    let result;

    switch (action) {
      case 'list_devices': {
        // List all devices
        const devices = await makeAuthenticatedRequest(
          'GET',
          '/v1.0/devices',
          null,
          accessToken
        );
        result = devices;
        break;
      }

      case 'get_device': {
        // Get specific device info
        if (!deviceId) {
          throw new Error('deviceId is required for get_device action');
        }
        const device = await makeAuthenticatedRequest(
          'GET',
          `/v1.0/devices/${deviceId}`,
          null,
          accessToken
        );
        result = device;
        break;
      }

      case 'get_device_status': {
        // Get device status
        if (!deviceId) {
          throw new Error('deviceId is required for get_device_status action');
        }
        const status = await makeAuthenticatedRequest(
          'GET',
          `/v1.0/devices/${deviceId}/status`,
          null,
          accessToken
        );
        result = status;
        break;
      }

      case 'send_command': {
        // Send command to device
        if (!deviceId || !commands) {
          throw new Error('deviceId and commands are required for send_command action');
        }
        
        const response = await makeAuthenticatedRequest(
          'POST',
          `/v1.0/devices/${deviceId}/commands`,
          { commands },
          accessToken
        );
        result = response;
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in smart-home-devices function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
