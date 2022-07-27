import { getRandomNumber, checkCommentsMaxLength, getRandomElementFromArray, getSeveralElementsFromArray } from "./util";

const DESCRIPTIONS = [
    'Это я в отпуске',
    'Это я на работе',
    'Жизнь прекрасна',
    'Просто мы <3',
    'Хорошо в деревне летом',
    'Это я еду за рулем',
    'Моя мечта',
    'Хороший день'
];

const COMMENTATOR_NAMES = [
    'Иван',
    'Вера',
    'Мария',
    'Антон',
    'Наташа',
    'Инокентий',
    'Святополк',
    'Ольга',
    'Игорь'
];

const COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
    'Отписываюсь!!!111',
    'Сохраню себе!'
];


const COMMENTS_COUNT = 50;
const POSTS_COUNT = 25;
const MIN_AVATAR_NUMBER = 1;
const MAX_AVATAR_NUMBER = 6;
const MIN_LIKE_NUMBER = 15;
const MAX_LIKE_NUMBER = 200;
const MIN_COMMENT_NUMBER = 0;
const MAX_COMMENT_NUMBER = 7;



const createRandomComments = (commentsQuantity) => {
    const result = [];
    commentsQuantity.forEach((element, idx) => {
        const randomCommentator = getRandomElementFromArray(COMMENTATOR_NAMES);
        const randomComment = getRandomElementFromArray(COMMENTS);
        result.push({
            id: idx,
            avatar: 'img/avatar-${getRandomNumber(MIN_AVATAR_NUMBER,MAX_AVATAR_NUMBER)}.svg',
            message: randomComment,
            name: randomCommentator
        });
    });
    return result;
};

const createRandomPosts = (photosQuantity) => {
    const result = [];
    const commentsArray = createRandomComments(COMMENTS_COUNT)
    photosQuantity.forEach((element, idx) => {
        const commentsForPost = getRandomNumber(MIN_COMMENT_NUMBER, MAX_COMMENT_NUMBER); // quntity of comment for 1 post photo
        result.push({
            id: idx,
            url: 'photos/{{${idx}}}.jpg',
            description: getRandomElementFromArray(DESCRIPTIONS),
            likes: getRandomNumber(MIN_LIKE_NUMBER, MAX_LIKE_NUMBER),
            comments: getSeveralElementsFromArray(commentsArray, commentsForPost)
        });
    });
    return result;
};

export { createRandomPosts };