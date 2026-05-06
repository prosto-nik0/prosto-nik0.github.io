const BOT_TOKEN = '8776620555:AAEprKjWryt6soMpEU8zS0J7IiLR6156vb8'; // Замените на токен вашего бота
const CHAT_ID = '2045877032'; // Замените на ID вашего канала
const MESSAGES_COUNT = 5; // Количество последних сообщений для отображения
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 минут в миллисекундах

// Функция для получения сообщений из Telegram
async function fetchTelegramPosts() {
    try {
        const response = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=-${MESSAGES_COUNT}`
        );
        const data = await response.json();

        if (!data.ok) {
            throw new Error('Ошибка API Telegram: ' + data.description);
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

// Функция для отображения сообщений на странице
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

// Функция для запуска периодического обновления
function startAutoUpdate() {
    // Загружаем сообщения сразу при загрузке страницы
    fetchTelegramPosts();

    // Устанавливаем интервал для автоматического обновления каждые 5 минут
    setInterval(fetchTelegramPosts, UPDATE_INTERVAL);

    console.log(`Автоматическое обновление запущено. Следующее обновление через ${UPDATE_INTERVAL / 60000} минут.`);
}

// Запускаем автоматическое обновление при полной загрузке страницы
document.addEventListener('DOMContentLoaded', startAutoUpdate);
