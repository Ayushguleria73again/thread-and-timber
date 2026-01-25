const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("thread-timber-token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(error.message || "Request failed");
    }

    return response.json();
}
