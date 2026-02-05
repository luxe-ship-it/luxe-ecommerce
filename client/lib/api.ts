export async function apiRequest(
    method: string,
    path: string,
    body?: unknown
) {
    const headers: Record<string, string> = {};

    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const token = localStorage.getItem("token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`/api${path}`, {
        method,
        headers,
        body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });

    if (!res.ok) {
        let error;
        try {
            error = await res.json();
        } catch {
            error = { message: res.statusText || `Error ${res.status}` };
        }
        throw new Error(error.message || "Something went wrong");
    }

    try {
        return await res.json();
    } catch {
        return {}; // Handle empty or non-JSON success responses
    }
}
