
/*
 * index.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Fri Aug 23 2019 11:35:02 GMT+0800 (中国标准时间)
 */

import * as crypto from 'crypto';
import * as https from 'https';

interface TConfigItem {
    name: string;
    duration: number;
    suffix: string;
};

const items: TConfigItem[] = [{
    name: 'bbcWorldService',
    duration: 6.4,
    suffix: 'mp3',
}];

const CDNDOMAIN = 'https://cdn.perterpon.com';
const CDNPATH = '/listen/radio';

const SALT = '';

async function sleep(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

async function start(): Promise<void> {

    for (let i = 0; i < items.length; i++) {
        const item: TConfigItem = items[i];
        trigger(item);
    }

}

async function trigger(item: TConfigItem): Promise<void> {
    while (true) {
        const fregmentId: number = Math.round(Date.now() / 1000 / item.duration) + 1;
        const md5 = crypto.createHash('md5');
        const cryptedId: string = md5.update(`${SALT}${fregmentId}`).digest('hex');
        const url: string = `${CDNDOMAIN}${CDNPATH}/${item.name}/${cryptedId}.${item.suffix}`;
        doTrigger(url);
        await sleep(item.duration * 1000);
    }
}

async function doTrigger(url: string): Promise<void> {
    console.time('trigger time');
    https.get(url, (res) => {
        console.log(`trigger success: ${url}`);
        console.timeEnd('trigger time');
    });
    await sleep(500);
    https.get(url);
}

start();
