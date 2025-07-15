export default function decodeJwt(token: string): any {
    if (!token) {
        return null;
    }

    const parts = token.split('.');

    if (parts.length !== 3) {
        throw new Error('Token JWT invalide');
    }

    const payload = parts[1];

    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

    return decodedPayload;
}