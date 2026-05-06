const BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Замените на токен вашего бота
const CHAT_ID = 'YOUR_CHANNEL_ID'; // Замените на ID вашего канала
const MESSAGES_COUNT = 5; // Количество последних сообщений для отображения

async function fetchTelegramPosts() {
    try {
        const response = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=-${MESSAGES_COUNT}`
        );
        const data = await response.json();

        if (!data.ok) {
            throw new Error('Ошибка API Telegram');
        }

        const posts = data.result
            .filter(update => update.message && update.message.chat.id == CHAT_ID)
            .map(update => update.message)
            .sort((a, b) => b.date - a.date); // От новых к старым

        displayPosts(posts);
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
        document.getElementById('telegram-posts').innerHTML =
            '<p>Не удалось загрузить сообщения. Проверьте настройки.</p>';
    }
}

function displayPosts(posts) {
    const container = document.getElementById('telegram-posts');

    if (posts.length === 0) {
        container.innerHTML = '<p>Сообщений пока нет.</p>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post">
            <div class="post-date">
                ${new Date(post.date * 1000).toLocaleString('ru-RU')}
            </div>
            <div class="post-text">
                ${post.text || 'Сообщение без текста (возможно, фото или файл)'}
            </div>
        </div>
    `).join('');
}

// Загружаем сообщения при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchTelegramPosts);
