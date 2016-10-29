import cheerio from 'cheerio';
import got from 'got';
import path from 'path';
import fs from 'fs-extra';
import BigNumber from 'bignumber.js';

const name = process.argv[2];
const dir = `image/${name}`;
fs.mkdirsSync(dir);

const wait = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), 5000);
    });
};

const req = (url, opt) => {
    opt.headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko'
    };

    return got(url, opt)
    .then(res => res.body);
};

const save = url => {
    return req(`${url}:orig`, { encoding: null })
    .then(data => {
        const file = `${dir}/${path.basename(url)}`;
        fs.writeFileSync(file, data, 'binary');
    });
};

const getMedia = html => {
    const $ = cheerio.load(html);

    return Promise.all(
        $('.AdaptiveMedia-photoContainer').map((i, el) => {
            const imgUrl = $(el).data('image-url');
            return save(imgUrl);
        }).get()
    );
};

const getParam = html => {
    const $ = cheerio.load(html);
    const cxtId = $('.tweet').eq(-1).data('tweet-id');
    const big = new BigNumber(cxtId);
    const maxId = big.minus(1).toFixed(0);

    return `?last_note_ts=${cxtId}&max_position=${maxId}`;
};

const twitterMedia = async param => {
    const json = await req(
        `https://twitter.com/i/profiles/show/${name}/media_timeline${param}`,
        { json: true }
    );
    const html = json.items_html;
    await getMedia(html);

    if (json.has_more_items) {
        await wait();
        twitterMedia(getParam(html));
    }
};

twitterMedia('');
