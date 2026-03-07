export async function sendWhatsAppMessage(target, message) {
    const token = process.env.FONNTE_API_TOKEN;

    if (!token) {
        console.warn('FONNTE_API_TOKEN is not set. WhatsApp message not sent.');
        return null;
    }

    try {
        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target: target,
                message: message,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Fonnte API Error:', result);
            return { success: false, error: result };
        }

        return { success: true, data: result };
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return { success: false, error: error.message };
    }
}
