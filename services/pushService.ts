import admin from '../firebase/firebaseAdmin';

export interface PushPayload {
    title: string;
    body: string;
    data?: Record<string, string>;
}

class PushService {
    async sendToTokens(tokens: string[], payload: PushPayload): Promise<{ invalidTokens: string[] }> {
        if (!tokens || tokens.length === 0) return { invalidTokens: [] };

        const message: admin.messaging.MulticastMessage = {
            tokens,
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {},
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    channelId: 'default',
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        contentAvailable: true,
                    },
                },
            },
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        const invalidTokens: string[] = [];

        response.responses.forEach((r, idx) => {
            if (!r.success) {
                const code = (r.error as any)?.errorInfo?.code || r.error?.code;
                if (
                    code === 'messaging/registration-token-not-registered' ||
                    code === 'messaging/invalid-registration-token'
                ) {
                    invalidTokens.push(tokens[idx]);
                }
            }
        });

        return { invalidTokens };
    }
}

export default new PushService();
