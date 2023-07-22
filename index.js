const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
dotenv.config();

async function getRandomWikipediaArticle() {
    try {

        const wikiApiUrl = 'https://en.wikipedia.org/w/api.php';
        const params = {
            action: 'query',
            list: 'random',
            rnnamespace: 0,
            format: 'json'
        };

        const response = await axios.get(wikiApiUrl, { params });
        const randomArticleTitle = response.data.query.random[0].title;
        console.log('Random Article Title:', randomArticleTitle);


        const articleSummaryApiUrl = 'https://en.wikipedia.org/w/api.php';
        const summaryParams = {
            action: 'query',
            prop: 'extracts',
            titles: randomArticleTitle,
            format: 'json'
        };

        const summaryResponse = await axios.get(articleSummaryApiUrl, { params: summaryParams });
        const title = summaryResponse.data.query.pages[Object.keys(summaryResponse.data.query.pages)[0]].title;
        const pageId = Object.keys(summaryResponse.data.query.pages)[0];
        const articleSummary = summaryResponse.data.query.pages[pageId].extract;
        const $ = cheerio.load(articleSummary);
        const plainTextSummary = $.text();
        // var text = $(articleSummary).text();
        console.log('Article Summary:', plainTextSummary);

        // Post to the Telegram group
        // const telegramBotToken = process.env.TELEGRAM_KEY;
        // const chatId = process.env.CHATID;
        const telegramBotToken = '';
        const chatId = '';
        const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        const message = `Wikipedia Article Name : ${title}\n\nSummary: ${plainTextSummary}`;

        const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
        });

        if (telegramResponse.ok) {
            console.log('Message sent successfully!');
        } else {
            console.error('Failed to send the message.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Call the function to start the process
getRandomWikipediaArticle();