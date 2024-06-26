const keywords = [];

let currentKeywords = [];

const keywordsCategories = [
    {
        name: 'Programmation',
        keywords: ['Javascript', 'Promises', 'React', 'Vue JS', 'Angular', 'ES6']
    },
    {
        name: 'Librairie',
        keywords: ['Lecture', 'Livres', 'Conseils librairie', 'Bibliothèque']
    },
    {
        name: 'Jeu vidéo',
        keywords: ['Switch', 'Game Boy', 'Nintendo', 'PS4', 'Gaming', 'DOOM', 'Animal Crossing']
    },
    {
        name: 'Vidéo',
        keywords: ['Streaming', 'Netflix', 'Twitch', 'Influenceur', 'Film']
    }
];

const allKeywords = keywordsCategories.reduce((prevKeywords, category) => [
    ...prevKeywords,
    ...category.keywords
], []);

// If the keyword is present in keywords to take into account and we toggle the checkbox, it means
// the checkbox is now unchecked, so we remove the keyword from keywords to take in account.
// Otherwise, it means that we added a new keyword, or we re-checked a checkbox. So we add the
// keyword in the keywords list to take in account.
const toggleKeyword = (keyword) => {
    if (currentKeywords.includes(keyword)) {
        currentKeywords = currentKeywords.filter((currentKeyword) => currentKeyword !== keyword);
    } else {
        currentKeywords.push(keyword);
    }

    reloadArticles();
};

// The first argument is the keyword's label, what will be visible by the user.
// It needs to handle uppercase, special characters, etc.
// The second argument is the value of the checkbox. To be sure to not have bugs, we generally
// put it in lowercase and without special characters.
const addNewKeyword = (label, keyword) => {
    resetInput();

    if (keywords.includes(keyword)) {
        console.warn("You already added this keyword. Nothing happens.");
        return;
    }

    if (!label || !keyword) {
        console.error("It seems you forgot to write the label or keyword in the addNewKeyword function");
        return;
    }

    keywords.push(keyword);
    currentKeywords.push(keyword);

    document.querySelector('.keywordsList').innerHTML += `
        <div>
            <input id="${label}" value="${keyword}" type="checkbox" checked onchange="toggleKeyword(this.value)">
            <label for="${label}">${label}</label>
        </div>
    `;

    reloadArticles();
    resetKeywordsUl();
};

// We reload the articles depends of the currentKeywords
// This function display only articles that contain at least one of the selected keywords.
const reloadArticles = () => {
    document.querySelector('.articlesList').innerHTML = '';
    
    const articlesToShow = data.articles.filter((article) => article.tags.some(tag => currentKeywords.includes(tag))); //some exécute la fonction (fournis en argument), renvoi un true indiquant le résultat du test.
    //some() est équivalent à un forEach mais pas applicable ici car : 
    //forEach canont be inside the filter method. The filter method expects a function that returns a boolean value (true or false) for each element in the array. 
    //The forEach method doesn't return anything; it's used for side effects (like logging to the console or changing an external variable).

    articlesToShow.forEach((article) => {
        document.querySelector('.articlesList').innerHTML += `
            <article>
                <h2>${article.titre}</h2>
            </article>
        `;
    });
};

// We empty the content from the <ul> under the text input
const resetKeywordsUl = () => {
    document.querySelector('.inputKeywordsHandle ul').innerHTML = '';
};

// We add a new article. The argument is an object with a title
const addNewArticle = (article) => {
    document.querySelector('.articlesList').innerHTML += `
        <article>
            <h2>${article.titre}</h2>
        </article>
    `;
};

// We empty the text input once the user submits the form
const resetInput = () => {
    document.querySelector("input[type='text']").value = "";
};

// Clean a keyword to lowercase and without special characters
const cleanedKeyword = (keyword) => {
    const cleanedKeyword = keyword.toLowerCase().replace(/[^a-z]/g, ''); //will replace all characters that are not lowercase letters from a to z
    //[^a-z0-9] is the character set which matches any character that is NOT in the range of lowercase a-z or 0-9.
    //^ inside the square brackets negates the set, meaning it will match anything that is NOT in the specified range.
    //g is a flag that means "global". This will find all matches in the string, not just the first one.
    return cleanedKeyword;
};

// this function show the keyword containing a part of the word inserted
// into the form (starting autocompletion at 3 letters).
// We also show all the words from the same category than this word.
// We show in first the keyword containing a part of the word inserted.
// If a keyword is already in the list of presents hashtags (checkbox list), we don't show it.
const showKeywordsList = (value) => {
    // Starting at 3 letters inserted in the form, we do something
    if (value.length >= 3) {
        const keyWordUl = document.querySelector(".inputKeywordsHandle ul");
        resetKeywordsUl();
        // Filter allKeywords for keywords that include the input value
        const matchingKeywords = allKeywords.filter(keyword => keyword.includes(value));
        //Filter keywordsCategories for categories that include matchingKeywords
        const matchingKeywordCategory = keywordsCategories.filter(category => category.keywords.some(keyword => matchingKeywords.includes(keyword)));
        // Transform matchingKeywordCategory to an arrays of keywords
        const allKeywordsFromCategories = matchingKeywordCategory.reduce((prevKeywords, category) => [
            ...prevKeywords,
            ...category.keywords
        ], []);
        // console.log(allKeywordsFromCategories);
        // Filter allKeywordsFromCategories to not contain matchinKeywords
        const filteredAllKeywordsFromCategories = allKeywordsFromCategories.filter(keyword => !matchingKeywords.includes(keyword));
        // console.log(filteredAllKeywordsFromCategories);

        // create an array of all keywords found with matchingKeywords to be at the begining of the list
        const keywordsToShow = [...matchingKeywords,...filteredAllKeywordsFromCategories]; 
        // console.log(keywordsToShow);        
        
        // This will allow you to add a new element in the list under the text input
        // On click, we add the keyword, like so:
        keywordsToShow.forEach(keyword => {
            keyWordUl.innerHTML += `
                <li onclick="addNewKeyword('${keyword}', '${cleanedKeyword(keyword)}')">${keyword}</li>
            `;
        });
    }
};

// Once the DOM (you will se what is it next week) is loaded, we get back our form and
// we prevent the initial behavior of the navigator: reload the page when it's submitted.
// Then we call the function addNewKeyword() with 2 arguments: the label value to show,
// and the checkbox value.
window.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.querySelector('input[type="text"]');

    document.querySelector('.addKeywordsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const keywordInputValue = inputElement.value;
        addNewKeyword(keywordInputValue, cleanedKeyword(keywordInputValue));
    });

    inputElement.addEventListener('input', (event) => {
        const { value } = event.currentTarget;
        showKeywordsList(value);
    });

    data.articles.forEach((article) => {
        addNewArticle(article);
    });
});

document.addEventListener('click', function(event) {
    const keywordListBox = document.querySelector('.inputKeywordsHandle ul');
    resetKeywordsUl();
});