import {youtube_v3} from "googleapis";
import {google} from "googleapis";

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY!
});

interface ChannelIdentifier {
    id?: string;
    handle?: string;
}

export default async function getChannelMetrics(identifier: ChannelIdentifier) {
    try {
        const params: youtube_v3.Params$Resource$Channels$List = {
            part: ['snippet', 'statistics'],
            maxResults: 1
        };

        if (identifier.id) {
            params.id = [identifier.id];
        } else if (identifier.handle) {
            params.forHandle = identifier.handle.replace('@', '');
        } else {
            throw new Error("You must provide either a channel 'id' or a 'handle'.");
        }

        const response = await youtube.channels.list(params);

        if (!response.data.items || response.data.items.length === 0) {
            console.log('Channel not found.');
            return;
        }

        const channel = response.data.items[0];

        const snippet = channel?.snippet;
        const stats = channel?.statistics;

        const pfpUrl = snippet?.thumbnails?.high?.url || snippet?.thumbnails?.default?.url || '';

        return [snippet?.title || 'Unknown', snippet?.description || 'No description', pfpUrl, parseInt(stats?.subscriberCount || '0').toLocaleString(), parseInt(stats?.viewCount || '0').toLocaleString(), parseInt(stats?.videoCount || '0').toLocaleString()];

    } catch (error: any) {
        console.error('Error fetching channel data:', error?.message || error);
    }
}