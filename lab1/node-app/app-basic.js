const express = require('express');
const app = express();
const port = 3001;

//Вычисление необходимых данных
const dateNow = new Date();
const weekDay = dateNow.getDate();
let weekDayText = '';

if(weekDay == 0){
    weekDayText = 'Воскресенье';
}
if(weekDay == 1){
    weekDayText = 'Понедельник';
}
if(weekDay == 2){
    weekDayText = 'Вторник';
}
if(weekDay == 3){
    weekDayText = 'Среда';
}
if(weekDay == 4){
    weekDayText = 'Четверг';
}
if(weekDay == 5){
    weekDayText = 'Пятница';
}
if(weekDay == 6){
    weekDayText = 'Суббота';
}


// 1. Текстовый эндпоинт
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// 2. JSON эндпоинт 
app.get('/api/date', (req, res) => {
    res.json({date: `${dateNow.getFullYear()}-${dateNow.getMonth()+1}-${dateNow.getDate()}`, day : weekDayText});
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});