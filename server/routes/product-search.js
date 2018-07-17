const router = require('express').Router();

const algoliaSearch = require('algoliasearch');
const client = algoliaSearch('RH2OQ34WSP', '249f5d83212291330f862a28f75d2bfb');
const index = client.initIndex('artarckRC');



router.get('/', (req, res, next) => {
    if (req.query.query) {
        index.search({
            query: req.query.query,
            page: req.query.page
        }, (err, content) => {
            res.json({
                success: true,
                message: 'Here is your search results',
                status: 200,
                content: content,
                search_result: req.query.query
            });
        });
    }
});


module.exports = router;