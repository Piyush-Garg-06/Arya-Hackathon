const API_BASE_URL = "http://localhost:5000/api";

export interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
  xpPoints: number;
  level: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

class AuthService {
  /**
   * Register a new user
   */
  async register(
    name: string,
    email: string,
    password: string,
    userType: "student" | "professional" = "student"
  ): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        userType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Store token and user
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    return data;
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store token and user
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    return data;
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get auth headers for API requests
   */
  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle unauthorized
    if (response.status === 401) {
      this.logout();
      window.location.href = "/login";
    }

    return response;
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<User>): Promise<any> {
    const response = await this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Profile update failed");
    }

    // Update stored user data
    localStorage.setItem("user", JSON.stringify(data.data.user));

    return data;
  }
}

// Export singleton instance
export const authService = new AuthService();
