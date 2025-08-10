import { auth } from '@/services/firebase/config';

/**
 * Make an authenticated API request with Firebase ID token
 * @param url The API endpoint URL
 * @param options Fetch options
 * @returns Promise with the response
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    // Get the current user
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Get the ID token
    const idToken = await currentUser.getIdToken();
    
    // Prepare headers
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', `Bearer ${idToken}`);

    // Make the request
    return fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error('Error making authenticated request:', error);
    throw error;
  }
}

/**
 * Make a POST request with authentication
 * @param url The API endpoint URL
 * @param data The data to send
 * @returns Promise with the response
 */
export async function authenticatedPost<T = any>(
  url: string,
  data: any
): Promise<T> {
  const response = await authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Make a GET request with authentication
 * @param url The API endpoint URL
 * @returns Promise with the response
 */
export async function authenticatedGet<T = any>(url: string): Promise<T> {
  const response = await authenticatedFetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Make a PUT request with authentication
 * @param url The API endpoint URL
 * @param data The data to send
 * @returns Promise with the response
 */
export async function authenticatedPut<T = any>(
  url: string,
  data: any
): Promise<T> {
  const response = await authenticatedFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Make a DELETE request with authentication
 * @param url The API endpoint URL
 * @returns Promise with the response
 */
export async function authenticatedDelete<T = any>(url: string): Promise<T> {
  const response = await authenticatedFetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
} 