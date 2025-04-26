
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1365685641773322250/BRKD26u3L4Pvpm7-fsgS7p214PrnQQ1iHmMlZwg-ufZ7BDHoUxN_NIDHC2ShUruJq4ph';


export const send = async(msg) => {
    

    try {

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content: msg
            }) 
        });


        if (!response.ok) {
            console.error('❌ Error al enviar mensaje:', await response.text());
        } else {
            console.log('✅ Mensaje enviado correctamente a Discord');
        }
        
    } catch (error) {
        console.error('❌ Error en el envío a Discord:', error);
    }

}