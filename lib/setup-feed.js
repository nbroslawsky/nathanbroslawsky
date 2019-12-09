const Feed = require('feed').Feed;

module.exports = function(results) {

    const year = (new Date()).getFullYear();
    const website = 'https://www.nathanbroslawsky.com';
    const author = {
        name: 'Nathan Broslawsky',
        email: 'nbroslawsky@gmail.com',
        link: website
    };

    const feed = new Feed({
        title: "Nathan Broslawsky's Blog",
        description: "Lessons and explorations in leadership and technology",
        id: website,
        link: website,
        language: 'en',
        image: website + '/files/img/nbroslawsky.jpg',
        favicon: website + '/files/img/favicon.ico',
        copyright: 'All Rights Reserved, ' + year,
        generator: 'Nathan Broslawsky',
        feedLinks: {
            json: website + '/json',
            atom: website + '/atom',
        },
        author: author
    });

    feed.addCategory("Leadership")
    feed.addCategory("Technology")
    feed.addCategory("Engineering")
    feed.addCategory("Management")

    const stories = results.stories || []
    stories.forEach(story => {
        feed.addItem({
            title: story.name,
            id: website + story.preview.url,
            link: website + story.preview.url,
            description: story.preview.sanitized,
            content: story.view.html,
            author: author,
            date: new Date(story.first_published_at),
            image: story.preview.image
        })
    });

    return feed;

}