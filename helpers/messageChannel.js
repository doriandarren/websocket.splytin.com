
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1319318553677004810/Yb7QE6vfM6BTjzTXs93e4LVxz4IRan2WT95yQiHBPdajkHuusZHsF6Ld047GY5hO1DWz';


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